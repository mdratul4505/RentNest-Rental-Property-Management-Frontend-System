/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { MapPin, Filter, BedDouble, Bath, Square, Loader2, RefreshCw } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { getProperties, getCategories } from "@/service/properties";
import { getPropertyImage } from "@/components/home/FeaturedProperties";

import PropertyCard from "@/components/shared/PropertyCard";

export default function PropertiesPage() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get("search") || "";

  const [properties, setProperties] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [priceRange, setPriceRange] = useState("any");
  const [isPending, startTransition] = useTransition();
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  // Fetch initial data
  useEffect(() => {
    async function loadData() {
      try {
        const catRes = await getCategories();
        if (catRes.success) {
          setCategories(catRes.data || []);
        }

        const propRes = await getProperties({ searchTerm: initialSearch });
        if (propRes.success) {
          setProperties(propRes.data || []);
        }
      } catch (err) {
        console.error("Failed to load browse properties data", err);
      } finally {
        setIsInitialLoading(false);
      }
    }
    loadData();
  }, [initialSearch]);

  const handleApplyFilters = () => {
    startTransition(async () => {
      let minPrice = "";
      let maxPrice = "";

      if (priceRange === "under10000") {
        maxPrice = "10000";
      } else if (priceRange === "10000to20000") {
        minPrice = "10000";
        maxPrice = "20000";
      } else if (priceRange === "over20000") {
        minPrice = "20000";
      }

      const params: any = {
        searchTerm,
        categoryId: selectedCategory,
        minPrice,
        maxPrice,
      };

      const res = await getProperties(params);
      if (res.success) {
        setProperties(res.data || []);
      }
    });
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setPriceRange("any");
    startTransition(async () => {
      const res = await getProperties({});
      if (res.success) {
        setProperties(res.data || []);
      }
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative min-h-[600px]">
      <div className="flex flex-col lg:flex-row gap-10">
        
        {/* Sidebar Filters */}
        <div className="w-full lg:w-72 shrink-0 animate-fade-in-up">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800/80 shadow-[0_8px_30px_rgb(0,0,0,0.02)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.2)] sticky top-24 transition-colors">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-black text-slate-800 dark:text-slate-150 flex items-center gap-2">
                <Filter className="w-5 h-5 text-primary" /> Filters
              </h3>
              <button
                onClick={handleResetFilters}
                className="text-xs font-bold text-slate-400 hover:text-primary transition-colors flex items-center gap-1 focus:outline-none cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" /> Reset
              </button>
            </div>

            <div className="space-y-5">
              {/* Keyword search */}
              <div>
                <label className="text-xs font-bold text-slate-550 dark:text-slate-400 uppercase tracking-wider block mb-2 ml-1">
                  Location / Keyword
                </label>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="e.g. Dhaka, Apartment..."
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-205 dark:border-slate-700 focus:border-primary/55 rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:bg-white dark:focus:bg-slate-900 transition-all text-sm font-semibold"
                />
              </div>

              {/* Price range */}
              <div>
                <label className="text-xs font-bold text-slate-555 dark:text-slate-400 uppercase tracking-wider block mb-2 ml-1">
                  Monthly Rent
                </label>
                <select
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-205 dark:border-slate-700 focus:border-primary/55 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:bg-white dark:focus:bg-slate-900 transition-all text-sm font-bold cursor-pointer"
                >
                  <option value="any">Any Price</option>
                  <option value="under10000">Under ৳10,000</option>
                  <option value="10000to20000">৳10,000 - ৳20,000</option>
                  <option value="over20000">Over ৳20,000</option>
                </select>
              </div>

              {/* Property types / Category */}
              <div>
                <label className="text-xs font-bold text-slate-555 dark:text-slate-400 uppercase tracking-wider block mb-2 ml-1">
                  Property Type
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-205 dark:border-slate-700 focus:border-primary/55 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:bg-white dark:focus:bg-slate-900 transition-all text-sm font-bold cursor-pointer"
                >
                  <option value="">Any Type</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <Button
                onClick={handleApplyFilters}
                disabled={isPending}
                className="w-full bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-slate-200 text-white dark:text-slate-900 rounded-xl py-6 font-bold transition-all shadow-md mt-2 flex items-center justify-center gap-2 cursor-pointer"
              >
                {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                Apply Filters
              </Button>
            </div>
          </div>
        </div>

        {/* Property Grid */}
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Available Listings</h1>
              <p className="text-slate-500 dark:text-slate-400 font-semibold text-sm mt-1">Explore and secure properties seamlessly</p>
            </div>
            <p className="text-sm font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-900 px-3.5 py-1.5 rounded-full inline-flex self-start sm:self-auto border border-slate-200/20">
              {properties.length} {properties.length === 1 ? "result" : "results"}
            </p>
          </div>

          {isInitialLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="bg-slate-50 dark:bg-slate-900 rounded-3xl h-[450px] animate-pulse border border-slate-100 dark:border-slate-800/80" />
              ))}
            </div>
          ) : properties.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-3xl p-16 text-center shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
              <p className="text-slate-400 dark:text-slate-350 font-bold text-lg mb-2">No Properties Found</p>
              <p className="text-slate-500 dark:text-slate-450 text-sm max-w-xs mx-auto">Try resetting or modifying your filter parameters to see more listings.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {properties.map((property, idx) => (
                <PropertyCard key={property.id} property={property} index={idx} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
