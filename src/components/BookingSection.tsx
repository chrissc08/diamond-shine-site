import { useState, useRef } from "react";
import { useScrollReveal } from "./useScrollReveal";
import { Send, Upload, X, ImageIcon } from "lucide-react";

const BookingSection = () => {
  const { ref, visible } = useScrollReveal();
  const [submitted, setSubmitted] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...newFiles].slice(0, 5));
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
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
                <option>Signature Maintenance Detail</option>
                <option>Complete Reset Detail</option>
                <option>Interior Restoration Detail</option>
                <option>Diamond Full Detail</option>
              </select>

              <textarea
                rows={3}
                placeholder="Describe the vehicle's current condition (optional)"
                className="w-full px-4 py-3 rounded-lg bg-card border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow resize-none"
              />

              {/* File Upload */}
              <div>
                <label
                  htmlFor="file-upload"
                  className="flex items-center gap-3 w-full px-4 py-3 rounded-lg bg-card border border-dashed border-border text-muted-foreground text-sm cursor-pointer hover:border-primary/50 hover:text-foreground transition-colors"
                >
                  <Upload className="w-5 h-5 shrink-0 text-primary" />
                  <span>Upload photos of your vehicle for a more accurate quote (max 5)</span>
                </label>
                <input
                  ref={fileInputRef}
                  id="file-upload"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                />

                {files.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {files.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-card border border-border text-xs text-foreground"
                      >
                        <ImageIcon className="w-3.5 h-3.5 text-primary shrink-0" />
                        <span className="truncate max-w-[140px]">{file.name}</span>
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="text-muted-foreground hover:text-destructive transition-colors"
                          aria-label={`Remove ${file.name}`}
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

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
