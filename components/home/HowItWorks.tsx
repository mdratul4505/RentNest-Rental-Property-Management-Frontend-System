"use client";

import { Search, FileText, Key, PlusCircle, CheckSquare, DollarSign } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function HowItWorks() {
  const [activeTab, setActiveTab] = useState<"tenant" | "landlord">("tenant");

  const tenantSteps = [
    {
      icon: Search,
      step: "01",
      title: "Discover Your Nest",
      desc: "Use our interactive search tool to filter rentals by location, price, and essential amenities to find the perfect home.",
    },
    {
      icon: FileText,
      step: "02",
      title: "Submit Rent Request",
      desc: "Input your ideal move-in date and send an instant application to the landlord. No tedious paperwork required.",
    },
    {
      icon: Key,
      step: "03",
      title: "Confirm & Move In",
      desc: "Once the landlord approves, pay the booking deposit safely via Stripe, digitally sign the contract, and collect your keys!",
    },
  ];

  const landlordSteps = [
    {
      icon: PlusCircle,
      step: "01",
      title: "List Your Properties",
      desc: "Upload title, description, monthly rent, and category specs. Make your listings visible to thousands of premium tenants.",
    },
    {
      icon: CheckSquare,
      step: "02",
      title: "Review Applications",
      desc: "Receive instant notifications of tenant applications. Easily view tenant profiles and approve or reject in one tap.",
    },
    {
      icon: DollarSign,
      step: "03",
      title: "Collect Rent Online",
      desc: "Receive rental deposits directly into your balance. Track monthly transactions and request histories seamlessly.",
    },
  ];

  const activeSteps = activeTab === "tenant" ? tenantSteps : landlordSteps;

  return (
    <section className="py-24 bg-slate-50 dark:bg-slate-950 relative overflow-hidden transition-colors duration-300">
      {/* Background Dots */}
      <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:20px_20px] opacity-40 dark:opacity-10" />

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
            Process Guide
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight transition-colors">
            How RentNest Works
          </h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium text-sm md:text-base transition-colors">
            Whether you are searching for your next cozy home or listing a property asset, we have simplified the entire process.
          </p>

          {/* Tabs */}
          <div className="inline-flex bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-1.5 rounded-2xl shadow-sm mt-6 relative overflow-hidden">
            <button
              onClick={() => setActiveTab("tenant")}
              className={`relative z-10 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                activeTab === "tenant"
                  ? "text-white"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white"
              }`}
            >
              I am a Tenant
              {activeTab === "tenant" && (
                <motion.div
                  layoutId="activeTabPill"
                  className="absolute inset-0 bg-slate-900 dark:bg-slate-800 rounded-xl -z-10"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </button>
            <button
              onClick={() => setActiveTab("landlord")}
              className={`relative z-10 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                activeTab === "landlord"
                  ? "text-white"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white"
              }`}
            >
              I am a Landlord
              {activeTab === "landlord" && (
                <motion.div
                  layoutId="activeTabPill"
                  className="absolute inset-0 bg-slate-900 dark:bg-slate-800 rounded-xl -z-10"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </button>
          </div>
        </motion.div>

        {/* Steps Flow */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 relative min-h-[340px]">
          {/* Connector Line (Desktop) */}
          <div className="hidden lg:block absolute top-1/2 left-[10%] right-[10%] h-0.5 bg-slate-200/80 dark:bg-slate-800 -translate-y-12 z-0" />

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.1,
                  },
                },
                exit: {
                  opacity: 0,
                  transition: {
                    duration: 0.15,
                  },
                },
              }}
              className="contents"
            >
              {activeSteps.map((stepItem, idx) => {
                const StepIcon = stepItem.icon;
                return (
                  <motion.div
                    key={stepItem.step}
                    variants={{
                      hidden: { opacity: 0, y: 30, scale: 0.95 },
                      visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: "easeOut" as const } },
                      exit: { opacity: 0, y: -20, scale: 0.95, transition: { duration: 0.15 } },
                    }}
                    whileHover={{ y: -6, transition: { duration: 0.2 } }}
                    className="bg-white dark:bg-slate-900/60 p-8 rounded-3xl border border-slate-100 dark:border-slate-800/80 shadow-[0_4px_20px_rgba(0,0,0,0.01)] relative z-10 flex flex-col items-center text-center group hover:shadow-[0_15px_30px_rgba(0,0,0,0.05)] dark:hover:shadow-[0_15px_30px_rgba(0,0,0,0.2)] transition-all duration-300"
                  >
                    {/* Step badge */}
                    <span className="absolute top-4 right-6 text-3xl font-black text-slate-100 dark:text-slate-800/40 group-hover:text-primary/10 transition-colors duration-300">
                      {stepItem.step}
                    </span>

                    {/* Icon box */}
                    <div className="w-16 h-16 rounded-2xl bg-slate-900 dark:bg-slate-800 text-white flex items-center justify-center mb-6 group-hover:bg-primary transition-colors duration-300 shadow-md">
                      <StepIcon className="w-7 h-7" />
                    </div>

                    <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-3 group-hover:text-primary transition-colors duration-300">
                      {stepItem.title}
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium leading-relaxed transition-colors">
                      {stepItem.desc}
                    </p>
                  </motion.div>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

