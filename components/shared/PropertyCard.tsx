"use client";

import { MapPin, BedDouble, Bath, Square, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { getPropertyImage } from "@/components/home/FeaturedProperties";

interface PropertyCardProps {
  property: {
    id: string;
    title: string;
    description: string;
    location: string;
    price: number;
    category?: {
      name: string;
    };
  };
  index: number;
}

export default function PropertyCard({ property, index }: PropertyCardProps) {
  const imageUrl = getPropertyImage(property.id);
  const bedrooms = property.price > 12000 ? 3 : 2;
  const bathrooms = property.price > 15000 ? 2 : 1;
  const sqft = bedrooms * 500 + 200;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      whileHover={{ y: -8, scale: 1.01 }}
      className="bg-white dark:bg-slate-900/60 rounded-3xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.015)] dark:shadow-[0_4px_25px_rgba(0,0,0,0.3)] hover:shadow-[0_15px_35px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] transition-all duration-300 group border border-slate-100/80 dark:border-slate-800/80 flex flex-col h-full"
    >
      {/* Property Image & Badge */}
      <div className="relative h-64 overflow-hidden bg-slate-100 dark:bg-slate-800">
        <Image
          src={imageUrl}
          alt={property.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        <div className="absolute top-4 right-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-3.5 py-1.5 rounded-full text-sm font-black text-slate-900 dark:text-white shadow-sm border border-slate-100/50 dark:border-slate-800/50">
          ৳{property.price.toLocaleString()}
          <span className="text-slate-500 dark:text-slate-400 font-medium text-xs">/mo</span>
        </div>
        {property.category && (
          <div className="absolute top-4 left-4 bg-slate-900/80 dark:bg-slate-800/90 backdrop-blur-md text-white text-[10px] uppercase font-black tracking-wider px-3.5 py-1.5 rounded-full shadow-sm">
            {property.category.name}
          </div>
        )}
      </div>

      {/* Details */}
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div className="space-y-4">
          <div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 line-clamp-1 mb-1.5 group-hover:text-primary dark:group-hover:text-primary transition-colors">
              {property.title}
            </h3>
            <div className="flex items-center text-slate-500 dark:text-slate-400 text-xs font-semibold">
              <MapPin className="w-4 h-4 mr-1 text-orange-400 dark:text-orange-500 shrink-0" />
              {property.location}
            </div>
          </div>

          <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-2 font-medium leading-relaxed">
            {property.description}
          </p>
        </div>

        <div className="mt-6 space-y-5">
          {/* Specs */}
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-bold py-3.5 border-t border-slate-100 dark:border-slate-800/80">
            <div className="flex items-center gap-1.5">
              <BedDouble className="w-4.5 h-4.5 text-slate-400 dark:text-slate-500" /> {bedrooms} Beds
            </div>
            <div className="flex items-center gap-1.5">
              <Bath className="w-4.5 h-4.5 text-slate-400 dark:text-slate-500" /> {bathrooms} Baths
            </div>
            <div className="flex items-center gap-1.5">
              <Square className="w-4.5 h-4.5 text-slate-400 dark:text-slate-500" /> {sqft} sqft
            </div>
          </div>

          {/* Action Button */}
          <div>
            <Link href={`/properties/${property.id}`} className="block w-full">
              <Button className="w-full bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-slate-200 text-white dark:text-slate-900 rounded-xl py-6 transition-all duration-300 font-bold cursor-pointer text-sm shadow-sm flex items-center justify-center gap-2 group-hover:gap-3">
                View Details <ArrowRight className="w-4 h-4 transition-all" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
