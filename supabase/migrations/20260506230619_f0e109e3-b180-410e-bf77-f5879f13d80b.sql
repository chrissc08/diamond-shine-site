-- Roles enum + table
CREATE TYPE public.app_role AS ENUM ('admin');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "Admins can view roles" ON public.user_roles
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Bookings table
CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  address TEXT NOT NULL,
  vehicle_type TEXT NOT NULL,
  package_id TEXT NOT NULL,
  package_name TEXT NOT NULL,
  package_price TEXT,
  package_duration TEXT,
  add_ons JSONB NOT NULL DEFAULT '[]'::jsonb,
  booking_date DATE NOT NULL,
  time_slot_id TEXT NOT NULL,
  time_slot_label TEXT NOT NULL,
  notes TEXT,
  referral TEXT,
  status TEXT NOT NULL DEFAULT 'confirmed',
  cancellation_reason TEXT,
  cancelled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_bookings_date ON public.bookings (booking_date);
CREATE INDEX idx_bookings_status ON public.bookings (status);

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Anyone (even unauth) can submit a booking
CREATE POLICY "Anyone can create a booking" ON public.bookings
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

-- Only admins can read / update / delete
CREATE POLICY "Admins can view all bookings" ON public.bookings
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update bookings" ON public.bookings
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete bookings" ON public.bookings
  FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Confirmed bookings (date + slot) publicly readable for availability checks
-- Expose only the minimum needed: date, slot, package_id, status
CREATE OR REPLACE VIEW public.public_booking_slots
WITH (security_invoker = true) AS
SELECT booking_date, time_slot_id, package_id
FROM public.bookings
WHERE status = 'confirmed';

GRANT SELECT ON public.public_booking_slots TO anon, authenticated;

-- We need a way for the public to read confirmed-booking slots without a policy on the base table.
-- Easiest: a security definer RPC.
CREATE OR REPLACE FUNCTION public.get_booked_slots()
RETURNS TABLE (booking_date DATE, time_slot_id TEXT, package_id TEXT)
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT booking_date, time_slot_id, package_id
  FROM public.bookings
  WHERE status = 'confirmed' AND booking_date >= CURRENT_DATE;
$$;

GRANT EXECUTE ON FUNCTION public.get_booked_slots() TO anon, authenticated;

-- Vacation periods
CREATE TABLE public.vacation_periods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  message TEXT,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_vacation_active ON public.vacation_periods (active, end_date);

ALTER TABLE public.vacation_periods ENABLE ROW LEVEL SECURITY;

-- Public read so the site can block dates / show banner
CREATE POLICY "Vacation periods publicly readable" ON public.vacation_periods
  FOR SELECT TO anon, authenticated
  USING (true);

CREATE POLICY "Admins manage vacation periods" ON public.vacation_periods
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- updated_at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER bookings_updated_at
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER vacation_updated_at
  BEFORE UPDATE ON public.vacation_periods
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();