-- Create sponsored_apps table
CREATE TABLE sponsored_apps (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    app_id UUID REFERENCES apps(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'rejected')),
    message TEXT,
    payment_link TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(app_id, start_date) -- Prevent double-booking
);

-- Create function to update is_sponsored flag
CREATE OR REPLACE FUNCTION update_sponsored_status()
RETURNS TRIGGER AS $$
BEGIN
    -- Set is_sponsored to true when status changes to paid
    IF NEW.status = 'paid' AND OLD.status != 'paid' THEN
        UPDATE apps SET is_sponsored = true WHERE id = NEW.app_id;
    ELSIF NEW.status != 'paid' AND OLD.status = 'paid' THEN
        UPDATE apps SET is_sponsored = false WHERE id = NEW.app_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for sponsored apps
CREATE TRIGGER update_sponsored_status_trigger
    AFTER UPDATE ON sponsored_apps
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
        WHERE end_date < CURRENT_DATE
    );
    
    -- Delete expired sponsorship records
    DELETE FROM sponsored_apps 
    WHERE end_date < CURRENT_DATE;
END;
$$ LANGUAGE plpgsql;

-- Create a scheduled job to run cleanup every day
SELECT cron.schedule(
    'cleanup-expired-sponsorships',
    '0 0 * * *',  -- Run at midnight every day
    'SELECT cleanup_expired_sponsorships();'
); 