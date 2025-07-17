'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';

export default function Navigation() {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  // 处理登出
  const handleSignOut = async () => {
    await signOut({ redirect: true, callbackUrl: '/' });
  };

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white shadow-sm border-b border-gray-200"
    >
      <div className="max-w-5xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="text-2xl font-bold text-blue-600"
            >
              📄 AI合同助手
            </motion.div>
          </Link>

          {/* 导航链接 */}
          <div className="flex items-center space-x-6">
            <Link href="/">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  pathname === '/' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                首页
              </motion.div>
            </Link>
            
            <Link href="/analyze">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  pathname === '/analyze' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                合同分析
              </motion.div>
            </Link>

            <Link href="/pricing">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  pathname === '/pricing' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                定价说明
              </motion.div>
            </Link>

            {/* 用户状态 */}
            {status === 'loading' ? (
              <div className="px-4 py-2 text-gray-500">加载中...</div>
            ) : session ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  欢迎，{session.user?.name}
                </span>
                <Link href="/profile">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className={`px-4 py-2 bg-gray-100 hover:bg-blue-100 text-blue-700 rounded-lg font-medium transition-colors${pathname === '/profile' ? ' bg-blue-100' : ''}`}
                  >
                    个人中心
                  </motion.div>
                </Link>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={handleSignOut}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
                >
                  退出登录
                </motion.button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link href="/login">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="px-4 py-2 text-gray-600 hover:text-blue-600 font-medium transition-colors"
                  >
                    登录
                  </motion.div>
                </Link>
                <Link href="/register">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                  >
                    注册
                  </motion.div>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
} 