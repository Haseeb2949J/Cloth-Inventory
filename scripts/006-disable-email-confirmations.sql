-- This script helps disable email confirmations in Supabase
-- You'll need to run this in your Supabase SQL Editor or configure via dashboard

-- Check current auth settings
SELECT 
  setting_name,
  setting_value 
FROM auth.config 
WHERE setting_name IN (
  'enable_confirmations',
  'enable_signup',
  'mailer_autoconfirm'
);

-- Note: These settings might need to be changed via Supabase Dashboard
-- Go to Authentication > Settings and:
-- 1. Turn OFF "Enable email confirmations"
-- 2. Turn ON "Enable signup"
-- 3. Save changes

-- Alternative: If you have admin access, you can try:
-- UPDATE auth.config SET setting_value = 'false' WHERE setting_name = 'enable_confirmations';
-- UPDATE auth.config SET setting_value = 'true' WHERE setting_name = 'mailer_autoconfirm';
