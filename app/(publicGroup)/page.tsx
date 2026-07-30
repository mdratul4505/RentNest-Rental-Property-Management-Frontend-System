import HeroSection from "@/components/home/HeroSection";
import FeaturedProperties from "@/components/home/FeaturedProperties";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import HowItWorks from "@/components/home/HowItWorks";
import Stats from "@/components/home/Stats";
import Testimonials from "@/components/home/Testimonials";
import CTA from "@/components/home/CTA";

export const metadata = {
    title: "RentNest | Find & List Rental Properties with Ease",
    description: "Your go-to platform for renting and listing properties easily and securely.",
};

export default function HomePage() {
    return (
        <main className="flex flex-col min-h-screen">
            <HeroSection />
            <FeaturedProperties />
            <WhyChooseUs />
            <HowItWorks />
            <Stats />
            <Testimonials />
            <CTA />
        </main>
    );
}
