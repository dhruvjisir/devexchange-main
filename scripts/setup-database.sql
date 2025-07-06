-- Database setup script for payment integration

-- This script sets up the necessary database tables and functions
-- for the StartupBazzar application

-- Note: Payment gateway integration has been removed
-- Contact support for alternative payment options

-- 1. Add missing columns to subscriptions table
ALTER TABLE subscriptions 
ADD COLUMN IF NOT EXISTS amount DECIMAL(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'INR',
ADD COLUMN IF NOT EXISTS payment_id TEXT,
ADD COLUMN IF NOT EXISTS order_id TEXT,
ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'seller' CHECK (type IN ('seller', 'buyer')),
ADD COLUMN IF NOT EXISTS valuation DECIMAL(15,2);

-- 2. Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'INR',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'cancelled')),
  payment_session_id TEXT,
  payment_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create user_access table
CREATE TABLE IF NOT EXISTS user_access (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  plan TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('seller', 'buyer')),
  subscription_id UUID REFERENCES subscriptions(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, plan, type)
);

-- 4. Create indexes (safe to run multiple times)
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_user_access_user_id ON user_access(user_id);

-- 5. Enable RLS on new tables
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_access ENABLE ROW LEVEL SECURITY;

-- 6. Create RLS policies for orders (safe to run multiple times)
DO $$
BEGIN
    -- Drop existing policies if they exist
    DROP POLICY IF EXISTS "Users can view their own orders" ON orders;
    DROP POLICY IF EXISTS "Users can insert their own orders" ON orders;
    DROP POLICY IF EXISTS "Users can update their own orders" ON orders;
    
    -- Create new policies
    CREATE POLICY "Users can view their own orders" ON orders
      FOR SELECT USING (auth.uid() = user_id);

    CREATE POLICY "Users can insert their own orders" ON orders
      FOR INSERT WITH CHECK (auth.uid() = user_id);

    CREATE POLICY "Users can update their own orders" ON orders
      FOR UPDATE USING (auth.uid() = user_id);
END $$;

-- 7. Create RLS policies for user_access (safe to run multiple times)
DO $$
BEGIN
    -- Drop existing policies if they exist
    DROP POLICY IF EXISTS "Users can view their own access" ON user_access;
    DROP POLICY IF EXISTS "Users can insert their own access" ON user_access;
    DROP POLICY IF EXISTS "Users can update their own access" ON user_access;
    
    -- Create new policies
    CREATE POLICY "Users can view their own access" ON user_access
      FOR SELECT USING (auth.uid() = user_id);

    CREATE POLICY "Users can insert their own access" ON user_access
      FOR INSERT WITH CHECK (auth.uid() = user_id);

    CREATE POLICY "Users can update their own access" ON user_access
      FOR UPDATE USING (auth.uid() = user_id);
END $$;

-- 8. Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- 9. Create triggers (safe to run multiple times)
DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
CREATE TRIGGER update_orders_updated_at 
  BEFORE UPDATE ON orders 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_access_updated_at ON user_access;
CREATE TRIGGER update_user_access_updated_at 
  BEFORE UPDATE ON user_access 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- 10. Verify setup
SELECT 'Database setup completed successfully!' as status; 