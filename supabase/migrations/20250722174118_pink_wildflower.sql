/*
  # Update videos table for Pexels integration

  1. Changes
    - Replace `video_url` with `pexels_video_url` for Pexels video links
    - Add `redirect_url` field for click redirects
    - Update existing data structure

  2. Security
    - Maintain existing RLS policies
    - No security changes needed
*/

-- Add new columns
ALTER TABLE videos ADD COLUMN IF NOT EXISTS pexels_video_url text;
ALTER TABLE videos ADD COLUMN IF NOT EXISTS redirect_url text;

-- Update existing records to use new structure (if any exist)
UPDATE videos SET 
  pexels_video_url = video_url,
  redirect_url = 'https://www.instagram.com/sabina.mak?igsh=Y2ozaWpjN3YzOHNl'
WHERE video_url IS NOT NULL;

-- Remove old column
ALTER TABLE videos DROP COLUMN IF EXISTS video_url;