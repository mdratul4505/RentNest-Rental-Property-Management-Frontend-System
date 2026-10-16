"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle, ShieldCheck, CreditCard, Key } from "lucide-react";

const FAQ_ITEMS = [
  {
    category: "tenants",
    question: "How do I request to rent a property on RentNest?",
    answer: "Browse available properties, select your desired unit, click 'View Details', and press the 'Request to Rent' button. Select your move-in date and submit! The landlord will review your profile and respond promptly.",
  },
  {
    category: "tenants",
    question: "Are there any hidden service fees for tenants?",
    answer: "No! Searching and submitting rental requests on RentNest is 100% free for tenants. You only pay the rental deposit and monthly rent directly agreed with the landlord.",
  },
  {
    category: "landlords",
    question: "How do I list my apartment or villa as a Landlord?",
    answer: "Create an account selecting 'Landlord' role. From your Landlord Dashboard, click 'Add New Property', upload property photos, enter specs (bedrooms, baths, rent price, address), and publish instantly.",
  },
  {
    category: "landlords",
    question: "How are tenant requests managed and approved?",
    answer: "You will receive instant notifications when a tenant submits a request. You can view their verified profile, contact them directly, and approve or decline with a single click from your Dashboard.",
  },
  {
    category: "safety",
    question: "How does RentNest verify landlords and property listings?",
    answer: "Our team conducts background checks on landlord accounts and verifies ownership documents for premium listings to ensure a safe, scam-free environment for all tenants.",
  },
];

export default function FAQSection() {
  const [activeTab, setActiveTab] = useState<"all" | "tenants" | "landlords" | "safety">("all");
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const filteredFaqs = FAQ_ITEMS.filter((item) => activeTab === "all" || item.category === activeTab);

  return (
    <section className="py-20 bg-slate-50/70 dark:bg-slate-950 transition-colors relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center space-y-4 mb-12">
          <span className="text-xs font-black uppercase tracking-widest text-orange-500 bg-orange-500/10 px-3.5 py-1.5 rounded-full inline-block">
            Frequently Asked Questions
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Got Questions? We Have Answers.
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium max-w-xl mx-auto">
            Everything you need to know about renting, listing, and managing properties on RentNest.
          </p>

          {/* Filter Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
            {[
              { id: "all", label: "All Questions" },
              { id: "tenants", label: "For Tenants" },
              { id: "landlords", label: "For Landlords" },
              { id: "safety", label: "Safety & Security" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as any);
                  setOpenIdx(0);
                }}
                className={`px-4 py-2 rounded-2xl text-xs font-extrabold transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-md"
                    : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-800 hover:bg-slate-100"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Accordion */}
        <div className="space-y-4">
          {filteredFaqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/60 dark:border-slate-800 shadow-sm overflow-hidden"
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
                >
                  <span className="font-extrabold text-slate-900 dark:text-white text-base sm:text-lg flex items-center gap-3">
                    <HelpCircle className="w-5 h-5 text-orange-500 shrink-0" />
                    {faq.question}
                  </span>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 flex items-center justify-center shrink-0"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </motion.div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="px-6 pb-6 pt-0 text-slate-500 dark:text-slate-400 text-sm font-medium leading-relaxed border-t border-slate-100 dark:border-slate-800/60 mt-2">
                        <p className="pt-4">{faq.answer}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
