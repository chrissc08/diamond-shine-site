import { useScrollReveal } from "./useScrollReveal";
import { Dog, Droplets, Trash2, AlertTriangle, Mountain, ShieldCheck } from "lucide-react";

const addOns = [
  { icon: Dog, name: "Pet Hair Removal", price: "$25–75" },
  { icon: Droplets, name: "Heavy Stain Removal", price: "$25–100" },
  { icon: Trash2, name: "Excess Trash Cleanup", price: "$20–50", note: "(applied to bill if vehicle requires additional service time due to heavy amounts of trash)" },
  { icon: Mountain, name: "Excess Sand / Mud", price: "$30–80", note: "(applied to bill if vehicle requires additional service time due to heavy amounts of sand/mud)" },
  { icon: ShieldCheck, name: "Ceramic / Wet Coat", price: "$20–50" },
];

const AddOnsSection = () => {
  const { ref, visible } = useScrollReveal();

  return (
    <section className="py-20 lg:py-28 bg-deep-blue/30">
      <div className="container mx-auto px-6">
        <div ref={ref} className={visible ? "reveal" : "opacity-0"}>
          <p className="text-primary font-display text-xs tracking-[0.25em] uppercase text-center mb-3">Extras</p>
          <h2 className="font-display text-2xl md:text-3xl font-bold text-center mb-12 tracking-tight">
            Add-On Services
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {addOns.map((item, i) => {
            const { ref: cardRef, visible: cardVisible } = useScrollReveal();
            return (
              <div
                key={item.name}
                ref={cardRef}
                className={`flex flex-col items-center text-center p-6 rounded-xl bg-card border border-border hover:box-glow hover:-translate-y-1 transition-all duration-500 ${
                  cardVisible ? "reveal reveal-delay-" + (i + 1) : "opacity-0"
                }`}
              >
                <item.icon className="w-8 h-8 text-primary mb-3" />
                <h3 className="font-display text-xs font-semibold tracking-wide mb-2">{item.name}</h3>
                <p className="text-primary font-display text-sm font-bold">{item.price}</p>
                {"note" in item && <p className="text-muted-foreground text-[10px] mt-1 leading-tight">{item.note}</p>}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default AddOnsSection;
