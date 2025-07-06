-- Fix Subscription Schema Issues
-- This script checks and fixes the subscriptions table to resolve 406 errors

-- 1. Check current table structure
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default,
    character_maximum_length
FROM information_schema.columns 
WHERE table_name = 'subscriptions' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 2. Check if RLS is enabled
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'subscriptions';

-- 3. Check RLS policies
SELECT 
    policyname,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'subscriptions';

-- 4. Check if the table has the correct structure
-- If not, recreate it with the proper schema
DO $$ 
BEGIN
    -- Check if the table has the expected columns
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'subscriptions' 
        AND column_name = 'plan'
        AND data_type = 'USER-DEFINED'
    ) THEN
        RAISE NOTICE 'Table structure is incorrect. Recreating...';
        
        -- Drop existing table and recreate
        DROP TABLE IF EXISTS subscriptions CASCADE;
        
        -- Create enum types if they don't exist
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'subscription_plan') THEN
            CREATE TYPE subscription_plan AS ENUM ('basic', 'premium', 'buyer_basic', 'buyer_premium');
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'subscription_status') THEN
            CREATE TYPE subscription_status AS ENUM ('active', 'cancelled', 'expired');
        END IF;
        
        -- Create the table with correct structure
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
            
        -- Add service role policy
        CREATE POLICY "Service role can access all subscriptions"
            ON subscriptions FOR ALL
            USING (auth.role() = 'service_role');
        
        -- Create indexes
        CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
        CREATE INDEX idx_subscriptions_status ON subscriptions(status);
        CREATE INDEX idx_subscriptions_plan ON subscriptions(plan);
        CREATE INDEX idx_subscriptions_end_date ON subscriptions(end_date);
        CREATE INDEX idx_subscriptions_user_status ON subscriptions(user_id, status);
        
        RAISE NOTICE 'Table recreated successfully';
    ELSE
        RAISE NOTICE 'Table structure is correct';
    END IF;
END $$;

-- 5. Ensure all required columns exist with correct types
DO $$ 
BEGIN
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

-- 6. Update existing records with missing required fields
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

-- 7. Grant necessary permissions
GRANT SELECT, INSERT, UPDATE ON subscriptions TO authenticated;
GRANT ALL ON subscriptions TO service_role;

-- 8. Refresh schema cache
NOTIFY pgrst, 'reload schema';

-- 9. Show final table structure
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'subscriptions' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 10. Show final policies
SELECT 
    policyname,
    cmd,
    qual
FROM pg_policies 
WHERE tablename = 'subscriptions'; 