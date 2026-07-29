"use client";

import { useEffect, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { MapPin, Filter, BedDouble, Bath, Square, Loader2, RefreshCw } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { getProperties, getCategories } from "@/service/properties";
import { getPropertyImage } from "@/components/home/FeaturedProperties";

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

      if (priceRange === "under1000") {
        maxPrice = "1000";
      } else if (priceRange === "1000to2000") {
        minPrice = "1000";
        maxPrice = "2000";
      } else if (priceRange === "over2000") {
        minPrice = "2000";
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
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] sticky top-24">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
                <Filter className="w-5 h-5 text-primary" /> Filters
              </h3>
              <button
                onClick={handleResetFilters}
                className="text-xs font-bold text-slate-400 hover:text-primary transition-colors flex items-center gap-1 focus:outline-none"
              >
                <RefreshCw className="w-3 h-3" /> Reset
              </button>
            </div>

            <div className="space-y-5">
              {/* Keyword search */}
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2 ml-1">
                  Location / Keyword
                </label>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="e.g. Dhaka, Apartment..."
                  className="w-full px-4 py-3 bg-slate-50 hover:bg-slate-50 border border-slate-200 focus:border-primary/55 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:bg-white transition-all text-sm font-semibold"
                />
              </div>

              {/* Price range */}
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2 ml-1">
                  Monthly Rent
                </label>
                <select
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 hover:bg-slate-50 border border-slate-200 focus:border-primary/55 rounded-xl text-slate-800 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:bg-white transition-all text-sm font-bold"
                >
                  <option value="any">Any Price</option>
                  <option value="under1000">Under ৳1,000</option>
                  <option value="1000to2000">৳1,000 - ৳2,000</option>
                  <option value="over2000">Over ৳2,000</option>
                </select>
              </div>

              {/* Property types / Category */}
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2 ml-1">
                  Property Type
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 hover:bg-slate-50 border border-slate-200 focus:border-primary/55 rounded-xl text-slate-800 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:bg-white transition-all text-sm font-bold"
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
                className="w-full bg-slate-900 hover:bg-slate-800 text-white rounded-xl py-6 font-bold transition-all shadow-md mt-2 flex items-center justify-center gap-2 cursor-pointer"
              >
                {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                Apply Filters
              </Button>
            </div>
          </div>
        </div>

        {/* Property Grid */}
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4 animate-fade-in-up">
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">Available Listings</h1>
              <p className="text-slate-500 font-semibold text-sm mt-1">Explore and secure properties seamlessly</p>
            </div>
            <p className="text-sm font-bold text-slate-500 bg-slate-100 px-3.5 py-1.5 rounded-full inline-flex self-start sm:self-auto">
              {properties.length} {properties.length === 1 ? "result" : "results"}
            </p>
          </div>

          {isInitialLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="bg-slate-50 rounded-3xl h-[450px] animate-pulse border border-slate-100" />
              ))}
            </div>
          ) : properties.length === 0 ? (
            <div className="bg-white border border-slate-100 rounded-3xl p-16 text-center shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
              <p className="text-slate-400 font-bold text-lg mb-2">No Properties Found</p>
              <p className="text-slate-400 text-sm max-w-xs mx-auto">Try resetting or modifying your filter parameters to see more listings.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {properties.map((property, idx) => {
                const imageUrl = getPropertyImage(property.id);
                const bedrooms = (property.price > 12000) ? 3 : 2;
                const bathrooms = (property.price > 15000) ? 2 : 1;
                const sqft = bedrooms * 500 + 200;

                return (
                  <div
                    key={property.id}
                    className="bg-white rounded-3xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.01)] hover:shadow-[0_15px_30px_rgba(0,0,0,0.05)] hover:-translate-y-1 transition-all duration-300 group border border-slate-100/80 flex flex-col animate-fade-in-up"
                    style={{ animationDelay: `${(idx + 1) * 70}ms` }}
                  >
                    <div className="relative h-56 overflow-hidden bg-slate-100">
                      <Image
                        src={imageUrl}
                        alt={property.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                      />
                      <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3.5 py-1.5 rounded-full text-sm font-black text-slate-900 shadow-sm border border-slate-100">
                        ৳{property.price.toLocaleString()}
                        <span className="text-slate-500 font-medium text-xs">/mo</span>
                      </div>
                      {property.category && (
                        <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-sm text-white text-[10px] uppercase font-bold tracking-wider px-3 py-1 rounded-full">
                          {property.category.name}
                        </div>
                      )}
                    </div>

                    <div className="p-6 flex-1 flex flex-col">
                      <div className="mb-4">
                        <h3 className="text-xl font-bold text-slate-800 line-clamp-1 mb-1 group-hover:text-primary transition-colors">
                          {property.title}
                        </h3>
                        <div className="flex items-center text-slate-400 text-xs font-semibold">
                          <MapPin className="w-4 h-4 mr-1 text-orange-400 shrink-0" />
                          {property.location}
                        </div>
                      </div>

                      <p className="text-slate-400 text-sm line-clamp-2 mb-5 font-medium">
                        {property.description}
                      </p>

                      <div className="flex items-center justify-between text-slate-500 text-xs font-bold py-3.5 border-t border-slate-100/80 mt-auto mb-4">
                        <div className="flex items-center gap-1.5">
                          <BedDouble className="w-4 h-4 text-slate-400" /> {bedrooms} Bed
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Bath className="w-4 h-4 text-slate-400" /> {bathrooms} Bath
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Square className="w-4 h-4 text-slate-400" /> {sqft} sqft
                        </div>
                      </div>

                      <Link href={`/properties/${property.id}`} className="block w-full">
                        <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white rounded-xl py-6 transition-all font-bold cursor-pointer text-sm shadow-sm">
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
