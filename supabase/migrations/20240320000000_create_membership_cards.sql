-- Create membership_cards table
CREATE TABLE membership_cards (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    card_number VARCHAR(19) NOT NULL UNIQUE,
    plan_type VARCHAR(50) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    last_updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create index for faster lookups
CREATE INDEX idx_membership_cards_user_id ON membership_cards(user_id);
CREATE INDEX idx_membership_cards_card_number ON membership_cards(card_number);

-- Enable Row Level Security (RLS)
ALTER TABLE membership_cards ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own membership card"
    ON membership_cards
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own membership card"
    ON membership_cards
    FOR UPDATE
    USING (auth.uid() = user_id);

-- Create function to update last_updated_at
CREATE OR REPLACE FUNCTION update_last_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.last_updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for last_updated_at
CREATE TRIGGER update_membership_cards_last_updated_at
    BEFORE UPDATE ON membership_cards
    FOR EACH ROW
    EXECUTE FUNCTION update_last_updated_at();

-- Create function to generate unique card number
CREATE OR REPLACE FUNCTION generate_unique_card_number()
RETURNS VARCHAR AS $$
DECLARE
    new_card_number VARCHAR;
    is_unique BOOLEAN;
BEGIN
    LOOP
        -- Generate a random 16-digit number
        new_card_number := lpad(floor(random() * 10000000000000000)::text, 16, '0');
        -- Format with spaces
        new_card_number := regexp_replace(new_card_number, '(\d{4})(\d{4})(\d{4})(\d{4})', '\1 \2 \3 \4');
        
        -- Check if number is unique
        SELECT NOT EXISTS (
            SELECT 1 FROM membership_cards WHERE card_number = new_card_number
        ) INTO is_unique;
        
        EXIT WHEN is_unique;
    END LOOP;
    
    RETURN new_card_number;
END;
$$ LANGUAGE plpgsql; 