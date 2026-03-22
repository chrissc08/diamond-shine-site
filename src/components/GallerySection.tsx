import { useScrollReveal } from "./useScrollReveal";
import beforeAfter1 from "@/assets/before-after-1.jpg";
import beforeAfter2 from "@/assets/before-after-2.jpg";

const GallerySection = () => {
  const { ref, visible } = useScrollReveal();

  return (
    <section className="py-20 lg:py-28 bg-deep-blue/30">
      <div className="container mx-auto px-6">
        <div ref={ref} className={visible ? "reveal" : "opacity-0"}>
          <p className="text-primary font-display text-xs tracking-[0.25em] uppercase text-center mb-3">Results</p>
          <h2 className="font-display text-2xl md:text-4xl font-bold text-center mb-12 tracking-tight">
            Before & After Transformations
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {[beforeAfter1, beforeAfter2].map((img, i) => {
            const { ref: imgRef, visible: imgVisible } = useScrollReveal();
            return (
              <div
                key={i}
                ref={imgRef}
                className={`rounded-xl overflow-hidden border border-border hover:box-glow transition-shadow duration-500 ${
                  imgVisible ? "reveal reveal-delay-" + (i + 1) : "opacity-0"
                }`}
              >
                <img
                  src={img}
                  alt={`Before and after detailing transformation ${i + 1}`}
                  className="w-full h-64 md:h-80 object-cover"
                  loading="lazy"
                />
                <div className="flex">
                  <span className="flex-1 text-center py-2 text-xs font-display tracking-widest uppercase text-muted-foreground bg-card">Before</span>
                  <span className="flex-1 text-center py-2 text-xs font-display tracking-widest uppercase text-primary bg-card border-l border-border">After</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default GallerySection;
