-- Check current auth settings
SELECT * FROM auth.config;

-- Check if SMTP is configured
SELECT 
  setting_name,
  setting_value 
FROM auth.config 
WHERE setting_name LIKE '%smtp%' OR setting_name LIKE '%email%';

-- Enable email confirmations (if disabled)
UPDATE auth.config 
SET setting_value = 'true' 
WHERE setting_name = 'enable_signup';

-- Disable email confirmation requirement for testing (temporary)
UPDATE auth.config 
SET setting_value = 'false' 
WHERE setting_name = 'enable_confirmations';
