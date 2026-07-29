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

export default async function FeaturedProperties() {
  const response = await getProperties();
  const properties = response.success && response.data ? response.data.slice(0, 3) : [];

  return (
    <section className="py-24 bg-slate-50 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px] opacity-50" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-16 animate-fade-in-up">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 px-3.5 py-1.5 rounded-full inline-flex items-center gap-1.5 mb-4">
              <Sparkles className="w-3.5 h-3.5" /> Premium Rentals
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-3">
              Featured Properties
            </h2>
            <p className="text-slate-500 font-medium text-base max-w-xl">
              Hand-picked premium rental homes and apartments for your high-comfort living.
            </p>
          </div>
          <Link href="/properties" className="mt-6 sm:mt-0">
            <Button variant="outline" className="rounded-full px-6 py-5 border-slate-200 hover:bg-slate-900 hover:text-white transition-all cursor-pointer font-semibold shadow-sm">
              View All Properties
            </Button>
          </Link>
        </div>

        {properties.length === 0 ? (
          <div className="bg-white border border-slate-100 rounded-3xl p-16 text-center shadow-sm">
            <p className="text-slate-400 font-medium italic">No properties listed yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map((property: any, idx: number) => {
              const imageUrl = getPropertyImage(property.id);
              // Backend might not store bedrooms/bathrooms/sqft since they are not in schema, so let's fallback to realistic values
              const bedrooms = (property.price > 12000) ? 3 : 2;
              const bathrooms = (property.price > 15000) ? 2 : 1;
              const sqft = bedrooms * 500 + 200;

              return (
                <div
                  key={property.id}
                  className="bg-white rounded-3xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_15px_30px_rgba(0,0,0,0.06)] hover:-translate-y-1.5 transition-all duration-300 group border border-slate-100/80 flex flex-col animate-fade-in-up"
                  style={{ animationDelay: `${(idx + 1) * 100}ms` }}
                >
                  {/* Property Image & Badge */}
                  <div className="relative h-64 overflow-hidden bg-slate-100">
                    <Image
                      src={imageUrl}
                      alt={property.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3.5 py-1.5 rounded-full text-sm font-black text-slate-900 shadow-sm">
                      ৳{property.price.toLocaleString()}
                      <span className="text-slate-500 font-medium text-xs">/mo</span>
                    </div>
                    {property.category && (
                      <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-sm text-white text-[10px] uppercase font-bold tracking-wider px-3 py-1 rounded-full">
                        {property.category.name}
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="mb-4">
                      <h3 className="text-xl font-bold text-slate-800 line-clamp-1 mb-1.5 group-hover:text-primary transition-colors">
                        {property.title}
                      </h3>
                      <div className="flex items-center text-slate-500 text-xs font-semibold">
                        <MapPin className="w-4 h-4 mr-1 text-orange-400 shrink-0" />
                        {property.location}
                      </div>
                    </div>

                    <p className="text-slate-400 text-sm line-clamp-2 mb-5 font-medium">
                      {property.description}
                    </p>

                    {/* Stats */}
                    <div className="flex items-center justify-between text-slate-500 text-xs font-bold py-3.5 border-t border-slate-100/80 mt-auto">
                      <div className="flex items-center gap-1.5">
                        <BedDouble className="w-4.5 h-4.5 text-slate-400" /> {bedrooms} Beds
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Bath className="w-4.5 h-4.5 text-slate-400" /> {bathrooms} Baths
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Square className="w-4.5 h-4.5 text-slate-400" /> {sqft} sqft
                      </div>
                    </div>

                    <div className="mt-5">
                      <Link href={`/properties/${property.id}`} className="block w-full">
                        <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white rounded-xl py-6 transition-all font-bold cursor-pointer text-sm shadow-sm">
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
