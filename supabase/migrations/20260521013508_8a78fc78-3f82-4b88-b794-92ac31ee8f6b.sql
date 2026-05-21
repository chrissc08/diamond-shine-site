ALTER TABLE public.bookings
  ADD COLUMN IF NOT EXISTS image_urls text[] NOT NULL DEFAULT '{}';

INSERT INTO storage.buckets (id, name, public)
VALUES ('booking-photos', 'booking-photos', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Booking photos publicly readable" ON storage.objects;
CREATE POLICY "Booking photos publicly readable"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'booking-photos');

DROP POLICY IF EXISTS "Anyone can upload booking photos" ON storage.objects;
CREATE POLICY "Anyone can upload booking photos"
  ON storage.objects FOR INSERT
  TO anon, authenticated
  WITH CHECK (bucket_id = 'booking-photos');