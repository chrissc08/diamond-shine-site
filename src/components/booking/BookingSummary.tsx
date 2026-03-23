import { packages, timeSlots, addOns as addOnData } from "./bookingData";
import { Clock, Sparkles, CalendarDays } from "lucide-react";
import { format } from "date-fns";

interface BookingSummaryProps {
  packageId: string | null;
  selectedDate: Date | undefined;
  timeSlotId: string | null;
  selectedAddOns: string[];
  step: number;
}

const BookingSummary = ({ packageId, selectedDate, timeSlotId, selectedAddOns, step }: BookingSummaryProps) => {
  const pkg = packages.find((p) => p.id === packageId);
  const slot = timeSlots.find((s) => s.id === timeSlotId);
  const addOns = addOnData.filter((a) => selectedAddOns.includes(a.id));

  if (!pkg) return null;

  return (
    <div className="rounded-xl bg-card border border-border p-5 space-y-4">
      <div className="flex items-center gap-2 mb-1">
        <Sparkles className="w-4 h-4 text-primary" />
        <h4 className="font-display text-sm font-bold tracking-wide uppercase">Booking Summary</h4>
      </div>

      <div className="space-y-3 text-sm">
        <div className="flex justify-between items-start">
          <span className="text-muted-foreground">Package</span>
          <span className="font-display font-semibold text-right max-w-[180px] leading-tight">{pkg.name}</span>
        </div>

        {selectedDate && step >= 2 && (
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Date</span>
            <span className="font-display font-semibold flex items-center gap-1.5">
              <CalendarDays className="w-3 h-3 text-primary" />
              {format(selectedDate, "EEE, MMM d")}
            </span>
          </div>
        )}

        {slot && step >= 3 && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Time</span>
            <span className="font-display font-semibold">{slot.time}</span>
          </div>
        )}

        {selectedDate && slot && step >= 3 && (
          <div className="px-3 py-2 rounded-lg bg-primary/[0.04] border border-primary/10 text-xs text-muted-foreground">
            <span className="text-foreground font-semibold">
              {format(selectedDate, "EEEE, MMMM d")} at {slot.time}
            </span>
          </div>
        )}

        {addOns.length > 0 && step >= 4 && (
          <div>
            <span className="text-muted-foreground text-xs block mb-1.5">Add-ons</span>
            {addOns.map((a) => (
              <div key={a.id} className="flex justify-between text-xs mb-1">
                <span className="text-secondary-foreground">{a.name}</span>
                <span className="text-primary/80 font-display">{a.price}</span>
              </div>
            ))}
          </div>
        )}

        <div className="border-t border-border pt-3 space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Price Range</span>
            <span className="font-display font-bold text-foreground">{pkg.sedanPrice} – {pkg.suvPrice.replace(/^\$/, '')}</span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
            <Clock className="w-3 h-3" />
            <span>Approximately {pkg.time}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingSummary;
