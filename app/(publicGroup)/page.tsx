import HeroSection from "@/components/home/HeroSection";
import CategoriesSection from "@/components/home/CategoriesSection";
import FeaturedProperties from "@/components/home/FeaturedProperties";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import HowItWorks from "@/components/home/HowItWorks";
import Stats from "@/components/home/Stats";
import Testimonials from "@/components/home/Testimonials";
import BlogSection from "@/components/home/BlogSection";
import FAQSection from "@/components/home/FAQSection";
import CTA from "@/components/home/CTA";

export const metadata = {
  title: "RentNest | Premier Rental & Property Management Platform in Bangladesh",
  description: "Discover luxury apartments, family homes, and commercial rentals. Connect directly with verified landlords effortlessly.",
};

export default function HomePage() {
  return (
    <main className="flex flex-col min-h-screen bg-white dark:bg-slate-950 transition-colors">
      {/* 1. Hero Section (Slider, Tabs, CTA, Scroll Flow) */}
      <HeroSection />

      {/* 2. Categories Grid */}
      <CategoriesSection />

      {/* 3. Featured Core Listings (Min 3 Desktop per row) */}
      <FeaturedProperties />

      {/* 4. Why Choose RentNest */}
      <WhyChooseUs />

      {/* 5. How It Works */}
      <HowItWorks />

      {/* 6. Live Platform Statistics */}
      <Stats />

      {/* 7. Testimonials & Reviews */}
      <Testimonials />

      {/* 8. Housing Insights & Blog */}
      <BlogSection />

      {/* 9. Interactive FAQ Accordion */}
      <FAQSection />

      {/* 10. Call To Action & Newsletter */}
      <CTA />
    </main>
  );
}
