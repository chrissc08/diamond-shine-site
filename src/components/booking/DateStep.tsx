import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { addDays, isSunday, format } from "date-fns";
import { CalendarDays } from "lucide-react";
import { BOOKING_WINDOW_DAYS } from "./bookingData";

interface DateStepProps {
  selected: Date | undefined;
  onSelect: (date: Date | undefined) => void;
  packageName?: string;
}

const DateStep = ({ selected, onSelect, packageName }: DateStepProps) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const minDate = today;
  const maxDate = addDays(today, BOOKING_WINDOW_DAYS);

  const disabledDays = [
    { before: minDate },
    { after: maxDate },
    (date: Date) => isSunday(date),
  ];

  return (
    <div className="space-y-6">
      <div className="text-center mb-2">
        <h3 className="font-display text-xl md:text-2xl font-bold tracking-tight mb-2">
          Pick a Date
        </h3>
        <p className="text-muted-foreground text-sm">
          {packageName
            ? `Choose a day for your ${packageName}`
            : "Select your preferred service date"}
        </p>
      </div>

      <div className="flex justify-center">
        <div className="rounded-xl bg-card border border-border p-2 sm:p-4 inline-block">
          <Calendar
            mode="single"
            selected={selected}
            onSelect={onSelect}
            disabled={disabledDays}
            fromDate={tomorrow}
            toDate={maxDate}
            className={cn("p-3 pointer-events-auto")}
            classNames={{
              months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
              month: "space-y-4",
              caption: "flex justify-center pt-1 relative items-center",
              caption_label: "text-sm font-display font-semibold tracking-wide",
              nav: "space-x-1 flex items-center",
              nav_button:
                "h-8 w-8 bg-transparent border border-border rounded-lg p-0 opacity-60 hover:opacity-100 hover:bg-card hover:box-glow transition-all duration-200 inline-flex items-center justify-center",
              nav_button_previous: "absolute left-1",
              nav_button_next: "absolute right-1",
              table: "w-full border-collapse",
              head_row: "flex",
              head_cell:
                "text-muted-foreground rounded-md w-10 sm:w-11 font-display font-medium text-[11px] uppercase tracking-wider",
              row: "flex w-full mt-1",
              cell: "h-10 w-10 sm:h-11 sm:w-11 text-center text-sm p-0 relative focus-within:relative focus-within:z-20",
              day: "h-10 w-10 sm:h-11 sm:w-11 p-0 font-normal rounded-lg transition-all duration-200 hover:bg-primary/10 hover:text-primary aria-selected:opacity-100 inline-flex items-center justify-center cursor-pointer active:scale-[0.95]",
              day_selected:
                "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground box-glow font-semibold",
              day_today:
                "ring-1 ring-primary/40 text-primary font-semibold",
              day_outside: "text-muted-foreground opacity-30",
              day_disabled:
                "text-muted-foreground/30 opacity-30 cursor-not-allowed hover:bg-transparent hover:text-muted-foreground/30",
              day_hidden: "invisible",
            }}
          />
        </div>
      </div>

      {selected && (
        <div className="flex items-center justify-center gap-2 text-sm text-primary reveal">
          <CalendarDays className="w-4 h-4" />
          <span className="font-display font-semibold">
            {format(selected, "EEEE, MMMM d, yyyy")}
          </span>
        </div>
      )}

      <p className="text-center text-muted-foreground text-xs">
        Monday – Saturday · Booking available up to {BOOKING_WINDOW_DAYS} days out
      </p>
    </div>
  );
};

export default DateStep;
