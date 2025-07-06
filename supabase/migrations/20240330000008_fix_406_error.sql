-- Fix 406 error in subscriptions table
-- This migration addresses the HTTP 406 errors when querying subscriptions

-- First, let's check and fix the table structure
DO $$ 
BEGIN
    -- Ensure all required columns exist with correct types
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'subscriptions' 
        AND column_name = 'id'
    ) THEN
        -- Recreate the table if it doesn't exist
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
    END IF;

    -- Add missing columns if they don't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'subscriptions' 
        AND column_name = 'price'
    ) THEN
        ALTER TABLE subscriptions ADD COLUMN price DECIMAL(10,2) NOT NULL DEFAULT 0;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'subscriptions' 
        AND column_name = 'currency'
    ) THEN
        ALTER TABLE subscriptions ADD COLUMN currency VARCHAR(3) NOT NULL DEFAULT 'USD';
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'subscriptions' 
        AND column_name = 'payment_intent_id'
    ) THEN
        ALTER TABLE subscriptions ADD COLUMN payment_intent_id VARCHAR(255);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'subscriptions' 
        AND column_name = 'start_date'
    ) THEN
        ALTER TABLE subscriptions ADD COLUMN start_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW();
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'subscriptions' 
        AND column_name = 'end_date'
    ) THEN
        ALTER TABLE subscriptions ADD COLUMN end_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (NOW() + INTERVAL '1 month');
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'subscriptions' 
        AND column_name = 'created_at'
    ) THEN
        ALTER TABLE subscriptions ADD COLUMN created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW();
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'subscriptions' 
        AND column_name = 'updated_at'
    ) THEN
        ALTER TABLE subscriptions ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW();
    END IF;
END $$;

-- Ensure RLS is enabled
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to recreate them
DROP POLICY IF EXISTS "Users can view their own subscriptions" ON subscriptions;
DROP POLICY IF EXISTS "Users can insert their own subscriptions" ON subscriptions;
DROP POLICY IF EXISTS "Users can update their own subscriptions" ON subscriptions;
DROP POLICY IF EXISTS "Service role can access all subscriptions" ON subscriptions;

-- Recreate policies with proper conditions
CREATE POLICY "Users can view their own subscriptions"
    ON subscriptions FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own subscriptions"
    ON subscriptions FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own subscriptions"
    ON subscriptions FOR UPDATE
    USING (auth.uid() = user_id);

-- Add policy for service role access (for Edge Functions)
CREATE POLICY "Service role can access all subscriptions"
    ON subscriptions FOR ALL
    USING (auth.role() = 'service_role');

-- Ensure indexes exist for better performance
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_plan ON subscriptions(plan);
CREATE INDEX IF NOT EXISTS idx_subscriptions_end_date ON subscriptions(end_date);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_status ON subscriptions(user_id, status);

-- Grant necessary permissions
GRANT SELECT, INSERT, UPDATE ON subscriptions TO authenticated;
GRANT ALL ON subscriptions TO service_role;

-- Update any existing records with missing required fields
UPDATE subscriptions 
SET 
    price = CASE 
        WHEN plan = 'basic' THEN 459.00
        WHEN plan = 'premium' THEN 999.00
        WHEN plan = 'buyer_basic' THEN 99.00
        WHEN plan = 'buyer_premium' THEN 599.00
        ELSE 0
    END,
    currency = 'USD',
    start_date = COALESCE(start_date, created_at, NOW()),
    end_date = COALESCE(end_date, created_at + INTERVAL '1 month', NOW() + INTERVAL '1 month')
WHERE price IS NULL OR currency IS NULL OR start_date IS NULL OR end_date IS NULL; 