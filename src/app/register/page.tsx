'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // 处理输入变化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(''); // 清除错误信息
  };

  // 处理注册提交
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 验证输入
    if (!formData.username || !formData.email || !formData.password) {
      setError('请填写所有必填项');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('两次输入的密码不一致');
      return;
    }

    if (formData.password.length < 6) {
      setError('密码长度至少6位');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('注册成功！请登录');
        router.push('/login');
      } else {
        setError(data.error || '注册失败');
      }
    } catch (err) {
      console.error('注册错误：', err);
      setError('网络错误，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="bg-gradient-to-b from-blue-100 to-white min-h-screen p-6 font-sans">
      <div className="max-w-md mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-xl shadow-lg p-8"
        >
          <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
            用户注册
          </h1>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* 用户名 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                用户名 *
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="请输入用户名"
                className="
                  w-full px-3 py-2              /* 内边距 */
                  border border-gray-300        /* 边框 */
                  rounded-lg                    /* 圆角 */
                  focus:outline-none            /* 聚焦时无轮廓 */
                  focus:ring-2 focus:ring-blue-500  /* 聚焦时蓝色环 */
                  focus:border-transparent      /* 聚焦时透明边框 */
                "
                required
              />
            </div>

            {/* 邮箱 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                邮箱 *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="请输入邮箱地址"
                className="
                  w-full px-3 py-2              /* 内边距 */
                  border border-gray-300        /* 边框 */
                  rounded-lg                    /* 圆角 */
                  focus:outline-none            /* 聚焦时无轮廓 */
                  focus:ring-2 focus:ring-blue-500  /* 聚焦时蓝色环 */
                  focus:border-transparent      /* 聚焦时透明边框 */
                "
                required
              />
            </div>

            {/* 密码 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                密码 *
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="请输入密码（至少6位）"
                className="
                  w-full px-3 py-2              /* 内边距 */
                  border border-gray-300        /* 边框 */
                  rounded-lg                    /* 圆角 */
                  focus:outline-none            /* 聚焦时无轮廓 */
                  focus:ring-2 focus:ring-blue-500  /* 聚焦时蓝色环 */
                  focus:border-transparent      /* 聚焦时透明边框 */
                "
                required
              />
            </div>

            {/* 确认密码 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                确认密码 *
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="请再次输入密码"
                className="
                  w-full px-3 py-2              /* 内边距 */
                  border border-gray-300        /* 边框 */
                  rounded-lg                    /* 圆角 */
                  focus:outline-none            /* 聚焦时无轮廓 */
                  focus:ring-2 focus:ring-blue-500  /* 聚焦时蓝色环 */
                  focus:border-transparent      /* 聚焦时透明边框 */
                "
                required
              />
            </div>

            {/* 错误提示 */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg text-sm"
              >
                {error}
              </motion.div>
            )}

            {/* 注册按钮 */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="
                w-full py-3 px-6              /* 内边距 */
                bg-blue-600 hover:bg-blue-700  /* 背景颜色 */
                text-white                     /* 文字颜色 */
                rounded-lg                     /* 圆角 */
                font-semibold                  /* 字体粗细 */
                transition                     /* 过渡动画 */
                disabled:opacity-50            /* 禁用状态 */
                disabled:cursor-not-allowed    /* 禁用光标 */
              "
            >
              {isLoading ? '注册中...' : '立即注册'}
            </motion.button>
          </form>

          {/* 登录链接 */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              已有账号？
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => router.push('/login')}
                className="text-blue-600 hover:text-blue-700 font-medium ml-1"
              >
                立即登录
              </motion.button>
            </p>
          </div>
          <div className="mt-8 text-xs text-gray-500 text-center">
            注册即代表同意
            <a href="/terms" className="underline hover:text-blue-600 mx-1">用户协议</a>、
            <a href="/privacy" className="underline hover:text-blue-600 mx-1">隐私政策</a>、
            <a href="/disclaimer" className="underline hover:text-blue-600 mx-1">免责声明</a>
          </div>
        </motion.div>
      </div>
    </main>
  );
} 