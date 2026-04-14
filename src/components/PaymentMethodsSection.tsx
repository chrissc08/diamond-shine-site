import { Banknote, Smartphone } from "lucide-react";

const methods = [
  { name: "Cash", icon: "💵" },
  { name: "Check", icon: "🏦" },
  { name: "Zelle", icon: "⚡" },
  { name: "Cash App", icon: "💲" },
  { name: "Venmo", icon: "📱" },
];

const PaymentMethodsSection = () => {
  return (
    <div className="bg-deep-blue/30 pb-16">
      <div className="container mx-auto px-6">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-muted-foreground text-xs font-display uppercase tracking-[0.2em] mb-4">
            Accepted Payment Methods
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            {methods.map((m) => (
              <div
                key={m.name}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary/50 border border-border text-sm text-foreground"
              >
                <span className="text-base">{m.icon}</span>
                <span>{m.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethodsSection;
