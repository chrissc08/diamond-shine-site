import { useState } from "react";
import { useScrollReveal } from "./useScrollReveal";
import { Send } from "lucide-react";

const BookingSection = () => {
  const { ref, visible } = useScrollReveal();
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section id="booking" className="py-24 lg:py-32 bg-deep-blue/30">
      <div className="container mx-auto px-6">
        <div ref={ref} className={visible ? "reveal" : "opacity-0"}>
          <p className="text-primary font-display text-xs tracking-[0.25em] uppercase text-center mb-3">Book Now</p>
          <h2 className="font-display text-2xl md:text-4xl font-bold text-center mb-4 tracking-tight">
            Request Your Detail
          </h2>
          <p className="text-center text-muted-foreground text-sm mb-12 max-w-md mx-auto">
            Fill out the form below and we'll get back to you within a few hours.
          </p>
        </div>

        <div className="max-w-xl mx-auto">
          {submitted ? (
            <div className="text-center py-16 reveal">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                <Send className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-display text-xl font-bold mb-2">Request Sent</h3>
              <p className="text-muted-foreground text-sm">We'll reach out shortly to confirm your appointment.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className={`space-y-4 ${visible ? "reveal reveal-delay-2" : "opacity-0"}`}>
              <div className="grid sm:grid-cols-2 gap-4">
                <input
                  required
                  type="text"
                  placeholder="Your Name"
                  className="w-full px-4 py-3 rounded-lg bg-card border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
                />
                <input
                  required
                  type="tel"
                  placeholder="Phone Number"
                  className="w-full px-4 py-3 rounded-lg bg-card border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
                />
              </div>

              <select
                required
                className="w-full px-4 py-3 rounded-lg bg-card border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow appearance-none"
                defaultValue=""
              >
                <option value="" disabled>Vehicle Type</option>
                <option>Sedan</option>
                <option>SUV</option>
                <option>Truck</option>
                <option>Van</option>
                <option>Coupe</option>
                <option>Other</option>
              </select>

              <select
                required
                className="w-full px-4 py-3 rounded-lg bg-card border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow appearance-none"
                defaultValue=""
              >
                <option value="" disabled>Select Package</option>
                <option>Maintenance Detail</option>
                <option>Standard Detail</option>
                <option>Deep Interior Detail</option>
                <option>Full Detail</option>
              </select>

              <textarea
                rows={3}
                placeholder="Describe the vehicle's current condition (optional)"
                className="w-full px-4 py-3 rounded-lg bg-card border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow resize-none"
              />

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 px-8 py-4 font-display text-sm font-semibold tracking-wider uppercase bg-primary text-primary-foreground rounded-lg box-glow hover:box-glow-strong transition-shadow duration-300 active:scale-[0.97]"
              >
                <Send className="w-4 h-4" />
                Request Your Detail
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default BookingSection;
