"use client";

import { motion } from "framer-motion";
import { Building2, Home, Hotel, TreePine, ArrowRight, ShieldCheck, Warehouse, Sparkles } from "lucide-react";
import Link from "next/link";

const CATEGORIES = [
  {
    id: "luxury-apartments",
    title: "Luxury Apartments",
    count: "1,240+ Properties",
    icon: Building2,
    color: "from-blue-500 to-indigo-600",
    bgLight: "bg-blue-50 dark:bg-blue-950/30",
  },
  {
    id: "family-houses",
    title: "Family Houses",
    count: "850+ Properties",
    icon: Home,
    color: "from-amber-500 to-orange-600",
    bgLight: "bg-amber-50 dark:bg-amber-950/30",
  },
  {
    id: "penthouse-suites",
    title: "Penthouse Suites",
    count: "320+ Properties",
    icon: Hotel,
    color: "from-purple-500 to-pink-600",
    bgLight: "bg-purple-50 dark:bg-purple-950/30",
  },
  {
    id: "cozy-studios",
    title: "Studio Apartments",
    count: "640+ Properties",
    icon: Sparkles,
    color: "from-emerald-500 to-teal-600",
    bgLight: "bg-emerald-50 dark:bg-emerald-950/30",
  },
  {
    id: "commercial-spaces",
    title: "Commercial & Office",
    count: "410+ Properties",
    icon: Warehouse,
    color: "from-rose-500 to-red-600",
    bgLight: "bg-rose-50 dark:bg-rose-950/30",
  },
  {
    id: "suburban-villas",
    title: "Suburban Villas",
    count: "290+ Properties",
    icon: TreePine,
    color: "from-cyan-500 to-blue-600",
    bgLight: "bg-cyan-50 dark:bg-cyan-950/30",
  },
];

export default function CategoriesSection() {
  return (
    <section className="py-20 bg-slate-50/70 dark:bg-slate-950 transition-colors relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div className="space-y-3">
            <span className="text-xs font-black uppercase tracking-widest text-orange-500 bg-orange-500/10 px-3.5 py-1.5 rounded-full inline-block">
              Property Categories
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              Explore by Property Type
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium max-w-lg">
              Whether you need a sleek city flat or a peaceful suburb villa, discover spaces tailored to your lifestyle.
            </p>
          </div>

          <Link href="/properties">
            <motion.div whileHover={{ x: 5 }}>
              <span className="text-xs font-black text-primary hover:text-orange-500 transition-colors inline-flex items-center gap-1.5 cursor-pointer">
                View All Categories <ArrowRight className="w-4 h-4" />
              </span>
            </motion.div>
          </Link>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {CATEGORIES.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                whileHover={{ y: -6, scale: 1.02 }}
                className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/60 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 group cursor-pointer flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${cat.color} flex items-center justify-center text-white shadow-md group-hover:rotate-6 transition-transform`}>
                    <Icon className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 dark:text-white text-base group-hover:text-orange-500 transition-colors">
                      {cat.title}
                    </h3>
                    <p className="text-xs font-semibold text-slate-400 mt-0.5">
                      {cat.count}
                    </p>
                  </div>
                </div>

                <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 group-hover:bg-orange-500 group-hover:text-white flex items-center justify-center transition-colors">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
