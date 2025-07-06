-- Enable RLS on projects table
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can view projects" ON projects;
DROP POLICY IF EXISTS "Authenticated users can insert projects" ON projects;
DROP POLICY IF EXISTS "Users can update their own projects" ON projects;
DROP POLICY IF EXISTS "Users can delete their own projects" ON projects;

-- Create policies for projects table
CREATE POLICY "Anyone can view projects"
    ON projects FOR SELECT
    USING (true);

CREATE POLICY "Authenticated users can insert projects"
    ON projects FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update their own projects"
    ON projects FOR UPDATE
    USING (auth.uid()::text = (maker->>'id'))
    WITH CHECK (auth.uid()::text = (maker->>'id'));

CREATE POLICY "Users can delete their own projects"
    ON projects FOR DELETE
    USING (auth.uid()::text = (maker->>'id'));

-- Create storage bucket policies
CREATE POLICY "Anyone can view product images"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'product-images');

CREATE POLICY "Authenticated users can upload product images"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'product-images' 
        AND auth.role() = 'authenticated'
    );

CREATE POLICY "Users can update their own product images"
    ON storage.objects FOR UPDATE
    USING (
        bucket_id = 'product-images' 
        AND auth.role() = 'authenticated'
    );

CREATE POLICY "Users can delete their own product images"
    ON storage.objects FOR DELETE
    USING (
        bucket_id = 'product-images' 
        AND auth.role() = 'authenticated'
    ); 