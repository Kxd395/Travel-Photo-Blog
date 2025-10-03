-- ============================================
-- SUPABASE STORAGE SETUP FOR TRAVEL PHOTO BLOG
-- ============================================
-- Run this in Supabase SQL Editor after creahttps://cocalc.com/projectsting your project
-- This sets up storage bucket and RLS policies for photo uploads

-- ============================================
-- 1. CREATE PHOTOS BUCKET
-- ============================================
-- Create a public bucket for photo storage
-- Public means URLs are accessible without auth (for displaying on site)
-- Upload/modify/delete still requires authentication (controlled by policies below)

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'photos',
  'photos',
  true,  -- Public read access
  10485760,  -- 10MB limit per file
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/heic']  -- Allowed image types
)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 2. RLS POLICIES - PUBLIC READ
-- ============================================
-- Allow anyone to view/download photos
-- This enables your public website to display images

CREATE POLICY "Public can read photos"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'photos');

-- ============================================
-- 3. RLS POLICIES - AUTHENTICATED UPLOAD
-- ============================================
-- Allow signed-in users to upload new photos
-- Upload endpoint will handle EXIF extraction and optimization

CREATE POLICY "Authenticated users can upload photos"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'photos' 
  AND (storage.foldername(name))[1] = auth.uid()::text  -- User can only upload to their own folder
);

-- ============================================
-- 4. RLS POLICIES - OWNER UPDATE
-- ============================================
-- Allow users to update their own photos
-- Useful for replacing images or updating metadata

CREATE POLICY "Users can update own photos"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'photos' 
  AND (storage.foldername(name))[1] = auth.uid()::text
)
WITH CHECK (
  bucket_id = 'photos' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- ============================================
-- 5. RLS POLICIES - OWNER DELETE
-- ============================================
-- Allow users to delete their own photos

CREATE POLICY "Users can delete own photos"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'photos' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- ============================================
-- 6. OPTIONAL: ADMIN POLICIES
-- ============================================
-- Uncomment to allow admin users full access to all photos
-- Useful for moderation or bulk operations

-- CREATE POLICY "Admins can do anything with photos"
-- ON storage.objects
-- FOR ALL
-- TO authenticated
-- USING (
--   bucket_id = 'photos'
--   AND auth.jwt() ->> 'email' IN ('admin@example.com')  -- Update with your admin emails
-- )
-- WITH CHECK (
--   bucket_id = 'photos'
--   AND auth.jwt() ->> 'email' IN ('admin@example.com')
-- );

-- ============================================
-- 7. VERIFY SETUP
-- ============================================
-- Run these queries to verify everything is set up correctly

-- Check bucket exists
SELECT * FROM storage.buckets WHERE id = 'photos';

-- Check policies are active
SELECT * FROM pg_policies WHERE tablename = 'objects' AND policyname LIKE '%photo%';

-- ============================================
-- USAGE NOTES
-- ============================================
-- 
-- File Organization:
--   - Files are stored as: photos/{user_id}/{filename}
--   - This keeps user uploads organized
--   - Makes cleanup easier if user deletes account
--
-- Public URLs:
--   - Format: https://{project}.supabase.co/storage/v1/object/public/photos/{user_id}/{filename}
--   - These URLs are permanent and can be cached
--
-- CORS:
--   - Supabase handles CORS automatically
--   - No additional configuration needed
--
-- Storage Limits:
--   - Free tier: 1GB storage
--   - Pro tier: 100GB included, then $0.021/GB
--   - File size limit: Set to 10MB (adjustable above)
--
-- Security:
--   - Users can only upload to their own folder
--   - Public can read but not write
--   - Delete requires ownership
--
-- ============================================
-- TROUBLESHOOTING
-- ============================================
--
-- "RLS policy violation" or "not authorized":
--   1. Check user is authenticated
--   2. Verify user ID matches folder name
--   3. Confirm policies are active (query above)
--
-- "Permission denied for bucket":
--   1. Verify bucket exists (query above)
--   2. Check bucket is marked as public
--   3. Wait a few seconds for changes to propagate
--
-- File upload fails:
--   1. Check file size under limit (10MB)
--   2. Verify MIME type is allowed
--   3. Ensure user is authenticated
--   4. Check SUPABASE_SERVICE_ROLE env var is set
--
-- ============================================
