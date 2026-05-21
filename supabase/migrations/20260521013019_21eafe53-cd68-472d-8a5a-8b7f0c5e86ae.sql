CREATE UNIQUE INDEX IF NOT EXISTS bookings_unique_confirmed_slot
ON public.bookings (booking_date, time_slot_id)
WHERE status = 'confirmed';