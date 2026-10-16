/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { User, Mail, Phone, MapPin, Camera, Save, Lock, Loader2, ShieldCheck, CheckCircle2 } from "lucide-react";
import { getMe } from "@/service/getMe";
import { motion } from "framer-motion";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  bio: z.string().optional(),
  image: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "+880 1712-345678",
      bio: "Passionate renter looking for luxury apartments in Dhaka.",
      image: "",
    },
  });

  const imageUrlValue = watch("image");

  useEffect(() => {
    async function loadUserData() {
      try {
        const res = await getMe();
        if (res.success && res.data?.user) {
          const uData = res.data.user;
          setUser(uData);
          setValue("name", uData.name || "");
          setValue("email", uData.email || "");
          setValue("image", uData.image || "");
          setAvatarPreview(uData.image || null);
        }
      } catch (err) {
        console.error("Failed to load user profile", err);
      } fontFinally: {
        setIsLoading(false);
      }
    }
    loadUserData();
  }, [setValue]);

  const onSubmit = async (data: ProfileFormValues) => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setUser((prev: any) => ({ ...prev, ...data }));
      toast.success("Profile updated successfully!", {
        description: "Your user profile information has been saved.",
      });
    }, 1000);
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-4 sm:p-6 lg:p-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Account Profile</h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold mt-1">
            Manage your personal credentials, contact info, and profile avatar.
          </p>
        </div>

        <span className="self-start sm:self-auto text-xs font-black uppercase tracking-wider text-orange-500 bg-orange-500/10 px-3.5 py-1.5 rounded-full border border-orange-500/20">
          Role: {user?.role || "TENANT"}
        </span>
      </div>

      {/* Main Profile Form */}
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/60 dark:border-slate-800 shadow-sm space-y-8"
      >
        {/* Avatar Section */}
        <div className="flex flex-col sm:flex-row items-center gap-6 p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200/60 dark:border-slate-700">
          <div className="relative group">
            {avatarPreview || imageUrlValue ? (
              <img
                src={avatarPreview || imageUrlValue}
                alt="Avatar"
                className="w-24 h-24 rounded-full object-cover border-4 border-white dark:border-slate-900 shadow-md"
                onError={() => setAvatarPreview(null)}
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-slate-900 to-orange-500 text-white font-black text-2xl flex items-center justify-center border-4 border-white dark:border-slate-900 shadow-md">
                {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
              </div>
            )}
            <div className="absolute bottom-0 right-0 p-2 bg-orange-500 text-white rounded-full shadow-md">
              <Camera className="w-4 h-4" />
            </div>
          </div>

          <div className="flex-1 space-y-2 text-center sm:text-left">
            <h3 className="text-lg font-black text-slate-900 dark:text-white">{user?.name || "User"}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">{user?.email}</p>
            <p className="text-[11px] text-emerald-500 font-bold flex items-center gap-1 justify-center sm:justify-start">
              <CheckCircle2 className="w-3.5 h-3.5" /> Verified RentNest Member
            </p>
          </div>
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          
          {/* Full Name */}
          <div>
            <label className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1">
              Full Name
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4" />
              </span>
              <input
                type="text"
                {...register("name")}
                className="block w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-slate-100 font-bold text-xs focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
          </div>

          {/* Email Address */}
          <div>
            <label className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </span>
              <input
                type="email"
                {...register("email")}
                className="block w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-slate-100 font-bold text-xs focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
          </div>

          {/* Phone Number */}
          <div>
            <label className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1">
              Phone Number
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Phone className="w-4 h-4" />
              </span>
              <input
                type="text"
                {...register("phone")}
                className="block w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-slate-100 font-bold text-xs focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          {/* Profile Image URL */}
          <div>
            <label className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1">
              Profile Image URL
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Camera className="w-4 h-4" />
              </span>
              <input
                type="url"
                placeholder="https://images.unsplash.com/..."
                {...register("image", {
                  onChange: (e) => setAvatarPreview(e.target.value || null),
                })}
                className="block w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-slate-100 font-bold text-xs focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

        </div>

        {/* Bio */}
        <div>
          <label className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1">
            About / Bio
          </label>
          <textarea
            rows={3}
            {...register("bio")}
            className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-slate-100 font-bold text-xs focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        {/* Submit */}
        <div className="pt-2 flex justify-end">
          <Button
            type="submit"
            disabled={isSaving}
            className="py-6 px-8 bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 text-white dark:text-slate-900 font-black text-xs rounded-2xl shadow-lg transition-all cursor-pointer flex items-center gap-2"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Changes
          </Button>
        </div>

      </motion.form>
    </div>
  );
}
