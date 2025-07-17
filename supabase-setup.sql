-- Supabase 数据库设置脚本
-- 请在 Supabase Dashboard > SQL Editor 中执行以下命令

-- 1. 创建用户表
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  is_paid_user BOOLEAN DEFAULT FALSE,
  daily_usage_count INTEGER DEFAULT 0,
  last_usage_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. 创建分析记录表
CREATE TABLE IF NOT EXISTS analysis_records (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  contract_text TEXT NOT NULL,
  analysis_result TEXT NOT NULL,
  model_used VARCHAR(50) NOT NULL,
  tokens_used INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. 创建用户使用统计表
CREATE TABLE IF NOT EXISTS user_usage_stats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  usage_count INTEGER DEFAULT 0,
  total_tokens INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- 4. 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_analysis_records_user_id ON analysis_records(user_id);
CREATE INDEX IF NOT EXISTS idx_analysis_records_created_at ON analysis_records(created_at);
CREATE INDEX IF NOT EXISTS idx_user_usage_stats_user_date ON user_usage_stats(user_id, date);

-- 5. 创建触发器函数来更新updated_at字段
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 6. 为users表添加触发器
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 7. 创建行级安全策略 (RLS)
-- 启用RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE analysis_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_usage_stats ENABLE ROW LEVEL SECURITY;

-- 用户只能访问自己的数据
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid()::text = id::text);

CREATE POLICY "Users can view own analysis records" ON analysis_records
    FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own analysis records" ON analysis_records
    FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can view own usage stats" ON user_usage_stats
    FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own usage stats" ON user_usage_stats
    FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

-- 8. 创建函数来重置每日使用次数
CREATE OR REPLACE FUNCTION reset_daily_usage()
RETURNS void AS $$
BEGIN
    UPDATE users 
    SET daily_usage_count = 0, last_usage_date = CURRENT_DATE
    WHERE last_usage_date < CURRENT_DATE;
END;
$$ LANGUAGE plpgsql;

-- 9. 创建定时任务（可选，需要pg_cron扩展）
-- 注意：这需要管理员权限，如果无法执行可以忽略
-- SELECT cron.schedule('reset-daily-usage', '0 0 * * *', 'SELECT reset_daily_usage();');

-- 10. 插入一些测试数据（可选）
-- INSERT INTO users (username, email, password, is_paid_user) VALUES 
-- ('test_user', 'test@example.com', '$2b$10$test_hash_here', false);

-- 显示创建的表
SELECT table_name, column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name IN ('users', 'analysis_records', 'user_usage_stats')
ORDER BY table_name, ordinal_position; 