"use client";

import { Search, MapPin, Home, ArrowDown, Sparkles, Building, Key, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const HERO_SLIDES = [
  {
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=2000",
    tagline: "Discover Premium Homes Across Dhaka & Beyond",
    title: "Find Your Ideal Rental Sanctuary",
  },
  {
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=2000",
    tagline: "Verified Landlords & Instant Requests",
    title: "Modern Apartments & Luxury Villas",
  },
  {
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=2000",
    tagline: "Seamless Property Management Platform",
    title: "Rent Effortlessly With RentNest",
  },
];

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeTab, setActiveTab] = useState<"rent" | "buy" | "short">("rent");
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  // Hero background slider auto-play
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/properties?search=${encodeURIComponent(searchQuery)}`);
    } else {
      router.push("/properties");
    }
  };

  const scrollToNextSection = () => {
    const featuredSection = document.getElementById("featured-properties");
    if (featuredSection) {
      featuredSection.scrollIntoView({ behavior: "smooth" });
    } else {
      window.scrollTo({ top: window.innerHeight * 0.65, behavior: "smooth" });
    }
  };

  return (
    <section className="relative h-[65vh] min-h-[580px] max-h-[700px] w-full flex items-center justify-center overflow-hidden bg-slate-950">
      {/* Background Image Carousel Slider with Motion */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{ backgroundImage: `url('${HERO_SLIDES[currentSlide].image}')` }}
        >
          {/* Overlays for high contrast */}
          <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-[2px]" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-slate-950/60" />
        </motion.div>
      </AnimatePresence>

      {/* Content Layer */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        
        {/* Animated Tagline Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-white text-xs font-bold shadow-lg"
        >
          <Sparkles className="w-3.5 h-3.5 text-orange-400 animate-spin" />
          <span>{HERO_SLIDES[currentSlide].tagline}</span>
        </motion.div>

        {/* Dynamic Animated Main Heading */}
        <motion.h1
          key={`head-${currentSlide}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-tight"
        >
          {HERO_SLIDES[currentSlide].title.split(" ").slice(0, -2).join(" ")}{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-rose-400">
            {HERO_SLIDES[currentSlide].title.split(" ").slice(-2).join(" ")}
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-2xl mx-auto text-sm sm:text-base text-slate-300 font-medium leading-relaxed"
        >
          Explore handpicked apartments, luxury penthouses, & family homes. Connect directly with landlords with zero hassle.
        </motion.p>

        {/* Search Box Container with Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="max-w-3xl mx-auto pt-2"
        >
          {/* Rent / Buy / Short-term selector tabs */}
          <div className="inline-flex items-center p-1 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 mb-3 gap-1">
            {[
              { id: "rent", label: "Long Rent", icon: Building },
              { id: "buy", label: "Buy Property", icon: Key },
              { id: "short", label: "Short Stay", icon: Home },
            ].map((tab) => {
              const Icon = tab.icon;
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isSelected
                      ? "bg-orange-500 text-white shadow-md"
                      : "text-white/80 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Form */}
          <form
            onSubmit={handleSearch}
            className="flex flex-col sm:flex-row gap-2 bg-white/15 backdrop-blur-xl p-2.5 rounded-3xl border border-white/25 shadow-2xl"
          >
            <div className="relative flex-1 group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <MapPin className="h-4.5 w-4.5 text-orange-400" />
              </div>
              <input
                type="text"
                placeholder="Search by neighborhood, city (e.g. Gulshan, Banani, Uttara)..."
                className="block w-full pl-11 pr-4 py-3.5 rounded-2xl border-none outline-none focus:ring-2 focus:ring-orange-400 bg-white/90 text-slate-900 placeholder:text-slate-500 font-bold text-xs sm:text-sm transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <Button
              type="submit"
              size="lg"
              className="py-6 px-7 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-2xl text-xs sm:text-sm font-black transition-all shadow-lg hover:shadow-orange-500/30 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Search className="w-4 h-4" />
              Search Now
            </Button>
          </form>
        </motion.div>

        {/* Carousel Indicators & Highlights */}
        <div className="flex items-center justify-center gap-4 pt-2">
          {HERO_SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-1.5 rounded-full transition-all duration-500 cursor-pointer ${
                currentSlide === idx ? "w-8 bg-orange-400" : "w-2 bg-white/30 hover:bg-white/60"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Visual Flow indicator to next section */}
      <motion.button
        onClick={scrollToNextSection}
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        className="absolute bottom-4 z-10 flex flex-col items-center gap-1 text-white/70 hover:text-white transition-colors cursor-pointer text-[10px] font-extrabold uppercase tracking-widest"
      >
        <span>Explore Listings</span>
        <div className="w-7 h-7 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center">
          <ArrowDown className="w-3.5 h-3.5 text-orange-400" />
        </div>
      </motion.button>
    </section>
  );
}
