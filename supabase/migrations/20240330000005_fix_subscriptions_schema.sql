-- Add missing columns to subscriptions table
ALTER TABLE subscriptions 
ADD COLUMN IF NOT EXISTS amount DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'INR',
ADD COLUMN IF NOT EXISTS payment_id TEXT,
ADD COLUMN IF NOT EXISTS order_id TEXT,
ADD COLUMN IF NOT EXISTS type TEXT CHECK (type IN ('seller', 'buyer')),
ADD COLUMN IF NOT EXISTS valuation DECIMAL(15,2);

-- Update existing records to have default values
UPDATE subscriptions 
SET 
  amount = 0,
  currency = 'INR',
  type = 'seller'
WHERE amount IS NULL;

-- Make amount column NOT NULL after setting defaults
ALTER TABLE subscriptions ALTER COLUMN amount SET NOT NULL; 