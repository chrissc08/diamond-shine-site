import { Star, Clock, Check } from "lucide-react";
import { packages, type BookingPackage } from "./bookingData";

interface PackageStepProps {
  selected: string | null;
  onSelect: (id: string) => void;
}

const PackageStep = ({ selected, onSelect }: PackageStepProps) => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-2">
        <h3 className="font-display text-xl md:text-2xl font-bold tracking-tight mb-2">
          Select Your Package
        </h3>
        <p className="text-muted-foreground text-sm">
          Choose the level of detail that suits your vehicle
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {packages.map((pkg) => (
          <PackageCard
            key={pkg.id}
            pkg={pkg}
            isSelected={selected === pkg.id}
            onSelect={() => onSelect(pkg.id)}
          />
        ))}
      </div>
    </div>
  );
};

const PackageCard = ({
  pkg,
  isSelected,
  onSelect,
}: {
  pkg: BookingPackage;
  isSelected: boolean;
  onSelect: () => void;
}) => {
  const isDiamond = pkg.id === "diamond";

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`relative flex flex-col text-left rounded-xl p-5 lg:p-6 border transition-all duration-300 active:scale-[0.97] cursor-pointer group ${
        isSelected
          ? isDiamond
            ? "border-primary bg-primary/[0.06] box-glow-strong"
            : "border-primary/60 bg-primary/[0.04] box-glow"
          : "border-border bg-card hover:border-border hover:box-glow hover:-translate-y-0.5"
      }`}
    >
      {pkg.popular && (
        <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-primary text-primary-foreground font-display text-[9px] font-bold uppercase tracking-widest rounded-full flex items-center gap-1 whitespace-nowrap">
          <Star className="w-2.5 h-2.5" /> Most Popular
        </div>
      )}

      <div className="flex items-start justify-between gap-2 mb-1">
        <h4 className="font-display text-sm font-bold tracking-wide leading-tight">
          {pkg.name}
        </h4>
        <div
          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all duration-200 ${
            isSelected
              ? "border-primary bg-primary"
              : "border-muted-foreground/30"
          }`}
        >
          {isSelected && <Check className="w-3 h-3 text-primary-foreground" />}
        </div>
      </div>

      <div className="flex items-center gap-1.5 text-muted-foreground text-xs mb-3">
        <Clock className="w-3 h-3" />
        {pkg.time}
      </div>

      <ul className="space-y-1.5 mb-4 flex-1">
        {pkg.features.slice(0, 3).map((f) => (
          <li key={f} className="flex items-start gap-2 text-xs text-secondary-foreground">
            <Check className="w-3 h-3 text-primary mt-0.5 shrink-0" />
            <span className="leading-tight">{f}</span>
          </li>
        ))}
        {pkg.features.length > 3 && (
          <li className="text-xs text-muted-foreground pl-5">
            +{pkg.features.length - 3} more
          </li>
        )}
      </ul>

      <div className="border-t border-border pt-3 flex justify-between text-xs">
        <div>
          <span className="text-muted-foreground">Sedan </span>
          <span className="font-display font-bold text-foreground">{pkg.sedanPrice}</span>
        </div>
        <div>
          <span className="text-muted-foreground">SUV </span>
          <span className="font-display font-bold text-foreground">{pkg.suvPrice}</span>
        </div>
      </div>
    </button>
  );
};

export default PackageStep;
