-- Create the emails table if it doesn't exist
CREATE TABLE IF NOT EXISTS public."emails" (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  img_text TEXT NOT NULL,
  seen BOOLEAN DEFAULT false,
  seen_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add unique constraint to img_text if not exists
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'emails_img_text_unique'
  ) THEN
    ALTER TABLE public."emails" 
    ADD CONSTRAINT emails_img_text_unique UNIQUE (img_text);
  END IF;
END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS emails_user_id_idx ON public."emails" (user_id);
CREATE INDEX IF NOT EXISTS emails_img_text_idx ON public."emails" (img_text);

-- Insert a test email for tracking
INSERT INTO public."emails" (
  user_id, 
  email, 
  subject, 
  img_text, 
  seen
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  'test@example.com',
  'Test Email Subject',
  'unique_hash_123',
  false
)
ON CONFLICT (img_text) 
DO UPDATE SET seen = false, seen_at = NULL;

-- Set permissions for the public role
CREATE OR REPLACE FUNCTION set_permissions_for_emails()
RETURNS void AS $$
BEGIN
  -- This function ensures your permissions are set correctly
  -- You would manually run these in the Hasura console
  RAISE NOTICE 'Set these permissions in Hasura console:';
  RAISE NOTICE '1. For public role - allow select on: id, img_text, seen, seen_at';
  RAISE NOTICE '2. For public role - allow update on: seen, seen_at';
  RAISE NOTICE '3. For user role - allow insert with proper column permissions';
END;
$$ LANGUAGE plpgsql;

SELECT set_permissions_for_emails();

-- Now you can run:
-- SELECT * FROM public."emails" WHERE img_text = 'unique_hash_123';
-- to verify the test email exists 