import { Clock, Info, AlertTriangle } from "lucide-react";
import { timeSlots, getAllowedSlots, getSlotMessage, getSlotAvailability, packages } from "./bookingData";

interface TimeSlotStepProps {
  packageId: string;
  dateStr: string;
  selected: string | null;
  onSelect: (id: string) => void;
}

const TimeSlotStep = ({ packageId, dateStr, selected, onSelect }: TimeSlotStepProps) => {
  const message = getSlotMessage(packageId);
  const pkg = packages.find((p) => p.id === packageId);

  return (
    <div className="space-y-6">
      <div className="text-center mb-2">
        <h3 className="font-display text-xl md:text-2xl font-bold tracking-tight mb-2">
          Choose Your Time
        </h3>
        <p className="text-muted-foreground text-sm">
          Available slots for {pkg?.name}
        </p>
      </div>

      {message && (
        <div className="flex items-start gap-3 px-4 py-3 rounded-lg bg-primary/[0.06] border border-primary/20 text-sm text-primary">
          <Info className="w-4 h-4 mt-0.5 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {packageId === "signature" && (
        <div className="flex items-start gap-3 px-4 py-3 rounded-lg bg-muted/50 border border-border text-sm text-muted-foreground">
          <Info className="w-4 h-4 mt-0.5 shrink-0" />
          <span>We recommend the 3:00 PM slot when available to keep earlier times open for larger detail packages. Thank you!</span>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        {timeSlots.map((slot) => {
          const availability = getSlotAvailability(dateStr, packageId, slot.id);
          const isSelected = selected === slot.id;
          const isLimited = !availability.allowed && availability.reason?.includes("Only");

          return (
            <button
              key={slot.id}
              type="button"
              disabled={!availability.allowed}
              onClick={() => onSelect(slot.id)}
              className={`relative flex flex-col items-center gap-1 py-5 px-4 rounded-xl border transition-all duration-300 ${
                !availability.allowed
                  ? "opacity-30 cursor-not-allowed border-border bg-card"
                  : isSelected
                  ? "border-primary bg-primary/[0.06] box-glow"
                  : "border-border bg-card hover:border-primary/30 hover:box-glow cursor-pointer active:scale-[0.97]"
              }`}
              title={!availability.allowed ? availability.reason : undefined}
            >
              <Clock className={`w-5 h-5 mb-1 ${isSelected ? "text-primary" : "text-muted-foreground"}`} />
              <span className={`font-display text-base font-bold ${isSelected ? "text-primary" : "text-foreground"}`}>
                {slot.time}
              </span>
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-display">
                {slot.label}
              </span>
              {!availability.allowed && (
                <span className="flex items-center gap-1 text-[9px] text-muted-foreground mt-1">
                  {isLimited && <AlertTriangle className="w-2.5 h-2.5" />}
                  {availability.reason === "This time is already booked" ? "Booked" : "Unavailable"}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Show day-level warnings */}
      {(() => {
        const allUnavailable = timeSlots.every(
          (s) => !getSlotAvailability(dateStr, packageId, s.id).allowed
        );
        if (allUnavailable) {
          return (
            <div className="flex items-start gap-3 px-4 py-3 rounded-lg bg-destructive/10 border border-destructive/20 text-sm text-destructive">
              <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
              <span>No slots available for this package on this date. Try a different day or package.</span>
            </div>
          );
        }
        return null;
      })()}
    </div>
  );
};

export default TimeSlotStep;
