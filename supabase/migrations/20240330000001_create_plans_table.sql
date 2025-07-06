-- Create plans table for subscription plan details
CREATE TABLE IF NOT EXISTS plans (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    duration_days INTEGER NOT NULL,
    features JSONB,
    max_listing_amount DECIMAL(10,2),
    contact_access_limit DECIMAL(10,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE plans ENABLE ROW LEVEL SECURITY;

-- Create policies for plans table
CREATE POLICY "Anyone can view plans"
    ON plans FOR SELECT
    USING (true);

CREATE POLICY "Service role can manage plans"
    ON plans FOR ALL
    USING (auth.role() = 'service_role');

-- Insert default plans
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

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_plans_id ON plans(id);

-- Grant permissions
GRANT ALL ON plans TO authenticated;
GRANT ALL ON plans TO service_role; 