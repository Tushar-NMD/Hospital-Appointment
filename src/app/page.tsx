import HeroCarousel from "@/components/home/HeroCarousel";
import Features from "@/components/home/Features";
import Testimonials from "@/components/home/Testimonials";
import FAQ from "@/components/home/FAQ";
import CTA from "@/components/home/CTA";
import Footer from "@/components/layout/Footer";

export default function HomePage() {
  return (
    <>
      <HeroCarousel />
      <Features />
      <Testimonials />
      <FAQ />
      <CTA />
      <Footer />
    </>
  );
}
