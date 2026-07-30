"use client";

import { Sparkles, Users, Compass, ShieldCheck, Heart, Award } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden py-20 px-4 sm:px-6 lg:px-8">
      {/* Background Orbs */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 animate-float" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 animate-float" style={{ animationDelay: "2s" }} />

      <div className="max-w-6xl mx-auto relative z-10 space-y-20">
        {/* Hero Area */}
        <div className="text-center space-y-6 max-w-3xl mx-auto animate-fade-in-up">
          <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 px-4 py-2 rounded-full inline-flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> Our Journey
          </span>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight leading-none">
            We are redefining the <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-500">Rental Experience</span>
          </h1>
          <p className="text-slate-500 font-medium text-base md:text-lg leading-relaxed">
            RentNest was born out of a simple idea: to make finding and listing rental properties as seamless, transparent, and secure as possible. We connect verified tenants and premium landlords through cutting-edge technology.
          </p>
        </div>

        {/* Mission Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: Compass,
              title: "Our Mission",
              desc: "To empower individuals to discover places they are proud to call home, while giving landlords the tools to manage listings effortlessly.",
              color: "text-primary bg-primary/10",
            },
            {
              icon: ShieldCheck,
              title: "Trust & Safety",
              desc: "Every listing, tenant, and landlord undergoes verification, ensuring a secure environment for communications and transactions.",
              color: "text-orange-500 bg-orange-500/10",
            },
            {
              icon: Heart,
              title: "User Centered",
              desc: "We design experiences based on real feedback. Our priority is your comfort, choice, and ease of rental operations.",
              color: "text-rose-500 bg-rose-500/10",
            },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-white/80 backdrop-blur-md p-8 rounded-3xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.01)] hover:shadow-[0_15px_30px_rgba(0,0,0,0.04)] hover:-translate-y-2 transition-all duration-300 group animate-fade-in-up"
                style={{ animationDelay: `${idx * 150}ms` }}
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform ${item.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-primary transition-colors">{item.title}</h3>
                <p className="text-slate-500 text-sm font-medium leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Story Section */}
        <div className="bg-white rounded-3xl p-8 md:p-16 border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.015)] grid grid-cols-1 lg:grid-cols-2 gap-12 items-center animate-fade-in-up">
          <div className="relative h-96 rounded-3xl overflow-hidden shadow-md">
            <img
              src="https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=1200"
              alt="Cozy Home"
              className="object-cover w-full h-full hover:scale-105 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 text-white">
              <p className="text-sm font-bold uppercase tracking-widest text-orange-400 mb-1">Our Inspiration</p>
              <h4 className="text-xl font-black">Building communities, not just houses.</h4>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight">
              Why we started <span className="text-primary">RentNest.</span>
            </h2>
            <p className="text-slate-500 font-medium text-sm md:text-base leading-relaxed">
              We realized that the traditional renting market was plagued by miscommunication, hidden fees, and unverified properties. It was exhausting for tenants and insecure for landlords. 
            </p>
            <p className="text-slate-500 font-medium text-sm md:text-base leading-relaxed">
              By building a centralized portal equipped with advanced searching, verified landlord accounts, and safe transaction integrations (like Stripe), we created a community of trust that turns the chore of renting into a breeze.
            </p>
            <div className="pt-4 flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-white">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-800">Top Rated 2026</h4>
                  <p className="text-xs text-slate-400">Award-winning management</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-800">10k+ Active Users</h4>
                  <p className="text-xs text-slate-400">Landlords & Tenants trust us</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div className="text-center space-y-6 bg-slate-900 text-white rounded-3xl p-12 relative overflow-hidden animate-fade-in-up">
          <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500/10 rounded-full blur-2xl translate-x-1/3 -translate-y-1/3" />
          <h2 className="text-3xl md:text-5xl font-black tracking-tight">Ready to find your nest?</h2>
          <p className="text-slate-300 max-w-xl mx-auto text-sm md:text-base">
            Explore premium rental properties matching your budget and lifestyle, or start listing your properties today.
          </p>
          <div className="pt-4 flex items-center justify-center gap-4">
            <Link href="/properties">
              <Button className="bg-orange-500 hover:bg-orange-600 px-8 py-6 rounded-full text-sm font-bold shadow-lg hover:shadow-orange-500/20 cursor-pointer">
                Browse Properties
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button variant="outline" className="border-white/20 hover:bg-white/10 px-8 py-6 rounded-full text-sm font-bold cursor-pointer text-white">
                Join Community
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
