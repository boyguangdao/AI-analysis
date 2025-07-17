# AI合同风险分析助手

一个基于Next.js 14和OpenAI的智能合同风险分析系统，支持用户注册登录和合同文本分析。

## 🚀 功能特性

- **用户系统**: 支持用户名+密码+邮箱注册登录
- **合同分析**: 智能分析合同文本，识别潜在风险
- **模型选择**: 免费用户使用GPT-3.5，付费用户使用GPT-4o
- **文件上传**: 支持文本文件、PDF等格式上传
- **响应式设计**: 适配各种设备屏幕

## 🛠️ 技术栈

- **前端**: Next.js 14, React, TypeScript, Tailwind CSS
- **后端**: Next.js API Routes
- **数据库**: Supabase (PostgreSQL)
- **认证**: NextAuth.js
- **AI**: OpenAI API
- **动画**: Framer Motion

## 📋 环境变量配置

在项目根目录创建 `.env.local` 文件：

```env
# OpenAI API配置
OPENAI_API_KEY=your_openai_api_key_here

# Supabase配置
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# NextAuth配置
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=http://localhost:3000
```

## 🗄️ 数据库设置

在Supabase中创建 `users` 表：

```sql
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 🚀 启动项目

1. 安装依赖：
```bash
npm install
```

2. 配置环境变量（见上方配置说明）

3. 启动开发服务器：
```bash
npm run dev
```

4. 访问 http://localhost:3000

## 📱 页面说明

- **首页** (`/`): 项目介绍和功能展示
- **注册** (`/register`): 用户注册页面
- **登录** (`/login`): 用户登录页面
- **合同分析** (`/analyze`): 合同文本分析功能（需要登录）
- **定价说明** (`/pricing`): 服务定价和使用说明

## 🔐 用户权限

- **免费用户**: 每日1次GPT-3.5分析
- **付费用户**: 无限制GPT-4o分析

## 🎨 设计特色

- 现代化UI设计
- 流畅的动画效果
- 响应式布局
- 用户友好的交互体验

## 📝 开发规范

- 使用TypeScript确保类型安全
- 遵循React Hooks最佳实践
- 统一的错误处理机制
- 详细的代码注释

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支
3. 提交更改
4. 推送到分支
5. 创建Pull Request

## �� 许可证

MIT License
