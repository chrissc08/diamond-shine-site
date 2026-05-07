-- 1. Lock down internal email-queue SECURITY DEFINER functions to service_role only
REVOKE EXECUTE ON FUNCTION public.enqueue_email(text, jsonb) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.delete_email(text, bigint) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.read_email_batch(text, integer, integer) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.move_to_dlq(text, text, bigint, jsonb) FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.enqueue_email(text, jsonb) TO service_role;
GRANT EXECUTE ON FUNCTION public.delete_email(text, bigint) TO service_role;
GRANT EXECUTE ON FUNCTION public.read_email_batch(text, integer, integer) TO service_role;
GRANT EXECUTE ON FUNCTION public.move_to_dlq(text, text, bigint, jsonb) TO service_role;

-- 2. Replace the permissive booking INSERT policy with a validated one
DROP POLICY IF EXISTS "Anyone can create a booking" ON public.bookings;

CREATE POLICY "Anyone can create a validated booking"
ON public.bookings
FOR INSERT
TO anon, authenticated
WITH CHECK (
  status = 'confirmed'
  AND char_length(btrim(customer_name)) BETWEEN 2 AND 100
  AND char_length(btrim(customer_email)) BETWEEN 5 AND 255
  AND customer_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
  AND char_length(btrim(customer_phone)) BETWEEN 7 AND 30
  AND char_length(btrim(address)) BETWEEN 5 AND 300
  AND char_length(btrim(package_id)) > 0
  AND char_length(btrim(package_name)) > 0
  AND char_length(btrim(vehicle_type)) > 0
  AND char_length(btrim(time_slot_id)) > 0
  AND char_length(btrim(time_slot_label)) > 0
  AND booking_date >= CURRENT_DATE
  AND booking_date <= CURRENT_DATE + INTERVAL '1 year'
  AND (notes IS NULL OR char_length(notes) <= 2000)
  AND (referral IS NULL OR char_length(referral) <= 200)
);