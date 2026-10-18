/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { login } from "@/service/login";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { Loader2, Mail, Lock, UserCheck, ShieldCheck, Sparkles, Building2, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      const response = await login(data);
      if (response.success) {
        toast.success("Successfully logged in!");
        router.refresh();

        const token = response.data?.accessToken;
        let role = "TENANT";
        try {
          if (token) {
            const payload = JSON.parse(atob(token.split(".")[1]));
            role = (payload.role || "TENANT").toUpperCase();
          }
        } catch (e) {
          console.error("JWT decode error:", e);
        }

        if (role === "LANDLORD") {
          window.location.href = "/dashboard/landlord";
        } else if (role === "ADMIN") {
          window.location.href = "/dashboard/admin";
        } else {
          window.location.href = "/dashboard/tenant";
        }
      } else {
        toast.error(response.message || "Invalid credentials. Please try again.");
      }
    } catch (error: any) {
      toast.error(error.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = (emailVal: string, passVal: string, roleName: string) => {
    setValue("email", emailVal);
    setValue("password", passVal);
    toast.info(`Auto-filled ${roleName} Demo Credentials`, {
      description: `Email: ${emailVal} - Press Sign In to continue!`,
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden transition-colors">
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 pointer-events-none" />

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
            Sign In Portal
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
            Welcome Back
          </h2>
          <p className="mt-1 text-xs font-semibold text-slate-500 dark:text-slate-400">
            Don&apos;t have an account?{" "}
            <Link
              href="/auth/register"
              className="font-extrabold text-orange-500 hover:text-orange-600 transition-colors"
            >
              Sign up free
            </Link>
          </p>
        </div>

        <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/60 dark:border-slate-700 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-orange-500 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Quick Demo Login (Auto-Fill)
            </span>
          </div>

          <div className="grid grid-cols-3 gap-1.5 pt-1">
            <button
              type="button"
              onClick={() => handleDemoLogin("tenant@rentnest.com", "123456", "Tenant")}
              className="py-2 px-2 bg-white dark:bg-slate-900 hover:bg-orange-500 hover:text-white dark:hover:bg-orange-500 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl text-[11px] font-extrabold transition-colors shadow-sm flex items-center justify-center gap-1 cursor-pointer"
            >
              <UserCheck className="w-3 h-3" /> Tenant
            </button>

            <button
              type="button"
              onClick={() => handleDemoLogin("landlord@rentnest.com", "123456", "Landlord")}
              className="py-2 px-2 bg-white dark:bg-slate-900 hover:bg-orange-500 hover:text-white dark:hover:bg-orange-500 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl text-[11px] font-extrabold transition-colors shadow-sm flex items-center justify-center gap-1 cursor-pointer"
            >
              <ShieldCheck className="w-3 h-3" /> Landlord
            </button>

            <button
              type="button"
              onClick={() => handleDemoLogin("admin@rentnest.com", "123456", "Admin")}
              className="py-2 px-2 bg-white dark:bg-slate-900 hover:bg-orange-500 hover:text-white dark:hover:bg-orange-500 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl text-[11px] font-extrabold transition-colors shadow-sm flex items-center justify-center gap-1 cursor-pointer"
            >
              <Building2 className="w-3 h-3" /> Admin
            </button>
          </div>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
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
                } rounded-2xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 text-xs font-bold`}
                placeholder="name@example.com"
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
                } rounded-2xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 text-xs font-bold`}
                placeholder="••••••••"
              />
            </div>
            {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full py-6 text-xs font-black bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 text-white dark:text-slate-900 rounded-2xl shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Sign In"}
          </Button>
        </form>
      </motion.div>
    </div>
  );
}
