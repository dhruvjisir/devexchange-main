-- Drop existing policies if they exist
DO $$ 
BEGIN
    -- Drop policies on subscriptions table if it exists
    IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'subscriptions') THEN
        DROP POLICY IF EXISTS "Users can view their own subscriptions" ON subscriptions;
        DROP POLICY IF EXISTS "Users can insert their own subscriptions" ON subscriptions;
        DROP POLICY IF EXISTS "Users can update their own subscriptions" ON subscriptions;
    END IF;

    -- Drop policies on user_access table if it exists
    IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'user_access') THEN
        DROP POLICY IF EXISTS "Users can view their own access" ON user_access;
        DROP POLICY IF EXISTS "Users can insert their own access" ON user_access;
        DROP POLICY IF EXISTS "Users can update their own access" ON user_access;
    END IF;
END $$;

-- Create user_access table
CREATE TABLE IF NOT EXISTS user_access (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id),
    plan VARCHAR(50) NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('seller', 'buyer')),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    subscription_id VARCHAR(255)
);

-- Create index on user_id
CREATE INDEX IF NOT EXISTS idx_user_access_user_id ON user_access(user_id);

-- Create subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id),
    type VARCHAR(20) NOT NULL CHECK (type IN ('free', 'basic', 'premium', 'buyer_basic', 'buyer_premium')),
    status VARCHAR(20) NOT NULL CHECK (status IN ('active', 'inactive', 'expired')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL
);

-- Create index on user_id and status
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_status ON subscriptions(user_id, status);

-- Add foreign key constraint for subscription_id
ALTER TABLE user_access
ADD CONSTRAINT fk_user_access_subscription
FOREIGN KEY (subscription_id) REFERENCES subscriptions(order_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_subscriptions_updated_at
    BEFORE UPDATE ON subscriptions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_access_updated_at
    BEFORE UPDATE ON user_access
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add RLS policies
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_access ENABLE ROW LEVEL SECURITY;

-- Policy for users to view their own subscriptions
CREATE POLICY "Users can view their own subscriptions"
    ON subscriptions
    FOR SELECT
    USING (auth.uid() = user_id);

-- Policy for users to insert their own subscriptions
CREATE POLICY "Users can insert their own subscriptions"
    ON subscriptions
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Policy for users to update their own subscriptions
CREATE POLICY "Users can update their own subscriptions"
    ON subscriptions
    FOR UPDATE
    USING (auth.uid() = user_id);

-- Policy for users to view their own access
CREATE POLICY "Users can view their own access"
    ON user_access
    FOR SELECT
    USING (auth.uid() = user_id);

-- Policy for users to insert their own access
CREATE POLICY "Users can insert their own access"
    ON user_access
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Policy for users to update their own access
CREATE POLICY "Users can update their own access"
    ON user_access
    FOR UPDATE
    USING (auth.uid() = user_id); 