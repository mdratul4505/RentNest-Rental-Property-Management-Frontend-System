"use client";

import { use, useEffect, useState, useTransition } from "react";
import {
  MapPin,
  BedDouble,
  Bath,
  Square,
  CheckCircle2,
  Phone,
  Mail,
  Calendar,
  Loader2,
  Star,
  MessageSquare,
  ArrowLeft,
  Share2,
  Heart,
  ShieldCheck,
} from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { getPropertyById, createRentalRequest, getProperties } from "@/service/properties";
import { getMe } from "@/service/getMe";
import { getPropertyImage } from "@/components/home/FeaturedProperties";
import PropertyCard from "@/components/shared/PropertyCard";
import { motion, AnimatePresence } from "framer-motion";
import { isInWishlist, toggleWishlistItem } from "@/utils/wishlist";

export default function PropertyDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const id = unwrappedParams.id;
  const router = useRouter();

  const [property, setProperty] = useState<any>(null);
  const [relatedProperties, setRelatedProperties] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [isLiked, setIsLiked] = useState(false);

  // Booking Form State
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [moveInDate, setMoveInDate] = useState("");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    async function loadDetails() {
      try {
        const detailsRes = await getPropertyById(id);
        if (detailsRes.success && detailsRes.data) {
          const propData = detailsRes.data;
          setProperty(propData);
          
          const mainImg = getPropertyImage(propData.id);
          setSelectedImage(mainImg);

          // Fetch related properties
          const allPropsRes = await getProperties({});
          if (allPropsRes.success && allPropsRes.data) {
            setRelatedProperties(allPropsRes.data.filter((p: any) => p.id !== id).slice(0, 3));
          }
        } else {
          toast.error(detailsRes.message || "Could not retrieve property details");
        }

        const userRes = await getMe();
        if (userRes.success) {
          setCurrentUser(userRes.data?.user);
        }
      } catch (err) {
        console.error("Error loading details page", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadDetails();
  }, [id]);

  useEffect(() => {
    if (property?.id) {
      setIsLiked(isInWishlist(property.id));
    }
    const handleSync = () => {
      if (property?.id) {
        setIsLiked(isInWishlist(property.id));
      }
    };
    window.addEventListener("wishlistUpdated", handleSync);
    return () => window.removeEventListener("wishlistUpdated", handleSync);
  }, [property?.id]);

  const handleToggleWishlist = () => {
    if (!property) return;
    const liked = toggleWishlistItem({
      id: property.id,
      title: property.title,
      description: property.description,
      location: property.location,
      price: property.price,
      category: property.category,
      amenities: property.amenities,
      rating: property.rating,
    });
    setIsLiked(liked);
    if (liked) {
      toast.success("Saved to wishlist!", { description: property.title });
    } else {
      toast.info("Removed from wishlist", { description: property.title });
    }
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUser) {
      toast.error("Please login to submit a rental request.", {
        description: "Redirecting to sign-in page...",
      });
      setTimeout(() => router.push(`/auth/login?redirect=/properties/${id}`), 1500);
      return;
    }

    if (currentUser.role !== "TENANT") {
      toast.error("Booking restricted", {
        description: "Only tenants can submit rental requests.",
      });
      return;
    }

    if (!moveInDate) {
      toast.error("Move-in Date required", {
        description: "Please select a valid move-in date.",
      });
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDate = new Date(moveInDate);
    if (selectedDate < today) {
      toast.error("Invalid Move-In Date", {
        description: "Move-in date cannot be in the past.",
      });
      return;
    }

    startTransition(async () => {
      const res = await createRentalRequest({
        propertyId: id,
        moveInDate: new Date(moveInDate).toISOString(),
      });

      if (res.success) {
        toast.success("Rental Request Submitted successfully!", {
          description: "The landlord will review your request shortly.",
        });
        setIsBookModalOpen(false);
        setMoveInDate("");
        router.push("/dashboard/tenant");
      } else {
        toast.error(res.message || "Failed to submit request.");
      }
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: property?.title || "RentNest Property",
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 transition-colors">
        <Loader2 className="w-10 h-10 animate-spin text-orange-500 mb-4" />
        <p className="text-slate-500 font-bold text-sm">Loading property details...</p>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-slate-50 dark:bg-slate-950 transition-colors p-4">
        <div className="text-center space-y-4 p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm max-w-sm">
          <p className="text-red-500 font-black text-lg">Property Not Found</p>
          <p className="text-slate-500 text-xs font-medium">The listing you requested does not exist or has been unlisted.</p>
          <Button onClick={() => router.push("/properties")} className="bg-slate-900 text-white font-bold rounded-2xl w-full">
            Browse All Listings
          </Button>
        </div>
      </div>
    );
  }

  const galleryImages = [
    getPropertyImage(property.id),
    getPropertyImage(property.id + "1"),
    getPropertyImage(property.id + "2"),
    getPropertyImage(property.id + "3"),
  ];

  const bedrooms = property.price > 12000 ? 3 : 2;
  const bathrooms = property.price > 15000 ? 2 : 1;
  const sqft = bedrooms * 500 + 200;
  const rating = property.rating || 4.8;

  return (
    <div className="bg-slate-50/50 dark:bg-slate-950 min-h-screen py-10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Navigation & Action Bar */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="text-xs font-extrabold text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer bg-white dark:bg-slate-900 px-4 py-2 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Search
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleWishlist}
              className={`p-2.5 rounded-2xl border transition-colors cursor-pointer shadow-sm ${
                isLiked
                  ? "bg-rose-50 border-rose-200 text-rose-500 dark:bg-rose-950/30 dark:border-rose-900"
                  : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
              title={isLiked ? "Remove from wishlist" : "Save to wishlist"}
            >
              <Heart className={`w-4.5 h-4.5 ${isLiked ? "fill-rose-500 text-rose-500" : ""}`} />
            </button>
            <button
              onClick={handleShare}
              className="p-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 cursor-pointer shadow-sm"
            >
              <Share2 className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>

        {/* Section 1: Title Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            {property.category && (
              <span className="text-[10px] font-black uppercase tracking-wider text-orange-500 bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/20">
                {property.category.name}
              </span>
            )}
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> Verified Listing
            </span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
                {property.title}
              </h1>
              <div className="flex items-center text-slate-500 dark:text-slate-400 font-semibold text-xs sm:text-sm mt-2">
                <MapPin className="w-4 h-4 mr-1 text-orange-500 shrink-0" />
                {property.location}
              </div>
            </div>

            <div className="text-left md:text-right shrink-0">
              <div className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                ৳{property.price.toLocaleString()}
                <span className="text-sm font-semibold text-slate-500">/mo</span>
              </div>
              <div className="text-xs font-bold text-amber-500 flex items-center gap-1 md:justify-end mt-1">
                <Star className="w-4 h-4 fill-amber-500" />
                <span>{rating} (12 Reviews)</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Section 2: Interactive Media / Gallery */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="space-y-4">
          <div className="relative h-[380px] sm:h-[480px] w-full rounded-3xl overflow-hidden shadow-lg border border-slate-200/60 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 group">
            <Image
              src={selectedImage || galleryImages[0]}
              alt={property.title}
              fill
              priority
              className="object-cover transition-transform duration-500 group-hover:scale-102"
            />
          </div>

          {/* Thumbnails grid */}
          <div className="grid grid-cols-4 gap-3 sm:gap-4">
            {galleryImages.map((imgUrl, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImage(imgUrl)}
                className={`relative h-20 sm:h-28 rounded-2xl overflow-hidden border-2 transition-all cursor-pointer ${
                  selectedImage === imgUrl ? "border-orange-500 scale-102 shadow-md" : "border-transparent opacity-75 hover:opacity-100"
                }`}
              >
                <Image src={imgUrl} alt={`Thumbnail ${idx + 1}`} fill className="object-cover" />
              </button>
            ))}
          </div>
        </motion.div>

        {/* Section 3 & 4 Layout: Specs, Description, Landlord Card */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Details (Col 1 & 2) */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Specs Bar */}
            <div className="grid grid-cols-3 gap-4 p-5 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-3xl shadow-sm">
              <div className="text-center p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl flex flex-col items-center justify-center">
                <BedDouble className="w-5 h-5 text-orange-500 mb-1" />
                <span className="text-slate-900 dark:text-white font-extrabold text-sm">{bedrooms} Bedrooms</span>
              </div>
              <div className="text-center p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl flex flex-col items-center justify-center">
                <Bath className="w-5 h-5 text-orange-500 mb-1" />
                <span className="text-slate-900 dark:text-white font-extrabold text-sm">{bathrooms} Bathrooms</span>
              </div>
              <div className="text-center p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl flex flex-col items-center justify-center">
                <Square className="w-5 h-5 text-orange-500 mb-1" />
                <span className="text-slate-900 dark:text-white font-extrabold text-sm">{sqft} Sq Feet</span>
              </div>
            </div>

            {/* Description Section */}
            <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200/60 dark:border-slate-800 shadow-sm space-y-4">
              <h2 className="text-xl font-black text-slate-900 dark:text-white">Property Description & Overview</h2>
              <p className="text-slate-600 dark:text-slate-300 text-sm font-medium leading-relaxed">
                {property.description}
              </p>
            </div>

            {/* Amenities Section */}
            <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200/60 dark:border-slate-800 shadow-sm space-y-4">
              <h2 className="text-xl font-black text-slate-900 dark:text-white">Key Amenities & Specifications</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {(property.amenities || ["24/7 Security", "High-speed Wi-Fi", "Dedicated Parking", "Backup Generator", "Balcony View", "Modern Elevator"]).map((amenity: string, idx: number) => (
                  <div key={idx} className="flex items-center gap-2 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200/40 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    {amenity}
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews Section */}
            <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200/60 dark:border-slate-800 shadow-sm space-y-6">
              <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-orange-500" /> Tenant Reviews & Ratings
              </h2>

              <div className="space-y-4">
                {[
                  { name: "Rafiqul Islam", date: "Aug 20, 2026", rating: 5, comment: "Spacious layout, very clean environment, and super supportive landlord!" },
                  { name: "Nusrat Jahan", date: "Jul 14, 2026", rating: 4, comment: "Great location near major transport hubs. Highly recommended!" },
                ].map((rev, idx) => (
                  <div key={idx} className="p-5 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200/50 dark:border-slate-700 space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-extrabold text-slate-900 dark:text-white text-sm">{rev.name}</p>
                        <p className="text-[10px] text-slate-400 font-medium">{rev.date}</p>
                      </div>
                      <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-500" /> {rev.rating}.0
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">{rev.comment}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Landlord & Request Booking Action Sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800 shadow-sm sticky top-24 space-y-6">
              
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200/50 dark:border-slate-700 space-y-3">
                <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Listed By Landlord</p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-slate-900 to-orange-500 text-white font-black text-base flex items-center justify-center shadow-md">
                    {property.landlord?.name ? property.landlord.name.charAt(0).toUpperCase() : "L"}
                  </div>
                  <div>
                    <p className="font-black text-slate-900 dark:text-white text-sm">
                      {property.landlord?.name || "Verified Landlord"}
                    </p>
                    <p className="text-[11px] text-emerald-500 font-bold">● Active Property Owner</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-xs font-bold text-slate-600 dark:text-slate-300">
                <div className="flex items-center gap-2 p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200/50">
                  <Mail className="w-4 h-4 text-orange-500 shrink-0" />
                  <span className="truncate">{property.landlord?.email || "landlord@rentnest.com"}</span>
                </div>
                <div className="flex items-center gap-2 p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200/50">
                  <Phone className="w-4 h-4 text-orange-500 shrink-0" />
                  <span>+880 1712-345678</span>
                </div>
              </div>

              <Button
                onClick={() => setIsBookModalOpen(true)}
                className="w-full py-6 bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-slate-200 text-white dark:text-slate-900 font-black text-sm rounded-2xl shadow-lg transition-all cursor-pointer"
              >
                Request to Rent This Property
              </Button>

            </div>
          </aside>

        </div>

        {/* Section 5: Related Items / Similar Properties */}
        {relatedProperties.length > 0 && (
          <div className="pt-12 border-t border-slate-200 dark:border-slate-800 space-y-6">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Related Properties You Might Like
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedProperties.map((prop, idx) => (
                <PropertyCard key={prop.id} property={prop} index={idx} />
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Booking Form Modal */}
      {isBookModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 max-w-md w-full p-6 shadow-2xl relative space-y-6">
            <button
              onClick={() => setIsBookModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-900 dark:hover:text-white font-bold text-lg cursor-pointer"
            >
              ✕
            </button>

            <div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-orange-500" /> Rental Application
              </h3>
              <p className="text-slate-500 text-xs font-semibold mt-1">Select your move-in date to proceed with your request.</p>
            </div>

            <form onSubmit={handleBookingSubmit} className="space-y-4">
              <div>
                <label className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1">
                  Desired Move-In Date
                </label>
                <input
                  type="date"
                  required
                  value={moveInDate}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => setMoveInDate(e.target.value)}
                  className="w-full px-4 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-slate-100 font-bold text-xs focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <Button
                type="submit"
                disabled={isPending}
                className="w-full py-6 bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 text-white dark:text-slate-900 font-black text-xs rounded-2xl shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                Confirm & Submit Request
              </Button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
