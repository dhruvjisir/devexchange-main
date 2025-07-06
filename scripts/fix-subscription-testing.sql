-- Temporary fix for testing - allows all operations on subscriptions table
-- WARNING: This is for testing only, NOT for production!

-- Enable RLS
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Drop all existing policies
DROP POLICY IF EXISTS "Users can view their own subscriptions" ON subscriptions;
DROP POLICY IF EXISTS "Users can insert their own subscriptions" ON subscriptions;
DROP POLICY IF EXISTS "Users can update their own subscriptions" ON subscriptions;
DROP POLICY IF EXISTS "Users can delete their own subscriptions" ON subscriptions;
DROP POLICY IF EXISTS "Allow all operations for testing" ON subscriptions;

-- Create a permissive policy for testing
CREATE POLICY "Allow all operations for testing"
    ON subscriptions FOR ALL
    USING (true);

-- Verify the policy was created
SELECT 
    schemaname, 
    tablename, 
    policyname, 
    permissive, 
    roles, 
    cmd, 
    qual 
FROM pg_policies 
WHERE tablename = 'subscriptions'; 