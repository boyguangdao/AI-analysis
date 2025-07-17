-- 升级 users 表，增加 VIP 字段
ALTER TABLE users ADD COLUMN IF NOT EXISTS vip_expire_at TIMESTAMP;
ALTER TABLE users ADD COLUMN IF NOT EXISTS vip_gpt4o_quota INTEGER DEFAULT 0;

-- 创建 orders 表（交易记录）
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(20) NOT NULL, -- 'single' 或 'vip'
  amount NUMERIC(10,2) NOT NULL,
  status VARCHAR(20) DEFAULT 'paid',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 升级 analysis_records 表，增加类型和有效期
ALTER TABLE analysis_records ADD COLUMN IF NOT EXISTS type VARCHAR(20) DEFAULT 'free';
ALTER TABLE analysis_records ADD COLUMN IF NOT EXISTS expire_at TIMESTAMP;

-- 可选：为新字段添加索引
CREATE INDEX IF NOT EXISTS idx_users_vip_expire_at ON users(vip_expire_at);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_analysis_records_expire_at ON analysis_records(expire_at);

-- 查看表结构
SELECT table_name, column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name IN ('users', 'orders', 'analysis_records')
ORDER BY table_name, ordinal_position; 