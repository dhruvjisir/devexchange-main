-- Drop existing objects if they exist
DROP FUNCTION IF EXISTS prevent_multiple_active_subscriptions() CASCADE;
DROP FUNCTION IF EXISTS set_subscription_price() CASCADE;
DROP FUNCTION IF EXISTS get_subscription_price(subscription_plan) CASCADE;
DROP FUNCTION IF EXISTS check_subscription_expiration() CASCADE;
DROP FUNCTION IF EXISTS is_subscription_expired(UUID) CASCADE;
DROP FUNCTION IF EXISTS get_subscription_status(UUID) CASCADE;
DROP FUNCTION IF EXISTS can_view_contact_details(UUID, DECIMAL) CASCADE;
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;
DROP TABLE IF EXISTS subscriptions CASCADE;
DROP TYPE IF EXISTS subscription_plan CASCADE;
DROP TYPE IF EXISTS subscription_status CASCADE;

-- Create enum types
CREATE TYPE subscription_plan AS ENUM ('basic', 'premium', 'buyer_basic', 'buyer_premium');
CREATE TYPE subscription_status AS ENUM ('active', 'cancelled', 'expired');

-- Create subscriptions table
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

-- Enable Row Level Security
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own subscriptions" ON subscriptions;
DROP POLICY IF EXISTS "Users can insert their own subscriptions" ON subscriptions;
DROP POLICY IF EXISTS "Users can update their own subscriptions" ON subscriptions;

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

-- Create function to prevent multiple active subscriptions
CREATE OR REPLACE FUNCTION prevent_multiple_active_subscriptions()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'active' THEN
        IF EXISTS (
            SELECT 1 FROM subscriptions
            WHERE user_id = NEW.user_id
            AND status = 'active'
            AND id != NEW.id
        ) THEN
            RAISE EXCEPTION 'User already has an active subscription';
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for preventing multiple active subscriptions
CREATE TRIGGER prevent_multiple_active_subscriptions
    BEFORE INSERT OR UPDATE ON subscriptions
    FOR EACH ROW
    EXECUTE FUNCTION prevent_multiple_active_subscriptions();

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

-- Create trigger for setting subscription price
CREATE TRIGGER set_subscription_price
    BEFORE INSERT OR UPDATE ON subscriptions
    FOR EACH ROW
    EXECUTE FUNCTION set_subscription_price();

-- Create function to check subscription expiration
CREATE OR REPLACE FUNCTION check_subscription_expiration()
RETURNS TRIGGER AS $$
BEGIN
    -- If the subscription is active and has expired, mark it as expired
    IF NEW.status = 'active' AND NEW.end_date < NOW() THEN
        NEW.status := 'expired';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for checking subscription expiration
CREATE TRIGGER check_subscription_expiration
    BEFORE INSERT OR UPDATE ON subscriptions
    FOR EACH ROW
    EXECUTE FUNCTION check_subscription_expiration();

-- Create a function to check if a subscription is expired
CREATE OR REPLACE FUNCTION is_subscription_expired(subscription_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    sub_end_date TIMESTAMP WITH TIME ZONE;
    sub_status subscription_status;
BEGIN
    SELECT end_date, status INTO sub_end_date, sub_status
    FROM subscriptions
    WHERE id = subscription_id;

    RETURN sub_status = 'expired' OR (sub_status = 'active' AND sub_end_date < NOW());
END;
$$ LANGUAGE plpgsql;

-- Create a function to get subscription status with expiration check
CREATE OR REPLACE FUNCTION get_subscription_status(subscription_id UUID)
RETURNS subscription_status AS $$
DECLARE
    sub_end_date TIMESTAMP WITH TIME ZONE;
    sub_status subscription_status;
BEGIN
    SELECT end_date, status INTO sub_end_date, sub_status
    FROM subscriptions
    WHERE id = subscription_id;

    IF sub_status = 'active' AND sub_end_date < NOW() THEN
        RETURN 'expired';
    END IF;

    RETURN sub_status;
END;
$$ LANGUAGE plpgsql;

-- Create function to check if user can view contact details
CREATE OR REPLACE FUNCTION can_view_contact_details(user_id UUID, project_price DECIMAL)
RETURNS BOOLEAN AS $$
DECLARE
    user_subscription subscriptions;
BEGIN
    -- Get user's subscription
    SELECT * INTO user_subscription
    FROM subscriptions
    WHERE subscriptions.user_id = $1
    AND status = 'active'
    AND end_date > timezone('utc'::text, now());

    -- If no active subscription, return false
    IF user_subscription IS NULL THEN
        RETURN FALSE;
    END IF;

    -- Check limits based on subscription type
    CASE user_subscription.plan
        -- Buyer plans
        WHEN 'buyer_basic' THEN
            RETURN project_price < 100000; -- Can view contacts for projects under $100K
        WHEN 'buyer_premium' THEN
            RETURN TRUE; -- Can view contacts for all projects
        -- Seller plans cannot view contact details
        WHEN 'basic' THEN
            RETURN FALSE;
        WHEN 'premium' THEN
            RETURN FALSE;
        ELSE
            RETURN FALSE;
    END CASE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to get subscription price
CREATE OR REPLACE FUNCTION get_subscription_price(plan subscription_plan)
RETURNS DECIMAL AS $$
BEGIN
    RETURN CASE plan
        WHEN 'basic' THEN 459.00
        WHEN 'premium' THEN 999.00
        WHEN 'buyer_basic' THEN 99.00
        WHEN 'buyer_premium' THEN 599.00
    END;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_subscriptions_updated_at
    BEFORE UPDATE ON subscriptions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 