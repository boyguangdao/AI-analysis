'use client';

import { motion } from 'framer-motion';

export default function PricingPage() {
  return (
    <main className="bg-gradient-to-b from-blue-100 to-white min-h-screen p-6 font-sans">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-xl shadow-lg p-8 mt-8"
        >
          <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">服务说明</h1>

          <div className="space-y-6">
            <section>
              <h2 className="text-xl font-semibold mb-2 text-blue-700">基础模型（普通用户）</h2>
              <ul className="list-disc pl-6 text-gray-700 text-base space-y-1">
                <li>每天可免费使用1次合同智能分析</li>
                <li>适合日常合同风险初步筛查</li>
                <li>合同文本限制：10000字符</li>
                <li>免费</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2 text-green-700">多模型深度计算（付费服务）</h2>
              <ul className="list-disc pl-6 text-gray-700 text-base space-y-1">
                <li>单次深度分析：<span className="text-red-600 font-bold">3.99元/次</span>，分析结果可保存30天</li>
                <li>月度VIP套餐：<span className="text-red-600 font-bold">30元/月</span>，每月可获得50次深度分析，VIP有效期30天</li>
                <li>适合高价值合同、复杂条款等场景</li>
                <li>合同文本限制：10000字符</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2 text-gray-700">历史记录与权益</h2>
              <ul className="list-disc pl-6 text-gray-700 text-base space-y-1">
                <li>所有已付费的深度分析结果可在30天内随时查看</li>
                <li>VIP套餐剩余次数和到期时间可在个人中心查看</li>
                <li>支持查看历史提交记录和交易记录</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2 text-red-600">免责声明</h2>
              <div className="text-gray-500 text-sm">
                本服务的分析结果仅供参考，不构成法律意见或依据。请结合实际情况及专业律师建议做出决策。
              </div>
            </section>
          </div>
        </motion.div>
      </div>
    </main>
  );
} 