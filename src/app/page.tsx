'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

export default function Home() {
  // 动画变体配置
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2, // 子元素交错动画
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut" as const
      }
    }
  };

  return (
    <main className="bg-gradient-to-b from-blue-100 to-white min-h-screen p-6 font-sans">
      {/* 主要介绍区域 - 淡入动画 */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-5xl mx-auto bg-white shadow-xl rounded-2xl p-8 mb-12"
      >
        <motion.h1 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-4xl font-bold mb-2"
        >
          AI合同规避助手
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-gray-600 mb-6"
        >
          智能识别合同风险，提前规避潜在法律问题！
        </motion.p>
        
        {/* 按钮动画 */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => window.location.href = '/analyze'}
          className="
            bg-blue-600 hover:bg-blue-700  /* 背景颜色和悬停效果 */
            text-white                     /* 文字颜色 */
            py-3 px-6                     /* 内边距 */
            rounded-xl                     /* 圆角 */
            font-semibold                  /* 字体粗细 */
            transition                     /* 过渡动画 */
            disabled:opacity-50            /* 禁用状态透明度 */
          "
        >
          立即上传合同进行智能分析
        </motion.button>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-8 flex justify-center"
        >
          {/* 合同分析示意图占位符 */}
          <div className="
            w-80 h-48                    /* 宽度和高度 */
            bg-gradient-to-r from-blue-50 to-indigo-100  /* 渐变背景 */
            rounded-lg                    /* 圆角 */
            flex items-center justify-center  /* 居中对齐 */
            border-2 border-dashed border-blue-300  /* 虚线边框 */
            text-blue-600                 /* 文字颜色 */
            font-medium                   /* 字体粗细 */
          ">
            📄 合同分析示意图
          </div>
        </motion.div>
      </motion.section>

      {/* 支持的合同类型 - 交错动画 */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6 mb-12"
      >
        <motion.div variants={itemVariants} className="bg-white p-6 rounded-xl shadow">
          <h3 className="font-semibold text-lg mb-2">办公/劳务合同</h3>
          <p className="text-sm text-gray-600">常见办公协议、人事相关合同等</p>
        </motion.div>
        <motion.div variants={itemVariants} className="bg-white p-6 rounded-xl shadow">
          <h3 className="font-semibold text-lg mb-2">租赁/购房协议</h3>
          <p className="text-sm text-gray-600">房屋租赁合同、购房交易合同</p>
        </motion.div>
        <motion.div variants={itemVariants} className="bg-white p-6 rounded-xl shadow">
          <h3 className="font-semibold text-lg mb-2">合作/商务协议</h3>
          <p className="text-sm text-gray-600">项目合作、商务协议等文件</p>
        </motion.div>
      </motion.section>

      {/* 分析流程说明 - 从下往上动画 */}
      <motion.section 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="max-w-5xl mx-auto mb-12"
      >
        <motion.h2 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-2xl font-bold mb-6"
        >
          分析流程
        </motion.h2>
        <div className="grid md:grid-cols-3 gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            whileHover={{ y: -5 }}
            className="bg-white p-6 rounded-xl shadow cursor-pointer"
          >
            <h4 className="font-semibold mb-2">读取合同内容</h4>
            <p className="text-sm text-gray-600">使用OCR及文本提取技术自动识别合同主要信息</p>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            whileHover={{ y: -5 }}
            className="bg-white p-6 rounded-xl shadow cursor-pointer"
          >
            <h4 className="font-semibold mb-2">模型智能判断</h4>
            <p className="text-sm text-gray-600">判断合同类型并使用专业模型解析风险项</p>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            whileHover={{ y: -5 }}
            className="bg-white p-6 rounded-xl shadow cursor-pointer"
          >
            <h4 className="font-semibold mb-2">给出建议优化</h4>
            <p className="text-sm text-gray-600">明确指出风险区域及建议修改方向</p>
          </motion.div>
        </div>
      </motion.section>

      {/* 免费使用计划 - 数字计数动画 */}
      <motion.section 
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="max-w-5xl mx-auto mb-12"
      >
        <motion.h2 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-2xl font-bold mb-6"
        >
          免费使用计划
        </motion.h2>
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="bg-white p-6 rounded-xl shadow flex flex-col md:flex-row items-center justify-around text-center"
        >
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="transition-transform"
          >
            <motion.div 
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
              viewport={{ once: true }}
              className="text-4xl font-bold text-blue-600 mb-2"
            >
              1
            </motion.div>
            <p className="text-gray-600">份合同起分析</p>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="text-2xl font-bold mx-4"
          >
            →
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="transition-transform"
          >
            <motion.div 
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4, type: "spring", stiffness: 200 }}
              viewport={{ once: true }}
              className="text-4xl font-bold text-blue-600 mb-2"
            >
              3
            </motion.div>
            <p className="text-gray-600">测试免费</p>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            viewport={{ once: true }}
            className="text-2xl font-bold mx-4"
          >
            →
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="transition-transform"
          >
            <motion.div 
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.6, type: "spring", stiffness: 200 }}
              viewport={{ once: true }}
              className="text-4xl font-bold text-blue-600 mb-2"
            >
              5
            </motion.div>
            <p className="text-gray-600">正式合同分析</p>
          </motion.div>
        </motion.div>
      </motion.section>
    </main>
  );
}
