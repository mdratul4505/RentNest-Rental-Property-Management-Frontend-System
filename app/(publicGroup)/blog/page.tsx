"use client";

import { useState } from "react";
import { Search, Calendar, Clock, User, ArrowRight, BookOpen, Tag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const BLOG_ARTICLES = [
  {
    id: "1",
    title: "10 Essential Tips for First-Time Apartment Renters in Dhaka",
    snippet: "Navigating leases, security deposits, utility payments, and location advantages when renting your first home.",
    category: "Tenant Guide",
    date: "Sep 02, 2026",
    readTime: "5 min read",
    author: "Tanvir Rahman",
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=800",
    featured: true,
  },
  {
    id: "2",
    title: "Landlord Best Practices: Managing High-Demand Rental Properties",
    snippet: "How to screen prospective tenants, handle maintenance requests fast, and maintain 98%+ occupancy rates.",
    category: "Landlord Tips",
    date: "Aug 28, 2026",
    readTime: "7 min read",
    author: "Farhana Chowdhury",
    image: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&q=80&w=800",
    featured: false,
  },
  {
    id: "3",
    title: "Dhaka Real Estate Market Trends: Where to Invest in 2026",
    snippet: "An in-depth review of emerging residential hotspots across Gulshan, Banani, Purbachal, and Uttara.",
    category: "Market Analysis",
    date: "Aug 15, 2026",
    readTime: "6 min read",
    author: "Asif Mahmood",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800",
    featured: false,
  },
  {
    id: "4",
    title: "Understanding Tenant Legal Rights and Rental Agreements in Bangladesh",
    snippet: "What every renter should know before signing a tenancy contract to protect their security deposit and privacy.",
    category: "Tenant Guide",
    date: "Jul 30, 2026",
    readTime: "8 min read",
    author: "Barrister S. Hossain",
    image: "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&q=80&w=800",
    featured: false,
  },
  {
    id: "5",
    title: "Interior Decor Hacks for Small Rental Apartments",
    snippet: "Transform compact spaces into cozy, stylish homes using removable wallpaper, multi-purpose furniture, and lighting.",
    category: "Design & Living",
    date: "Jul 18, 2026",
    readTime: "4 min read",
    author: "Mariya Sultana",
    image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=800",
    featured: false,
  },
];

export default function BlogPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", "Tenant Guide", "Landlord Tips", "Market Analysis", "Design & Living"];

  const filteredArticles = BLOG_ARTICLES.filter((article) => {
    const matchesSearch =
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.snippet.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === "All" || article.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const featuredArticle = BLOG_ARTICLES[0];

  return (
    <div className="bg-slate-50/50 dark:bg-slate-950 min-h-screen py-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <span className="text-xs font-black uppercase tracking-widest text-orange-500 bg-orange-500/10 px-3.5 py-1.5 rounded-full inline-block">
            RentNest Publications
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            Rental Housing Blog & News
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
            Expert insights, tenant guidelines, landlord strategies, and market analysis for smart living.
          </p>

          {/* Search bar */}
          <div className="relative max-w-md mx-auto pt-2">
            <input
              type="text"
              placeholder="Search articles by topic..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-slate-100 font-bold text-xs focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-sm"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-6 pointer-events-none" />
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-2xl text-xs font-extrabold transition-all cursor-pointer ${
                selectedCategory === cat
                  ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-md"
                  : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-800 hover:bg-slate-100"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Featured Hero Article */}
        {selectedCategory === "All" && !searchTerm && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/60 dark:border-slate-800 overflow-hidden shadow-lg grid grid-cols-1 lg:grid-cols-2"
          >
            <div className="relative h-64 lg:h-auto min-h-[300px]">
              <Image src={featuredArticle.image} alt={featuredArticle.title} fill className="object-cover" />
              <span className="absolute top-4 left-4 bg-orange-500 text-white text-[10px] font-black uppercase tracking-wider px-3.5 py-1.5 rounded-full shadow-md">
                Featured Insight
              </span>
            </div>

            <div className="p-8 sm:p-10 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-4 text-xs font-bold text-slate-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-orange-500" /> {featuredArticle.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> {featuredArticle.readTime}
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white leading-tight">
                  {featuredArticle.title}
                </h2>

                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium leading-relaxed">
                  {featuredArticle.snippet}
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                  <User className="w-4 h-4 text-orange-500" /> {featuredArticle.author}
                </span>
                <span className="text-xs font-black text-orange-500 flex items-center gap-1 cursor-pointer">
                  Read Full Article <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredArticles.map((article, idx) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08 }}
              whileHover={{ y: -6 }}
              className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/60 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full">
                    {article.category}
                  </span>
                </div>

                <div className="p-6 space-y-3">
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-orange-500" /> {article.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> {article.readTime}
                    </span>
                  </div>

                  <h3 className="font-extrabold text-slate-900 dark:text-white text-lg group-hover:text-orange-500 transition-colors line-clamp-2">
                    {article.title}
                  </h3>

                  <p className="text-slate-500 dark:text-slate-400 text-xs font-medium line-clamp-2 leading-relaxed">
                    {article.snippet}
                  </p>
                </div>
              </div>

              <div className="px-6 pb-6 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-orange-500" /> {article.author}
                </span>
                <span className="text-xs font-black text-orange-500 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                  Read <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
}
