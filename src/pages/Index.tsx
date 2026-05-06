import Navbar from "@/components/Navbar";
import VacationBanner from "@/components/VacationBanner";
import HeroSection from "@/components/HeroSection";
import PackagesSection from "@/components/PackagesSection";
import AddOnsSection from "@/components/AddOnsSection";
import WhyChooseSection from "@/components/WhyChooseSection";
import GallerySection from "@/components/GallerySection";
import TestimonialsSection from "@/components/TestimonialsSection";
import BookingSection from "@/components/BookingSection";
import PaymentMethodsSection from "@/components/PaymentMethodsSection";
import FooterSection from "@/components/FooterSection";

const Index = () => {
  return (
    <main className="overflow-x-hidden">
      <VacationBanner />
      <Navbar />
      <HeroSection />
      <PackagesSection />
      <div id="addons"><AddOnsSection /></div>
      <div id="why"><WhyChooseSection /></div>
      <div id="gallery"><GallerySection /></div>
      <div id="reviews"><TestimonialsSection /></div>
      <BookingSection />
      <PaymentMethodsSection />
      <FooterSection />
    </main>
  );
};

export default Index;
