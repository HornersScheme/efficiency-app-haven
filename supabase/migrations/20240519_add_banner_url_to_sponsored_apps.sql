ALTER TABLE sponsored_apps ADD COLUMN banner_url TEXT;
-- Note: Make it required in the application form, but allow NULL for existing rows for backward compatibility. 