"use client";

import { use, useEffect, useState, useTransition } from "react";
import { MapPin, BedDouble, Bath, Square, CheckCircle2, User, Phone, Mail, Calendar, Loader2, Star, MessageSquare } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { getPropertyById, createRentalRequest } from "@/service/properties";
import { getMe } from "@/service/getMe";
import { getPropertyImage } from "@/components/home/FeaturedProperties";

export default function PropertyDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const id = unwrappedParams.id;
  const router = useRouter();

  const [property, setProperty] = useState<any>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Booking Form State
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [moveInDate, setMoveInDate] = useState("");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    async function loadDetails() {
      try {
        const detailsRes = await getPropertyById(id);
        if (detailsRes.success) {
          setProperty(detailsRes.data);
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

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUser) {
      toast.error("Please login to request to rent.", {
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

    // Verify date is not in the past
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center space-y-4">
          <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto" />
          <p className="text-slate-400 font-bold text-sm">Loading property details...</p>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center space-y-4 p-8 bg-white rounded-3xl border border-slate-100 shadow-sm max-w-sm">
          <p className="text-red-500 font-black text-lg">Property Not Found</p>
          <p className="text-slate-500 text-sm">The property you are looking for does not exist or has been removed.</p>
          <Button onClick={() => router.push("/properties")} className="bg-slate-900 text-white font-bold cursor-pointer rounded-xl">
            Back to Properties
          </Button>
        </div>
      </div>
    );
  }

  const mainImage = getPropertyImage(property.id);
  const secondaryImage = getPropertyImage(property.id + "1");
  const tertiaryImage = getPropertyImage(property.id + "2");

  const bedrooms = (property.price > 12000) ? 3 : 2;
  const bathrooms = (property.price > 15000) ? 2 : 1;
  const sqft = bedrooms * 500 + 200;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
      {/* Back button */}
      <div className="mb-6">
        <button
          onClick={() => router.back()}
          className="text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors flex items-center gap-1.5 focus:outline-none cursor-pointer"
        >
          ← Go Back
        </button>
      </div>

      {/* Header Info */}
      <div className="mb-8 animate-fade-in-up">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            {property.category && (
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full inline-block mb-3.5 border border-primary/5">
                {property.category.name}
              </span>
            )}
            <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-2.5">
              {property.title}
            </h1>
            <div className="flex items-center text-slate-500 font-semibold text-sm">
              <MapPin className="w-4.5 h-4.5 mr-1.5 text-orange-400 shrink-0" />
              {property.location}
            </div>
          </div>
          <div className="text-left md:text-right shrink-0">
            <div className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
              ৳{property.price.toLocaleString()}
              <span className="text-lg text-slate-500 font-medium">/mo</span>
            </div>
            <div className="text-xs font-bold text-green-500 mt-1 flex items-center gap-1 md:justify-end">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block animate-pulse" /> Available Now
            </div>
          </div>
        </div>
      </div>

      {/* Images Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-12 animate-fade-in-up" style={{ animationDelay: "100ms" }}>
        <div className="lg:col-span-2 relative h-[350px] md:h-[480px] rounded-3xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-slate-100/80 group">
          <Image
            src={mainImage}
            alt="Main view of property"
            fill
            priority
            className="object-cover group-hover:scale-102 transition-transform duration-500"
          />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
          <div className="relative h-[168px] lg:h-[232px] rounded-3xl overflow-hidden shadow-sm border border-slate-100/80 group">
            <Image
              src={secondaryImage}
              alt="Interior shot"
              fill
              className="object-cover group-hover:scale-102 transition-transform duration-500"
            />
          </div>
          <div className="relative h-[168px] lg:h-[232px] rounded-3xl overflow-hidden shadow-sm border border-slate-100/80 group">
            <Image
              src={tertiaryImage}
              alt="Bedroom shot"
              fill
              className="object-cover group-hover:scale-102 transition-transform duration-500"
            />
          </div>
        </div>
      </div>

      {/* Details layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-10 animate-fade-in-up" style={{ animationDelay: "200ms" }}>
          
          {/* Key specs */}
          <div className="grid grid-cols-3 gap-4 p-5 bg-slate-50 border border-slate-100 rounded-2xl">
            <div className="text-center p-3 bg-white rounded-xl border border-slate-200/40 shadow-[0_2px_8px_rgba(0,0,0,0.01)] flex flex-col items-center justify-center">
              <BedDouble className="w-5 h-5 text-primary mb-1 shrink-0" />
              <span className="text-slate-800 font-bold text-sm leading-tight">{bedrooms} Bedrooms</span>
            </div>
            <div className="text-center p-3 bg-white rounded-xl border border-slate-200/40 shadow-[0_2px_8px_rgba(0,0,0,0.01)] flex flex-col items-center justify-center">
              <Bath className="w-5 h-5 text-primary mb-1 shrink-0" />
              <span className="text-slate-800 font-bold text-sm leading-tight">{bathrooms} Bathrooms</span>
            </div>
            <div className="text-center p-3 bg-white rounded-xl border border-slate-200/40 shadow-[0_2px_8px_rgba(0,0,0,0.01)] flex flex-col items-center justify-center">
              <Square className="w-5 h-5 text-primary mb-1 shrink-0" />
              <span className="text-slate-800 font-bold text-sm leading-tight">{sqft} Sq Feet</span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h2 className="text-xl font-bold text-slate-800 mb-3.5">About this property</h2>
            <p className="text-slate-500 leading-relaxed text-sm font-semibold">{property.description}</p>
          </div>

          {/* Amenities */}
          <div>
            <h2 className="text-xl font-bold text-slate-800 mb-4">What this place offers</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3.5">
              {property.amenities.map((amenity: string, idx: number) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 text-slate-600 text-sm font-semibold bg-white p-3 border border-slate-100 rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.01)]"
                >
                  <CheckCircle2 className="w-4.5 h-4.5 text-green-500 shrink-0" />
                  {amenity}
                </div>
              ))}
            </div>
          </div>

          {/* Reviews section */}
          <div className="pt-6 border-t border-slate-100">
            <h2 className="text-xl font-bold text-slate-800 mb-5 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-primary shrink-0" />
              Tenant Reviews ({property.reviews?.length || 0})
            </h2>

            {!property.reviews || property.reviews.length === 0 ? (
              <div className="bg-slate-50 rounded-2xl p-6 text-center border border-slate-100">
                <p className="text-slate-400 text-sm font-semibold italic">No reviews submitted for this property yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {property.reviews.map((rev: any) => (
                  <div key={rev.id} className="p-5 border border-slate-100 bg-white rounded-2xl shadow-sm space-y-2.5">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <p className="font-bold text-slate-800 text-sm">{rev.user?.name || "Verified Tenant"}</p>
                        <p className="text-[10px] text-slate-400 font-semibold">{new Date(rev.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="flex items-center gap-0.5 text-yellow-400">
                        {Array.from({ length: rev.rating }).map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-current" />
                        ))}
                      </div>
                    </div>
                    <p className="text-slate-500 text-xs font-semibold leading-relaxed">{rev.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar landlord contact & Request Rent CTA */}
        <div className="lg:col-span-1 animate-fade-in-up" style={{ animationDelay: "300ms" }}>
          <div className="bg-white p-6 border border-slate-100 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.02)] space-y-6 sticky top-24">
            <div className="p-4 bg-slate-50/50 border border-slate-200/40 rounded-2xl">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Listed by Landlord</p>
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 bg-primary/10 border border-primary/20 text-primary font-black rounded-full flex items-center justify-center">
                  {property.landlord?.name ? property.landlord.name.charAt(0).toUpperCase() : "L"}
                </div>
                <div>
                  <p className="font-bold text-slate-800 text-sm leading-none mb-1">
                    {property.landlord?.name || "Verified Owner"}
                  </p>
                  <p className="text-[10px] text-slate-400 font-semibold leading-none">
                    Status: {property.landlord?.status || "Active"}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3.5 text-slate-600 text-xs font-semibold">
              <div className="flex items-center gap-2.5 p-3 border border-slate-100 bg-slate-50/20 rounded-xl">
                <Mail className="w-4.5 h-4.5 text-slate-400 shrink-0" />
                <span className="truncate">{property.landlord?.email || "owner@rentnest.com"}</span>
              </div>
              <div className="flex items-center gap-2.5 p-3 border border-slate-100 bg-slate-50/20 rounded-xl">
                <Phone className="w-4.5 h-4.5 text-slate-400 shrink-0" />
                <span>+880 1712-345678</span>
              </div>
            </div>

            <Button
              onClick={() => setIsBookModalOpen(true)}
              className="w-full py-6.5 text-sm font-bold bg-slate-900 hover:bg-slate-800 text-white rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              Request to Rent
            </Button>
            <p className="text-center text-[10px] font-bold text-slate-400">
              Your security and privacy are fully protected.
            </p>
          </div>
        </div>
      </div>

      {/* Booking Form Modal */}
      {isBookModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-3xl border border-slate-100 max-w-md w-full p-6 shadow-2xl relative animate-scale-in">
            <button
              onClick={() => setIsBookModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-900 font-bold text-lg focus:outline-none cursor-pointer"
            >
              ✕
            </button>

            <h3 className="text-xl font-black text-slate-800 mb-1 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" /> Request Booking
            </h3>
            <p className="text-slate-500 text-xs font-semibold mb-6">
              Enter details below to submit your rental application to the landlord.
            </p>

            <form onSubmit={handleBookingSubmit} className="space-y-4">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-3 mb-2">
                <Image src={mainImage} alt={property.title} width={60} height={60} className="object-cover rounded-lg aspect-square" />
                <div>
                  <p className="font-bold text-slate-800 text-xs line-clamp-1">{property.title}</p>
                  <p className="font-semibold text-slate-500 text-[10px]">{property.location}</p>
                  <p className="font-extrabold text-primary text-xs mt-0.5">৳{property.price.toLocaleString()} /mo</p>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5 ml-1">
                  Select Move-In Date
                </label>
                <input
                  type="date"
                  required
                  value={moveInDate}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => setMoveInDate(e.target.value)}
                  className="w-full px-4 py-3.5 bg-slate-50 hover:bg-slate-50 border border-slate-200 focus:border-primary/55 rounded-xl text-slate-800 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:bg-white transition-all text-sm font-semibold"
                />
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={isPending}
                  className="w-full py-6 text-sm font-bold bg-slate-900 hover:bg-slate-800 text-white rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                  Submit Rental Request
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
