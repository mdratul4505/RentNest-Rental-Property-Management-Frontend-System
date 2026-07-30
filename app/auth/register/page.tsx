/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { registerUser } from "@/service/register";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { Loader2, Mail, Lock, User, Shield } from "lucide-react";

// Form validation schema matching backend constraints
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
  const [imagePreview, setImagePreview] = useState<string | null>(null);

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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setImagePreview(base64String);
        setValue("image", base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const selectedRole = watch("role");

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    try {
      const response = await registerUser(data);
      if (response.success) {
        toast.success("Account created successfully! Please login.");
        router.push("/auth/login");
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
    <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />

      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-slate-100/80 relative z-10 animate-fade-in-up">
        <div className="text-center">
          <Link href="/" className="inline-block mb-4">
            <span className="text-3xl font-black text-primary tracking-tight">
              RentNest<span className="text-orange-500">.</span>
            </span>
          </Link>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Create an account
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Already have an account?{" "}
            <Link
              href="/auth/login"
              className="font-semibold text-primary hover:text-primary/80 transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1.5 ml-1">
                Full Name
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-5 h-5" />
                </span>
                <input
                  type="text"
                  {...register("name")}
                  className={`block w-full pl-11 pr-4 py-3.5 bg-slate-50/50 hover:bg-slate-50 border ${
                    errors.name ? "border-red-500 focus:ring-red-400" : "border-slate-200 focus:ring-primary/40"
                  } rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:bg-white transition-all text-sm`}
                  placeholder="John Doe"
                />
              </div>
              {errors.name && (
                <p className="mt-1.5 text-xs text-red-500 ml-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Email Address */}
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1.5 ml-1">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-5 h-5" />
                </span>
                <input
                  type="email"
                  {...register("email")}
                  className={`block w-full pl-11 pr-4 py-3.5 bg-slate-50/50 hover:bg-slate-50 border ${
                    errors.email ? "border-red-500 focus:ring-red-400" : "border-slate-200 focus:ring-primary/40"
                  } rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:bg-white transition-all text-sm`}
                  placeholder="john@example.com"
                />
              </div>
              {errors.email && (
                <p className="mt-1.5 text-xs text-red-500 ml-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1.5 ml-1">
                Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-5 h-5" />
                </span>
                <input
                  type="password"
                  {...register("password")}
                  className={`block w-full pl-11 pr-4 py-3.5 bg-slate-50/50 hover:bg-slate-50 border ${
                    errors.password ? "border-red-500 focus:ring-red-400" : "border-slate-200 focus:ring-primary/40"
                  } rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:bg-white transition-all text-sm`}
                  placeholder="••••••••"
                />
              </div>
              {errors.password && (
                <p className="mt-1.5 text-xs text-red-500 ml-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Profile Image */}
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1.5 ml-1">
                Profile Image / Photo
              </label>
              <div className="relative flex items-center gap-4">
                <div className="relative flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-[10px] file:font-black file:bg-slate-900 file:text-white hover:file:bg-slate-800 transition-all border border-slate-200 rounded-xl p-2 bg-slate-50/50 cursor-pointer"
                  />
                </div>
                {imagePreview && (
                  <div className="shrink-0 animate-scale-in">
                    <img
                      src={imagePreview}
                      alt="Avatar Preview"
                      className="w-12 h-12 rounded-full object-cover border-2 border-primary shadow-md hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Role selection Cards */}
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2.5 ml-1">
                Register As
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div
                  onClick={() => setValue("role", "TENANT")}
                  className={`cursor-pointer p-4 rounded-2xl border-2 transition-all flex flex-col items-center justify-center text-center ${
                    selectedRole === "TENANT"
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-slate-100 hover:border-slate-200 bg-slate-50/50 text-slate-500"
                  }`}
                >
                  <User className="w-6 h-6 mb-2" />
                  <span className="font-bold text-sm">Tenant</span>
                  <span className="text-[10px] mt-1 opacity-80">Looking for a home</span>
                </div>

                <div
                  onClick={() => setValue("role", "LANDLORD")}
                  className={`cursor-pointer p-4 rounded-2xl border-2 transition-all flex flex-col items-center justify-center text-center ${
                    selectedRole === "LANDLORD"
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-slate-100 hover:border-slate-200 bg-slate-50/50 text-slate-500"
                  }`}
                >
                  <Shield className="w-6 h-6 mb-2" />
                  <span className="font-bold text-sm">Landlord</span>
                  <span className="text-[10px] mt-1 opacity-80">Own properties to list</span>
                </div>
              </div>
              {errors.role && (
                <p className="mt-1.5 text-xs text-red-500 ml-1">
                  {errors.role.message}
                </p>
              )}
            </div>
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full py-6 text-sm font-bold bg-slate-900 hover:bg-slate-800 text-white rounded-xl shadow-md hover:shadow-lg transition-all"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Registering...
                </>
              ) : (
                "Create Account"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
