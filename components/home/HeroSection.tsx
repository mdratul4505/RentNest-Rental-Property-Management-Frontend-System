"use client";

import { Search, MapPin, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function HeroSection() {
    const [searchQuery, setSearchQuery] = useState("");
    const router = useRouter();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/properties?search=${encodeURIComponent(searchQuery)}`);
        } else {
            router.push("/properties");
        }
    };

    return (
        <section className="relative h-[650px] w-full flex items-center justify-center overflow-hidden bg-slate-900">
            {/* Background Image with Overlay */}
            <div
                className="absolute inset-0 z-0 bg-cover bg-center"
                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=2000')" }}
            >
                <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px]"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8 mt-16">

                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-white/90 text-sm font-medium"
                >
                    <span className="flex h-2 w-2 rounded-full bg-orange-500"></span>
                    Discover your next perfect home
                </motion.div>

                <motion.h1 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="text-5xl md:text-7xl font-extrabold text-white tracking-tight"
                >
                    Find & List Rental <br className="hidden md:block" />
                    Properties <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-rose-400">with Ease</span>
                </motion.h1>

                <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="max-w-2xl mx-auto text-lg md:text-xl text-slate-300 leading-relaxed"
                >
                    Join RentNest to explore top-tier locations, submit rental requests seamlessly, and manage your properties from one intuitive platform.
                </motion.p>

                {/* Search Bar Container */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="max-w-3xl mx-auto mt-10"
                >
                    <form
                        onSubmit={handleSearch}
                        className="flex flex-col md:flex-row gap-3 bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/20 shadow-2xl"
                    >
                        <div className="relative flex-1 group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <MapPin className="h-5 w-5 text-white/60 group-focus-within:text-orange-400 transition-colors" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search by location, neighborhood, or city..."
                                className="block w-full pl-11 pr-4 py-4 rounded-xl border-none outline-none focus:ring-2 focus:ring-orange-400 bg-white/80 text-slate-800 placeholder:text-slate-500 font-medium transition-all"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        <Button size="lg" className="py-7 px-8 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-lg font-semibold transition-all shadow-lg hover:shadow-orange-500/25">
                            <Search className="w-5 h-5 mr-2" />
                            Search
                        </Button>
                    </form>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="flex items-center justify-center gap-6 pt-6"
                >
                    <div className="flex items-center gap-2 text-white/80 text-sm font-medium">
                        <Home className="w-4 h-4 text-orange-400" />
                        10,000+ Properties
                    </div>
                    <div className="h-4 w-px bg-white/20"></div>
                    <div className="flex items-center gap-2 text-white/80 text-sm font-medium">
                        <span className="font-bold text-orange-400">4.9/5</span> Average Rating
                    </div>
                </motion.div>

            </div>
        </section>
    );
}
    
