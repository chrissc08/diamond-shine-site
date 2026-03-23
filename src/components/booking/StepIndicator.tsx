import { Check } from "lucide-react";

const steps = ["Package", "Date", "Time", "Add-ons", "Details", "Confirm"];

interface StepIndicatorProps {
  current: number;
}

const StepIndicator = ({ current }: StepIndicatorProps) => {
  return (
    <div className="flex items-center justify-center gap-1 sm:gap-1.5 mb-10">
      {steps.map((label, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <div key={label} className="flex items-center gap-1 sm:gap-1.5">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-bold transition-all duration-300 ${
                  done
                    ? "bg-primary text-primary-foreground"
                    : active
                    ? "bg-primary/20 text-primary border border-primary/50 box-glow"
                    : "bg-card border border-border text-muted-foreground"
                }`}
              >
                {done ? <Check className="w-3.5 h-3.5" /> : i + 1}
              </div>
              <span
                className={`text-[9px] sm:text-[10px] font-display uppercase tracking-wider hidden sm:block ${
                  active ? "text-primary" : done ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className={`w-4 sm:w-8 h-px mb-5 sm:mb-4 transition-colors duration-300 ${
                  i < current ? "bg-primary/60" : "bg-border"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default StepIndicator;
