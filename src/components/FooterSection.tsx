import logo from "@/assets/logo-clean.png";
import { Instagram, Facebook, Phone, Mail } from "lucide-react";

const FooterSection = () => {
  return (
    <footer className="border-t border-border py-12">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-8">
          <div className="flex flex-col items-center md:items-start gap-3">
            <img src={logo} alt="Diamond Touch Mobile Detailing" className="w-40 rounded-lg" />
            <p className="text-muted-foreground text-sm">Orange County, NY & Surrounding Areas</p>
          </div>

          <div className="flex flex-col items-center md:items-end gap-3 text-sm text-muted-foreground">
            <div className="flex gap-4">
              <a href="#packages" className="hover:text-primary transition-colors">Packages</a>
              <a href="#booking" className="hover:text-primary transition-colors">Book Now</a>
            </div>
            <div className="flex gap-4">
              <a href="#" aria-label="Instagram" className="hover:text-primary transition-colors"><Instagram className="w-5 h-5" /></a>
              <a href="#" aria-label="Facebook" className="hover:text-primary transition-colors"><Facebook className="w-5 h-5" /></a>
              <a href="tel:" aria-label="Call us" className="hover:text-primary transition-colors"><Phone className="w-5 h-5" /></a>
              <a href="mailto:" aria-label="Email us" className="hover:text-primary transition-colors"><Mail className="w-5 h-5" /></a>
            </div>
            <p className="text-xs text-muted-foreground/60">© {new Date().getFullYear()} Diamond Touch Mobile Detailing. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
