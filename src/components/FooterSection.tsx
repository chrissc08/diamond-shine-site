import logo from "@/assets/logo-clean.png";
import { Phone, Mail, MapPin } from "lucide-react";

const FooterSection = () => {
  return (
    <footer className="border-t border-border py-16">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Logo & tagline */}
          <div className="flex flex-col gap-4">
            <img src={logo} alt="Diamond Touch Mobile Detailing" className="w-64 md:w-72 rounded-lg" />
            <p className="text-muted-foreground text-sm max-w-xs">
              Orange County, NY's trusted mobile detailing service. We come to you.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-3">
            <h4 className="font-display text-sm tracking-[0.15em] uppercase text-foreground mb-1">Quick Links</h4>
            <a href="#packages" className="text-muted-foreground text-sm hover:text-foreground transition-colors w-fit">Packages</a>
            <a href="#why" className="text-muted-foreground text-sm hover:text-foreground transition-colors w-fit">Why Us</a>
            <a href="#gallery" className="text-muted-foreground text-sm hover:text-foreground transition-colors w-fit">Gallery</a>
            <a href="#reviews" className="text-muted-foreground text-sm hover:text-foreground transition-colors w-fit">Reviews</a>
            <a href="#booking" className="text-muted-foreground text-sm hover:text-foreground transition-colors w-fit">Contact</a>
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-3">
            <h4 className="font-display text-sm tracking-[0.15em] uppercase text-foreground mb-1">Contact</h4>
            <a href="tel:8457200963" className="flex items-center gap-2 text-primary text-sm hover:text-primary/80 transition-colors w-fit">
              <Phone className="w-4 h-4" /> (845) 720-0963
            </a>
            <a href="mailto:diamondtouchdetailers@gmail.com" className="flex items-center gap-2 text-muted-foreground text-sm hover:text-foreground transition-colors w-fit">
              <Mail className="w-4 h-4" /> diamondtouchdetailers@gmail.com
            </a>
            <div className="flex items-start gap-2 text-muted-foreground text-sm">
              <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
              <span>Orange County, NY &<br />Surrounding Areas</span>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-12 pt-8">
          <p className="text-center text-xs text-muted-foreground/60">
            © {new Date().getFullYear()} Diamond Touch Mobile Detailing. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
