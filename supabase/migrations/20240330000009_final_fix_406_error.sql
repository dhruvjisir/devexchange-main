-- Final Fix for 406 Error in Subscriptions Table
-- This migration completely recreates the subscriptions table with the correct schema

-- Drop all existing objects related to subscriptions
DROP FUNCTION IF EXISTS prevent_multiple_active_subscriptions() CASCADE;
DROP FUNCTION IF EXISTS set_subscription_price() CASCADE;
DROP FUNCTION IF EXISTS get_subscription_price(subscription_plan) CASCADE;
DROP FUNCTION IF EXISTS check_subscription_expiration() CASCADE;
DROP FUNCTION IF EXISTS is_subscription_expired(UUID) CASCADE;
DROP FUNCTION IF EXISTS get_subscription_status(UUID) CASCADE;
DROP FUNCTION IF EXISTS can_view_contact_details(UUID, DECIMAL) CASCADE;
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;
DROP TRIGGER IF EXISTS prevent_multiple_active_subscriptions ON subscriptions;
DROP TRIGGER IF EXISTS set_subscription_price ON subscriptions;
DROP TRIGGER IF EXISTS check_subscription_expiration ON subscriptions;
DROP TRIGGER IF EXISTS update_subscriptions_updated_at ON subscriptions;

-- Drop the table completely
DROP TABLE IF EXISTS subscriptions CASCADE;

-- Drop enum types
DROP TYPE IF EXISTS subscription_plan CASCADE;
DROP TYPE IF EXISTS subscription_status CASCADE;

-- Create enum types with correct values
CREATE TYPE subscription_plan AS ENUM ('basic', 'premium', 'buyer_basic', 'buyer_premium');
CREATE TYPE subscription_status AS ENUM ('active', 'cancelled', 'expired');

-- Create subscriptions table with correct schema
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    plan subscription_plan NOT NULL,
    status subscription_status NOT NULL DEFAULT 'active',
    price DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) NOT NULL DEFAULT 'USD',
    payment_intent_id VARCHAR(255),
    start_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    end_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (NOW() + INTERVAL '1 month'),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Drop any existing policies
DROP POLICY IF EXISTS "Users can view their own subscriptions" ON subscriptions;
DROP POLICY IF EXISTS "Users can insert their own subscriptions" ON subscriptions;
DROP POLICY IF EXISTS "Users can update their own subscriptions" ON subscriptions;
DROP POLICY IF EXISTS "Service role can access all subscriptions" ON subscriptions;

-- Create RLS policies
CREATE POLICY "Users can view their own subscriptions"
    ON subscriptions FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own subscriptions"
    ON subscriptions FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own subscriptions"
    ON subscriptions FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Service role can access all subscriptions"
    ON subscriptions FOR ALL
    USING (auth.role() = 'service_role');

-- Create indexes for better performance
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_subscriptions_plan ON subscriptions(plan);
CREATE INDEX idx_subscriptions_end_date ON subscriptions(end_date);
CREATE INDEX idx_subscriptions_user_status ON subscriptions(user_id, status);

-- Create function to set subscription price based on plan
CREATE OR REPLACE FUNCTION set_subscription_price()
RETURNS TRIGGER AS $$
BEGIN
    CASE NEW.plan
        WHEN 'basic' THEN
            NEW.price := 459.00;
        WHEN 'premium' THEN
            NEW.price := 999.00;
        WHEN 'buyer_basic' THEN
            NEW.price := 99.00;
        WHEN 'buyer_premium' THEN
            NEW.price := 599.00;
    END CASE;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create function to update updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
CREATE TRIGGER set_subscription_price
    BEFORE INSERT OR UPDATE ON subscriptions
    FOR EACH ROW
    EXECUTE FUNCTION set_subscription_price();

CREATE TRIGGER update_subscriptions_updated_at
    BEFORE UPDATE ON subscriptions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT SELECT, INSERT, UPDATE ON subscriptions TO authenticated;
GRANT ALL ON subscriptions TO service_role;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO authenticated;

-- Refresh schema cache
NOTIFY pgrst, 'reload schema';

-- Add comments for documentation
COMMENT ON TABLE subscriptions IS 'Stores user subscription information with pricing and access controls';
COMMENT ON COLUMN subscriptions.plan IS 'Subscription plan type: basic ($459/month), premium ($999/month), buyer_basic ($99/year), buyer_premium ($599/year)';
COMMENT ON COLUMN subscriptions.price IS 'Automatically set based on plan type';
COMMENT ON COLUMN subscriptions.end_date IS 'Subscription expiration date - used for access control'; 