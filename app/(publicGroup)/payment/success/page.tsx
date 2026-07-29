"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ShieldCheck, ArrowRight, DollarSign, Calendar } from "lucide-react";
import Link from "next/link";
import { use } from "react";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const amount = searchParams.get("amount") || "0";
  const transactionId = searchParams.get("transactionId") || "";

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background radial effects */}
      <div className="absolute top-1/2 left-1/2 w-[500px] h-[500px] bg-green-500/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />

      <div className="max-w-md w-full text-center space-y-8 bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.015)] border border-slate-100 relative z-10 animate-fade-in-up">
        {/* Success Icon */}
        <div className="relative">
          <div className="w-20 h-20 bg-green-50 text-green-500 border border-green-100 rounded-full flex items-center justify-center mx-auto animate-scale-in">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 border border-green-200/30 rounded-full animate-ping [animation-duration:2s]" />
        </div>

        {/* Title */}
        <div className="space-y-2">
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Payment Successful!</h1>
          <p className="text-slate-400 text-xs font-semibold px-4">
            Your payment has been processed successfully. Your rental agreement is now active!
          </p>
        </div>

        {/* Info Box */}
        <div className="p-5 bg-slate-50 border border-slate-100 rounded-2xl text-left space-y-3.5 text-xs font-semibold text-slate-600">
          <div className="flex justify-between items-center pb-2.5 border-b border-slate-200/40">
            <span className="text-slate-400">Paid Amount</span>
            <span className="text-slate-850 font-black text-sm">৳{Number(amount).toLocaleString()}</span>
          </div>
          {transactionId && (
            <div className="flex justify-between items-start gap-4">
              <span className="text-slate-400 shrink-0">Transaction ID</span>
              <span className="font-mono text-slate-500 select-all break-all text-right leading-relaxed">{transactionId}</span>
            </div>
          )}
          <div className="flex justify-between items-center pt-2.5 border-t border-slate-200/40">
            <span className="text-slate-400">Payment Status</span>
            <span className="text-green-600 font-extrabold bg-green-50 border border-green-200/50 px-2.5 py-0.5 rounded-full text-[10px]">
              COMPLETED
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Link href="/dashboard/tenant" className="block w-full">
            <Button className="w-full py-6.5 text-sm font-bold bg-slate-900 hover:bg-slate-800 text-white rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer">
              Go to Dashboard <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Link href="/properties" className="block w-full">
            <Button variant="outline" className="w-full py-6.5 text-sm font-bold border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl transition-all cursor-pointer">
              Browse More Properties
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
