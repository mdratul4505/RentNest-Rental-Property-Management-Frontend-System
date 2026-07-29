"use client";

import { use, useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { getCategories, getPropertyById } from "@/service/properties";
import { updateLandlordProperty } from "@/service/landlord";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, ArrowLeft, Building2, MapPin, DollarSign, Tag, CheckCircle2 } from "lucide-react";
import NextLink from "next/link";

// Zod Validation Schema
const propertyFormSchema = z.object({
  title: z.string().min(1, "Title is required").min(5, "Title must be at least 5 characters"),
  description: z.string().min(1, "Description is required").min(10, "Description must be at least 10 characters"),
  location: z.string().min(1, "Location is required"),
  price: z.number({ message: "Price is required" })
    .refine((val) => !isNaN(val), { message: "Price is required" })
    .refine((val) => Number.isInteger(val), { message: "Price must be an integer" })
    .refine((val) => val > 0, { message: "Price must be positive" }),
  amenities: z.string().min(1, "At least one amenity is required (e.g. WiFi, AC)"),
  categoryId: z.string().min(1, "Please select a category"),
  isAvailable: z.boolean(),
});

type PropertyFormValues = z.infer<typeof propertyFormSchema>;

export default function EditPropertyPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const propertyId = unwrappedParams.id;
  const router = useRouter();

  const [categories, setCategories] = useState<any[]>([]);
  const [property, setProperty] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<PropertyFormValues>({
    resolver: zodResolver(propertyFormSchema),
    defaultValues: {
      title: "",
      description: "",
      location: "",
      price: undefined,
      amenities: "",
      categoryId: "",
      isAvailable: true,
    },
  });

  useEffect(() => {
    async function loadData() {
      try {
        const catRes = await getCategories();
        const propRes = await getPropertyById(propertyId);

        if (catRes.success) {
          setCategories(catRes.data || []);
        }

        if (propRes.success && propRes.data) {
          const prop = propRes.data;
          setProperty(prop);

          // Prefill values
          setValue("title", prop.title);
          setValue("description", prop.description);
          setValue("location", prop.location);
          setValue("price", prop.price);
          setValue("categoryId", prop.categoryId);
          setValue("isAvailable", prop.isAvailable);
          setValue("amenities", (prop.amenities || []).join(", "));
        } else {
          toast.error(propRes.message || "Failed to load property details");
          router.push("/dashboard/landlord");
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to load edit page data");
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [propertyId, setValue, router]);

  const onSubmit = (data: PropertyFormValues) => {
    const amenityArray = data.amenities
      .split(",")
      .map((a) => a.trim())
      .filter((a) => a.length > 0);

    const payload = {
      title: data.title,
      description: data.description,
      location: data.location,
      price: data.price,
      amenities: amenityArray,
      categoryId: data.categoryId,
      isAvailable: data.isAvailable,
    };

    startTransition(async () => {
      const res = await updateLandlordProperty(propertyId, payload);
      if (res.success) {
        toast.success("Property updated successfully!");
        router.push("/dashboard/landlord");
        router.refresh();
      } else {
        toast.error(res.message || "Failed to update property. Please try again.");
      }
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center space-y-4">
          <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto" />
          <p className="text-slate-400 font-bold text-sm">Loading listing details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

      <div className="max-w-2xl mx-auto bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.015)] border border-slate-100 relative z-10 animate-fade-in-up">
        {/* Back navigation */}
        <NextLink
          href="/dashboard/landlord"
          className="text-xs font-bold text-slate-400 hover:text-slate-800 transition-colors flex items-center gap-1.5 focus:outline-none mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> Back to dashboard
        </NextLink>

        {/* Title Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Building2 className="w-6 h-6 text-primary" /> Edit Property Listing
          </h2>
          <p className="text-slate-400 text-xs font-semibold mt-1">
            Update your property listing information and availability status
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Title */}
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5 ml-1">
              Property Title
            </label>
            <input
              type="text"
              {...register("title")}
              className={`block w-full px-4 py-3 bg-slate-50 hover:bg-slate-50 border ${
                errors.title ? "border-red-500 focus:ring-red-400" : "border-slate-200 focus:ring-primary/45"
              } rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:bg-white transition-all text-xs font-semibold`}
            />
            {errors.title && <p className="mt-1 text-xs text-red-500 ml-1">{errors.title.message}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5 ml-1">
              Description
            </label>
            <textarea
              rows={4}
              {...register("description")}
              className={`block w-full px-4 py-3 bg-slate-50 hover:bg-slate-50 border ${
                errors.description ? "border-red-500 focus:ring-red-400" : "border-slate-200 focus:ring-primary/45"
              } rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:bg-white transition-all text-xs font-semibold`}
            />
            {errors.description && (
              <p className="mt-1 text-xs text-red-500 ml-1">{errors.description.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Location */}
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5 ml-1">
                Location
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <MapPin className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  {...register("location")}
                  className={`block w-full pl-9 pr-4 py-3 bg-slate-50 hover:bg-slate-50 border ${
                    errors.location ? "border-red-500 focus:ring-red-400" : "border-slate-200 focus:ring-primary/45"
                  } rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:bg-white transition-all text-xs font-semibold`}
                />
              </div>
              {errors.location && (
                <p className="mt-1 text-xs text-red-500 ml-1">{errors.location.message}</p>
              )}
            </div>

            {/* Price */}
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5 ml-1">
                Monthly Rent (BDT)
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <DollarSign className="w-4 h-4" />
                </span>
                <input
                  type="number"
                  {...register("price", { valueAsNumber: true })}
                  className={`block w-full pl-9 pr-4 py-3 bg-slate-50 hover:bg-slate-50 border ${
                    errors.price ? "border-red-500 focus:ring-red-400" : "border-slate-200 focus:ring-primary/45"
                  } rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:bg-white transition-all text-xs font-semibold`}
                />
              </div>
              {errors.price && <p className="mt-1 text-xs text-red-500 ml-1">{errors.price.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Category selection */}
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5 ml-1">
                Property Category
              </label>
              <div className="relative">
                <select
                  {...register("categoryId")}
                  className={`block w-full px-4 py-3 bg-slate-50 hover:bg-slate-50 border ${
                    errors.categoryId ? "border-red-500 focus:ring-red-400" : "border-slate-200 focus:ring-primary/45"
                  } rounded-xl text-slate-900 focus:outline-none focus:ring-4 focus:bg-white transition-all text-xs font-semibold`}
                >
                  <option value="" disabled>
                    Select category
                  </option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              {errors.categoryId && (
                <p className="mt-1 text-xs text-red-500 ml-1">{errors.categoryId.message}</p>
              )}
            </div>

            {/* Amenities */}
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5 ml-1">
                Amenities (comma-separated)
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Tag className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  {...register("amenities")}
                  className={`block w-full pl-9 pr-4 py-3 bg-slate-50 hover:bg-slate-50 border ${
                    errors.amenities ? "border-red-500 focus:ring-red-400" : "border-slate-200 focus:ring-primary/45"
                  } rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:bg-white transition-all text-xs font-semibold`}
                />
              </div>
              {errors.amenities && (
                <p className="mt-1 text-xs text-red-500 ml-1">{errors.amenities.message}</p>
              )}
            </div>
          </div>

          {/* Availability Toggle */}
          <div className="p-4 bg-slate-50 border border-slate-200/50 rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-700 block leading-tight">Property Availability Status</span>
              <span className="text-[10px] text-slate-400 font-semibold leading-none mt-0.5 block">
                Toggle whether this listing should be visible for rent
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                {...register("isAvailable")}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
            </label>
          </div>

          <div className="pt-4 flex items-center gap-4">
            <Button
              type="submit"
              disabled={isPending}
              className="flex-1 py-6.5 text-sm font-bold bg-slate-900 hover:bg-slate-800 text-white rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4.5 h-4.5 animate-spin" /> Saving Changes...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4.5 h-4.5" /> Save Changes
                </>
              )}
            </Button>
            <NextLink href="/dashboard/landlord" className="flex-1">
              <Button
                type="button"
                variant="outline"
                className="w-full py-6 text-sm font-bold border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl transition-all cursor-pointer"
              >
                Cancel
              </Button>
            </NextLink>
          </div>
        </form>
      </div>
    </div>
  );
}
