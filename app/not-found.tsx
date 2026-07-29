"use client";

import NextLink from "next/link";
import { Button } from "@/components/ui/button";
import { AlertCircle, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="max-w-md w-full text-center space-y-5 p-8 bg-white rounded-3xl border border-slate-100 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-red-500" />
        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto border border-red-100">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h3 className="text-2xl font-black text-slate-800 tracking-tight">404 - Page Not Found</h3>
        <p className="text-slate-500 text-xs font-semibold leading-relaxed">
          The page you are looking for does not exist or has been moved. Please check the URL or click below to return home.
        </p>
        <div className="pt-2">
          <NextLink href="/">
            <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold cursor-pointer rounded-xl py-6.5 flex items-center justify-center gap-2">
              <ArrowLeft className="w-4 h-4" /> Back to Home
            </Button>
          </NextLink>
        </div>
      </div>
    </div>
  );
}
