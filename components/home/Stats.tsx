"use client";

import { Home, Users, CheckCircle2, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

export default function Stats() {
  const statsList = [
    {
      icon: Home,
      value: "15,000+",
      label: "Properties Listed",
      color: "text-emerald-400",
    },
    {
      icon: Users,
      value: "10,000+",
      label: "Happy Families",
      color: "text-blue-400",
    },
    {
      icon: CheckCircle2,
      value: "99.2%",
      label: "Approval Accuracy",
      color: "text-orange-400",
    },
    {
      icon: TrendingUp,
      value: "৳2.5M+",
      label: "Rent Processed Safely",
      color: "text-indigo-400",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.6, 
        ease: "easeOut" as const
      } 
    },
  };

  return (
    <section className="py-16 bg-slate-900 text-white relative overflow-hidden">
      {/* Background Mesh */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12"
        >
          {statsList.map((stat, idx) => {
            const StatIcon = stat.icon;
            return (
              <motion.div
                key={idx}
                variants={itemVariants}
                whileHover={{ scale: 1.03, backgroundColor: "rgba(255,255,255,0.04)" }}
                className="flex flex-col sm:flex-row items-center text-center sm:text-left gap-4 p-4 rounded-2xl transition-all duration-300"
              >
                <div className={`w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0 ${stat.color} shadow-inner`}>
                  <StatIcon className="w-6 h-6" />
                </div>
                <div className="space-y-0.5">
                  <h3 className="text-2xl sm:text-3xl font-black tracking-tight">{stat.value}</h3>
                  <p className="text-slate-400 text-xs font-semibold">{stat.label}</p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

