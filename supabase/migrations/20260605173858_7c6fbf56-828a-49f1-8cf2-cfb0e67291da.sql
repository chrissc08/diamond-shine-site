DROP POLICY IF EXISTS "Booking photos upload with valid path" ON storage.objects;

CREATE POLICY "Booking photos upload to unused folder"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'booking-photos'
  AND name ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/[^/]+\.(jpe?g|png|webp|heic|heif)$'
  AND NOT EXISTS (
    SELECT 1 FROM public.bookings b
    WHERE b.id::text = split_part(storage.objects.name, '/', 1)
  )
);