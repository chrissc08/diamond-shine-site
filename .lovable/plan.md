# Admin Dashboard + Bookings, Cancellations & Vacation Mode

## What you'll get

A private admin dashboard at `/admin` where you log in with your email + password. From there you can:
- See every booking that comes in (past and upcoming)
- Cancel bookings — the customer is automatically emailed a polite cancellation notice
- Set vacation/pause dates — the booking calendar blocks those days, a banner appears on the site, and any customers already booked in that range get an automatic email letting them know

## How it works

### 1. Database (new tables)

- **bookings** — every submission saves here: customer name, email, phone, vehicle type, package, add-ons, date, time slot, total estimate, notes, status (`confirmed` / `cancelled` / `completed`), cancellation reason, timestamps
- **vacation_periods** — start date, end date, optional message ("Back May 15!"), active flag
- **user_roles** — secure admin-role table (separate from profiles, industry-standard pattern)

All protected with security rules so only your admin account can view/edit them. Customers can submit a booking but can't read others'.

### 2. Booking flow update

The current booking form only emails you. We'll update the final confirm step to **also save the booking to the database** before sending the email — same UX, no extra clicks for the customer. The customer still gets their confirmation email; you still get notified.

The booking calendar will also check `vacation_periods` and block those dates automatically.

### 3. Admin login

- New page at `/admin/login` — email + password
- Sign up the first time (your account becomes admin via a one-time setup)
- After that, `disable_signup` is turned on so nobody else can register
- `/admin/*` routes are protected — non-admins get redirected

### 4. Admin dashboard pages

**`/admin` — Bookings overview**
- Table of all bookings with filters: status (upcoming / past / cancelled), date range, search by name/email
- Click a booking → detail panel showing everything (customer info, package, add-ons, notes)
- "Cancel booking" button → optional reason note → confirms → marks cancelled → fires the cancellation email
- Stats at top: bookings this week, this month, revenue estimate

**`/admin/vacation` — Vacation mode**
- List of upcoming vacation periods
- "Add vacation" → pick start + end date + optional message
- When saved, it:
  - Blocks those dates in the public booking calendar
  - Shows a banner on the homepage ("On vacation May 10–15 — booking resumes May 16")
  - Finds all bookings already in that range and emails each customer to reschedule
- Edit / delete vacation periods anytime

**`/admin/emails`** *(small bonus)* — view the email send log so you can see what went out (using the existing email tracking)

### 5. Customer cancellation email

New app email template ("booking-cancelled") with your branding. Sent automatically when:
- You cancel a booking from the dashboard
- A vacation period is created that includes their date

Includes: the cancelled date/time, optional reason, link back to your site to rebook.

### 6. Site banner

Small dismissible banner at the top of the homepage when a vacation period is active or upcoming within 7 days. Pulled live from the database.

## Out of scope (can add later)

- SMS notifications
- Customer self-service rescheduling link in the email
- Calendar view (Google-Calendar-style) — we'll start with the table view
- Multi-admin support
- Photo upload for the "condition assessment" disclaimer

## Technical notes

- Uses Lovable Cloud (auth + database + edge functions for cancellation emails)
- Roles stored in dedicated `user_roles` table with a `has_role()` security-definer function (prevents privilege escalation)
- Cancellation email uses the existing email infrastructure (`send-transactional-email`) — adds one new template
- Vacation date blocking integrates with the existing `getSlotAvailability` logic in `bookingData.ts`
- Mock bookings in `bookingData.ts` will be replaced by live database queries

Ready to build when you are.