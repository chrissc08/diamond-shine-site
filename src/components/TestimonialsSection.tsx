import { useScrollReveal } from "./useScrollReveal";
import { Star } from "lucide-react";

const testimonials = [
  { name: "Marcus Rivera", text: "My truck looked brand new after the Full Detail. Worth every penny — the interior smelled incredible.", rating: 5 },
  { name: "Sarah Pennington", text: "They came right to my driveway and worked magic on my SUV. The ceramic coating still beads water weeks later.", rating: 5 },
  { name: "Tom Vasquez", text: "Had dog hair embedded in every seat. After their deep interior, not a single strand left. Seriously impressed.", rating: 5 },
];

const TestimonialsSection = () => {
  const { ref, visible } = useScrollReveal();

  return (
    <section className="py-24 lg:py-32">
      <div className="container mx-auto px-6">
        <div ref={ref} className={visible ? "reveal" : "opacity-0"}>
          <p className="text-primary font-display text-xs tracking-[0.25em] uppercase text-center mb-3">Testimonials</p>
          <h2 className="font-display text-2xl md:text-3xl font-bold text-center mb-12 tracking-tight">
            What Our Clients Say
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {testimonials.map((t, i) => {
            const { ref: tRef, visible: tVisible } = useScrollReveal();
            return (
              <div
                key={t.name}
                ref={tRef}
                className={`p-6 rounded-xl bg-card border border-border ${tVisible ? "reveal reveal-delay-" + (i + 1) : "opacity-0"}`}
              >
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-secondary-foreground text-sm leading-relaxed mb-4">"{t.text}"</p>
                <p className="font-display text-xs font-semibold tracking-wide">{t.name}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
