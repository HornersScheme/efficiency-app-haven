-- Create categories table
CREATE TABLE categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    icon TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create apps table
CREATE TABLE apps (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    slogan TEXT,
    description TEXT NOT NULL,
    logo_url TEXT NOT NULL,
    app_link TEXT NOT NULL,
    platform TEXT NOT NULL CHECK (platform IN ('PC', 'Mobile')),
    category_id UUID REFERENCES categories(id) NOT NULL,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    upvotes_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create app_images table
CREATE TABLE app_images (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    app_id UUID REFERENCES apps(id) ON DELETE CASCADE NOT NULL,
    image_url TEXT NOT NULL,
    display_order INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create upvotes table
CREATE TABLE upvotes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    app_id UUID REFERENCES apps(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(app_id, user_id)
);

-- Create function to update upvotes count
CREATE OR REPLACE FUNCTION update_upvotes_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE apps SET upvotes_count = upvotes_count + 1 WHERE id = NEW.app_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE apps SET upvotes_count = upvotes_count - 1 WHERE id = OLD.app_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for upvotes
CREATE TRIGGER update_upvotes_count_insert
    AFTER INSERT ON upvotes
    FOR EACH ROW
    EXECUTE FUNCTION update_upvotes_count();

CREATE TRIGGER update_upvotes_count_delete
    AFTER DELETE ON upvotes
    FOR EACH ROW
    EXECUTE FUNCTION update_upvotes_count();

-- Insert initial categories
INSERT INTO categories (name, slug, description, icon) VALUES
    ('Task Management', 'task-management', 'Tools to help you organize and track your tasks', 'check-square'),
    ('Note Taking', 'note-taking', 'Apps for capturing and organizing your thoughts', 'file-text'),
    ('Time Tracking', 'time-tracking', 'Tools to monitor and optimize your time usage', 'clock'),
    ('Project Management', 'project-management', 'Solutions for managing projects and teams', 'folder'),
    ('Team Collaboration', 'team-collaboration', 'Tools for effective team communication and collaboration', 'users'),
    ('Communication', 'communication', 'Apps for messaging and team communication', 'message-square'),
    ('Other', 'other', 'Other productivity tools', 'more-horizontal'); 