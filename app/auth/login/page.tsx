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
import { Loader2, Mail, Lock } from "lucide-react";

// Form validation schema
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
        
        // Refresh router so layout fetches new session info
        router.refresh();
        
        // Decode token to redirect to correct dashboard
        const token = response.data.accessToken;
        const payload = JSON.parse(atob(token.split(".")[1]));
        const role = payload.role.toUpperCase();
        
        if (role === "TENANT") {
          router.push("/dashboard/tenant");
        } else if (role === "LANDLORD") {
          router.push("/dashboard/landlord");
        } else if (role === "ADMIN") {
          router.push("/dashboard/admin");
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background gradients for premium aesthetic */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-slate-100/80 relative z-10 animate-fade-in-up">
        <div className="text-center">
          <Link href="/" className="inline-block mb-4">
            <span className="text-3xl font-black text-primary tracking-tight">
              RentNest<span className="text-orange-500">.</span>
            </span>
          </Link>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Welcome back
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Don&apos;t have an account?{" "}
            <Link
              href="/auth/register"
              className="font-semibold text-primary hover:text-primary/80 transition-colors"
            >
              Sign up free
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            {/* Email Input */}
            <div className="relative">
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
                  placeholder="name@example.com"
                />
              </div>
              {errors.email && (
                <p className="mt-1.5 text-xs text-red-500 ml-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Input */}
            <div className="relative">
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
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full py-6 text-sm font-bold bg-slate-900 hover:bg-slate-800 text-white rounded-xl shadow-md hover:shadow-lg transition-all"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
