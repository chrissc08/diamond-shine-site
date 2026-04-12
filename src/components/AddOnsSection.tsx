import { useScrollReveal } from "./useScrollReveal";
import { Dog, Droplets, Trash2, Mountain, ShieldCheck, Sparkles, Gem } from "lucide-react";

const optionalAddOns = [
  { icon: Dog, name: "Pet Hair Removal", price: "$25–75", note: "Thorough removal of embedded pet hair from seats, carpets & hard-to-reach areas" },
  { icon: Droplets, name: "Heavy Stain Removal", price: "$25–100", note: "Targeted deep-cleaning treatment for stubborn stains on upholstery, carpets & fabric surfaces" },
  { icon: ShieldCheck, name: "Ceramic / Wet Coat", price: "$20–50", note: "Adds a hydrophobic layer of protection for enhanced gloss, water beading & UV defense" },
  { icon: Sparkles, name: "Paint Decontamination Treatment", price: "$40–80", note: "Iron removal & clay treatment to eliminate bonded contaminants, leaving paint silky smooth" },
  { icon: Gem, name: "Leather Protection Treatment", price: "$30–60", note: "Restores, conditions & protects leather with a non-greasy, luxurious finish that prevents cracking" },
];

const conditionBased = [
  { icon: Trash2, name: "Excess Trash Cleanup", price: "$20–50", note: "Applied to bill if vehicle requires additional service time due to heavy amounts of trash" },
  { icon: Mountain, name: "Excess Sand / Mud", price: "$30–80", note: "Applied to bill if vehicle requires additional service time due to heavy amounts of sand or mud" },
];

const AddOnCard = ({ item, index }: { item: typeof optionalAddOns[0]; index: number }) => {
  const { ref, visible } = useScrollReveal();
  return (
    <div
      ref={ref}
      className={`flex flex-col items-center text-center p-6 rounded-xl bg-card border border-border hover:box-glow hover:-translate-y-1 transition-all duration-500 ${
        visible ? "reveal reveal-delay-" + (index + 1) : "opacity-0"
      }`}
    >
      <item.icon className="w-8 h-8 text-primary mb-3" />
      <h3 className="font-display text-xs font-semibold tracking-wide mb-2">{item.name}</h3>
      <p className="text-primary font-display text-sm font-bold">{item.price}</p>
      <p className="text-muted-foreground text-[10px] mt-1 leading-tight">{item.note}</p>
    </div>
  );
};

const AddOnsSection = () => {
  const { ref, visible } = useScrollReveal();
  const { ref: ref2, visible: visible2 } = useScrollReveal();

  return (
    <section className="py-20 lg:py-28 bg-deep-blue/30">
      <div className="container mx-auto px-6">
        <div ref={ref} className={visible ? "reveal" : "opacity-0"}>
          <p className="text-primary font-display text-xs tracking-[0.25em] uppercase text-center mb-3">Extras</p>
          <h2 className="font-display text-2xl md:text-3xl font-bold text-center mb-12 tracking-tight">
            Add-On Services
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-5xl mx-auto">
          {optionalAddOns.map((item, i) => (
            <AddOnCard key={item.name} item={item} index={i} />
          ))}
        </div>

        <div ref={ref2} className={`mt-16 ${visible2 ? "reveal" : "opacity-0"}`}>
          <p className="text-primary font-display text-xs tracking-[0.25em] uppercase text-center mb-3">Condition-Based Fees</p>
          <p className="text-center text-muted-foreground text-sm max-w-lg mx-auto mb-8">
            These fees are automatically applied if your vehicle requires additional service time.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
          {conditionBased.map((item, i) => (
            <AddOnCard key={item.name} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default AddOnsSection;
