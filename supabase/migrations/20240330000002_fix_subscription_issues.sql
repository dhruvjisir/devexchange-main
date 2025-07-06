-- Fix subscription system issues
-- This migration addresses the HTTP 406 errors and missing tables

-- First, ensure the subscriptions table has the correct structure
DO $$ 
BEGIN
    -- Check if subscriptions table exists and has correct columns
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'subscriptions' 
        AND column_name = 'plan'
    ) THEN
        -- Drop and recreate if structure is wrong
        DROP TABLE IF EXISTS subscriptions CASCADE;
        
        CREATE TABLE subscriptions (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
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
        
        -- Enable RLS
        ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
        
        -- Create policies
        CREATE POLICY "Users can view their own subscriptions"
            ON subscriptions FOR SELECT
            USING (auth.uid() = user_id);

        CREATE POLICY "Users can insert their own subscriptions"
            ON subscriptions FOR INSERT
            WITH CHECK (auth.uid() = user_id);

        CREATE POLICY "Users can update their own subscriptions"
            ON subscriptions FOR UPDATE
            USING (auth.uid() = user_id);
    END IF;
END $$;

-- Handle plans table - add missing columns if they don't exist
DO $$ 
BEGIN
    -- Add description column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'plans' 
        AND column_name = 'description'
    ) THEN
        ALTER TABLE plans ADD COLUMN description TEXT;
    END IF;
    
    -- Add duration_days column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'plans' 
        AND column_name = 'duration_days'
    ) THEN
        ALTER TABLE plans ADD COLUMN duration_days INTEGER DEFAULT 30;
    END IF;
    
    -- Add features column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'plans' 
        AND column_name = 'features'
    ) THEN
        ALTER TABLE plans ADD COLUMN features JSONB;
    END IF;
    
    -- Add max_listing_amount column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'plans' 
        AND column_name = 'max_listing_amount'
    ) THEN
        ALTER TABLE plans ADD COLUMN max_listing_amount DECIMAL(10,2);
    END IF;
    
    -- Add contact_access_limit column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'plans' 
        AND column_name = 'contact_access_limit'
    ) THEN
        ALTER TABLE plans ADD COLUMN contact_access_limit DECIMAL(10,2);
    END IF;
    
    -- Add created_at column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'plans' 
        AND column_name = 'created_at'
    ) THEN
        ALTER TABLE plans ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
    
    -- Add updated_at column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'plans' 
        AND column_name = 'updated_at'
    ) THEN
        ALTER TABLE plans ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
END $$;

-- Enable Row Level Security for plans if not already enabled
ALTER TABLE plans ENABLE ROW LEVEL SECURITY;

-- Create policies for plans table
DROP POLICY IF EXISTS "Anyone can view plans" ON plans;
CREATE POLICY "Anyone can view plans"
    ON plans FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Service role can manage plans" ON plans;
CREATE POLICY "Service role can manage plans"
    ON plans FOR ALL
    USING (auth.role() = 'service_role');

-- Check if type column exists and handle accordingly
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'plans' 
        AND column_name = 'type'
    ) THEN
        -- Insert with type column
        INSERT INTO plans (id, name, type, description, price, duration_days, features, max_listing_amount, contact_access_limit) VALUES
        ('free', 'Free Plan', 'free', 'List projects up to $10,000 for free', 0.00, 365, 
         '{"features": ["List unlimited projects up to $10,000", "Basic project analytics", "Standard visibility", "30 days listing duration", "Email support"]}', 
         10000, NULL),
        ('basic', 'Seller Plan 1', 'seller', 'List projects up to $100,000', 459.00, 30, 
         '{"features": ["List projects up to $100,000", "Basic project analytics", "Standard visibility", "30 days listing duration", "Email support"]}', 
         100000, NULL),
        ('premium', 'Seller Plan 2', 'seller', 'List projects up to $250,000', 999.00, 30, 
         '{"features": ["List projects up to $250,000", "Advanced project analytics", "Featured visibility", "90 days listing duration", "Priority email support", "Custom project page", "Performance metrics"]}', 
         250000, NULL),
        ('buyer_basic', 'Buyer Plan 1', 'buyer', 'View contact details for projects under $100,000', 99.00, 365, 
         '{"features": ["View contact details for projects under $100,000", "Basic search filters", "Email support"]}', 
         0, 100000),
        ('buyer_premium', 'Buyer Plan 2', 'buyer', 'View contact details for all projects', 599.00, 365, 
         '{"features": ["View contact details for all projects", "Advanced search filters", "Priority support", "Direct messaging"]}', 
         0, NULL)
        ON CONFLICT (id) DO UPDATE SET
            name = EXCLUDED.name,
            type = EXCLUDED.type,
            description = EXCLUDED.description,
            price = EXCLUDED.price,
            duration_days = EXCLUDED.duration_days,
            features = EXCLUDED.features,
            max_listing_amount = EXCLUDED.max_listing_amount,
            contact_access_limit = EXCLUDED.contact_access_limit,
            updated_at = NOW();
    ELSE
        -- Insert without type column
        INSERT INTO plans (id, name, description, price, duration_days, features, max_listing_amount, contact_access_limit) VALUES
        ('free', 'Free Plan', 'List projects up to $10,000 for free', 0.00, 365, 
         '{"features": ["List unlimited projects up to $10,000", "Basic project analytics", "Standard visibility", "30 days listing duration", "Email support"]}', 
         10000, NULL),
        ('basic', 'Seller Plan 1', 'List projects up to $100,000', 459.00, 30, 
         '{"features": ["List projects up to $100,000", "Basic project analytics", "Standard visibility", "30 days listing duration", "Email support"]}', 
         100000, NULL),
        ('premium', 'Seller Plan 2', 'List projects up to $250,000', 999.00, 30, 
         '{"features": ["List projects up to $250,000", "Advanced project analytics", "Featured visibility", "90 days listing duration", "Priority email support", "Custom project page", "Performance metrics"]}', 
         250000, NULL),
        ('buyer_basic', 'Buyer Plan 1', 'View contact details for projects under $100,000', 99.00, 365, 
         '{"features": ["View contact details for projects under $100,000", "Basic search filters", "Email support"]}', 
         0, 100000),
        ('buyer_premium', 'Buyer Plan 2', 'View contact details for all projects', 599.00, 365, 
         '{"features": ["View contact details for all projects", "Advanced search filters", "Priority support", "Direct messaging"]}', 
         0, NULL)
        ON CONFLICT (id) DO UPDATE SET
            name = EXCLUDED.name,
            description = EXCLUDED.description,
            price = EXCLUDED.price,
            duration_days = EXCLUDED.duration_days,
            features = EXCLUDED.features,
            max_listing_amount = EXCLUDED.max_listing_amount,
            contact_access_limit = EXCLUDED.contact_access_limit,
            updated_at = NOW();
    END IF;
END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_plan ON subscriptions(plan);
CREATE INDEX IF NOT EXISTS idx_subscriptions_end_date ON subscriptions(end_date);
CREATE INDEX IF NOT EXISTS idx_plans_id ON plans(id);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON subscriptions TO authenticated;
GRANT ALL ON plans TO authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO authenticated;

-- Ensure all functions exist and are working
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

-- Create trigger for setting subscription price
DROP TRIGGER IF EXISTS set_subscription_price ON subscriptions;
CREATE TRIGGER set_subscription_price
    BEFORE INSERT OR UPDATE ON subscriptions
    FOR EACH ROW
    EXECUTE FUNCTION set_subscription_price();

-- Add comments for documentation
COMMENT ON TABLE subscriptions IS 'Stores user subscription information with pricing and access controls';
COMMENT ON TABLE plans IS 'Stores subscription plan details and features';
COMMENT ON COLUMN subscriptions.plan IS 'Subscription plan type: basic ($459/month), premium ($999/month), buyer_basic ($99/year), buyer_premium ($599/year)';
COMMENT ON COLUMN subscriptions.price IS 'Automatically set based on plan type';
COMMENT ON COLUMN subscriptions.end_date IS 'Subscription expiration date - used for access control'; 