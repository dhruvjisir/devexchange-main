-- Remove invalid tags from all projects
UPDATE projects
SET tags = array_remove(tags, '444')
WHERE '444' = ANY(tags);

UPDATE projects
SET tags = array_remove(tags, '564')
WHERE '564' = ANY(tags);

UPDATE projects
SET tags = array_remove(tags, '4554')
WHERE '4554' = ANY(tags);

UPDATE projects
SET tags = array_remove(tags, '7')
WHERE '7' = ANY(tags);

-- Create a function to validate tags
CREATE OR REPLACE FUNCTION validate_project_tags()
RETURNS TRIGGER AS $$
BEGIN
    -- Check if any tag is a number
    IF EXISTS (
        SELECT 1
        FROM unnest(NEW.tags) AS tag
        WHERE tag ~ '^\d+$'
    ) THEN
        RAISE EXCEPTION 'Tags cannot be numbers';
    END IF;

    -- Check if any tag is too short
    IF EXISTS (
        SELECT 1
        FROM unnest(NEW.tags) AS tag
        WHERE length(tag) < 2
    ) THEN
        RAISE EXCEPTION 'Tags must be at least 2 characters long';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to validate tags before insert or update
CREATE TRIGGER validate_project_tags_trigger
    BEFORE INSERT OR UPDATE ON projects
    FOR EACH ROW
    EXECUTE FUNCTION validate_project_tags(); 