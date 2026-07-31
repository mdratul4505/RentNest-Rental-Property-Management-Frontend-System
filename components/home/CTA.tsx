"use client";

import { Home, ArrowRight, Shield } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CTA() {
  return (
    <section className="py-24 bg-slate-50 dark:bg-slate-950/40 border-t border-slate-100 dark:border-slate-900/60 relative overflow-hidden transition-colors duration-300">
      {/* Background gradients */}
      <div className="absolute top-1/2 left-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8 bg-white dark:bg-slate-900/40 p-12 md:p-20 rounded-[40px] border border-slate-100 dark:border-slate-800/80 shadow-[0_10px_40px_rgba(0,0,0,0.015)] dark:shadow-[0_15px_45px_rgba(0,0,0,0.3)] animate-fade-in-up">
        {/* Shield verification tag */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-100 dark:border-emerald-900/40 text-emerald-700 dark:text-emerald-400 text-xs font-black uppercase tracking-wider">
          <Shield className="w-4 h-4 text-emerald-600 dark:text-emerald-500" /> 100% Secure Rental Agreements
        </div>

        <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-none transition-colors">
          Ready to experience the future of <span className="text-primary">Rental Management?</span>
        </h2>

        <p className="text-slate-500 dark:text-slate-400 font-medium text-base md:text-lg max-w-2xl mx-auto leading-relaxed transition-colors">
          Create a free account today to list your homes, browse verified local houses, submit rental queries, and manage stripe transfers.
        </p>

        {/* Buttons */}
        <div className="pt-6 flex flex-wrap items-center justify-center gap-4">
          <Link href="/properties">
            <Button size="lg" className="bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-slate-200 text-white dark:text-slate-900 rounded-full px-8 py-7 text-sm font-bold shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center gap-2 group">
              Browse All Listings <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Link href="/auth/register">
            <Button size="lg" variant="outline" className="border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-350 rounded-full px-8 py-7 text-sm font-semibold transition-all cursor-pointer">
              Register Now
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
