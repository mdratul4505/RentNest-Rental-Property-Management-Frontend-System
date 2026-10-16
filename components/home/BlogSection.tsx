"use client";

import { motion } from "framer-motion";
import { BookOpen, Calendar, Clock, ArrowRight, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const BLOG_POSTS = [
  {
    id: "1",
    title: "10 Essential Tips for First-Time Apartment Renters in Dhaka",
    snippet: "Navigating leases, security deposits, and location advantages when renting your first home.",
    category: "Renting Guide",
    date: "Sep 02, 2026",
    readTime: "5 min read",
    author: "Tanvir Rahman",
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "2",
    title: "Landlord Best Practices: Managing High-Demand Rental Properties",
    snippet: "How to screen tenants, handle maintenance, and maintain high occupancy rates effortlessly.",
    category: "Landlord Advice",
    date: "Aug 28, 2026",
    readTime: "7 min read",
    author: "Farhana Chowdhury",
    image: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "3",
    title: "Dhaka Real Estate Market Trends: Where to Invest in 2026",
    snippet: "An in-depth review of emerging residential hotspots across Gulshan, Purbachal, and Uttara.",
    category: "Market Insights",
    date: "Aug 15, 2026",
    readTime: "6 min read",
    author: "Asif Mahmood",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800",
  },
];

export default function BlogSection() {
  return (
    <section className="py-20 bg-white dark:bg-slate-900 transition-colors relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div className="space-y-3">
            <span className="text-xs font-black uppercase tracking-widest text-primary bg-primary/10 px-3.5 py-1.5 rounded-full inline-block">
              RentNest Insights
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              Latest Housing Guides & News
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium max-w-lg">
              Stay informed with expert advice on renting, tenant rights, and real estate market analysis.
            </p>
          </div>

          <Link href="/blog">
            <motion.div whileHover={{ x: 5 }}>
              <span className="text-xs font-black text-primary hover:text-orange-500 transition-colors inline-flex items-center gap-1.5 cursor-pointer">
                Visit Full Blog <ArrowRight className="w-4 h-4" />
              </span>
            </motion.div>
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {BLOG_POSTS.map((post, idx) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              whileHover={{ y: -8 }}
              className="bg-slate-50 dark:bg-slate-950 rounded-3xl overflow-hidden border border-slate-200/60 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="relative h-48 w-full overflow-hidden bg-slate-200">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full">
                    {post.category}
                  </span>
                </div>

                <div className="p-6 space-y-3">
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-orange-500" /> {post.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> {post.readTime}
                    </span>
                  </div>

                  <h3 className="font-extrabold text-slate-900 dark:text-white text-lg group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </h3>

                  <p className="text-slate-500 dark:text-slate-400 text-xs font-medium line-clamp-2 leading-relaxed">
                    {post.snippet}
                  </p>
                </div>
              </div>

              <div className="px-6 pb-6 pt-2 border-t border-slate-200/50 dark:border-slate-800/80 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-primary" /> {post.author}
                </span>
                <Link href="/blog" className="text-xs font-black text-primary hover:text-orange-500 transition-colors inline-flex items-center gap-1">
                  Read <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
