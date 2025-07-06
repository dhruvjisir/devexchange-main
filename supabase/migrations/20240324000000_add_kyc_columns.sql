-- Add KYC columns to the maker JSONB object in projects table
ALTER TABLE projects
ALTER COLUMN maker TYPE JSONB USING maker::jsonb;

-- Update the maker JSONB structure to include KYC information
UPDATE projects
SET maker = maker || jsonb_build_object(
  'kyc', jsonb_build_object(
    'document_type', 'pending',
    'document_number', '',
    'document_image', '',
    'address', jsonb_build_object(
      'street', '',
      'city', '',
      'state', '',
      'country', '',
      'postal_code', ''
    ),
    'verification_status', 'pending',
    'verification_date', null
  )
)
WHERE maker->>'kyc' IS NULL;

-- Add a check constraint to ensure KYC information is present
ALTER TABLE projects
ADD CONSTRAINT maker_kyc_check
CHECK (
  maker ? 'kyc' AND
  maker->'kyc' ? 'document_type' AND
  maker->'kyc' ? 'document_number' AND
  maker->'kyc' ? 'document_image' AND
  maker->'kyc' ? 'address' AND
  maker->'kyc' ? 'verification_status'
); 