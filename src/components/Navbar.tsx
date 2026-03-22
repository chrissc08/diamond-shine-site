import { useState, useEffect } from "react";
import logo from "@/assets/logo-clean.png";
import { Menu, X } from "lucide-react";

const navLinks = [
  { label: "Packages", href: "#packages" },
  { label: "Add-Ons", href: "#addons" },
  { label: "Why Us", href: "#why" },
  { label: "Gallery", href: "#gallery" },
  { label: "Reviews", href: "#reviews" },
  { label: "Contact", href: "#booking" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-background/95 backdrop-blur-md border-b border-border shadow-lg" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between h-24 md:h-28">
        <a href="#" className="shrink-0">
          <img src={logo} alt="Diamond Touch Mobile Detailing" className="h-28 md:h-36 w-auto drop-shadow-[0_0_20px_rgba(30,144,255,0.25)]" style={{ mixBlendMode: 'lighten' }} />
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="font-display text-[11px] tracking-[0.15em] uppercase text-silver hover:text-primary transition-colors duration-200"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#booking"
            className="ml-2 px-5 py-2.5 font-display text-[11px] tracking-[0.15em] uppercase bg-primary text-primary-foreground rounded-lg box-glow hover:box-glow-strong transition-shadow duration-300 active:scale-[0.97]"
          >
            Book Now
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-foreground p-2"
          aria-label="Toggle menu"
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-background/98 backdrop-blur-md border-t border-border">
          <div className="container mx-auto px-6 py-6 flex flex-col gap-4">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setOpen(false)}
                className="font-display text-xs tracking-[0.15em] uppercase text-silver hover:text-primary transition-colors py-2"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#booking"
              onClick={() => setOpen(false)}
              className="mt-2 text-center px-5 py-3 font-display text-xs tracking-[0.15em] uppercase bg-primary text-primary-foreground rounded-lg box-glow active:scale-[0.97]"
            >
              Book Now
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
