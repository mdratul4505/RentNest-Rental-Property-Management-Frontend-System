"use client";

import { useEffect } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import NextLink from "next/link";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Next.js Error Boundary caught an error:", error);
  }, [error]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-16">
      <div className="w-full max-w-md text-center bg-white p-8 rounded-3xl border border-slate-100 shadow-lg">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-red-100 bg-red-50 text-red-500 shadow-sm">
          <AlertTriangle className="h-8 w-8" aria-hidden="true" />
        </div>

        <p className="mb-2 font-mono text-[10px] font-bold tracking-widest text-red-500 uppercase">
          Application Error
        </p>

        <h1 className="text-2xl font-black tracking-tight text-slate-800">
          Something went wrong
        </h1>

        <p className="mx-auto mt-3 max-w-sm text-xs font-semibold leading-relaxed text-slate-400">
          {error.message || "An unexpected error occurred while processing your request. Please try again."}
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button onClick={reset} className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white font-bold cursor-pointer rounded-xl h-12 px-5 text-xs">
            <RotateCcw className="h-4 w-4 mr-2" aria-hidden="true" />
            Try again
          </Button>

          <NextLink href="/" className="w-full sm:w-auto">
            <Button variant="outline" className="w-full border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold rounded-xl h-12 px-5 text-xs">
              Back to Home
            </Button>
          </NextLink>
        </div>
      </div>
    </main>
  );
}
