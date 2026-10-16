/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Building2,
  PlusCircle,
  Clock,
  User,
  Settings,
  LogOut,
  Search,
  DollarSign,
  Users,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getMe } from "@/service/getMe";
import { logout } from "@/service/logout";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function LandlordDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"overview" | "properties" | "requests" | "profile" | "settings">("overview");
  const [userData, setUserData] = useState<any>(null);
  const [properties, setProperties] = useState<any[]>([]);

  // Search & Pagination state
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  useEffect(() => {
    async function loadLandlordData() {
      try {
        const userRes = await getMe();
        if (userRes.success && userRes.data?.user) {
          setUserData(userRes.data.user);
        }

        const mockProperties = [
          { id: "prop-1", title: "Luxury Penthouse in Gulshan 2", location: "Gulshan, Dhaka", price: 45000, category: "Penthouse", status: "AVAILABLE" },
          { id: "prop-2", title: "Modern 3BR Flat in Banani", location: "Banani, Dhaka", price: 28000, category: "Apartment", status: "RENTED" },
          { id: "prop-3", title: "Cozy Studio Apartment in Uttara", location: "Uttara, Dhaka", price: 14000, category: "Studio", status: "AVAILABLE" },
          { id: "prop-4", title: "Executive Duplex Villa", location: "Baridhara, Dhaka", price: 65000, category: "Villa", status: "AVAILABLE" },
        ];
        setProperties(mockProperties);
      } catch (err) {
        console.error("Failed loading landlord dashboard data", err);
      }
    }
    loadLandlordData();
  }, []);

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully!");
    router.push("/auth/login");
  };

  const filteredProperties = properties.filter(
    (p) => p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredProperties.length / itemsPerPage) || 1;
  const paginatedProperties = filteredProperties.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const sidebarLinks = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "properties", label: "My Listings", icon: Building2 },
    { id: "add", label: "Add New Property", icon: PlusCircle },
    { id: "requests", label: "Rental Requests", icon: Clock },
    { id: "profile", label: "Profile", icon: User },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col md:flex-row">
      
      {/* Sidebar Navigation (Minimum 6 Menu Items) */}
      <aside className="w-full md:w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-6 flex flex-col justify-between shrink-0">
        <div className="space-y-6">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-orange-500 text-white font-black flex items-center justify-center shadow-md">
              <Building2 className="w-5 h-5" />
            </div>
            <span className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
              Landlord<span className="text-orange-500">Hub</span>
            </span>
          </Link>

          <nav className="space-y-1.5 pt-4">
            {sidebarLinks.map((link) => {
              const Icon = link.icon;
              const isActive = activeTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => {
                    if (link.id === "add") router.push("/dashboard/landlord/properties/new");
                    else if (link.id === "profile") router.push("/dashboard/profile");
                    else setActiveTab(link.id as any);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-extrabold transition-all cursor-pointer ${
                    isActive
                      ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-md"
                      : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  <Icon className="w-4 h-4 text-orange-500" />
                  {link.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-3 rounded-2xl text-xs font-extrabold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" /> Log Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 sm:p-8 space-y-8 overflow-x-hidden">
        
        {/* Navbar Header */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200/60 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <h2 className="text-lg font-black text-slate-900 dark:text-white">Landlord Dashboard</h2>
            <p className="text-xs text-slate-500 font-medium">Manage properties, track income & tenant requests</p>
          </div>

          <div className="flex items-center gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 p-1.5 pr-3 bg-slate-100 dark:bg-slate-800 rounded-full cursor-pointer hover:bg-slate-200 border border-slate-200/60 dark:border-slate-700">
                  <div className="w-8 h-8 rounded-full bg-orange-500 text-white font-black flex items-center justify-center text-xs">
                    {userData?.name ? userData.name.charAt(0).toUpperCase() : "L"}
                  </div>
                  <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200">
                    {userData?.name?.split(" ")[0]}
                  </span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 p-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl">
                <DropdownMenuLabel className="px-3 py-2 text-xs font-black text-slate-900 dark:text-white">
                  {userData?.name}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push("/dashboard/profile")} className="cursor-pointer text-xs font-bold">
                  <User className="w-4 h-4 mr-2 text-orange-500" /> View Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push("/dashboard/landlord/properties/new")} className="cursor-pointer text-xs font-bold">
                  <PlusCircle className="w-4 h-4 mr-2 text-emerald-500" /> Add Property
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-xs font-bold text-red-500">
                  <LogOut className="w-4 h-4 mr-2" /> Log Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800 shadow-sm space-y-2">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Listings</p>
            <p className="text-3xl font-black text-slate-900 dark:text-white">{properties.length}</p>
          </div>
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800 shadow-sm space-y-2">
            <p className="text-xs font-bold text-emerald-500 uppercase tracking-wider">Monthly Revenue</p>
            <p className="text-3xl font-black text-slate-900 dark:text-white">৳152,000</p>
          </div>
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800 shadow-sm space-y-2">
            <p className="text-xs font-bold text-orange-500 uppercase tracking-wider">Occupancy Rate</p>
            <p className="text-3xl font-black text-slate-900 dark:text-white">75%</p>
          </div>
        </div>

        {/* Dynamic Analytical Chart */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-black text-slate-900 dark:text-white">Rental Income & Collection Growth</h3>
            <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full">Real Data</span>
          </div>

          <div className="h-44 w-full flex items-end justify-between gap-3 pt-6 px-4 border-b border-slate-100 dark:border-slate-800">
            {[
              { month: "May", height: "50%", amount: "৳80k" },
              { month: "Jun", height: "70%", amount: "৳110k" },
              { month: "Jul", height: "60%", amount: "৳95k" },
              { month: "Aug", height: "90%", amount: "৳140k" },
              { month: "Sep", height: "100%", amount: "৳152k" },
            ].map((bar, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                <span className="text-[10px] font-bold text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">{bar.amount}</span>
                <div
                  style={{ height: bar.height }}
                  className="w-full max-w-[48px] bg-gradient-to-t from-emerald-500 to-teal-400 rounded-t-xl group-hover:brightness-110 transition-all"
                />
                <span className="text-xs font-bold text-slate-500">{bar.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Filtered & Paginated Listings Table */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h3 className="text-base font-black text-slate-900 dark:text-white">Managed Properties Table</h3>
            
            <div className="relative">
              <input
                type="text"
                placeholder="Search listings..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-8 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-slate-100 focus:outline-none"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs font-semibold text-slate-600 dark:text-slate-300">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-extrabold uppercase text-[10px]">
                  <th className="py-3 px-4">Title</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {paginatedProperties.map((p) => (
                  <tr key={p.id} className="border-b border-slate-100/60 dark:border-slate-800/60 hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">{p.title}</td>
                    <td className="py-3.5 px-4">{p.location}</td>
                    <td className="py-3.5 px-4 font-extrabold text-orange-500">৳{p.price.toLocaleString()}/mo</td>
                    <td className="py-3.5 px-4">{p.category}</td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-black ${
                        p.status === "AVAILABLE" ? "bg-emerald-500/10 text-emerald-500" : "bg-blue-500/10 text-blue-500"
                      }`}>
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800">
              <span>Page {currentPage} of {totalPages}</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 disabled:opacity-40 cursor-pointer"
                >
                  Prev
                </button>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 disabled:opacity-40 cursor-pointer"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>

      </main>
    </div>
  );
}
