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
import { Loader2, Mail, Lock, User, Shield, Building2, ArrowLeft } from "lucide-react";
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
