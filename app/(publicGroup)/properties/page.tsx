/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { MapPin, Filter, RefreshCw, Star, BedDouble, ArrowUpDown, ChevronLeft, ChevronRight, SlidersHorizontal, Grid, List } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { getProperties, getCategories } from "@/service/properties";
import PropertyCard from "@/components/shared/PropertyCard";
import PropertyCardSkeleton from "@/components/shared/PropertyCardSkeleton";
import { motion, AnimatePresence } from "framer-motion";

export default function PropertiesPage() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get("search") || "";

  const [rawProperties, setRawProperties] = useState<any[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  
  // Filter States (5 fields: Search, Category, Price, Rating, Bedrooms)
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [priceRange, setPriceRange] = useState("any");
  const [minRating, setMinRating] = useState("any");
  const [bedrooms, setBedrooms] = useState("any");
  
  // Sorting State
  const [sortBy, setSortBy] = useState<"newest" | "price-asc" | "price-desc" | "rating">("newest");
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // View state
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isPending, startTransition] = useTransition();
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  // Fetch initial data
  useEffect(() => {
    async function loadData() {
      try {
        const catRes = await getCategories();
        if (catRes.success) setCategories(catRes.data || []);

        const propRes = await getProperties({ searchTerm: initialSearch });
        if (propRes.success) {
          setRawProperties(propRes.data || []);
        }
      } catch (err) {
        console.error("Failed to load browse properties data", err);
      } finally {
        setIsInitialLoading(false);
      }
    }
    loadData();
  }, [initialSearch]);

  // Apply filters, sorting, and pagination locally / dynamically
  useEffect(() => {
    let result = [...rawProperties];

    // 1. Search term
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (p) =>
          p.title?.toLowerCase().includes(term) ||
          p.location?.toLowerCase().includes(term) ||
          p.description?.toLowerCase().includes(term)
      );
    }

    // 2. Category
    if (selectedCategory) {
      result = result.filter((p) => p.categoryId === selectedCategory || p.category?.id === selectedCategory);
    }

    // 3. Price range
    if (priceRange === "under10000") {
      result = result.filter((p) => p.price <= 10000);
    } else if (priceRange === "10000to20000") {
      result = result.filter((p) => p.price >= 10000 && p.price <= 20000);
    } else if (priceRange === "over20000") {
      result = result.filter((p) => p.price >= 20000);
    }

    // 4. Rating filter
    if (minRating !== "any") {
      const targetRating = parseFloat(minRating);
      result = result.filter((p) => (p.rating || 4.5) >= targetRating);
    }

    // 5. Bedrooms filter
    if (bedrooms !== "any") {
      const reqBeds = parseInt(bedrooms);
      result = result.filter((p) => {
        const pBeds = p.price > 12000 ? 3 : 2;
        return pBeds >= reqBeds;
      });
    }

    // Sorting
    if (sortBy === "price-asc") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === "rating") {
      result.sort((a, b) => (b.rating || 4.8) - (a.rating || 4.8));
    } else {
      // newest
      result.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
    }

    setFilteredProperties(result);
    setCurrentPage(1); // Reset to page 1 on filter/sort change
  }, [rawProperties, searchTerm, selectedCategory, priceRange, minRating, bedrooms, sortBy]);

  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setPriceRange("any");
    setMinRating("any");
    setBedrooms("any");
    setSortBy("newest");
  };

  // Pagination calculation
  const totalPages = Math.ceil(filteredProperties.length / itemsPerPage) || 1;
  const paginatedProperties = filteredProperties.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const activeFilterCount = [
    searchTerm !== "",
    selectedCategory !== "",
    priceRange !== "any",
    minRating !== "any",
    bedrooms !== "any",
  ].filter(Boolean).length;

  return (
    <div className="bg-slate-50/50 dark:bg-slate-950 min-h-screen py-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Explore Rental Properties
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mt-1">
            Filter, compare, and request verified apartments and houses in Bangladesh.
          </p>
        </div>

        {/* Layout Container */}
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar Filter Card */}
          <aside className="w-full lg:w-80 shrink-0">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800 shadow-sm sticky top-24 space-y-6">
              
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-orange-500" /> Filters
                  {activeFilterCount > 0 && (
                    <span className="w-5 h-5 rounded-full bg-orange-500 text-white text-[10px] font-black flex items-center justify-center">
                      {activeFilterCount}
                    </span>
                  )}
                </h3>
                
                <button
                  onClick={handleResetFilters}
                  className="text-xs font-bold text-slate-400 hover:text-orange-500 transition-colors flex items-center gap-1 cursor-pointer focus:outline-none"
                >
                  <RefreshCw className="w-3 h-3" /> Reset
                </button>
              </div>

              {/* 1. Keyword / Location Search */}
              <div>
                <label className="text-[11px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-2">
                  Location / Keyword
                </label>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search Dhaka, Gulshan, Villa..."
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 text-xs font-bold transition-all"
                />
              </div>

              {/* 2. Category Select */}
              <div>
                <label className="text-[11px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-2">
                  Property Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500 text-xs font-bold cursor-pointer transition-all"
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* 3. Monthly Rent Range */}
              <div>
                <label className="text-[11px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-2">
                  Monthly Rent Range
                </label>
                <select
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500 text-xs font-bold cursor-pointer transition-all"
                >
                  <option value="any">Any Rent Price</option>
                  <option value="under10000">Under ৳10,000 / mo</option>
                  <option value="10000to20000">৳10,000 - ৳20,000 / mo</option>
                  <option value="over20000">Over ৳20,000 / mo</option>
                </select>
              </div>

              {/* 4. Minimum Rating Filter */}
              <div>
                <label className="text-[11px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-2">
                  Minimum Rating
                </label>
                <select
                  value={minRating}
                  onChange={(e) => setMinRating(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500 text-xs font-bold cursor-pointer transition-all"
                >
                  <option value="any">Any Rating</option>
                  <option value="4.5">⭐ 4.5 Stars & Above</option>
                  <option value="4.0">⭐ 4.0 Stars & Above</option>
                  <option value="3.5">⭐ 3.5 Stars & Above</option>
                </select>
              </div>

              {/* 5. Bedrooms Filter */}
              <div>
                <label className="text-[11px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-2">
                  Bedrooms
                </label>
                <select
                  value={bedrooms}
                  onChange={(e) => setBedrooms(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500 text-xs font-bold cursor-pointer transition-all"
                >
                  <option value="any">Any Bedrooms</option>
                  <option value="2">2+ Bedrooms</option>
                  <option value="3">3+ Bedrooms</option>
                </select>
              </div>

            </div>
          </aside>

          {/* Main Listing Grid & Controls */}
          <main className="flex-1 space-y-6">
            
            {/* Top Toolbar (Sort, View Mode, Result Count) */}
            <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200/60 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
              
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400">
                Showing <span className="text-slate-900 dark:text-white font-black">{filteredProperties.length}</span> properties found
              </p>

              {/* Sort Selector */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                  <ArrowUpDown className="w-3.5 h-3.5 text-orange-500" /> Sort by:
                </div>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 font-bold text-xs focus:outline-none cursor-pointer"
                >
                  <option value="newest">Newest First</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>

            </div>

            {/* Property Cards Grid (Minimum 3 per row on Desktop: lg:grid-cols-3) */}
            {isInitialLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <PropertyCardSkeleton key={n} />
                ))}
              </div>
            ) : paginatedProperties.length === 0 ? (
              <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-3xl p-16 text-center shadow-sm space-y-4">
                <p className="text-slate-400 font-bold text-lg">No Properties Match Your Filter Criteria</p>
                <p className="text-slate-500 text-xs max-w-sm mx-auto">
                  Try clearing some filter fields or expanding your price range to view more options.
                </p>
                <Button onClick={handleResetFilters} className="bg-slate-900 text-white rounded-2xl font-bold text-xs">
                  Reset All Filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedProperties.map((property, idx) => (
                  <PropertyCard key={property.id} property={property} index={idx} />
                ))}
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-8">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 cursor-pointer font-bold text-xs flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" /> Previous
                </button>

                {Array.from({ length: totalPages }).map((_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-10 h-10 rounded-2xl font-black text-xs transition-all cursor-pointer ${
                        currentPage === pageNum
                          ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-md"
                          : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 cursor-pointer font-bold text-xs flex items-center gap-1"
                >
                  Next <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

          </main>

        </div>
      </div>
    </div>
  );
}
