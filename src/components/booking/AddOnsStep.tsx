import { ShieldCheck, Dog, Trash2, Droplets, Check } from "lucide-react";
import { addOns } from "./bookingData";

const iconMap: Record<string, React.ElementType> = {
  shield: ShieldCheck,
  dog: Dog,
  trash: Trash2,
  droplets: Droplets,
};

interface AddOnsStepProps {
  selected: string[];
  onToggle: (id: string) => void;
}

const AddOnsStep = ({ selected, onToggle }: AddOnsStepProps) => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-2">
        <h3 className="font-display text-xl md:text-2xl font-bold tracking-tight mb-2">
          Enhance Your Detail
        </h3>
        <p className="text-muted-foreground text-sm">
          Optional extras to elevate your service
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        {addOns.map((addon) => {
          const Icon = iconMap[addon.icon] || ShieldCheck;
          const isSelected = selected.includes(addon.id);

          return (
            <button
              key={addon.id}
              type="button"
              onClick={() => onToggle(addon.id)}
              className={`flex items-center gap-4 p-4 rounded-xl border transition-all duration-300 text-left active:scale-[0.97] cursor-pointer ${
                isSelected
                  ? "border-primary/60 bg-primary/[0.06] box-glow"
                  : "border-border bg-card hover:border-primary/20 hover:box-glow"
              }`}
            >
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-colors duration-200 ${
                  isSelected ? "bg-primary/20" : "bg-muted"
                }`}
              >
                <Icon className={`w-5 h-5 ${isSelected ? "text-primary" : "text-muted-foreground"}`} />
              </div>
              <div className="flex-1 min-w-0">
                <span className="font-display text-sm font-semibold tracking-wide block">{addon.name}</span>
                <span className="text-primary/80 text-xs font-display">{addon.price}</span>
              </div>
              <div
                className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-all duration-200 ${
                  isSelected
                    ? "border-primary bg-primary"
                    : "border-muted-foreground/30"
                }`}
              >
                {isSelected && <Check className="w-3 h-3 text-primary-foreground" />}
              </div>
            </button>
          );
        })}
      </div>

      <p className="text-center text-muted-foreground text-xs">
        Add-ons are optional — skip ahead if none are needed
      </p>
      <p className="text-center text-muted-foreground/60 text-[11px]">
        Diamond Full Detail already includes everything — no add-ons necessary
      </p>
    </div>
  );
};

export default AddOnsStep;
