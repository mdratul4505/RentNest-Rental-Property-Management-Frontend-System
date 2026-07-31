"use client";

import { Shield, Sparkles, Zap, Award, Search, Key } from "lucide-react";
import { motion } from "framer-motion";

export default function WhyChooseUs() {
  const features = [
    {
      icon: Shield,
      title: "Verified Listings",
      desc: "Every single rental property goes through a rigorous validation process by our expert team. No fake listings, no scams.",
      color: "text-emerald-600 dark:text-emerald-450 bg-emerald-50 dark:bg-emerald-950/50",
      border: "hover:border-emerald-100 dark:hover:border-emerald-900/50",
    },
    {
      icon: Zap,
      title: "Instant Rent Requests",
      desc: "Apply to your dream apartment in one click. Our digital platform processes landlord approvals and tenant agreements in real-time.",
      color: "text-orange-600 dark:text-orange-450 bg-orange-50 dark:bg-orange-950/50",
      border: "hover:border-orange-100 dark:hover:border-orange-900/50",
    },
    {
      icon: Sparkles,
      title: "Stunning Aesthetics",
      desc: "Filter through high-resolution galleries, detailed floor plans, and curated modern styles to match your personal vibe.",
      color: "text-purple-600 dark:text-purple-450 bg-purple-50 dark:bg-purple-950/50",
      border: "hover:border-purple-100 dark:hover:border-purple-900/50",
    },
    {
      icon: Award,
      title: "Secure Payments",
      desc: "Built-in integration with Stripe ensures your booking and monthly rental payments are securely processed and monitored.",
      color: "text-blue-600 dark:text-blue-450 bg-blue-50 dark:bg-blue-950/50",
      border: "hover:border-blue-100 dark:hover:border-blue-900/50",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    show: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.7, 
        ease: "easeOut" as const
      } 
    },
  };

  return (
    <section className="py-24 bg-white dark:bg-slate-950 relative overflow-hidden transition-colors duration-300">
      {/* Decorative Orbs */}
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Title */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-2xl mx-auto mb-16 space-y-4"
        >
          <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 px-3.5 py-1.5 rounded-full">
            Core Features
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight transition-colors">
            Why Tenants & Landlords <br />
            choose <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-500">RentNest</span>
          </h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium text-sm md:text-base transition-colors">
            We provide a transparent, secure, and intuitive digital ecosystem built to handle your rental management from start to finish.
          </p>
        </motion.div>

        {/* Feature Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={idx}
                variants={cardVariants}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                className={`bg-slate-50/50 dark:bg-slate-900/40 p-8 rounded-3xl border border-slate-100 dark:border-slate-800/80 hover:bg-white dark:hover:bg-slate-900 hover:shadow-[0_15px_30px_rgba(0,0,0,0.03)] dark:hover:shadow-[0_15px_30px_rgba(0,0,0,0.2)] transition-all duration-300 group flex flex-col items-start ${feature.border}`}
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 ${feature.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-3 group-hover:text-primary transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium leading-relaxed transition-colors">
                  {feature.desc}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

