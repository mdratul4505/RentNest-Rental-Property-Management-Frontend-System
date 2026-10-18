"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logout } from "@/service/logout";
import {
  LayoutDashboard,
  LogOut,
  User,
  Home,
  Building2,
  Info,
  Phone,
  Sun,
  Moon,
  BookOpen,
  Menu,
  X,
  Sparkles,
  ShieldAlert,
} from "lucide-react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function Navbar({ user }: { user: any }) {
  const router = useRouter();
  const pathname = usePathname();
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Active link detector
  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  // User session info
  const isUserLoggedIn = Boolean(user && user.success && user.data?.user);
  const userData = user?.data?.user;
  const userRole = userData?.role?.toUpperCase();

  // Initialize theme
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    const initialTheme = savedTheme || systemTheme;
    setTheme(initialTheme);
    if (initialTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    localStorage.setItem("theme", nextTheme);
    if (nextTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  // Resolve dashboard URL based on role
  let dashboardUrl = "/auth/login";
  if (isUserLoggedIn) {
    if (userRole === "TENANT") dashboardUrl = "/dashboard/tenant";
    else if (userRole === "LANDLORD") dashboardUrl = "/dashboard/landlord";
    else if (userRole === "ADMIN") dashboardUrl = "/dashboard/admin";
  }

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully!");
    window.location.href = "/auth/login";
  };

  const navLinks = [
    { href: "/", label: "Home", icon: Home },
    { href: "/properties", label: "Properties", icon: Building2 },
    { href: "/about", label: "About", icon: Info },
    { href: "/blog", label: "Blog", icon: BookOpen },
    { href: "/contact", label: "Contact", icon: Phone },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/60 dark:border-slate-800/80 bg-white/85 dark:bg-slate-950/85 backdrop-blur-xl transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo */}
          <Link href="/" className="shrink-0 flex items-center gap-3 group">
            <motion.div
              whileHover={{ rotate: 10, scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-slate-900 via-primary to-orange-500 flex items-center justify-center shadow-md shadow-primary/20"
            >
              <Building2 className="w-5 h-5 text-white" />
            </motion.div>
            <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tight group-hover:text-primary transition-colors">
              RentNest<span className="text-orange-500">.</span>
            </span>
          </Link>

          {/* Desktop Nav Routes */}
          <nav className="hidden md:flex items-center gap-1.5 bg-slate-100/60 dark:bg-slate-900/60 p-1.5 rounded-full border border-slate-200/50 dark:border-slate-800/50">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative text-xs font-extrabold transition-all duration-300 py-2 px-4 rounded-full flex items-center gap-2 ${
                    active
                      ? "text-white bg-slate-900 dark:bg-slate-100 dark:text-slate-900 shadow-sm"
                      : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-800/60"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {link.label}
                </Link>
              );
            })}

            {/* Dashboard Link for Logged In User */}
            {isUserLoggedIn && (
              <Link
                href={dashboardUrl}
                className={`relative text-xs font-extrabold transition-all duration-300 py-2 px-4 rounded-full flex items-center gap-2 ${
                  pathname.startsWith("/dashboard")
                    ? "text-white bg-slate-900 dark:bg-slate-100 dark:text-slate-900 shadow-sm"
                    : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-800/60"
                }`}
              >
                <LayoutDashboard className="w-4 h-4 text-orange-500" />
                Dashboard
              </Link>
            )}
          </nav>

          {/* Right Action Menu */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle Button */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={toggleTheme}
              className="p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors border border-slate-200/60 dark:border-slate-800 cursor-pointer focus:outline-none"
              aria-label="Toggle theme"
            >
              {theme === "light" ? <Moon className="w-4.5 h-4.5" /> : <Sun className="w-4.5 h-4.5 text-amber-400" />}
            </motion.button>

            {isUserLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2.5 p-1.5 pr-3.5 bg-slate-100/80 dark:bg-slate-900 hover:bg-slate-200/80 dark:hover:bg-slate-800 border border-slate-200/60 dark:border-slate-800 rounded-full cursor-pointer transition-all duration-200 group focus:outline-none">
                    {userData?.image && userData.image !== "" && userData.image !== "null" ? (
                      <img
                        src={userData.image}
                        alt={userData.name}
                        className="w-8 h-8 rounded-full object-cover border border-slate-300 dark:border-slate-700 shadow-sm group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-slate-900 to-primary text-white font-black flex items-center justify-center text-xs shadow-sm">
                        {userData?.name ? userData.name.charAt(0).toUpperCase() : "U"}
                      </div>
                    )}
                    <div className="hidden sm:flex flex-col text-left">
                      <span className="text-xs font-black text-slate-800 dark:text-slate-100 leading-none">
                        {userData?.name?.split(" ")[0]}
                      </span>
                      <span className="text-[9px] font-bold text-orange-500 leading-none mt-0.5">
                        {userRole}
                      </span>
                    </div>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64 mt-2 p-2 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-2xl bg-white dark:bg-slate-900 animate-scale-in">
                  <DropdownMenuLabel className="font-normal px-3 py-3">
                    <div className="flex flex-col gap-1.5">
                      <p className="text-sm font-black text-slate-900 dark:text-white leading-none">
                        {userData?.name}
                      </p>
                      <p className="text-xs text-slate-400 dark:text-slate-400 font-medium truncate">
                        {userData?.email}
                      </p>
                      <span className="inline-flex self-start mt-1 text-[10px] font-extrabold text-orange-600 bg-orange-500/10 px-2.5 py-0.5 rounded-full border border-orange-500/20">
                        Role: {userRole}
                      </span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-slate-100 dark:bg-slate-800" />
                  
                  <DropdownMenuItem
                    onClick={() => router.push(dashboardUrl)}
                    className="flex items-center px-3.5 py-2.5 rounded-2xl cursor-pointer text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold text-xs"
                  >
                    <LayoutDashboard className="w-4 h-4 mr-2 text-primary" />
                    My Dashboard
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={() => router.push("/properties")}
                    className="flex items-center px-3.5 py-2.5 rounded-2xl cursor-pointer text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold text-xs"
                  >
                    <Building2 className="w-4 h-4 mr-2 text-emerald-500" />
                    Explore Properties
                  </DropdownMenuItem>

                  <DropdownMenuSeparator className="bg-slate-100 dark:bg-slate-800" />
                  
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="flex items-center px-3.5 py-2.5 rounded-2xl cursor-pointer text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 font-bold text-xs"
                  >
                    <LogOut className="w-4 h-4 mr-2 text-red-500" />
                    Log Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link href="/auth/login">
                  <Button variant="ghost" className="font-extrabold text-xs text-slate-700 dark:text-slate-200 hover:text-slate-900 rounded-full px-4">
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                    <Button className="bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-slate-200 text-white dark:text-slate-900 rounded-full px-5 py-5 text-xs font-black shadow-lg shadow-slate-900/10">
                      Register
                    </Button>
                  </motion.div>
                </Link>
              </div>
            )}

            {/* Mobile Hamburger Toggle */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-200 border border-slate-200/60 dark:border-slate-800"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 pt-4 pb-6 space-y-3"
          >
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 p-3 rounded-2xl text-sm font-extrabold ${
                    isActive(link.href)
                      ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                      : "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900"
                  }`}
                >
                  <Icon className="w-4.5 h-4.5" />
                  {link.label}
                </Link>
              );
            })}

            {!isUserLoggedIn && (
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-3">
                <Link href="/auth/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full rounded-xl font-bold py-5 text-xs">
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/register" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full bg-slate-900 text-white rounded-xl font-bold py-5 text-xs">
                    Register
                  </Button>
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}