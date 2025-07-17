'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

// 角色类型
const getUserRole = (user: any) => {
  if (!user) return 'guest';
  if (user.vip_expire_at && new Date(user.vip_expire_at) > new Date() && user.vip_gpt4o_quota > 0) return 'vip';
  if (user.has_single_pay) return 'single';
  return 'free';
};

// 分析系统置顶内容（不显示在输入框，仅用于分析请求）
const SYSTEM_PROMPT = `你是一名有十年经验的劳动法专业律师，善于为非专业用户解析合同风险。\n\n请从以下合同文本中提取最多 3 条潜在风险条款，并对每条做以下结构分析：\n1）风险条款（限1句话）\n2）风险原因（限2句话）\n3）修改建议（限1句话）\n\n请用通俗语言表达，总字数不超过300字。`;

export default function AnalyzePage() {
  const [contractText, setContractText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState('');
  const [error, setError] = useState('');
  const [userInfo, setUserInfo] = useState<any>(null); // 用户信息
  const [showPayModal, setShowPayModal] = useState(false);
  const [showVipModal, setShowVipModal] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [freeUsedToday, setFreeUsedToday] = useState(false); // 是否今日已用免费分析
  const [lastCheckedDate, setLastCheckedDate] = useState(new Date().toDateString()); // 用于跨天检测
  const { data: session, status } = useSession();
  const router = useRouter();

  // 获取用户信息（模拟，实际应从后端API获取）
  useEffect(() => {
    if (session?.user) {
      // TODO: 替换为真实API
      setUserInfo({
        ...session.user,
        vip_expire_at: null, // 示例：'2024-08-01T00:00:00Z'
        vip_gpt4o_quota: 0,  // 示例：50
        has_single_pay: false // 示例：true
      });
    }
  }, [session]);

  // 页面加载时检查今日是否已用免费分析
  useEffect(() => {
    const checkFreeUsed = async () => {
      if (!userInfo?.id) return;
      try {
        // 查询分析历史，判断今日是否有免费分析记录
        const res = await fetch(`/api/analysis/history?page=1&pageSize=1`);
        const data = await res.json();
        if (Array.isArray(data.records) && data.records.length > 0) {
          const today = new Date().toDateString();
          const first = data.records[0];
          const createdAt = new Date(first.created_at).toDateString();
          // 只要有一条今天的记录就算已用（如需更精确可加类型判断）
          if (createdAt === today) {
            setFreeUsedToday(true);
          } else {
            setFreeUsedToday(false);
          }
        } else {
          setFreeUsedToday(false);
        }
      } catch {
        setFreeUsedToday(false);
      }
    };
    checkFreeUsed();
  }, [userInfo?.id]);

  // 跨天自动重置 freeUsedToday
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().toDateString();
      if (now !== lastCheckedDate) {
        setFreeUsedToday(false);
        setLastCheckedDate(now);
      }
    }, 60 * 1000); // 每分钟检查一次
    return () => clearInterval(timer);
  }, [lastCheckedDate]);

  // 登录校验
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <main className="bg-gradient-to-b from-blue-100 to-white min-h-screen p-6 font-sans flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">检查登录状态...</p>
        </div>
      </main>
    );
  }
  if (!session) return null;

  // 角色判断
  const userRole = getUserRole(userInfo);

  // 合同文本输入变化
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length > 10000) return;
    setContractText(e.target.value);
    setError('');
  };

  // 分析按钮点击
  const handleAnalyze = async () => {
    if (!contractText.trim()) {
      setError('请输入合同文本');
      return;
    }
    if (contractText.length > 10000) {
      setError('合同文本不能超过10000字符');
      return;
    }
    setIsAnalyzing(true);
    setError('');
    setAnalysisResult('');
    try {
      // 拼接置顶内容和用户输入内容，发送给后端
      const fullText = `${SYSTEM_PROMPT}\n\n${contractText}`;
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contractText: fullText, // 置顶内容+用户输入
          userId: userInfo?.id // 确保 userInfo 有 id
        })
      });
      const data = await res.json();
      if (res.ok) {
        setAnalysisResult(data.result);
        // 如果是免费用户，分析成功后标记今日已用
        if (userRole === 'free') setFreeUsedToday(true);
      } else {
        setError(data.error || '分析失败');
        // 如果后端返回403且是免费用户，标记今日已用
        if (res.status === 403 && userRole === 'free') setFreeUsedToday(true);
      }
    } catch (err) {
      setError('网络错误，请稍后重试');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Stripe支付入口
  const handlePay = async (type: 'single' | 'vip') => {
    if (!session?.user?.id) {
      alert('请先登录');
      return;
    }
    setIsPaying(true);
    try {
      const res = await fetch('/api/payment/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: session.user.id,
          type,
        }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert('支付发起失败，请稍后重试');
      }
    } catch (err) {
      alert('支付发起失败，请检查网络');
    } finally {
      setIsPaying(false);
      setShowPayModal(false);
      setShowVipModal(false);
    }
  };

  // 付费弹窗
  const PayModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-8 max-w-sm w-full shadow-lg">
        <h2 className="text-lg font-bold mb-4 text-center">单次深度分析</h2>
        <p className="mb-4 text-gray-700 text-center">支付3.99元即可使用一次多模型深度计算分析，结果可保存30天。</p>
        <div className="flex justify-center space-x-4 mt-6">
          <button className="px-6 py-2 bg-blue-600 text-white rounded-lg" onClick={() => setShowPayModal(false)} disabled={isPaying}>关闭</button>
          <button className="px-6 py-2 bg-green-600 text-white rounded-lg" onClick={() => handlePay('single')} disabled={isPaying}>
            {isPaying ? '跳转中...' : '立即支付'}
          </button>
        </div>
      </div>
    </div>
  );

  // VIP弹窗
  const VipModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-8 max-w-sm w-full shadow-lg">
        <h2 className="text-lg font-bold mb-4 text-center">月度VIP套餐</h2>
        <p className="mb-4 text-gray-700 text-center">支付30元可获得50次多模型深度计算分析，VIP有效期30天。</p>
        <div className="flex justify-center space-x-4 mt-6">
          <button className="px-6 py-2 bg-blue-600 text-white rounded-lg" onClick={() => setShowVipModal(false)} disabled={isPaying}>关闭</button>
          <button className="px-6 py-2 bg-green-600 text-white rounded-lg" onClick={() => handlePay('vip')} disabled={isPaying}>
            {isPaying ? '跳转中...' : '立即支付'}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <main className="bg-gradient-to-b from-blue-100 to-white min-h-screen p-6 font-sans">
      <div className="max-w-4xl mx-auto">
        {/* 页面标题 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-800 mb-2">合同智能分析</h1>
          <p className="text-gray-600">上传合同文本，AI将为您分析潜在风险</p>
          <p className="text-sm text-blue-600 mt-2">合同文本限制10000字符</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* 输入区域 */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <h2 className="text-xl font-semibold mb-4">合同内容</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">输入或粘贴合同文本</label>
              <textarea
                value={contractText}
                onChange={handleTextChange}
                placeholder="请粘贴或输入合同文本内容..."
                rows={12}
                maxLength={10000}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-vertical focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <div className="text-xs text-gray-500 mt-1 text-right">{contractText.length}/10000</div>
            </div>
            {error && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg">{error}</motion.div>
            )}
            {/* 分析按钮和付费入口 */}
            <div className="space-y-3 mt-4">
              {userRole === 'free' && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAnalyze}
                  disabled={isAnalyzing || !contractText.trim() || freeUsedToday}
                  className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isAnalyzing ? '分析中...' : freeUsedToday ? '免费分析（今日已使用）' : '免费分析（每日1次）'}
                </motion.button>
              )}
              {(userRole === 'single' || userRole === 'vip') && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAnalyze}
                  disabled={isAnalyzing || !contractText.trim()}
                  className="w-full py-3 px-6 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isAnalyzing ? '分析中...' : '多模型深度计算'}
                </motion.button>
              )}
              <div className="flex space-x-3">
                <button type="button" className="flex-1 py-2 px-4 bg-gray-100 hover:bg-gray-200 rounded-lg text-blue-700 font-medium" onClick={() => setShowPayModal(true)} disabled={isPaying}>单次深度分析</button>
                <button type="button" className="flex-1 py-2 px-4 bg-yellow-100 hover:bg-yellow-200 rounded-lg text-yellow-700 font-medium" onClick={() => setShowVipModal(true)} disabled={isPaying}>开通月度VIP</button>
              </div>
            </div>
          </motion.div>

          {/* 结果区域 */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <h2 className="text-xl font-semibold mb-4">分析结果</h2>
            {isAnalyzing && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-center py-8">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">AI正在分析合同内容...</p>
                </div>
              </motion.div>
            )}
            {analysisResult && !isAnalyzing && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-gray-700 whitespace-pre-wrap text-sm leading-relaxed">{analysisResult}</div>
                </div>
              </motion.div>
            )}
            {!analysisResult && !isAnalyzing && (
              <div className="text-center py-8 text-gray-500">
                <div className="text-4xl mb-4">📄</div>
                <p>请上传或输入合同文本开始分析</p>
              </div>
            )}
            {/* 免责声明 */}
            <div className="mt-8 text-xs text-gray-400 text-center">
              本分析仅供参考，不构成法律意见或依据。请结合实际情况及专业律师建议做出决策。
            </div>
          </motion.div>
        </div>
      </div>
      {showPayModal && <PayModal />}
      {showVipModal && <VipModal />}
    </main>
  );
} 