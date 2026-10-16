"use client";

import { MapPin, BedDouble, Bath, Square, ArrowRight, Heart, Star, Calendar } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { getPropertyImage } from "@/components/home/FeaturedProperties";
import { useState } from "react";
import { toast } from "sonner";

interface PropertyCardProps {
  property: {
    id: string;
    title: string;
    description: string;
    location: string;
    price: number;
    createdAt?: string;
    rating?: number;
    category?: {
      name: string;
    };
  };
  index: number;
}

export default function PropertyCard({ property, index }: PropertyCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const imageUrl = getPropertyImage(property.id);
  
  const bedrooms = property.price > 12000 ? 3 : 2;
  const bathrooms = property.price > 15000 ? 2 : 1;
  const sqft = bedrooms * 500 + 200;
  const rating = property.rating || (4.5 + (parseInt(property.id.slice(-1) || "2", 16) % 5) * 0.1).toFixed(1);
  const dateAdded = property.createdAt 
    ? new Date(property.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })
    : "Recently Added";

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLiked(!isLiked);
    if (!isLiked) {
      toast.success("Saved to wishlist!", { description: property.title });
    } else {
      toast.info("Removed from wishlist");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: (index % 3) * 0.1, ease: "easeOut" }}
      whileHover={{ y: -8 }}
      className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.03)] dark:shadow-[0_4px_25px_rgba(0,0,0,0.3)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.09)] dark:hover:shadow-[0_20px_45px_rgba(0,0,0,0.45)] transition-all duration-300 group border border-slate-100 dark:border-slate-800 flex flex-col h-full relative"
    >
      {/* Property Image & Badges */}
      <div className="relative h-64 overflow-hidden bg-slate-100 dark:bg-slate-800">
        <Image
          src={imageUrl}
          alt={property.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        
        {/* Top Badges Overlay */}
        <div className="absolute top-4 inset-x-4 flex items-center justify-between pointer-events-none">
          {property.category ? (
            <span className="pointer-events-auto bg-slate-900/80 dark:bg-slate-800/90 backdrop-blur-md text-white text-[10px] uppercase font-black tracking-wider px-3.5 py-1.5 rounded-full shadow-md">
              {property.category.name}
            </span>
          ) : (
            <span className="pointer-events-auto bg-slate-900/80 backdrop-blur-md text-white text-[10px] uppercase font-black tracking-wider px-3.5 py-1.5 rounded-full shadow-md">
              Featured
            </span>
          )}

          <motion.button
            whileTap={{ scale: 0.8 }}
            whileHover={{ scale: 1.1 }}
            onClick={toggleWishlist}
            className="pointer-events-auto w-9 h-9 rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md flex items-center justify-center text-slate-700 dark:text-slate-200 shadow-md border border-white/40 cursor-pointer focus:outline-none transition-colors"
          >
            <Heart className={`w-4.5 h-4.5 transition-colors ${isLiked ? "fill-red-500 text-red-500" : "hover:text-red-500"}`} />
          </motion.button>
        </div>

        {/* Price Floating Tag */}
        <div className="absolute bottom-4 left-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-3.5 py-1.5 rounded-2xl text-sm font-black text-slate-900 dark:text-white shadow-lg border border-white/50 dark:border-slate-800">
          ৳{property.price.toLocaleString()}
          <span className="text-slate-500 dark:text-slate-400 font-semibold text-xs">/mo</span>
        </div>

        {/* Rating Floating Badge */}
        <div className="absolute bottom-4 right-4 bg-amber-500/90 backdrop-blur-md px-2.5 py-1 rounded-xl text-xs font-bold text-white shadow-md flex items-center gap-1">
          <Star className="w-3.5 h-3.5 fill-white text-white" />
          <span>{rating}</span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 dark:text-slate-500">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" /> {dateAdded}
            </span>
            <span className="text-emerald-500 font-extrabold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" /> Verified
            </span>
          </div>

          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 line-clamp-1 group-hover:text-primary transition-colors">
              {property.title}
            </h3>
            <div className="flex items-center text-slate-500 dark:text-slate-400 text-xs font-semibold mt-1">
              <MapPin className="w-3.5 h-3.5 mr-1 text-orange-500 shrink-0" />
              {property.location}
            </div>
          </div>

          <p className="text-slate-500 dark:text-slate-400 text-xs line-clamp-2 font-medium leading-relaxed">
            {property.description}
          </p>
        </div>

        {/* Specs & CTA */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-bold py-3 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-1.5">
              <BedDouble className="w-4 h-4 text-primary" /> {bedrooms} Beds
            </div>
            <div className="flex items-center gap-1.5">
              <Bath className="w-4 h-4 text-primary" /> {bathrooms} Baths
            </div>
            <div className="flex items-center gap-1.5">
              <Square className="w-4 h-4 text-primary" /> {sqft} sqft
            </div>
          </div>

          <Link href={`/properties/${property.id}`} className="block w-full">
            <Button className="w-full bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-slate-200 text-white dark:text-slate-900 rounded-2xl py-5.5 transition-all duration-300 font-bold cursor-pointer text-xs shadow-md flex items-center justify-center gap-2 group-hover:gap-3">
              View Details <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
