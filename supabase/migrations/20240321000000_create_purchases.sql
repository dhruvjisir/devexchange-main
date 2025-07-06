-- Create purchases table
CREATE TABLE purchases (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    buyer_id UUID REFERENCES auth.users(id) NOT NULL,
    project_id UUID REFERENCES projects(id) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    payment_intent_id VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(buyer_id, project_id)
);

-- Add company details columns to projects table
ALTER TABLE projects ADD COLUMN date_founded DATE;
ALTER TABLE projects ADD COLUMN team_size VARCHAR(50);
ALTER TABLE projects ADD COLUMN business_models TEXT[];
ALTER TABLE projects ADD COLUMN tech_stack TEXT[];
ALTER TABLE projects ADD COLUMN competitors TEXT[];
ALTER TABLE projects ADD COLUMN growth_opportunities TEXT[];
ALTER TABLE projects ADD COLUMN key_assets TEXT[];
ALTER TABLE projects ADD COLUMN selling_reason TEXT;
ALTER TABLE projects ADD COLUMN financing TEXT;

-- Create index for faster purchase retrieval
CREATE INDEX purchases_buyer_idx ON purchases(buyer_id);
CREATE INDEX purchases_project_idx ON purchases(project_id);

-- Enable RLS
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own purchases"
    ON purchases FOR SELECT
    USING (auth.uid() = buyer_id);

CREATE POLICY "Users can insert their own purchases"
    ON purchases FOR INSERT
    WITH CHECK (auth.uid() = buyer_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER update_purchases_updated_at
    BEFORE UPDATE ON purchases
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 