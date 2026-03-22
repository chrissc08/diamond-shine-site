import heroCar from "@/assets/hero-car.jpg";
import { Shield, Wrench, CheckCircle } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src={heroCar}
          alt="Premium detailed vehicle"
          className="w-full h-full object-cover object-center"
          loading="eager"
        />
        <div className="absolute inset-0 hero-gradient" />
        <div className="absolute inset-0 bg-background/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 text-center pt-28 pb-24">
        {/* Logo is in the navbar only */}

        <h1 className="font-display text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.08] mb-6 reveal reveal-delay-1">
          Premium Mobile Detailing —{" "}
          <span className="text-primary text-glow block mt-2">We Bring the Shine to You</span>
        </h1>

        <p className="text-silver text-base md:text-xl max-w-2xl mx-auto mb-10 reveal reveal-delay-2 font-light leading-relaxed">
          Deep cleaning, paint-safe techniques, and showroom-level results at your doorstep.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-14 reveal reveal-delay-3">
          <a
            href="#booking"
            className="inline-flex items-center justify-center px-8 py-4 font-display text-sm font-semibold tracking-wider uppercase bg-primary text-primary-foreground rounded-lg box-glow hover:box-glow-strong transition-shadow duration-300 active:scale-[0.97]"
          >
            Book Your Detail
          </a>
          <a
            href="#packages"
            className="inline-flex items-center justify-center px-8 py-4 font-display text-sm font-semibold tracking-wider uppercase border border-primary/40 text-primary rounded-lg hover:bg-primary/10 transition-colors duration-300 active:scale-[0.97]"
          >
            Get a Quote
          </a>
        </div>

        {/* Trust badges */}
        <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10 text-silver/80 text-sm reveal reveal-delay-4">
          <span className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-primary" />
            Fully Mobile
          </span>
          <span className="flex items-center gap-2">
            <Wrench className="w-4 h-4 text-primary" />
            Professional Grade Equipment
          </span>
          <span className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-primary" />
            Satisfaction Guaranteed
          </span>
        </div>

        <p className="mt-8 text-silver/60 text-xs max-w-md mx-auto reveal reveal-delay-5">
          Final price depends on vehicle condition. Photos may be required for accurate quote.
        </p>
      </div>

      {/* Sticky Book Now on mobile */}
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-background/90 backdrop-blur-md border-t border-border md:hidden">
        <a
          href="#booking"
          className="block w-full text-center px-6 py-3 font-display text-sm font-semibold tracking-wider uppercase bg-primary text-primary-foreground rounded-lg box-glow active:scale-[0.97] transition-all duration-200"
        >
          Book Now
        </a>
      </div>
    </section>
  );
};

export default HeroSection;
