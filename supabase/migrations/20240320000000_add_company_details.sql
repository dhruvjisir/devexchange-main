-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Add company details fields to projects table
ALTER TABLE projects
ADD COLUMN IF NOT EXISTS date_founded DATE,
ADD COLUMN IF NOT EXISTS team_size INTEGER,
ADD COLUMN IF NOT EXISTS business_models TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS tech_stack TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS competitors TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS growth_opportunities TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS key_assets TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS selling_reason TEXT,
ADD COLUMN IF NOT EXISTS financing TEXT;

-- Add comments to explain the fields
COMMENT ON COLUMN projects.date_founded IS 'The date when the company was founded';
COMMENT ON COLUMN projects.team_size IS 'The current number of employees in the company';
COMMENT ON COLUMN projects.business_models IS 'Array of business models used by the company';
COMMENT ON COLUMN projects.tech_stack IS 'Array of technologies used in the project';
COMMENT ON COLUMN projects.competitors IS 'Array of main competitors in the market';
COMMENT ON COLUMN projects.growth_opportunities IS 'Array of potential growth opportunities';
COMMENT ON COLUMN projects.key_assets IS 'Array of key assets owned by the company';
COMMENT ON COLUMN projects.selling_reason IS 'Reason for selling the business';
COMMENT ON COLUMN projects.financing IS 'Information about current financing';

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_projects_date_founded ON projects(date_founded);
CREATE INDEX IF NOT EXISTS idx_projects_team_size ON projects(team_size);

-- Enable Row Level Security
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON projects;
DROP POLICY IF EXISTS "Enable update for project owners" ON projects;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON projects;
DROP POLICY IF EXISTS "Enable delete for project owners" ON projects;

-- Create new RLS policies
CREATE POLICY "Enable read access for authenticated users"
ON projects FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Enable insert for authenticated users"
ON projects FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = maker_id);

CREATE POLICY "Enable update for project owners"
ON projects FOR UPDATE
TO authenticated
USING (auth.uid() = maker_id)
WITH CHECK (auth.uid() = maker_id);

CREATE POLICY "Enable delete for project owners"
ON projects FOR DELETE
TO authenticated
USING (auth.uid() = maker_id);

-- Add validation constraints
ALTER TABLE projects
DROP CONSTRAINT IF EXISTS valid_team_size,
DROP CONSTRAINT IF EXISTS valid_date_founded;

ALTER TABLE projects
ADD CONSTRAINT valid_team_size CHECK (team_size > 0),
ADD CONSTRAINT valid_date_founded CHECK (date_founded <= CURRENT_DATE);

-- Create or replace the array validation function
CREATE OR REPLACE FUNCTION validate_arrays()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.business_models IS NOT NULL AND array_length(NEW.business_models, 1) = 0 THEN
        RAISE EXCEPTION 'business_models array cannot be empty';
    END IF;
    IF NEW.tech_stack IS NOT NULL AND array_length(NEW.tech_stack, 1) = 0 THEN
        RAISE EXCEPTION 'tech_stack array cannot be empty';
    END IF;
    IF NEW.competitors IS NOT NULL AND array_length(NEW.competitors, 1) = 0 THEN
        RAISE EXCEPTION 'competitors array cannot be empty';
    END IF;
    IF NEW.growth_opportunities IS NOT NULL AND array_length(NEW.growth_opportunities, 1) = 0 THEN
        RAISE EXCEPTION 'growth_opportunities array cannot be empty';
    END IF;
    IF NEW.key_assets IS NOT NULL AND array_length(NEW.key_assets, 1) = 0 THEN
        RAISE EXCEPTION 'key_assets array cannot be empty';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS validate_arrays_trigger ON projects;

-- Create the trigger
CREATE TRIGGER validate_arrays_trigger
    BEFORE INSERT OR UPDATE ON projects
    FOR EACH ROW
    EXECUTE FUNCTION validate_arrays();

-- Create a rollback function
CREATE OR REPLACE FUNCTION rollback_company_details()
RETURNS void AS $$
BEGIN
    -- Drop the trigger first
    DROP TRIGGER IF EXISTS validate_arrays_trigger ON projects;
    
    -- Drop the function
    DROP FUNCTION IF EXISTS validate_arrays();
    
    -- Drop the constraints
    ALTER TABLE projects
    DROP CONSTRAINT IF EXISTS valid_team_size,
    DROP CONSTRAINT IF EXISTS valid_date_founded;
    
    -- Drop the indexes
    DROP INDEX IF EXISTS idx_projects_date_founded;
    DROP INDEX IF EXISTS idx_projects_team_size;
    
    -- Drop the columns
    ALTER TABLE projects
    DROP COLUMN IF EXISTS date_founded,
    DROP COLUMN IF EXISTS team_size,
    DROP COLUMN IF EXISTS business_models,
    DROP COLUMN IF EXISTS tech_stack,
    DROP COLUMN IF EXISTS competitors,
    DROP COLUMN IF EXISTS growth_opportunities,
    DROP COLUMN IF EXISTS key_assets,
    DROP COLUMN IF EXISTS selling_reason,
    DROP COLUMN IF EXISTS financing;
END;
$$ LANGUAGE plpgsql; 