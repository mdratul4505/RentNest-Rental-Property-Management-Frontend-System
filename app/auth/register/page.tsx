/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { registerUser } from "@/service/register";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";
import Link from "next/link";
import { Loader2, Mail, Lock, User, Shield, Building2, ArrowLeft, Camera, X, UploadCloud } from "lucide-react";
import { motion } from "framer-motion";

const registerSchema = z.object({
  name: z.string().min(1, "Name is required").min(2, "Name must be at least 2 characters"),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["TENANT", "LANDLORD"], {
    message: "Please select a role",
  }),
  image: z.string().optional(),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "TENANT",
      image: "",
    },
  });

  const selectedRole = watch("role");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file (JPG, PNG, WEBP).");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image file size should be less than 5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      // Create an Image element to resize/compress avatar
      const img = new Image();
      img.src = reader.result as string;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 300;
        const MAX_HEIGHT = 300;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, width, height);

        const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.85);
        setAvatarPreview(compressedDataUrl);
        setValue("image", compressedDataUrl);
        toast.success("Profile photo uploaded!");
      };
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setAvatarPreview(null);
    setValue("image", "");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    try {
      const response = await registerUser(data);
      if (response.success) {
        toast.success("Account created successfully! Welcome to RentNest.");
        const userRole = (response.data?.user?.role || data.role || "TENANT").toUpperCase();

        if (userRole === "LANDLORD") {
          window.location.href = "/dashboard/landlord";
        } else if (userRole === "ADMIN") {
          window.location.href = "/dashboard/admin";
        } else {
          window.location.href = "/dashboard/tenant";
        }
      } else {
        toast.error(response.message || "Registration failed. Try again.");
      }
    } catch (error: any) {
      toast.error(error.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden transition-colors">
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full space-y-6 bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-2xl border border-slate-200/60 dark:border-slate-800 relative z-10"
      >
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-1.5 text-xs font-extrabold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-orange-500" /> Go Back
          </button>

          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
            Registration Portal
          </span>
        </div>

        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2 mb-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-slate-900 via-primary to-orange-500 flex items-center justify-center text-white shadow-md">
              <Building2 className="w-5 h-5" />
            </div>
            <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              RentNest<span className="text-orange-500">.</span>
            </span>
          </Link>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Create an Account
          </h2>
          <p className="mt-1 text-xs font-semibold text-slate-500 dark:text-slate-400">
            Already registered?{" "}
            <Link
              href="/auth/login"
              className="font-extrabold text-orange-500 hover:text-orange-600 transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          {/* Profile Photo Upload */}
          <div className="flex flex-col items-center justify-center p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
            <div className="relative group mb-2">
              {avatarPreview ? (
                <div className="relative">
                  <img
                    src={avatarPreview}
                    alt="Avatar preview"
                    className="w-20 h-20 rounded-full object-cover border-2 border-orange-500 shadow-md"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    title="Remove photo"
                    className="absolute -top-1 -right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 shadow cursor-pointer transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 border-2 border-dashed border-slate-300 dark:border-slate-600 flex flex-col items-center justify-center text-slate-400 hover:text-orange-500 hover:border-orange-500 cursor-pointer transition-colors shadow-inner"
                >
                  <Camera className="w-6 h-6 mb-1" />
                  <span className="text-[9px] font-black uppercase tracking-wider">Photo</span>
                </div>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 text-[11px] font-extrabold text-orange-500 hover:text-orange-600 transition-colors cursor-pointer"
            >
              <UploadCloud className="w-3.5 h-3.5" />
              {avatarPreview ? "Change Photo" : "Upload Profile Photo (Optional)"}
            </button>
          </div>

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
                className={`block w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border ${
                  errors.name ? "border-red-500" : "border-slate-200 dark:border-slate-700"
                } rounded-2xl text-slate-900 dark:text-slate-100 text-xs font-bold`}
                placeholder="John Doe"
              />
            </div>
            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
          </div>

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
                className={`block w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border ${
                  errors.email ? "border-red-500" : "border-slate-200 dark:border-slate-700"
                } rounded-2xl text-slate-900 dark:text-slate-100 text-xs font-bold`}
                placeholder="john@example.com"
              />
            </div>
            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
          </div>

          <div>
            <label className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1">
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </span>
              <input
                type="password"
                {...register("password")}
                className={`block w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border ${
                  errors.password ? "border-red-500" : "border-slate-200 dark:border-slate-700"
                } rounded-2xl text-slate-900 dark:text-slate-100 text-xs font-bold`}
                placeholder="••••••••"
              />
            </div>
            {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
          </div>

          <div>
            <label className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block mb-2">
              Select Account Role
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div
                onClick={() => setValue("role", "TENANT")}
                className={`cursor-pointer p-3 rounded-2xl border-2 transition-all flex flex-col items-center justify-center text-center ${
                  selectedRole === "TENANT"
                    ? "border-orange-500 bg-orange-500/10 text-orange-500"
                    : "border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-500"
                }`}
              >
                <User className="w-5 h-5 mb-1" />
                <span className="font-extrabold text-xs">Tenant</span>
              </div>

              <div
                onClick={() => setValue("role", "LANDLORD")}
                className={`cursor-pointer p-3 rounded-2xl border-2 transition-all flex flex-col items-center justify-center text-center ${
                  selectedRole === "LANDLORD"
                    ? "border-orange-500 bg-orange-500/10 text-orange-500"
                    : "border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-500"
                }`}
              >
                <Shield className="w-5 h-5 mb-1" />
                <span className="font-extrabold text-xs">Landlord</span>
              </div>
            </div>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full py-6 text-xs font-black bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 text-white dark:text-slate-900 rounded-2xl shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create Account"}
          </Button>
        </form>
      </motion.div>
    </div>
  );
}
