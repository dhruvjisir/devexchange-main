-- Create user_access table if it doesn't exist
CREATE TABLE IF NOT EXISTS user_access (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  plan TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('seller', 'buyer')),
  subscription_id UUID REFERENCES subscriptions(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, plan, type)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_user_access_user_id ON user_access(user_id);
CREATE INDEX IF NOT EXISTS idx_user_access_plan ON user_access(plan);
CREATE INDEX IF NOT EXISTS idx_user_access_type ON user_access(type);

-- Enable RLS
ALTER TABLE user_access ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own access" ON user_access
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own access" ON user_access
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own access" ON user_access
  FOR UPDATE USING (auth.uid() = user_id);

-- Create trigger for updated_at
CREATE TRIGGER update_user_access_updated_at 
  BEFORE UPDATE ON user_access 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column(); 