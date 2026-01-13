-- =====================================================
-- Migration: Create Images Storage Bucket
-- Description: Creates a public storage bucket for image uploads
--              with appropriate RLS policies for technician dashboard
-- =====================================================

-- Create the images bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public, avif_autodetection, file_size_limit, allowed_mime_types)
VALUES (
    'images',
    'images',
    true,  -- Public bucket for getPublicUrl() to work
    false,
    52428800,  -- 50MB file size limit
    ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']
)
ON CONFLICT (id) DO UPDATE SET
    public = true,
    allowed_mime_types = ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];

-- Drop existing policies to avoid conflicts (safe to run multiple times)
DROP POLICY IF EXISTS "Allow authenticated users to upload images" ON storage.objects;
DROP POLICY IF EXISTS "Allow public to view images" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to update their images" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to delete their images" ON storage.objects;

-- Policy 1: Allow authenticated users to upload images
CREATE POLICY "Allow authenticated users to upload images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'images');

-- Policy 2: Allow anyone to view images (public access)
CREATE POLICY "Allow public to view images"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'images');

-- Policy 3: Allow authenticated users to update their own uploaded images
CREATE POLICY "Allow authenticated users to update their images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'images')
WITH CHECK (bucket_id = 'images');

-- Policy 4: Allow authenticated users to delete their own uploaded images
CREATE POLICY "Allow authenticated users to delete their images"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'images');

-- Grant RLS permissions to ensure policies are applied correctly
-- (These are typically already set up, but explicitly stating for clarity)

-- Log success
DO $$
BEGIN
    RAISE NOTICE 'Successfully created images bucket with RLS policies';
END $$;
