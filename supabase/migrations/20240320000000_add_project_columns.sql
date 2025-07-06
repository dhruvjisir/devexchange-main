-- Add new columns to the projects table
ALTER TABLE projects
ADD COLUMN IF NOT EXISTS is_new BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS yearly_revenue DECIMAL(12,2) NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS maker JSONB DEFAULT '{"id": null, "name": "", "email": "", "phone": "", "kyc": {"document_type": "pending", "document_number": "", "document_image": "", "address": {"street": "", "city": "", "state": "", "country": "", "postal_code": ""}, "verification_status": "pending", "verification_date": null}}'::jsonb,
ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;

-- Rename existing columns to match the interface
ALTER TABLE projects
RENAME COLUMN "isNew" TO is_new,
RENAME COLUMN "isVerified" TO is_verified,
RENAME COLUMN "yearlyRevenue" TO yearly_revenue; 