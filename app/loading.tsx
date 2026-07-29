"use client";

import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-slate-50/50">
      <div className="text-center space-y-4">
        <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto" />
        <p className="text-slate-500 font-extrabold text-xs uppercase tracking-wider">
          Loading RentNest...
        </p>
      </div>
    </div>
  );
}
