import { Clock, Info, AlertTriangle, Zap } from "lucide-react";
import { timeSlots, getAllowedSlots, getSlotMessage, getSlotAvailability, packages, is9amFallbackActive } from "./bookingData";

interface TimeSlotStepProps {
  packageId: string;
  dateStr: string;
  selected: string | null;
  onSelect: (id: string) => void;
}

const TimeSlotStep = ({ packageId, dateStr, selected, onSelect }: TimeSlotStepProps) => {
  const message = getSlotMessage(packageId, dateStr);
  const pkg = packages.find((p) => p.id === packageId);
  const fallbackActive = is9amFallbackActive(dateStr);
  const isSmallService = packageId === "signature" || packageId === "essential";

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

      {/* Last-minute fallback banner */}
      {fallbackActive && isSmallService && (
        <div className="flex items-start gap-3 px-4 py-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-sm text-amber-400 animate-in fade-in slide-in-from-top-2 duration-500">
          <Zap className="w-4 h-4 mt-0.5 shrink-0 fill-amber-400" />
          <span className="font-medium">A last-minute 9:00 AM appointment just opened up. Limited availability.</span>
        </div>
      )}

      {message && (
        <div className="flex items-start gap-3 px-4 py-3 rounded-lg bg-primary/[0.06] border border-primary/20 text-sm text-primary">
          <Info className="w-4 h-4 mt-0.5 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {packageId === "essential" && !fallbackActive && (
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
          const isFallbackSlot = slot.id === "9am" && fallbackActive && isSmallService && availability.allowed;

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
                  : isFallbackSlot
                  ? "border-amber-500/40 bg-amber-500/[0.06] hover:border-amber-500/60 hover:shadow-[0_0_20px_-5px_rgba(245,158,11,0.2)] cursor-pointer active:scale-[0.97] ring-1 ring-amber-500/20"
                  : "border-border bg-card hover:border-primary/30 hover:box-glow cursor-pointer active:scale-[0.97]"
              }`}
              title={!availability.allowed ? availability.reason : undefined}
            >
              {/* Last-minute badge */}
              {isFallbackSlot && !isSelected && (
                <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-amber-500 text-[9px] font-bold uppercase tracking-wider text-black whitespace-nowrap">
                  Last-Minute Opening
                </span>
              )}
              <Clock className={`w-5 h-5 mb-1 ${isSelected ? "text-primary" : isFallbackSlot ? "text-amber-400" : "text-muted-foreground"}`} />
              <span className={`font-display text-base font-bold ${isSelected ? "text-primary" : isFallbackSlot ? "text-amber-400" : "text-foreground"}`}>
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
