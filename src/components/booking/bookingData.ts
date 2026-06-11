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
      "Foam wash + detailed hand wash",
      "Wheels cleaned + tire shine applied",
      "Light interior vacuum + wipe down",
      "Streak-free window cleaning",
    ],
    time: "2–2.5 hrs",
    sedanPrice: "$80–100",
    suvPrice: "$110–130",
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
    time: "3–3.5 hrs",
    sedanPrice: "$150–200",
    suvPrice: "$180–230",
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
    time: "4–5 hrs",
    sedanPrice: "$210–260",
    suvPrice: "$250–300",
    tagline: "Brings your interior back to life",
  },
  {
    id: "diamond",
    name: "Ultimate Detail Package",
    subtitle: "The most complete detail offered",
    features: [
      "Everything in Signature Reset + Interior Revival",
      "Full paint decontamination (iron removal + clay treatment)",
      "Long-lasting exterior protection",
      "Showroom-level finish",
    ],
    time: "5–6 hrs",
    sedanPrice: "$270–350",
    suvPrice: "$320–400",
    tagline: "Showroom-level results, inside and out",
  },
];

export const timeSlots: TimeSlot[] = [
  { id: "10am", time: "10:00 AM", label: "Morning" },
  { id: "2pm", time: "2:00 PM", label: "Afternoon" },
];

// Service durations in hours (without buffer)
export function getServiceDuration(packageId: string): number {
  switch (packageId) {
    case "diamond": return 6;
    case "interior": return 5;
    case "signature": return 3;
    case "essential": return 2;
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
  "10am": 10,
  "2pm": 14,
};

// Calculate end time for a booking at a given slot
export function getBookingEndTime(slotId: string, packageId: string): number {
  const start = slotStartHours[slotId];
  if (start === undefined) return 0;
  return start + getTotalBookingTime(packageId);
}

/** Returns which slot IDs would be blocked by a booking at the given slot.
 * Rules:
 *  - Interior Revival and Ultimate Detail occupy the entire day → block every other slot.
 *  - Essential Maintenance and Signature Reset have no time-overlap blockers.
 */
export function getBlockedSlots(slotId: string, packageId: string): string[] {
  if (packageId === "interior" || packageId === "diamond") {
    return timeSlots.filter((s) => s.id !== slotId).map((s) => s.id);
  }
  return [];
}

export const addOns: AddOn[] = [
  { id: "ceramic", name: "Spray Protection (Ceramic Boost)", price: "$20–50", icon: "shield" },
  { id: "pet", name: "Pet Hair Removal", price: "$25–75", icon: "dog" },
  { id: "stain", name: "Stain Treatment", price: "$25–100", icon: "droplets" },
  { id: "decon", name: "Paint Decontamination Treatment", price: "$40–80", icon: "sparkles" },
  { id: "leather", name: "Leather Protection Treatment", price: "$20–40", icon: "gem" },
  { id: "odor", name: "Compressed Air Blowout", price: "$15–30", icon: "wind" },
];

export function getAllowedSlots(packageId: string, dateStr?: string): string[] {
  switch (packageId) {
    case "diamond":
    case "interior":
      return ["10am"]; // Long services — morning only, books the whole day
    case "signature":
    case "essential":
      return ["10am", "2pm"];
    default:
      return [];
  }
}

// Kept as a no-op for backwards compatibility with existing imports.
export function is9amFallbackActive(_dateStr: string): boolean {
  return false;
}

export function getSlotMessage(packageId: string, dateStr?: string): string | null {
  switch (packageId) {
    case "interior":
      return "Interior Revival is a full-day service — only the 10:00 AM slot is available, and it books out the entire day.";
    case "diamond":
      return "Ultimate Detail is a full-day service — only the 10:00 AM slot is available, and it books out the entire day.";
    default:
      return null;
  }
}

// ── Mock existing bookings (simulate real schedule) ──
// Generate mock bookings relative to today so they're always relevant
export const mockBookings: MockBooking[] = [];

// Allow runtime replacement with real DB bookings
export function setLiveBookings(bookings: MockBooking[]) {
  mockBookings.length = 0;
  mockBookings.push(...bookings);
}

export interface SlotAvailability {
  allowed: boolean;
  reason?: string;
}

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
  // 1. Package-level restriction
  const packageAllowed = getAllowedSlots(packageId, dateStr);
  if (!packageAllowed.includes(slotId)) {
    return { allowed: false, reason: "Not available for this package" };
  }

  const dayBookings = mockBookings.filter((b) => b.date === dateStr);

  // 2. If this specific slot is already taken
  const slotTaken = dayBookings.some((b) => b.slotId === slotId);
  if (slotTaken) {
    return { allowed: false, reason: "This time is already booked" };
  }

  // 3. Interior Revival and Ultimate Detail book out the entire day.
  //    a) If an existing booking that day is one of those services → nothing else fits.
  //    b) If the requested booking is one of those services → block when any other booking exists.
  const dayHasFullDayBooking = dayBookings.some(
    (b) => b.packageId === "interior" || b.packageId === "diamond"
  );
  if (dayHasFullDayBooking) {
    return { allowed: false, reason: "This day is fully booked" };
  }
  if ((packageId === "interior" || packageId === "diamond") && dayBookings.length > 0) {
    return { allowed: false, reason: "This day already has an appointment" };
  }

  return { allowed: true };
}

// Max booking window in days
export const BOOKING_WINDOW_DAYS = 365;
