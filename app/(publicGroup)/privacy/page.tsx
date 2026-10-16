"use client";

import { ShieldCheck, Lock, FileText, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

export default function PrivacyPage() {
  return (
    <div className="bg-slate-50/50 dark:bg-slate-950 min-h-screen py-12 transition-colors">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <span className="text-xs font-black uppercase tracking-widest text-orange-500 bg-orange-500/10 px-3.5 py-1.5 rounded-full inline-block">
            Legal & Compliance
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            Privacy Policy & Terms of Service
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
            Last Updated: September 2026 • RentNest Bangladesh Inc.
          </p>
        </div>

        {/* Content Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-900 p-8 sm:p-12 rounded-3xl border border-slate-200/60 dark:border-slate-800 shadow-sm space-y-8 text-slate-600 dark:text-slate-300 text-sm font-medium leading-relaxed"
        >
          {/* Section 1 */}
          <div className="space-y-3">
            <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-orange-500" /> 1. Data Collection & Privacy Standards
            </h2>
            <p>
              RentNest respects user privacy and enforces strict data protection rules. We collect essential profile data (name, email, phone, role) solely to process rental applications and facilitate transparent communication between tenants and landlords.
            </p>
          </div>

          {/* Section 2 */}
          <div className="space-y-3 border-t border-slate-100 dark:border-slate-800 pt-6">
            <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Lock className="w-5 h-5 text-orange-500" /> 2. Security & Password Encryption
            </h2>
            <p>
              All sensitive credentials, including user passwords, are hashed using bcrypt before storage. Communication across our platform is encrypted over SSL/TLS protocols.
            </p>
          </div>

          {/* Section 3 */}
          <div className="space-y-3 border-t border-slate-100 dark:border-slate-800 pt-6">
            <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-orange-500" /> 3. Terms of Rental Request Submissions
            </h2>
            <p>
              Submitting a rental request on RentNest indicates intent to rent. Landlords review requests independently and retain final authorization. RentNest does not charge hidden brokerage fees to tenants.
            </p>
          </div>

          <div className="p-4 bg-orange-500/10 rounded-2xl border border-orange-500/20 text-orange-600 dark:text-orange-400 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            Your privacy is our top priority. We never sell user data to third-party advertisers.
          </div>
        </motion.div>

      </div>
    </div>
  );
}
