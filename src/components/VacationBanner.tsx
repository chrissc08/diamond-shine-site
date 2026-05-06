import { useVacationPeriods } from "@/hooks/useVacationPeriods";
import { Plane, X } from "lucide-react";
import { format, parseISO, differenceInDays } from "date-fns";
import { useState } from "react";

const VacationBanner = () => {
  const { periods } = useVacationPeriods();
  const [dismissed, setDismissed] = useState(false);

  if (dismissed || periods.length === 0) return null;

  const today = new Date();
  const relevant = periods.find((p) => {
    const start = parseISO(p.start_date);
    const end = parseISO(p.end_date);
    return today <= end && differenceInDays(start, today) <= 14;
  });

  if (!relevant) return null;

  const startD = parseISO(relevant.start_date);
  const endD = parseISO(relevant.end_date);
  const isActive = today >= startD && today <= endD;

  return (
    <div className="bg-amber-500/10 border-b border-amber-500/30 text-amber-200">
      <div className="container mx-auto px-6 py-2.5 flex items-center gap-3">
        <Plane className="w-4 h-4 shrink-0" />
        <p className="text-sm flex-1">
          {isActive ? "We're currently on break " : "Upcoming break: "}
          <span className="font-semibold">
            {format(startD, "MMM d")} – {format(endD, "MMM d, yyyy")}
          </span>
          {relevant.message ? ` — ${relevant.message}` : isActive ? " — bookings paused." : " — booking paused for these dates."}
        </p>
        <button onClick={() => setDismissed(true)} className="opacity-70 hover:opacity-100">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default VacationBanner;