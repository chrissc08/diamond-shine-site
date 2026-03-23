import { packages, timeSlots, addOns as addOnData } from "./bookingData";
import { Check, Clock, MapPin, Car, User } from "lucide-react";
import type { BookingDetails } from "./DetailsStep";

interface ConfirmStepProps {
  packageId: string;
  timeSlotId: string;
  selectedAddOns: string[];
  details: BookingDetails;
}

const ConfirmStep = ({ packageId, timeSlotId, selectedAddOns, details }: ConfirmStepProps) => {
  const pkg = packages.find((p) => p.id === packageId);
  const slot = timeSlots.find((s) => s.id === timeSlotId);
  const addOns = addOnData.filter((a) => selectedAddOns.includes(a.id));

  if (!pkg || !slot) return null;

  const rows = [
    { icon: User, label: details.name, sub: details.phone },
    { icon: MapPin, label: details.address, sub: details.vehicleType },
    { icon: Car, label: pkg.name, sub: `${slot.time} · ${pkg.time}` },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center mb-2">
        <h3 className="font-display text-xl md:text-2xl font-bold tracking-tight mb-2">
          Confirm Your Booking
        </h3>
        <p className="text-muted-foreground text-sm">
          Review the details below, then submit your request
        </p>
      </div>

      <div className="rounded-xl bg-card border border-border divide-y divide-border">
        {rows.map(({ icon: Icon, label, sub }, i) => (
          <div key={i} className="flex items-center gap-4 px-5 py-4">
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <Icon className="w-4 h-4 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate">{label}</p>
              <p className="text-xs text-muted-foreground">{sub}</p>
            </div>
          </div>
        ))}
      </div>

      {addOns.length > 0 && (
        <div className="space-y-2">
          <span className="text-xs text-muted-foreground font-display uppercase tracking-wider">Add-ons</span>
          <div className="flex flex-wrap gap-2">
            {addOns.map((a) => (
              <span
                key={a.id}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-xs font-display text-primary"
              >
                <Check className="w-3 h-3" />
                {a.name}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 rounded-lg px-4 py-3">
        <Clock className="w-4 h-4 text-primary shrink-0" />
        <span>
          You're booked for approximately <strong className="text-foreground">{pkg.time}</strong>
        </span>
      </div>
    </div>
  );
};

export default ConfirmStep;
