import HeroSection from "@/components/home/HeroSection";
import FeaturedProperties from "@/components/home/FeaturedProperties";

export const metadata = {
    title: "RentNest | Find & List Rental Properties with Ease",
    description: "Your go-to platform for renting and listing properties easily and securely.",
};

export default function HomePage() {
    return (
        <main className="flex flex-col min-h-screen">
            <HeroSection />
            <FeaturedProperties />
        </main>
    );
}
