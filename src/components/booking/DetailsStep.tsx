import { useState } from "react";

export interface BookingDetails {
  name: string;
  phone: string;
  email: string;
  address: string;
  vehicleType: string;
  notes: string;
}

interface DetailsStepProps {
  details: BookingDetails;
  onChange: (details: BookingDetails) => void;
}

const inputClass =
  "w-full px-4 py-3.5 rounded-lg bg-card border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/30 transition-all duration-200";

const DetailsStep = ({ details, onChange }: DetailsStepProps) => {
  const update = (field: keyof BookingDetails, value: string) => {
    onChange({ ...details, [field]: value });
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-2">
        <h3 className="font-display text-xl md:text-2xl font-bold tracking-tight mb-2">
          Your Information
        </h3>
        <p className="text-muted-foreground text-sm">
          We'll reach out to confirm your appointment
        </p>
      </div>

      <div className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <input
            required
            type="text"
            placeholder="Full Name"
            value={details.name}
            onChange={(e) => update("name", e.target.value)}
            className={inputClass}
          />
          <input
            required
            type="tel"
            placeholder="Phone Number"
            value={details.phone}
            onChange={(e) => update("phone", e.target.value)}
            className={inputClass}
          />
        </div>

        <input
          type="email"
          placeholder="Email Address"
          value={details.email}
          onChange={(e) => update("email", e.target.value)}
          className={inputClass}
        />

        <input
          required
          type="text"
          placeholder="Service Address"
          value={details.address}
          onChange={(e) => update("address", e.target.value)}
          className={inputClass}
        />

        <select
          required
          value={details.vehicleType}
          onChange={(e) => update("vehicleType", e.target.value)}
          className={`${inputClass} appearance-none`}
        >
          <option value="" disabled>Vehicle Type</option>
          <option>Sedan</option>
          <option>SUV</option>
          <option>Truck</option>
          <option>Van</option>
          <option>Coupe</option>
        </select>

        <textarea
          rows={3}
          placeholder="Additional notes (optional)"
          value={details.notes}
          onChange={(e) => update("notes", e.target.value)}
          className={`${inputClass} resize-none`}
        />
      </div>
    </div>
  );
};

export default DetailsStep;
