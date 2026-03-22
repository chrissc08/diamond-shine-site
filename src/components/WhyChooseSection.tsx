import { useScrollReveal } from "./useScrollReveal";
import { Flame, Droplets, FlaskConical, Truck, Eye } from "lucide-react";

const reasons = [
  { icon: Flame, title: "Steam Cleaning", desc: "Deep sanitization that eliminates bacteria and grime without harsh chemicals." },
  { icon: Droplets, title: "Extraction Services", desc: "Professional carpet and upholstery extraction for the deepest clean possible." },
  { icon: FlaskConical, title: "Professional-Grade Chemicals", desc: "We use only the best pH-balanced, paint-safe products in the industry." },
  { icon: Truck, title: "Mobile Convenience", desc: "We come to you. (Orange County, NY & Surrounding Areas)" },
  { icon: Eye, title: "Attention to Detail", desc: "Every crevice, every surface. We don't cut corners." },
];

const WhyChooseSection = () => {
  const { ref, visible } = useScrollReveal();

  return (
    <section className="py-24 lg:py-32">
      <div className="container mx-auto px-6">
        <div ref={ref} className={visible ? "reveal" : "opacity-0"}>
          <p className="text-primary font-display text-xs tracking-[0.25em] uppercase text-center mb-3">The Difference</p>
          <h2 className="font-display text-2xl md:text-4xl font-bold text-center mb-14 tracking-tight">
            Why Choose Diamond Touch
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {reasons.map((r, i) => {
            const { ref: itemRef, visible: itemVisible } = useScrollReveal();
            return (
              <div
                key={r.title}
                ref={itemRef}
                className={`flex gap-4 ${itemVisible ? "reveal reveal-delay-" + (i + 1) : "opacity-0"}`}
              >
                <div className="shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <r.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-display text-sm font-bold mb-1 tracking-wide">{r.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{r.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseSection;
