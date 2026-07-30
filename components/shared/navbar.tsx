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
import { LayoutDashboard, LogOut, User, Home, Building2, Info, Phone } from "lucide-react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";
import { Button } from "../ui/button";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function Navbar({ user }: { user: any }) {
  const router = useRouter();
  const pathname = usePathname();

  // Helper to determine active link
  const isActive = (href: string) => pathname === href;

  // Resolve user info from backend format
  const isUserLoggedIn = user && user.success && user.data?.user;
  const userData = user.data?.user;
  const userRole = userData?.role?.toUpperCase();

  // Resolve dashboard URL
  let dashboardUrl = "/auth/login";
  if (isUserLoggedIn) {
    if (userRole === "TENANT") dashboardUrl = "/dashboard/tenant";
    else if (userRole === "LANDLORD") dashboardUrl = "/dashboard/landlord";
    else if (userRole === "ADMIN") dashboardUrl = "/dashboard/admin";
  }

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully!");
    router.push("/auth/login");
    router.refresh();
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-100 bg-white/80 backdrop-blur-md transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="shrink-0 flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center group-hover:bg-primary transition-colors duration-300">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-black text-slate-900 tracking-tight group-hover:text-primary transition-colors">
              RentNest<span className="text-orange-500">.</span>
            </span>
          </Link>

          {/* Navigation Items */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className={`text-sm font-semibold transition-all duration-200 py-1.5 px-3 rounded-lg flex items-center gap-1.5 ${
                isActive("/")
                  ? "text-primary bg-primary/5"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <Home className="w-4 h-4" /> 🏠 Home
            </Link>

            <Link
              href="/properties"
              className={`text-sm font-semibold transition-all duration-200 py-1.5 px-3 rounded-lg flex items-center gap-1.5 ${
                isActive("/properties")
                  ? "text-primary bg-primary/5"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <Building2 className="w-4 h-4" /> 🏢 Properties
            </Link>

            <Link
              href="/about"
              className={`text-sm font-semibold transition-all duration-200 py-1.5 px-3 rounded-lg flex items-center gap-1.5 ${
                isActive("/about")
                  ? "text-primary bg-primary/5"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <Info className="w-4 h-4" /> ℹ️ About
            </Link>

            <Link
              href="/contact"
              className={`text-sm font-semibold transition-all duration-200 py-1.5 px-3 rounded-lg flex items-center gap-1.5 ${
                isActive("/contact")
                  ? "text-primary bg-primary/5"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <Phone className="w-4 h-4" /> 📞 Contact
            </Link>

            {isUserLoggedIn && (
              <Link
                href={dashboardUrl}
                className={`text-sm font-semibold transition-all duration-200 py-1.5 px-3 rounded-lg flex items-center gap-1.5 ${
                  pathname.startsWith("/dashboard")
                    ? "text-primary bg-primary/5"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <LayoutDashboard className="w-4 h-4" /> Dashboard
              </Link>
            )}
          </div>

          {/* Right Action Menu */}
          <div className="flex items-center gap-4">
            {isUserLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 p-1.5 pr-3 bg-slate-50 hover:bg-slate-100 border border-slate-200/60 rounded-full cursor-pointer transition-all duration-200 group focus:outline-none">
                    {userData.image ? (
                      <img
                        src={userData.image}
                        alt={userData.name}
                        className="w-8 h-8 rounded-full object-cover border border-slate-200 shadow-sm group-hover:scale-105 transition-transform duration-200"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center text-sm shadow-sm group-hover:scale-105 transition-transform duration-200">
                        {userData.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <span className="hidden sm:inline text-sm font-bold text-slate-700">
                      {userData.name.split(" ")[0]}
                    </span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 mt-1.5 p-1 rounded-2xl border border-slate-100 shadow-[0_10px_30px_rgba(0,0,0,0.08)] bg-white animate-fade-in-up">
                  <DropdownMenuLabel className="font-normal px-3.5 py-3">
                    <div className="flex flex-col gap-1.5">
                      <p className="text-sm font-bold text-slate-800 leading-none">
                        {userData.name}
                      </p>
                      <p className="text-xs text-slate-400 font-medium leading-none">
                        {userData.email}
                      </p>
                      <span className="inline-flex self-start mt-1 text-[10px] font-bold text-primary bg-primary/5 px-2 py-0.5 rounded-full border border-primary/10">
                        {userRole}
                      </span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-slate-100" />
                  
                  <DropdownMenuItem
                    onClick={() => router.push(dashboardUrl)}
                    className="flex items-center px-3.5 py-2.5 rounded-xl cursor-pointer text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
                  >
                    <LayoutDashboard className="w-4.5 h-4.5 mr-2.5 text-slate-400" />
                    <span className="text-sm font-medium">My Dashboard</span>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator className="bg-slate-100" />
                  
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="flex items-center px-3.5 py-2.5 rounded-xl cursor-pointer text-red-500 hover:bg-red-50/50 hover:text-red-600 transition-colors"
                  >
                    <LogOut className="w-4.5 h-4.5 mr-2.5 text-red-400" />
                    <span className="text-sm font-bold">Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/auth/login" className="hidden sm:inline-block">
                  <Button variant="ghost" className="font-bold text-slate-600 hover:text-slate-900">
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button className="bg-slate-900 hover:bg-slate-800 text-white rounded-full px-5 py-5 text-sm font-bold shadow-md hover:shadow-lg transition-all">
                    Register
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}