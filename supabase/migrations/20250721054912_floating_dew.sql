/*
  # Create videos table and settings table

  1. New Tables
    - `videos`
      - `id` (uuid, primary key)
      - `title` (text, required)
      - `description` (text, required)
      - `caption` (text, required)
      - `thumbnail` (text, required)
      - `video_url` (text, required)
      - `created_at` (timestamp)
    - `settings`
      - `id` (uuid, primary key)
      - `key` (text, unique, required)
      - `value` (text, required)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for public read access
    - Add policies for admin write access

  3. Initial Data
    - Insert default background image setting
*/

-- Create videos table
CREATE TABLE IF NOT EXISTS videos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  caption text NOT NULL,
  thumbnail text NOT NULL,
  video_url text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create settings table for site configuration
CREATE TABLE IF NOT EXISTS settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value text NOT NULL,
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Videos policies
CREATE POLICY "Allow public read access to videos"
  ON videos
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Admins can insert videos"
  ON videos
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.is_admin = true
    )
  );

CREATE POLICY "Admins can update videos"
  ON videos
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.is_admin = true
    )
  );

CREATE POLICY "Admins can delete videos"
  ON videos
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.is_admin = true
    )
  );

-- Settings policies
CREATE POLICY "Allow public read access to settings"
  ON settings
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Admins can insert settings"
  ON settings
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.is_admin = true
    )
  );

CREATE POLICY "Admins can update settings"
  ON settings
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.is_admin = true
    )
  );

-- Insert default background image setting
INSERT INTO settings (key, value) VALUES 
  ('background_image', 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=1920')
ON CONFLICT (key) DO NOTHING;