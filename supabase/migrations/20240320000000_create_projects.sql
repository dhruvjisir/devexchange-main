-- Create the projects table
CREATE TABLE IF NOT EXISTS projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(12,2) NOT NULL,
    image TEXT,
    category TEXT NOT NULL,
    is_new BOOLEAN DEFAULT true,
    is_verified BOOLEAN DEFAULT false,
    yearly_revenue DECIMAL(12,2) NOT NULL DEFAULT 0,
    maker JSONB DEFAULT '{"id": null, "name": "", "email": "", "phone": "", "kyc": {"document_type": "pending", "document_number": "", "document_image": "", "address": {"street": "", "city": "", "state": "", "country": "", "postal_code": ""}, "verification_status": "pending", "verification_date": null}}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create an index on the maker.id field for faster queries
CREATE INDEX IF NOT EXISTS idx_projects_maker_id ON projects ((maker->>'id'));

-- Add RLS policies
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Allow users to view all projects
CREATE POLICY "Allow users to view all projects"
    ON projects FOR SELECT
    USING (true);

-- Allow users to insert their own projects
CREATE POLICY "Allow users to insert their own projects"
    ON projects FOR INSERT
    WITH CHECK (auth.uid()::text = (maker->>'id'));

-- Allow users to update their own projects
CREATE POLICY "Allow users to update their own projects"
    ON projects FOR UPDATE
    USING (auth.uid()::text = (maker->>'id'));

-- Allow users to delete their own projects
CREATE POLICY "Allow users to delete their own projects"
    ON projects FOR DELETE
    USING (auth.uid()::text = (maker->>'id'));

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create a trigger to automatically update the updated_at column
CREATE TRIGGER update_projects_updated_at
    BEFORE UPDATE ON projects
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 