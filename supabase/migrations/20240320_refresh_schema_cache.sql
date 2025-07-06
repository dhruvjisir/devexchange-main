-- Refresh the schema cache to recognize the new payment_intent_id column
NOTIFY pgrst, 'reload schema';

-- Ensure the column exists and has the correct type
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'subscriptions' 
        AND column_name = 'payment_intent_id'
    ) THEN
        ALTER TABLE subscriptions ADD COLUMN payment_intent_id TEXT;
    END IF;
END $$;

-- Update any existing subscriptions to use payment_id as payment_intent_id
UPDATE subscriptions 
SET payment_intent_id = payment_id 
WHERE payment_intent_id IS NULL;

-- Refresh the schema cache again to ensure all changes are recognized
NOTIFY pgrst, 'reload schema'; 