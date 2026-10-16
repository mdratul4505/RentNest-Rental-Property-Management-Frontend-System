"use client";

import { useState } from "react";
import { Search, HelpCircle, Phone, Mail, MessageSquare, ShieldCheck, FileText, Send, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function SupportPage() {
  const [ticketSubject, setTicketSubject] = useState("");
  const [ticketMessage, setTicketMessage] = useState("");
  const [ticketEmail, setTicketEmail] = useState("");

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketEmail || !ticketSubject || !ticketMessage) {
      toast.error("Please fill out all ticket fields");
      return;
    }
    toast.success("Support Ticket Submitted Successfully!", {
      description: "Our support team will contact you within 2-4 hours.",
    });
    setTicketSubject("");
    setTicketMessage("");
    setTicketEmail("");
  };

  return (
    <div className="bg-slate-50/50 dark:bg-slate-950 min-h-screen py-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <span className="text-xs font-black uppercase tracking-widest text-orange-500 bg-orange-500/10 px-3.5 py-1.5 rounded-full inline-block">
            24/7 Help & Support
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            How Can We Assist You?
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
            Search our knowledge base or submit a support request to our customer care team.
          </p>
        </div>

        {/* Support Options Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div whileHover={{ y: -6 }} className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200/60 dark:border-slate-800 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-orange-500/10 text-orange-500 flex items-center justify-center">
              <Phone className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-slate-900 dark:text-white text-lg">Call Support Desk</h3>
            <p className="text-slate-500 text-xs font-medium leading-relaxed">
              Reach our Dhaka customer helpline for urgent rental or listing emergencies.
            </p>
            <p className="text-sm font-black text-orange-500">+880 1700-123456</p>
          </motion.div>

          <motion.div whileHover={{ y: -6 }} className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200/60 dark:border-slate-800 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
              <Mail className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-slate-900 dark:text-white text-lg">Email Support</h3>
            <p className="text-slate-500 text-xs font-medium leading-relaxed">
              Send us detailed inquiries regarding rental requests or landlord verification.
            </p>
            <p className="text-sm font-black text-blue-500">support@rentnest.com.bd</p>
          </motion.div>

          <motion.div whileHover={{ y: -6 }} className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200/60 dark:border-slate-800 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-slate-900 dark:text-white text-lg">Tenant Safety Guarantee</h3>
            <p className="text-slate-500 text-xs font-medium leading-relaxed">
              All properties are pre-screened to ensure 100% scam-free rental transactions.
            </p>
            <p className="text-sm font-black text-emerald-500">100% Protected</p>
          </motion.div>
        </div>

        {/* Support Form */}
        <div className="max-w-2xl mx-auto bg-white dark:bg-slate-900 p-8 sm:p-10 rounded-3xl border border-slate-200/60 dark:border-slate-800 shadow-lg space-y-6">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-orange-500" /> Submit a Support Ticket
          </h2>

          <form onSubmit={handleSubmitTicket} className="space-y-4">
            <div>
              <label className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1">
                Your Email Address
              </label>
              <input
                type="email"
                required
                value={ticketEmail}
                onChange={(e) => setTicketEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-slate-100 font-bold text-xs focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1">
                Issue Subject
              </label>
              <input
                type="text"
                required
                value={ticketSubject}
                onChange={(e) => setTicketSubject(e.target.value)}
                placeholder="e.g. Question about booking request status"
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-slate-100 font-bold text-xs focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1">
                Description & Details
              </label>
              <textarea
                rows={4}
                required
                value={ticketMessage}
                onChange={(e) => setTicketMessage(e.target.value)}
                placeholder="Describe your question or issue in detail..."
                className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-slate-100 font-bold text-xs focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <Button
              type="submit"
              className="w-full py-6 bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 text-white dark:text-slate-900 font-black text-xs rounded-2xl shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" /> Submit Support Ticket
            </Button>
          </form>
        </div>

      </div>
    </div>
  );
}
