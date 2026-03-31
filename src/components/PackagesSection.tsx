import { useScrollReveal } from "./useScrollReveal";
import { Star, Clock, Check } from "lucide-react";

interface Package {
  name: string;
  popular?: boolean;
  description: string;
  features: string[];
  time: string;
  sedanPrice: string;
  suvPrice: string;
  tagline: string;
  subtitle: string;
}

const packages: Package[] = [
  {
    name: "Essential Maintenance Detail",
    subtitle: "Best for vehicles already in good condition",
    description: "Keep your car looking sharp with a consistent, high-quality maintenance clean. Designed for vehicles that are already in good condition and need upkeep — not heavy restoration.",
    features: [
      "Foam hand wash + detailed hand wash",
      "Wheels cleaned + tire shine applied",
      "Light interior vacuum + wipe down",
      "Streak-free window cleaning",
    ],
    time: "1–1.5 hours",
    sedanPrice: "$90–120",
    suvPrice: "$110–140",
    tagline: "A consistent, high-quality maintenance clean",
  },
  {
    name: "Signature Reset Detail",
    popular: true,
    subtitle: "A complete refresh — inside & out",
    description: "Our most popular package. A complete refresh inside and out that restores your vehicle's appearance and adds protection to keep it cleaner longer.",
    features: [
      "Deep foam pre-wash + detailed hand wash",
      "Deep wheel cleaning (faces + barrels)",
      "Full interior vacuum + wipe down",
      "Light stain spot treatment",
      "Spray protection (ceramic or sealant boost)",
      "Streak-free window cleaning",
    ],
    time: "2–3 hours",
    sedanPrice: "$160–220",
    suvPrice: "$190–260",
    tagline: "Our most popular package — the perfect balance of clean & protection",
  },
  {
    name: "Interior Revival Detail",
    subtitle: "For heavily used or neglected interiors",
    description: "A full interior transformation for heavily used or neglected vehicles. Removes deep dirt, stains, odors, and pet hair to restore your cabin.",
    features: [
      "Full vacuum + compressed air blowout",
      "Pet hair removal",
      "Steam cleaning",
      "Shampoo + water extraction",
      "Stain & odor treatment",
      "Deep plastics cleaning + UV protection",
    ],
    time: "3–4 hours",
    sedanPrice: "$240–320",
    suvPrice: "$280–360",
    tagline: "Brings your interior back to life",
  },
  {
    name: "Ultimate Detail Package",
    subtitle: "The most complete detail offered",
    description: "The most complete detail offered. A full interior and exterior transformation designed to deliver showroom-level results with long-lasting protection.",
    features: [
      "Everything in Signature Reset + Interior Revival",
      "Iron decontamination + tar removal (if needed)",
      "Long-lasting exterior protection",
      "Showroom-level finish",
    ],
    time: "4–5 hours",
    sedanPrice: "$320–450",
    suvPrice: "$380–550",
    tagline: "Showroom-level results, inside and out",
  },
];

const PackageCard = ({ pkg, index }: { pkg: Package; index: number }) => {
  const { ref, visible } = useScrollReveal();

  return (
    <div
      ref={ref}
      className={`relative flex flex-col rounded-xl bg-card border border-border p-6 lg:p-8 transition-all duration-500 hover:box-glow hover:-translate-y-1 group ${
        visible ? "reveal reveal-delay-" + (index + 1) : "opacity-0"
      } ${pkg.popular ? "border-primary/50 box-glow" : ""}`}
    >
      {pkg.popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-primary-foreground font-display text-[10px] font-bold uppercase tracking-widest rounded-full flex items-center gap-1">
          <Star className="w-3 h-3" /> Most Popular
        </div>
      )}

      <h3 className="font-display text-lg font-bold mb-1 tracking-wide">
        {pkg.name}
      </h3>
      <p className="text-muted-foreground text-sm mb-1">{pkg.subtitle}</p>
      <p className="text-muted-foreground/80 text-xs leading-relaxed mb-3">{pkg.description}</p>

      <div className="flex items-center gap-2 text-muted-foreground text-sm mb-4">
        <Clock className="w-3.5 h-3.5" />
        {pkg.time}
      </div>

      <ul className="space-y-2.5 mb-6 flex-1">
        {pkg.features.map((f) => (
          <li key={f} className="flex items-start gap-2.5 text-sm text-secondary-foreground">
            <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
            {f}
          </li>
        ))}
      </ul>

      <p className="text-primary/80 text-xs italic mb-4">👉 {pkg.tagline}</p>

      <div className="border-t border-border pt-5 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Sedan</span>
          <span className="font-display font-bold text-foreground">{pkg.sedanPrice}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">SUV / Truck</span>
          <span className="font-display font-bold text-foreground">{pkg.suvPrice}</span>
        </div>
      </div>
    </div>
  );
};

const PackagesSection = () => {
  const { ref, visible } = useScrollReveal();

  return (
    <section id="packages" className="py-24 lg:py-32">
      <div className="container mx-auto px-6">
        <div ref={ref} className={visible ? "reveal" : "opacity-0"}>
          <p className="text-primary font-display text-xs tracking-[0.25em] uppercase text-center mb-3">Our Packages</p>
          <h2 className="font-display text-2xl md:text-4xl font-bold text-center mb-4 tracking-tight">
            Choose Your Level of Detail
          </h2>
          <p className="text-center text-muted-foreground max-w-xl mx-auto mb-2 text-base md:text-lg">
            Final price depends on vehicle condition. Photos may be required for accurate quote.
          </p>
          <p className="text-center text-muted-foreground max-w-xl mx-auto mb-4 text-base md:text-lg">
            We supply our own power — we just ask to hook up to your water.
          </p>
        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6 mt-12">
          {packages.map((pkg, i) => (
            <PackageCard key={pkg.name} pkg={pkg} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PackagesSection;
