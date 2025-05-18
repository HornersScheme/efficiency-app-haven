-- Create sponsored_apps table
CREATE TABLE sponsored_apps (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    app_id UUID REFERENCES apps(id) ON DELETE CASCADE NOT NULL,
    start_date TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(app_id)
);

-- Create function to update is_sponsored flag
CREATE OR REPLACE FUNCTION update_sponsored_status()
RETURNS TRIGGER AS $$
BEGIN
    -- Set is_sponsored to true for the new sponsored app
    UPDATE apps SET is_sponsored = true WHERE id = NEW.app_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for sponsored apps
CREATE TRIGGER update_sponsored_status_insert
    AFTER INSERT ON sponsored_apps
    FOR EACH ROW
    EXECUTE FUNCTION update_sponsored_status();

-- Create function to clean up expired sponsorships
CREATE OR REPLACE FUNCTION cleanup_expired_sponsorships()
RETURNS void AS $$
BEGIN
    -- Set is_sponsored to false for expired sponsorships
    UPDATE apps 
    SET is_sponsored = false 
    WHERE id IN (
        SELECT app_id 
        FROM sponsored_apps 
        WHERE end_date < NOW()
    );
    
    -- Delete expired sponsorship records
    DELETE FROM sponsored_apps 
    WHERE end_date < NOW();
END;
$$ LANGUAGE plpgsql;

-- Create a scheduled job to run cleanup every day
SELECT cron.schedule(
    'cleanup-expired-sponsorships',
    '0 0 * * *',  -- Run at midnight every day
    'SELECT cleanup_expired_sponsorships();'
); 