DO $$ 
BEGIN
    -- Drop the existing type constraint if it exists
    IF EXISTS (
        SELECT 1 
        FROM pg_constraint 
        WHERE conname = 'subscriptions_type_check'
    ) THEN
        ALTER TABLE subscriptions DROP CONSTRAINT subscriptions_type_check;
    END IF;

    -- Add the new type constraint
    ALTER TABLE subscriptions ADD CONSTRAINT subscriptions_type_check 
        CHECK (type IN ('free', 'basic', 'premium', 'buyer_basic', 'buyer_premium'));

    -- Drop the existing status constraint if it exists
    IF EXISTS (
        SELECT 1 
        FROM pg_constraint 
        WHERE conname = 'subscriptions_status_check'
    ) THEN
        ALTER TABLE subscriptions DROP CONSTRAINT subscriptions_status_check;
    END IF;

    -- Add the new status constraint
    ALTER TABLE subscriptions ADD CONSTRAINT subscriptions_status_check 
        CHECK (status IN ('active', 'inactive', 'expired'));
END $$; 