import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import PackagesSection from "@/components/PackagesSection";
import AddOnsSection from "@/components/AddOnsSection";
import WhyChooseSection from "@/components/WhyChooseSection";
import GallerySection from "@/components/GallerySection";
import TestimonialsSection from "@/components/TestimonialsSection";
import BookingSection from "@/components/BookingSection";
import FooterSection from "@/components/FooterSection";

const Index = () => {
  return (
    <main className="overflow-x-hidden">
      <Navbar />
      <HeroSection />
      <PackagesSection />
      <div id="addons"><AddOnsSection /></div>
      <div id="why"><WhyChooseSection /></div>
      <div id="gallery"><GallerySection /></div>
      <div id="reviews"><TestimonialsSection /></div>
      <BookingSection />
      <FooterSection />
    </main>
  );
};

export default Index;
