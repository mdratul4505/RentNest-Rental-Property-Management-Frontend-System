"use client";

import { useEffect, useState } from "react";
import PropertyCard from "@/components/shared/PropertyCard";
import PropertyCardSkeleton from "@/components/shared/PropertyCardSkeleton";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { getProperties, getCategories } from "@/service/properties";
import { motion } from "framer-motion";

const DEFAULT_IMAGE_LIST = [
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=1000",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1000",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1000",
  "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&q=80&w=1000",
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=1000",
  "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&q=80&w=1000",
];

export function getPropertyImage(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % DEFAULT_IMAGE_LIST.length;
  return DEFAULT_IMAGE_LIST[index];
}

export default function FeaturedProperties() {
  const [properties, setProperties] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const catRes = await getCategories();
        if (catRes.success) setCategories(catRes.data || []);

        const propRes = await getProperties({});
        if (propRes.success) setProperties(propRes.data || []);
      } catch (err) {
        console.error("Failed to load featured properties", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  // Filter properties by category tab
  const filteredProperties = properties.filter((p) => {
    if (activeCategory === "all") return true;
    return p.categoryId === activeCategory || p.category?.id === activeCategory;
  });

  return (
    <section id="featured-properties" className="py-24 bg-white dark:bg-slate-900 transition-colors relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="space-y-3">
            <span className="text-xs font-black uppercase tracking-widest text-primary bg-primary/10 px-3.5 py-1.5 rounded-full inline-flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-orange-500" /> Exclusive Selections
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
              Featured Rental Properties
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium max-w-lg">
              Explore handpicked top-rated listings in Dhaka and major hubs with verified ownership.
            </p>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveCategory("all")}
              className={`px-4 py-2 rounded-2xl text-xs font-extrabold transition-all cursor-pointer ${
                activeCategory === "all"
                  ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-md"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
              }`}
            >
              All Types
            </button>
            {categories.slice(0, 4).map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-2xl text-xs font-extrabold transition-all cursor-pointer ${
                  activeCategory === cat.id
                    ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-md"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* 3-Column Desktop Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <PropertyCardSkeleton key={n} />
            ))}
          </div>
        ) : filteredProperties.length === 0 ? (
          <div className="bg-slate-50 dark:bg-slate-950 rounded-3xl p-16 text-center border border-slate-200/60 dark:border-slate-800">
            <p className="text-slate-500 dark:text-slate-400 font-bold text-base">No properties found in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProperties.slice(0, 6).map((property, idx) => (
              <PropertyCard key={property.id} property={property} index={idx} />
            ))}
          </div>
        )}

        {/* Bottom CTA to explore all */}
        <div className="mt-16 text-center">
          <Link href="/properties">
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="inline-block">
              <Button className="bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-slate-200 text-white dark:text-slate-900 rounded-full px-8 py-6 text-sm font-black shadow-lg hover:shadow-xl transition-all cursor-pointer inline-flex items-center gap-2">
                Explore All 50+ Listings <ArrowRight className="w-4 h-4" />
              </Button>
            </motion.div>
          </Link>
        </div>
      </div>
    </section>
  );
}
