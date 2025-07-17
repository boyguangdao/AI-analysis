# 🔐 环境变量配置说明

## 安全配置步骤

### 1. 创建环境变量文件

在项目根目录创建 `.env.local` 文件：

```bash
# Windows PowerShell
New-Item -Path ".env.local" -ItemType File -Force
Add-Content -Path ".env.local" -Value "OPENAI_API_KEY=你的OpenAI_API密钥"
```

### 2. 配置OpenAI API密钥

在 `.env.local` 文件中添加：

```env
# OpenAI API配置
OPENAI_API_KEY=sk-你的实际API密钥

# 应用配置
NEXT_PUBLIC_APP_NAME=AI合同规避助手
NEXT_PUBLIC_APP_VERSION=1.0.0
```

### 3. 安全注意事项

✅ **已配置的安全措施：**
- `.env.local` 文件已被 `.gitignore` 忽略
- API密钥不会提交到Git仓库
- 前端代码中不包含密钥信息
- 所有API调用都在后端进行

### 4. 验证配置

启动开发服务器后，访问：
- `http://localhost:3001` - 主页
- `http://localhost:3001/analyze` - 合同分析页面
- `http://localhost:3001/pricing` - 定价说明页面

### 5. 故障排除

如果遇到API密钥错误：
1. 检查 `.env.local` 文件是否存在
2. 确认API密钥格式正确
3. 重启开发服务器：`npm run dev`

## 📁 文件结构

```
my-next-app/
├── .env.local              ← 🔒 环境变量（不提交到Git）
├── src/
│   └── app/
│       ├── page.tsx        ← 前端页面
│       ├── analyze/page.tsx ← 分析页面
│       ├── pricing/page.tsx ← 定价页面
│       └── api/
│           └── analyze/
│               └── route.ts ← 🔒 后端API（读取密钥）
└── README.md
```

## 🔒 安全架构

```
前端页面 → 发送请求 → 后端API → 读取环境变量 → 调用OpenAI API
```

- ✅ 密钥只在服务器端使用
- ✅ 前端无法访问密钥
- ✅ 环境变量文件被Git忽略
- ✅ 所有API调用都有错误处理 