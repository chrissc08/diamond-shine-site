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
    time: "3–5 hrs",
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
    time: "4–6 hrs",
    sedanPrice: "$300–450",
    suvPrice: "$350–550",
    tagline: "Showroom-level results, inside and out",
  },
];

export const timeSlots: TimeSlot[] = [
  { id: "9am", time: "9:00 AM", label: "Premium Slot" },
  { id: "1130am", time: "11:30 AM", label: "Mid Slot" },
  { id: "130pm", time: "1:30 PM", label: "Flex Slot" },
  { id: "3pm", time: "3:00 PM", label: "Quick Slot" },
];

export const addOns: AddOn[] = [
  { id: "ceramic", name: "Spray Protection (Ceramic Boost)", price: "$20–50", icon: "shield" },
  { id: "pet", name: "Pet Hair Removal", price: "$25–75", icon: "dog" },
  { id: "trash", name: "Excess Trash Removal", price: "$20–50", icon: "trash" },
  { id: "stain", name: "Stain Treatment", price: "$25–100", icon: "droplets" },
];

export function getAllowedSlots(packageId: string): string[] {
  switch (packageId) {
    case "diamond":
      return ["9am"];
    case "interior":
      return ["9am"];
    case "complete":
      return ["9am", "1130am", "130pm"];
    case "signature":
      return ["9am", "1130am", "130pm", "3pm"];
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
