
-- Tighten booking-photos bucket: size + MIME limits
UPDATE storage.buckets
SET file_size_limit = 10485760,
    allowed_mime_types = ARRAY['image/jpeg','image/png','image/webp','image/heic','image/heif']
WHERE id = 'booking-photos';

-- Remove broad public listing/select policy. Public URL access still works because bucket is public.
DROP POLICY IF EXISTS "Booking photos publicly readable" ON storage.objects;

-- Replace permissive INSERT policy with one that enforces UUID-prefixed path and image extension
DROP POLICY IF EXISTS "Anyone can upload booking photos" ON storage.objects;
CREATE POLICY "Booking photos upload with valid path"
  ON storage.objects
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    bucket_id = 'booking-photos'
    AND name ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/[^/]+\.(jpe?g|png|webp|heic|heif)$'
  );

-- Admins (and service role) can manage booking photos
CREATE POLICY "Admins can read booking photos"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'booking-photos' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update booking photos"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'booking-photos' AND public.has_role(auth.uid(), 'admin'))
  WITH CHECK (bucket_id = 'booking-photos' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete booking photos"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'booking-photos' AND public.has_role(auth.uid(), 'admin'));
