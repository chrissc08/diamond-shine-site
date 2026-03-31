export interface BookingPackage {
  id: string;
  name: string;
  subtitle: string;
  time: string;
  sedanPrice: string;
  suvPrice: string;
  tagline: string;
  popular?: boolean;
  features: string[];
}

export interface TimeSlot {
  id: string;
  time: string;
  label: string;
}

export interface AddOn {
  id: string;
  name: string;
  price: string;
  icon: string;
}

export interface MockBooking {
  date: string; // "YYYY-MM-DD"
  slotId: string;
  packageId: string;
}

export const packages: BookingPackage[] = [
  {
    id: "essential",
    name: "Essential Maintenance Detail",
    subtitle: "Best for vehicles already in good condition",
    features: [
      "Foam hand wash + detailed hand wash",
      "Wheels cleaned + tire shine applied",
      "Light interior vacuum + wipe down",
      "Streak-free window cleaning",
    ],
    time: "1–1.5 hrs",
    sedanPrice: "$90–120",
    suvPrice: "$110–140",
    tagline: "A consistent, high-quality maintenance clean",
  },
  {
    id: "signature",
    name: "Signature Reset Detail",
    popular: true,
    subtitle: "A complete refresh — inside & out",
    features: [
      "Deep foam pre-wash + detailed hand wash",
      "Deep wheel cleaning (faces + barrels)",
      "Full interior vacuum + wipe down",
      "Light stain spot treatment",
      "Spray protection (ceramic or sealant boost)",
      "Streak-free window cleaning",
    ],
    time: "2–3 hrs",
    sedanPrice: "$160–220",
    suvPrice: "$190–260",
    tagline: "The perfect balance of clean & protection",
  },
  {
    id: "interior",
    name: "Interior Revival Detail",
    subtitle: "For heavily used or neglected interiors",
    features: [
      "Full vacuum + compressed air blowout",
      "Pet hair removal",
      "Steam cleaning",
      "Shampoo + water extraction",
      "Stain & odor treatment",
      "Deep plastics cleaning + UV protection",
    ],
    time: "3–4 hrs",
    sedanPrice: "$240–320",
    suvPrice: "$280–360",
    tagline: "Brings your interior back to life",
  },
  {
    id: "diamond",
    name: "Ultimate Detail Package",
    subtitle: "The most complete detail offered",
    features: [
      "Everything in Signature Reset + Interior Revival",
      "Iron decontamination + tar removal (if needed)",
      "Long-lasting exterior protection",
      "Showroom-level finish",
    ],
    time: "4–5 hrs",
    sedanPrice: "$320–450",
    suvPrice: "$380–550",
    tagline: "Showroom-level results, inside and out",
  },
];

export const timeSlots: TimeSlot[] = [
  { id: "9am", time: "9:00 AM", label: "Morning" },
  { id: "1230pm", time: "12:30 PM", label: "Midday" },
  { id: "3pm", time: "3:00 PM", label: "Afternoon" },
];

// Service durations in hours (without buffer)
export function getServiceDuration(packageId: string): number {
  switch (packageId) {
    case "diamond": return 5;
    case "interior": return 4;
    case "signature": return 2;
    case "essential": return 1;
    default: return 2;
  }
}

// Mandatory 30-minute buffer after every service
const BUFFER_HOURS = 0.5;

// Total time a booking occupies = service + buffer
export function getTotalBookingTime(packageId: string): number {
  return getServiceDuration(packageId) + BUFFER_HOURS;
}

// Slot start times in hours from midnight
export const slotStartHours: Record<string, number> = {
  "9am": 9,
  "1230pm": 12.5,
  "3pm": 15,
};

// Calculate end time for a booking at a given slot
export function getBookingEndTime(slotId: string, packageId: string): number {
  const start = slotStartHours[slotId];
  if (start === undefined) return 0;
  return start + getTotalBookingTime(packageId);
}

/** Returns which slot IDs would be blocked by a booking at the given slot (using buffer) */
export function getBlockedSlots(slotId: string, packageId: string): string[] {
  const endTime = getBookingEndTime(slotId, packageId);

  return timeSlots
    .filter((s) => {
      const sStart = slotStartHours[s.id];
      // Block any slot whose start time is before the booking end time (with buffer)
      return sStart > slotStartHours[slotId] && sStart < endTime;
    })
    .map((s) => s.id);
}

export const addOns: AddOn[] = [
  { id: "ceramic", name: "Spray Protection (Ceramic Boost)", price: "$20–50", icon: "shield" },
  { id: "pet", name: "Pet Hair Removal", price: "$25–75", icon: "dog" },
  { id: "trash", name: "Excess Trash Removal", price: "$20–50", icon: "trash" },
  { id: "stain", name: "Stain Treatment", price: "$25–100", icon: "droplets" },
];

// STRICT PRIORITY RULE: 9 AM reserved for high-duration services only
// Complete Reset and Signature are NOT allowed at 9 AM (unless fallback is active)
export function getAllowedSlots(packageId: string, dateStr?: string): string[] {
  const fallbackActive = dateStr ? is9amFallbackActive(dateStr) : false;

  switch (packageId) {
    case "diamond":
      return ["9am"];           // 5h — only fits at 9 AM
    case "interior":
      return ["9am"];           // 4h — only fits at 9 AM
    case "signature":
      return fallbackActive ? ["9am", "1230pm", "3pm"] : ["1230pm", "3pm"];
    case "essential":
      return fallbackActive ? ["9am", "1230pm", "3pm"] : ["1230pm", "3pm"];
    default:
      return [];
  }
}

// ── 9:00 AM Fallback Logic ──
// If 9 AM is unbooked within 12 hours of appointment start, open it to all services
const FALLBACK_HOURS = 24;

export function is9amFallbackActive(dateStr: string): boolean {
  const now = new Date();
  // Build the 9:00 AM appointment datetime for the given date
  const [year, month, day] = dateStr.split("-").map(Number);
  const appointmentTime = new Date(year, month - 1, day, 9, 0, 0);

  // Calculate hours until the 9 AM slot
  const hoursUntil = (appointmentTime.getTime() - now.getTime()) / (1000 * 60 * 60);

  // Fallback activates when within 12 hours AND the slot is not yet booked
  if (hoursUntil > FALLBACK_HOURS || hoursUntil < 0) return false;

  // Check if 9 AM is already booked on this date
  const is9amBooked = mockBookings.some(
    (b) => b.date === dateStr && b.slotId === "9am"
  );

  return !is9amBooked;
}

export function getSlotMessage(packageId: string, dateStr?: string): string | null {
  const fallbackActive = dateStr ? is9amFallbackActive(dateStr) : false;

  if (fallbackActive && (packageId === "signature" || packageId === "essential")) {
    return "A last-minute 9:00 AM opening is available today! All time slots are open for this service.";
  }

  switch (packageId) {
    case "interior":
      return "Interior Revival requires a morning appointment due to its duration (4 hours + 30min buffer)";
    case "diamond":
      return "Ultimate Detail Package requires the 9:00 AM slot (5 hours + 30min buffer)";
    case "signature":
      return "This service is available at 12:30 PM and 3:00 PM — the 9:00 AM slot is reserved for larger packages";
    case "essential":
      return "This service is available at 12:30 PM and 3:00 PM — the 9:00 AM slot is reserved for larger packages";
    default:
      return null;
  }
}

// ── Mock existing bookings (simulate real schedule) ──
// Generate mock bookings relative to today so they're always relevant
function generateMockBookings(): MockBooking[] {
  const today = new Date();
  const mocks: MockBooking[] = [];

  // Helper to get a future weekday date string
  const getFutureDate = (daysAhead: number): string => {
    const d = new Date(today);
    d.setDate(d.getDate() + daysAhead);
    return d.toISOString().split("T")[0];
  };

  // Day +4: Diamond Full Detail at 9am (blocks 12:30, end time 2:30 PM → 3 PM open)
  mocks.push({ date: getFutureDate(4), slotId: "9am", packageId: "diamond" });

  // Day +8: Interior Restoration at 9am (end time 1:30 PM → blocks 12:30, 3 PM open)
  mocks.push({ date: getFutureDate(8), slotId: "9am", packageId: "interior" });

  // Day +10: Signature Reset at 12:30pm (end time 3:00 PM → 3 PM slot available)
  mocks.push({ date: getFutureDate(10), slotId: "1230pm", packageId: "signature" });

  // Day +14: Essential at 12:30pm, mostly open
  mocks.push({ date: getFutureDate(14), slotId: "1230pm", packageId: "essential" });

  return mocks;
}

export const mockBookings: MockBooking[] = generateMockBookings();

export interface SlotAvailability {
  allowed: boolean;
  reason?: string;
}

// Maximum bookings per day
const MAX_BOOKINGS_PER_DAY = 3;

/**
 * Strict, rule-based availability check.
 * All availability is determined by time calculations with 30-min buffers.
 * No conditional or ambiguous logic.
 */
export function getSlotAvailability(
  dateStr: string,
  packageId: string,
  slotId: string
): SlotAvailability {
  // 1. Package-level restriction (priority rule: 9 AM reserved for large services, with fallback)
  const packageAllowed = getAllowedSlots(packageId, dateStr);
  if (!packageAllowed.includes(slotId)) {
    return { allowed: false, reason: "Not available for this package" };
  }

  const dayBookings = mockBookings.filter((b) => b.date === dateStr);

  // 2. Max 3 bookings per day
  if (dayBookings.length >= MAX_BOOKINGS_PER_DAY) {
    return { allowed: false, reason: "Maximum bookings reached for this day" };
  }

  // 3. If this specific slot is already taken
  const slotTaken = dayBookings.some((b) => b.slotId === slotId);
  if (slotTaken) {
    return { allowed: false, reason: "This time is already booked" };
  }

  const requestedStart = slotStartHours[slotId];

  // 4. Check if any EXISTING booking's end time (with buffer) overlaps into this slot
  for (const booking of dayBookings) {
    const existingEnd = getBookingEndTime(booking.slotId, booking.packageId);
    if (requestedStart < existingEnd) {
      return { allowed: false, reason: "Unavailable — previous appointment still in progress" };
    }
  }

  // 5. Check if THIS booking's end time (with buffer) would overlap into already-taken slots
  const requestedEnd = getBookingEndTime(slotId, packageId);
  for (const booking of dayBookings) {
    const existingStart = slotStartHours[booking.slotId];
    if (existingStart > requestedStart && existingStart < requestedEnd) {
      return { allowed: false, reason: "Not enough time — overlaps with a later appointment" };
    }
  }

  return { allowed: true };
}

// Max booking window in days
export const BOOKING_WINDOW_DAYS = 21;
