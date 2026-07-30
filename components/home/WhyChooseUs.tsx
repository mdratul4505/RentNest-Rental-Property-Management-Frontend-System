"use client";

import { Shield, Sparkles, Zap, Award, Search, Key } from "lucide-react";

export default function WhyChooseUs() {
  const features = [
    {
      icon: Shield,
      title: "Verified Listings",
      desc: "Every single rental property goes through a rigorous validation process by our expert team. No fake listings, no scams.",
      color: "text-emerald-500 bg-emerald-50",
      border: "hover:border-emerald-100",
    },
    {
      icon: Zap,
      title: "Instant Rent Requests",
      desc: "Apply to your dream apartment in one click. Our digital platform processes landlord approvals and tenant agreements in real-time.",
      color: "text-orange-500 bg-orange-50",
      border: "hover:border-orange-100",
    },
    {
      icon: Sparkles,
      title: "Stunning Aesthetics",
      desc: "Filter through high-resolution galleries, detailed floor plans, and curated modern styles to match your personal vibe.",
      color: "text-purple-500 bg-purple-50",
      border: "hover:border-purple-100",
    },
    {
      icon: Award,
      title: "Secure Payments",
      desc: "Built-in integration with Stripe ensures your booking and monthly rental payments are securely processed and monitored.",
      color: "text-blue-500 bg-blue-50",
      border: "hover:border-blue-100",
    },
  ];

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Decorative Orbs */}
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 px-3.5 py-1.5 rounded-full">
            Core Features
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Why Tenants & Landlords <br />
            choose <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-500">RentNest</span>
          </h2>
          <p className="text-slate-500 font-medium text-sm md:text-base">
            We provide a transparent, secure, and intuitive digital ecosystem built to handle your rental management from start to finish.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                className={`bg-slate-50/50 p-8 rounded-3xl border border-slate-100 hover:bg-white hover:shadow-[0_15px_30px_rgba(0,0,0,0.03)] hover:-translate-y-2 transition-all duration-300 group flex flex-col items-start ${feature.border}`}
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 ${feature.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-primary transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-slate-500 text-sm font-medium leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
