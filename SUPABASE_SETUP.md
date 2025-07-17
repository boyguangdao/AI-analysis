# Supabase 数据库设置指南

## 🗄️ 步骤1：登录Supabase控制台

1. 访问 [https://supabase.com](https://supabase.com)
2. 登录你的账户
3. 选择你的项目

## 🗄️ 步骤2：创建数据库表

1. 在Supabase控制台中，点击左侧菜单的 **"SQL Editor"**
2. 点击 **"New query"** 创建新查询
3. 复制并粘贴 `supabase-setup.sql` 文件中的所有内容
4. 点击 **"Run"** 执行SQL脚本

## 🗄️ 步骤3：验证表创建

执行以下查询来验证表是否创建成功：

```sql
-- 查看所有表
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_type = 'BASE TABLE';

-- 查看users表结构
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'users' 
AND table_schema = 'public';
```

## 🗄️ 步骤4：配置环境变量

确保你的 `.env.local` 文件包含以下配置：

```env
# Supabase配置
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# NextAuth配置
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=http://localhost:3000

# OpenAI配置
OPENAI_API_KEY=your_openai_api_key_here
```

## 🗄️ 步骤5：获取Supabase配置信息

### 获取Project URL：
1. 在Supabase控制台中，点击左侧菜单的 **"Settings"**
2. 点击 **"API"**
3. 复制 **"Project URL"**

### 获取Service Role Key：
1. 在同一页面，找到 **"Project API keys"** 部分
2. 复制 **"service_role"** 密钥（注意：这是敏感信息，不要分享）

## 🗄️ 步骤6：测试数据库连接

启动开发服务器后，尝试注册一个新用户来测试数据库连接：

```bash
npm run dev
```

然后访问 `http://localhost:3000/register` 进行测试。

## 📊 数据库表说明

### 1. users 表
- `id`: 用户唯一标识符
- `username`: 用户名（唯一）
- `email`: 邮箱地址（唯一）
- `password`: 加密后的密码
- `is_paid_user`: 是否为付费用户
- `daily_usage_count`: 当日使用次数
- `last_usage_date`: 最后使用日期
- `created_at`: 创建时间
- `updated_at`: 更新时间

### 2. analysis_records 表
- `id`: 记录唯一标识符
- `user_id`: 用户ID（外键）
- `contract_text`: 合同文本内容
- `analysis_result`: 分析结果
- `model_used`: 使用的AI模型
- `tokens_used`: 消耗的token数量
- `created_at`: 创建时间

### 3. user_usage_stats 表
- `id`: 统计记录唯一标识符
- `user_id`: 用户ID（外键）
- `date`: 统计日期
- `usage_count`: 当日使用次数
- `total_tokens`: 当日总token消耗
- `created_at`: 创建时间

## 🔒 安全特性

- **行级安全策略 (RLS)**: 用户只能访问自己的数据
- **密码加密**: 使用bcrypt加密存储密码
- **唯一约束**: 用户名和邮箱唯一性约束
- **外键约束**: 确保数据完整性

## 🚨 注意事项

1. **Service Role Key**: 这是管理员权限的密钥，只能在服务器端使用，不要暴露给前端
2. **RLS策略**: 如果遇到权限问题，可能需要调整RLS策略
3. **备份**: 定期备份数据库数据
4. **监控**: 监控API使用情况和错误日志

## 🔧 故障排除

### 常见问题：

1. **连接错误**: 检查SUPABASE_URL和SUPABASE_SERVICE_ROLE_KEY是否正确
2. **权限错误**: 检查RLS策略是否正确配置
3. **表不存在**: 确保SQL脚本执行成功
4. **数据类型错误**: 检查字段类型是否匹配

### 调试命令：

```sql
-- 检查用户表数据
SELECT * FROM users LIMIT 5;

-- 检查分析记录
SELECT * FROM analysis_records LIMIT 5;

-- 检查使用统计
SELECT * FROM user_usage_stats LIMIT 5;
```

## ✅ 完成检查清单

- [ ] 执行了supabase-setup.sql脚本
- [ ] 验证了所有表创建成功
- [ ] 配置了环境变量
- [ ] 测试了用户注册功能
- [ ] 测试了用户登录功能
- [ ] 测试了合同分析功能

完成以上步骤后，你的Supabase数据库就配置完成了！🎉 