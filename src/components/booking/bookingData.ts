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
    id: "signature",
    name: "Signature Maintenance Detail",
    subtitle: "Best for regularly maintained vehicles",
    features: [
      "Foam Wash + Hand Wash",
      "Wheels cleaned + tire shine applied",
      "Streak-free window cleaning",
      "Light interior vacuum + wipe down",
    ],
    time: "1–1.5 hrs",
    sedanPrice: "$80–120",
    suvPrice: "$100–140",
    tagline: "Fast, consistent clean for already-maintained cars",
  },
  {
    id: "complete",
    name: "Complete Reset Detail",
    popular: true,
    subtitle: "A full refresh — inside & out",
    features: [
      "Deep Foam Pre-Wash + Detailed Hand Wash",
      "Deep wheel cleaning (faces + barrels)",
      "Spray protection (ceramic or sealant boost)",
      "Full interior vacuum + wipe down",
      "Streak-free window cleaning",
    ],
    time: "2–3 hrs",
    sedanPrice: "$150–200",
    suvPrice: "$180–240",
    tagline: "The perfect balance of clean & protection",
  },
  {
    id: "interior",
    name: "Interior Restoration Detail",
    subtitle: "For heavily used or neglected interiors",
    features: [
      "Full vacuum + compressed air blowout",
      "Pet hair removal + steam cleaning",
      "Shampoo + wet extraction",
      "Stain & odor treatment",
      "Deep plastics cleaning + UV protection",
    ],
    time: "3–4 hrs",
    sedanPrice: "$220–300",
    suvPrice: "$260–350",
    tagline: "Brings your interior back to life",
  },
  {
    id: "diamond",
    name: "Diamond Full Detail",
    subtitle: "The ultimate transformation",
    features: [
      "Everything in Complete Reset + Interior Restoration",
      "Iron decontamination + tar removal",
      "Long-lasting spray protection",
      "Showroom-level finish",
    ],
    time: "4–5 hrs",
    sedanPrice: "$300–450",
    suvPrice: "$350–550",
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
    case "complete": return 2;
    case "signature": return 1;
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

// Package-based slot restrictions (which slots a package CAN use)
export function getAllowedSlots(packageId: string): string[] {
  switch (packageId) {
    case "diamond":
      return ["9am"];
    case "interior":
      return ["9am"];
    case "complete":
      return ["9am", "1230pm"];
    case "signature":
      return ["9am", "1230pm", "3pm"];
    default:
      return [];
  }
}

export function getSlotMessage(packageId: string): string | null {
  switch (packageId) {
    case "interior":
      return "This service requires a morning appointment due to its depth";
    case "diamond":
      return "Diamond Full Detail requires the earliest slot for best results";
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

  // Day +4: Diamond Full Detail at 9am (blocks entire day)
  mocks.push({ date: getFutureDate(4), slotId: "9am", packageId: "diamond" });

  // Day +8: Interior Restoration at 9am (only small jobs allowed after)
  mocks.push({ date: getFutureDate(8), slotId: "9am", packageId: "interior" });

  // Day +10: Complete Reset at 9am (dynamically blocks 12:30 via duration)
  mocks.push({ date: getFutureDate(10), slotId: "9am", packageId: "complete" });

  // Day +14: One booking, mostly open
  mocks.push({ date: getFutureDate(14), slotId: "9am", packageId: "signature" });

  return mocks;
}

export const mockBookings: MockBooking[] = generateMockBookings();

export interface SlotAvailability {
  allowed: boolean;
  reason?: string;
}

/**
 * Given existing bookings for a date, a selected package, and a slot,
 * determine if that slot is available and why not if it isn't.
 */
export function getSlotAvailability(
  dateStr: string,
  packageId: string,
  slotId: string
): SlotAvailability {
  // 1. Check package-level restriction first
  const packageAllowed = getAllowedSlots(packageId);
  if (!packageAllowed.includes(slotId)) {
    return { allowed: false, reason: "Not available for this package" };
  }

  const dayBookings = mockBookings.filter((b) => b.date === dateStr);

  // 2. If a Diamond Full Detail is booked that day → block everything
  const hasDiamond = dayBookings.some((b) => b.packageId === "diamond");
  if (hasDiamond) {
    return { allowed: false, reason: "Fully booked — large detail scheduled" };
  }

  // 3. If this specific slot is already taken
  const slotTaken = dayBookings.some((b) => b.slotId === slotId);
  if (slotTaken) {
    return { allowed: false, reason: "This time is already booked" };
  }

  // 4. Dynamic duration-based blocking:
  //    If an existing booking's duration would overlap into this slot, block it
  for (const booking of dayBookings) {
    const blocked = getBlockedSlots(booking.slotId, booking.packageId);
    if (blocked.includes(slotId)) {
      return { allowed: false, reason: "Unavailable — previous appointment still in progress" };
    }
  }

  // 5. Check if the NEW booking's duration would overlap into already-taken slots
  const wouldBlock = getBlockedSlots(slotId, packageId);
  for (const blockedSlotId of wouldBlock) {
    const conflict = dayBookings.some((b) => b.slotId === blockedSlotId);
    if (conflict) {
      return { allowed: false, reason: "Not enough time — overlaps with a later appointment" };
    }
  }

  return { allowed: true };
}

// Max booking window in days
export const BOOKING_WINDOW_DAYS = 21;
