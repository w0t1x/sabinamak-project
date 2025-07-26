/*
  # Add video_path column to videos table

  1. Changes
    - Add `video_path` column to `videos` table
    - Column stores the path/URL to the uploaded video file
    - Column is required (NOT NULL) for new records
    - Existing records will have empty string as default

  2. Notes
    - This replaces the previous `pexels_video_url` approach
    - All new videos will use Supabase Storage
*/

-- Add video_path column to videos table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'videos' AND column_name = 'video_path'
  ) THEN
    ALTER TABLE videos ADD COLUMN video_path text DEFAULT '' NOT NULL;
  END IF;
END $$;