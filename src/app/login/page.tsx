'use client';

import { useState } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useEffect } from 'react';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();

  // 如果已登录，跳转到主页
  useEffect(() => {
    if (status === 'authenticated' && session) {
      router.push('/');
    }
  }, [session, status, router]);

  // 处理输入变化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(''); // 清除错误信息
  };

  // 处理登录提交
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 验证输入
    if (!formData.username || !formData.password) {
      setError('请填写用户名和密码');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        redirect: false,
        username: formData.username,
        password: formData.password
      });

      if (result?.error) {
        setError('用户名或密码错误');
      } else if (result?.ok) {
        router.push('/');
      }
    } catch (err) {
      console.error('登录错误：', err);
      setError('网络错误，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };

  // 如果正在检查登录状态，显示加载
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

  return (
    <main className="bg-gradient-to-b from-blue-100 to-white min-h-screen p-2 sm:p-6 font-sans flex items-center justify-center">
      <div className="w-full max-w-xs sm:max-w-md mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-xl shadow-lg p-4 sm:p-8"
        >
          <h1 className="text-xl sm:text-2xl font-bold text-center mb-6 text-gray-800">
            用户登录
          </h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* 用户名或邮箱 */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                用户名或邮箱 *
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="请输入用户名或邮箱"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                required
              />
            </div>
            {/* 密码 */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                密码 *
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="请输入密码"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                required
              />
            </div>
            {/* 错误提示 */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg text-xs sm:text-sm"
              >
                {error}
              </motion.div>
            )}
            {/* 登录按钮 */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="w-full py-2 sm:py-3 px-4 sm:px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed text-base sm:text-lg"
            >
              {isLoading ? '登录中...' : '立即登录'}
            </motion.button>
          </form>
          <div className="mt-4 text-xs text-blue-600 text-center">
            <a href="/forgot-password" className="underline hover:text-blue-800">忘记密码？</a>
          </div>
          {/* 注册链接 */}
          <div className="mt-6 text-center">
            <p className="text-gray-600 text-xs sm:text-base">
              还没有账号？
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => router.push('/register')}
                className="text-blue-600 hover:text-blue-700 font-medium ml-1"
              >
                立即注册
              </motion.button>
            </p>
          </div>
          <div className="mt-8 text-xs text-gray-500 text-center">
            登录即代表同意
            <a href="/terms" className="underline hover:text-blue-600 mx-1">用户协议</a>、
            <a href="/privacy" className="underline hover:text-blue-600 mx-1">隐私政策</a>、
            <a href="/disclaimer" className="underline hover:text-blue-600 mx-1">免责声明</a>
          </div>
        </motion.div>
      </div>
    </main>
  );
} 