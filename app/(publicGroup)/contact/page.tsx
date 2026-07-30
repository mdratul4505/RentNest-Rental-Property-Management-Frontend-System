"use client";

import { Mail, Phone, MapPin, Send, HelpCircle, MessageSquare, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error("Please fill in all required fields.");
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      toast.success("Thank you! Your message has been received.");
      setForm({ name: "", email: "", subject: "", message: "" });
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden py-20 px-4 sm:px-6 lg:px-8">
      {/* Background blobs */}
      <div className="absolute top-20 right-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2 animate-float" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2 animate-float" style={{ animationDelay: "3s" }} />

      <div className="max-w-6xl mx-auto relative z-10 space-y-16">
        {/* Title area */}
        <div className="text-center space-y-4 max-w-3xl mx-auto animate-fade-in-up">
          <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 px-4 py-2 rounded-full inline-flex items-center gap-1.5">
            <MessageSquare className="w-3.5 h-3.5" /> Contact Support
          </span>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight leading-none">
            Get in touch <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-500">with RentNest</span>
          </h1>
          <p className="text-slate-500 font-medium text-base md:text-lg leading-relaxed">
            Have questions about a property listing, payment setups, or account details? Fill out the form below or contact our support team.
          </p>
        </div>

        {/* Contact info and Form split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Contact Details */}
          <div className="lg:col-span-5 space-y-8 animate-fade-in-up">
            <div className="bg-white/80 backdrop-blur-md p-8 rounded-3xl border border-slate-100/80 shadow-[0_4px_25px_rgba(0,0,0,0.01)] space-y-8">
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">Direct Contact Info</h3>
              <p className="text-slate-500 text-sm font-medium">Reach out directly through these communication channels.</p>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">Email Address</h4>
                    <p className="text-slate-500 text-xs mt-0.5">support@rentnest.com</p>
                    <p className="text-slate-400 text-[10px]">Response time: Under 2 hours</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">Phone Line</h4>
                    <p className="text-slate-500 text-xs mt-0.5">+880 1712 345678</p>
                    <p className="text-slate-400 text-[10px]">Toll-free / Mon - Sat, 9am - 6pm</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">Headquarters</h4>
                    <p className="text-slate-500 text-xs mt-0.5">Banani, Dhaka-1213, Bangladesh</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Card info */}
            <div className="bg-slate-900 text-white p-8 rounded-3xl relative overflow-hidden shadow-md">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-xl translate-x-1/2 -translate-y-1/2" />
              <HelpCircle className="w-8 h-8 text-orange-400 mb-4 animate-bounce" />
              <h4 className="text-lg font-bold mb-2">Looking for FAQs?</h4>
              <p className="text-slate-300 text-xs leading-relaxed mb-4">
                Before sending a message, browse our knowledge base to find instant answers about booking rules, security deposits, and refunds.
              </p>
              <Button variant="outline" className="border-white/20 hover:bg-white/10 text-white rounded-xl text-xs font-semibold">
                Explore FAQs
              </Button>
            </div>
          </div>

          {/* Form Area */}
          <div className="lg:col-span-7 bg-white p-8 md:p-12 rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.02)] animate-fade-in-up" style={{ animationDelay: "150ms" }}>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-2">Send Us a Message</h3>
            <p className="text-slate-400 text-xs font-semibold mb-8">We will reply to your inquiry as soon as possible.</p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5 ml-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="block w-full px-4 py-3 bg-slate-50 hover:bg-slate-50 border border-slate-200 focus:border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-primary/20 focus:bg-white transition-all text-xs font-semibold"
                    placeholder="e.g. John Doe"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5 ml-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="block w-full px-4 py-3 bg-slate-50 hover:bg-slate-50 border border-slate-200 focus:border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-primary/20 focus:bg-white transition-all text-xs font-semibold"
                    placeholder="name@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5 ml-1">Subject</label>
                <input
                  type="text"
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  className="block w-full px-4 py-3 bg-slate-50 hover:bg-slate-50 border border-slate-200 focus:border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-primary/20 focus:bg-white transition-all text-xs font-semibold"
                  placeholder="What is this regarding?"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5 ml-1">Message Details *</label>
                <textarea
                  rows={5}
                  required
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="block w-full px-4 py-3 bg-slate-50 hover:bg-slate-50 border border-slate-200 focus:border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-primary/20 focus:bg-white transition-all text-xs font-semibold"
                  placeholder="Tell us what you need help with..."
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-6 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-black shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider"
              >
                {isSubmitting ? (
                  "Sending Message..."
                ) : (
                  <>
                    <Send className="w-4 h-4" /> Send Message
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
