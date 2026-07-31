import { MapPin, BedDouble, Bath, Square, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getProperties } from "@/service/properties";

// Premium placeholder images for property listings (since backend does not store image URLs)
const PROPERTY_IMAGES = [
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1502672260266-1c15293036e9?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=800"
];

export const getPropertyImage = (id: string) => {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % PROPERTY_IMAGES.length;
  return PROPERTY_IMAGES[index];
};

import PropertyCard from "@/components/shared/PropertyCard";

export default async function FeaturedProperties() {
  const response = await getProperties();
  const properties = response.success && response.data ? response.data.slice(0, 3) : [];

  return (
    <section className="py-24 bg-slate-50 dark:bg-slate-950/40 border-y border-slate-100/85 dark:border-slate-900/60 relative overflow-hidden transition-colors duration-300">
      <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] dark:bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px] opacity-40 dark:opacity-15" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-16">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 px-3.5 py-1.5 rounded-full inline-flex items-center gap-1.5 mb-4">
              <Sparkles className="w-3.5 h-3.5" /> Premium Rentals
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight mb-3">
              Featured Properties
            </h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium text-base max-w-xl">
              Hand-picked premium rental homes and apartments for your high-comfort living.
            </p>
          </div>
          <Link href="/properties" className="mt-6 sm:mt-0">
            <Button variant="outline" className="rounded-full px-6 py-5 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-350 hover:bg-slate-900 dark:hover:bg-slate-100 hover:text-white dark:hover:text-slate-900 transition-all cursor-pointer font-semibold shadow-sm">
              View All Properties
            </Button>
          </Link>
        </div>

        {properties.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-3xl p-16 text-center shadow-sm">
            <p className="text-slate-400 dark:text-slate-500 font-medium italic">No properties listed yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map((property: any, idx: number) => (
              <PropertyCard key={property.id} property={property} index={idx} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
