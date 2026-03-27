import { useState, useRef } from "react";
import { ImagePlus, X } from "lucide-react";

export interface BookingDetails {
  name: string;
  phone: string;
  email: string;
  address: string;
  vehicleType: string;
  notes: string;
  images: File[];
}

interface DetailsStepProps {
  details: BookingDetails;
  onChange: (details: BookingDetails) => void;
}

const inputClass =
  "w-full px-4 py-3.5 rounded-lg bg-card border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/30 transition-all duration-200";

const DetailsStep = ({ details, onChange }: DetailsStepProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previews, setPreviews] = useState<string[]>([]);

  const update = (field: keyof BookingDetails, value: string) => {
    onChange({ ...details, [field]: value });
  };

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const newFiles = Array.from(files).slice(0, 5 - details.images.length);
    if (newFiles.length === 0) return;

    const updated = [...details.images, ...newFiles];
    onChange({ ...details, images: updated });

    newFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviews((prev) => [...prev, e.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    const updatedImages = details.images.filter((_, i) => i !== index);
    const updatedPreviews = previews.filter((_, i) => i !== index);
    onChange({ ...details, images: updatedImages });
    setPreviews(updatedPreviews);
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

        {/* Photo Upload */}
        <div className="pt-2">
          <p className="text-sm text-muted-foreground mb-3">
            Upload photos of your vehicle for a more accurate quote
            <span className="text-muted-foreground/60 ml-1">(optional, up to 5)</span>
          </p>

          <div className="flex flex-wrap gap-3">
            {previews.map((src, i) => (
              <div
                key={i}
                className="relative w-20 h-20 rounded-lg overflow-hidden border border-border group"
              >
                <img src={src} alt={`Upload ${i + 1}`} className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute inset-0 bg-background/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                >
                  <X className="w-4 h-4 text-foreground" />
                </button>
              </div>
            ))}

            {details.images.length < 5 && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-20 h-20 rounded-lg border border-dashed border-border hover:border-primary/40 bg-card/50 flex flex-col items-center justify-center gap-1 transition-colors text-muted-foreground hover:text-primary/70"
              >
                <ImagePlus className="w-5 h-5" />
                <span className="text-[10px]">Add</span>
              </button>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
        </div>
      </div>
    </div>
  );
};

export default DetailsStep;
