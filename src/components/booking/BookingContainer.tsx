import { useState, useCallback } from "react";
import { useScrollReveal } from "../useScrollReveal";
import { Send, ArrowLeft, ArrowRight } from "lucide-react";
import StepIndicator from "./StepIndicator";
import PackageStep from "./PackageStep";
import TimeSlotStep from "./TimeSlotStep";
import AddOnsStep from "./AddOnsStep";
import DetailsStep, { type BookingDetails } from "./DetailsStep";
import ConfirmStep from "./ConfirmStep";
import BookingSummary from "./BookingSummary";
import { getAllowedSlots } from "./bookingData";

const BookingSection = () => {
  const { ref, visible } = useScrollReveal();
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [details, setDetails] = useState<BookingDetails>({
    name: "",
    phone: "",
    email: "",
    address: "",
    vehicleType: "",
    notes: "",
  });

  const handlePackageSelect = useCallback((id: string) => {
    setSelectedPackage(id);
    // Reset slot if no longer allowed
    const allowed = getAllowedSlots(id);
    setSelectedSlot((prev) => (prev && allowed.includes(prev) ? prev : null));
  }, []);

  const handleAddOnToggle = useCallback((id: string) => {
    setSelectedAddOns((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  }, []);

  const canProceed = () => {
    switch (step) {
      case 0: return !!selectedPackage;
      case 1: return !!selectedSlot;
      case 2: return true; // add-ons optional
      case 3: return details.name && details.phone && details.address && details.vehicleType;
      case 4: return true;
      default: return false;
    }
  };

  const next = () => {
    if (step < 4) setStep(step + 1);
    else {
      setSubmitted(true);
    }
  };

  const back = () => {
    if (step > 0) setStep(step - 1);
  };

  if (submitted) {
    return (
      <section id="booking" className="py-24 lg:py-32 bg-deep-blue/30">
        <div className="container mx-auto px-6">
          <div className="max-w-lg mx-auto text-center py-16 reveal">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
              <Send className="w-7 h-7 text-primary" />
            </div>
            <h3 className="font-display text-xl font-bold mb-2">Request Sent</h3>
            <p className="text-muted-foreground text-sm mb-6">
              We'll reach out shortly to confirm your appointment.
            </p>
            <button
              onClick={() => {
                setSubmitted(false);
                setStep(0);
                setSelectedPackage(null);
                setSelectedSlot(null);
                setSelectedAddOns([]);
                setDetails({ name: "", phone: "", email: "", address: "", vehicleType: "", notes: "" });
              }}
              className="text-primary text-sm font-display uppercase tracking-wider hover:underline active:scale-[0.97]"
            >
              Book Another Detail
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="booking" className="py-24 lg:py-32 bg-deep-blue/30">
      <div className="container mx-auto px-6">
        <div ref={ref} className={visible ? "reveal" : "opacity-0"}>
          <p className="text-primary font-display text-xs tracking-[0.25em] uppercase text-center mb-3">
            Book Now
          </p>
          <h2 className="font-display text-2xl md:text-4xl font-bold text-center mb-4 tracking-tight">
            Request Your Detail
          </h2>
          <p className="text-center text-muted-foreground text-sm mb-8 max-w-md mx-auto">
            Build your perfect detail in a few quick steps
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <StepIndicator current={step} />

          <div className="grid lg:grid-cols-[1fr_280px] gap-6">
            {/* Main step content */}
            <div
              key={step}
              className="min-h-[360px] reveal"
            >
              {step === 0 && (
                <PackageStep selected={selectedPackage} onSelect={handlePackageSelect} />
              )}
              {step === 1 && selectedPackage && (
                <TimeSlotStep
                  packageId={selectedPackage}
                  selected={selectedSlot}
                  onSelect={setSelectedSlot}
                />
              )}
              {step === 2 && (
                <AddOnsStep selected={selectedAddOns} onToggle={handleAddOnToggle} />
              )}
              {step === 3 && (
                <DetailsStep details={details} onChange={setDetails} />
              )}
              {step === 4 && selectedPackage && selectedSlot && (
                <ConfirmStep
                  packageId={selectedPackage}
                  timeSlotId={selectedSlot}
                  selectedAddOns={selectedAddOns}
                  details={details}
                />
              )}
            </div>

            {/* Sidebar summary */}
            <div className="hidden lg:block">
              <div className="sticky top-24">
                <BookingSummary
                  packageId={selectedPackage}
                  timeSlotId={selectedSlot}
                  selectedAddOns={selectedAddOns}
                  step={step}
                />
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 lg:pr-[calc(280px+1.5rem)]">
            {step > 0 ? (
              <button
                type="button"
                onClick={back}
                className="flex items-center gap-2 px-5 py-2.5 text-sm font-display uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors active:scale-[0.97]"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
            ) : (
              <div />
            )}
            <button
              type="button"
              onClick={next}
              disabled={!canProceed()}
              className={`flex items-center gap-2 px-7 py-3 text-sm font-display font-semibold uppercase tracking-wider rounded-lg transition-all duration-300 active:scale-[0.97] ${
                canProceed()
                  ? "bg-primary text-primary-foreground box-glow hover:box-glow-strong"
                  : "bg-muted text-muted-foreground cursor-not-allowed"
              }`}
            >
              {step === 4 ? (
                <>
                  <Send className="w-4 h-4" />
                  Submit Request
                </>
              ) : (
                <>
                  Continue
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BookingSection;
