"use client";

import { Button } from "@/components/ui/button";
import { XCircle, AlertTriangle, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function PaymentCancelPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background radial effects */}
      <div className="absolute top-1/2 left-1/2 w-[500px] h-[500px] bg-red-500/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />

      <div className="max-w-md w-full text-center space-y-8 bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.015)] border border-slate-100 relative z-10 animate-fade-in-up">
        {/* Cancel Icon */}
        <div className="relative">
          <div className="w-20 h-20 bg-red-50 text-red-500 border border-red-100 rounded-full flex items-center justify-center mx-auto animate-scale-in">
            <XCircle className="w-10 h-10" />
          </div>
        </div>

        {/* Title */}
        <div className="space-y-2">
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Payment Cancelled</h1>
          <p className="text-slate-400 text-xs font-semibold px-4 leading-relaxed">
            The transaction was aborted or cancelled. No charges were made to your card. You can try again from your dashboard.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Link href="/dashboard/tenant" className="block w-full">
            <Button className="w-full py-6.5 text-sm font-bold bg-slate-900 hover:bg-slate-800 text-white rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer">
              <ArrowLeft className="w-4 h-4" /> Go to Dashboard
            </Button>
          </Link>
          <Link href="/properties" className="block w-full">
            <Button variant="outline" className="w-full py-6.5 text-sm font-bold border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl transition-all cursor-pointer">
              Browse Properties
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
