"use client";

import { motion } from "framer-motion";

export default function PropertyCardSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0.6 }}
      animate={{ opacity: [0.6, 1, 0.6] }}
      transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
      className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-100 dark:border-slate-800 flex flex-col h-[480px] shadow-sm"
    >
      {/* Image Skeleton */}
      <div className="relative h-60 bg-slate-200 dark:bg-slate-800 w-full animate-pulse" />

      {/* Content Skeleton */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded-md w-2/3 animate-pulse" />
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-full w-12 animate-pulse" />
          </div>
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-md w-1/2 animate-pulse" />
          <div className="space-y-1.5 pt-2">
            <div className="h-3.5 bg-slate-200 dark:bg-slate-800 rounded-md w-full animate-pulse" />
            <div className="h-3.5 bg-slate-200 dark:bg-slate-800 rounded-md w-4/5 animate-pulse" />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center py-3 border-t border-slate-100 dark:border-slate-800">
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-md w-16 animate-pulse" />
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-md w-16 animate-pulse" />
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-md w-16 animate-pulse" />
          </div>
          <div className="h-12 bg-slate-200 dark:bg-slate-800 rounded-xl w-full animate-pulse" />
        </div>
      </div>
    </motion.div>
  );
}
