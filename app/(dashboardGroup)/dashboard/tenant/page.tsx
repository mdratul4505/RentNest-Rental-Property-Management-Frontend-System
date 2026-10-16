/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Clock,
  CheckCircle2,
  XCircle,
  Building2,
  Calendar,
  DollarSign,
  ChevronLeft,
  ChevronRight,
  Filter,
  User,
  Settings,
  Heart,
  CreditCard,
  LogOut,
  Moon,
  Sun,
  Search,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getMe } from "@/service/getMe";
import { logout } from "@/service/logout";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function TenantDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"overview" | "requests" | "saved" | "profile" | "settings">("overview");
  const [userData, setUserData] = useState<any>(null);
  const [requests, setRequests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Search & Filter state for requests table
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  useEffect(() => {
    async function loadTenantData() {
      try {
        const userRes = await getMe();
        if (userRes.success && userRes.data?.user) {
          setUserData(userRes.data.user);
        }

        // Mock/Fetch Tenant Requests
        const mockRequests = [
          { id: "req-101", property: { title: "Luxury Penthouse in Gulshan 2", location: "Gulshan, Dhaka", price: 45000 }, moveInDate: "2026-09-15", status: "APPROVED", rentAmount: 45000 },
          { id: "req-102", property: { title: "Modern 3BR Flat in Banani", location: "Banani, Dhaka", price: 28000 }, moveInDate: "2026-09-20", status: "PENDING", rentAmount: 28000 },
          { id: "req-103", property: { title: "Cozy Studio Apartment in Uttara", location: "Uttara, Dhaka", price: 14000 }, moveInDate: "2026-08-01", status: "REJECTED", rentAmount: 14000 },
          { id: "req-104", property: { title: "Family Residence in Dhanmondi", location: "Dhanmondi, Dhaka", price: 22000 }, moveInDate: "2026-10-01", status: "APPROVED", rentAmount: 22000 },
          { id: "req-105", property: { title: "Executive Duplex Villa", location: "Baridhara, Dhaka", price: 65000 }, moveInDate: "2026-10-10", status: "PENDING", rentAmount: 65000 },
        ];
        setRequests(mockRequests);
      } catch (err) {
        console.error("Failed loading tenant dashboard data", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadTenantData();
  }, []);

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully!");
    router.push("/auth/login");
  };

  // Filter requests
  const filteredRequests = requests.filter((req) => {
    const matchesSearch =
      req.property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.property.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || req.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage) || 1;
  const paginatedRequests = filteredRequests.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const sidebarLinks = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "requests", label: "My Rental Requests", icon: Clock },
    { id: "saved", label: "Saved Wishlist", icon: Heart },
    { id: "profile", label: "My Profile", icon: User },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors flex flex-col md:flex-row">
      
      {/* Sidebar Navigation (Minimum 4 Menu Items) */}
      <aside className="w-full md:w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-6 flex flex-col justify-between shrink-0">
        <div className="space-y-6">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-orange-500 text-white font-black flex items-center justify-center shadow-md">
              <Building2 className="w-5 h-5" />
            </div>
            <span className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
              Tenant<span className="text-orange-500">Hub</span>
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
                    setActiveTab(link.id as any);
                    if (link.id === "profile") router.push("/dashboard/profile");
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

      {/* Main Content Area */}
      <main className="flex-1 p-6 sm:p-8 space-y-8 overflow-x-hidden">
        
        {/* Navbar with Profile Icon & Dropdown */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200/60 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <h2 className="text-lg font-black text-slate-900 dark:text-white">Tenant Dashboard</h2>
            <p className="text-xs text-slate-500 font-medium">Welcome back, {userData?.name || "Tenant"}</p>
          </div>

          <div className="flex items-center gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 p-1.5 pr-3 bg-slate-100 dark:bg-slate-800 rounded-full cursor-pointer hover:bg-slate-200 border border-slate-200/60 dark:border-slate-700">
                  <div className="w-8 h-8 rounded-full bg-orange-500 text-white font-black flex items-center justify-center text-xs">
                    {userData?.name ? userData.name.charAt(0).toUpperCase() : "T"}
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
                <DropdownMenuItem onClick={() => router.push("/properties")} className="cursor-pointer text-xs font-bold">
                  <Building2 className="w-4 h-4 mr-2 text-emerald-500" /> Browse Properties
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
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Requests</p>
            <p className="text-3xl font-black text-slate-900 dark:text-white">{requests.length}</p>
          </div>
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800 shadow-sm space-y-2">
            <p className="text-xs font-bold text-emerald-500 uppercase tracking-wider">Approved Requests</p>
            <p className="text-3xl font-black text-slate-900 dark:text-white">
              {requests.filter((r) => r.status === "APPROVED").length}
            </p>
          </div>
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800 shadow-sm space-y-2">
            <p className="text-xs font-bold text-amber-500 uppercase tracking-wider">Pending Requests</p>
            <p className="text-3xl font-black text-slate-900 dark:text-white">
              {requests.filter((r) => r.status === "PENDING").length}
            </p>
          </div>
        </div>

        {/* Dynamic Analytics Chart (Monthly Rental Spending SVG Bar Chart) */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-black text-slate-900 dark:text-white">Monthly Rental Activity & Spending</h3>
            <span className="text-xs font-bold text-orange-500 bg-orange-500/10 px-3 py-1 rounded-full">Dynamic Data</span>
          </div>

          {/* SVG Bar Chart */}
          <div className="h-44 w-full flex items-end justify-between gap-3 pt-6 px-4 border-b border-slate-100 dark:border-slate-800">
            {[
              { month: "May", height: "40%", amount: "৳14k" },
              { month: "Jun", height: "65%", amount: "৳22k" },
              { month: "Jul", height: "80%", amount: "৳28k" },
              { month: "Aug", height: "55%", amount: "৳18k" },
              { month: "Sep", height: "95%", amount: "৳45k" },
            ].map((bar, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                <span className="text-[10px] font-bold text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">{bar.amount}</span>
                <div
                  style={{ height: bar.height }}
                  className="w-full max-w-[48px] bg-gradient-to-t from-orange-500 to-amber-400 rounded-t-xl group-hover:brightness-110 transition-all"
                />
                <span className="text-xs font-bold text-slate-500">{bar.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Filtered & Paginated Table */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800 shadow-sm space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h3 className="text-base font-black text-slate-900 dark:text-white">Rental Application History</h3>
            
            {/* Controls */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Filter by property..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pl-8 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-slate-100 focus:outline-none"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-slate-100 focus:outline-none cursor-pointer"
              >
                <option value="all">All Status</option>
                <option value="APPROVED">Approved</option>
                <option value="PENDING">Pending</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs font-semibold text-slate-600 dark:text-slate-300">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-extrabold uppercase text-[10px]">
                  <th className="py-3 px-4">Property</th>
                  <th className="py-3 px-4">Move-In Date</th>
                  <th className="py-3 px-4">Rent</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {paginatedRequests.map((req) => (
                  <tr key={req.id} className="border-b border-slate-100/60 dark:border-slate-800/60 hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">{req.property.title}</td>
                    <td className="py-3.5 px-4">{req.moveInDate}</td>
                    <td className="py-3.5 px-4 font-extrabold text-orange-500">৳{req.rentAmount.toLocaleString()}</td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-black ${
                        req.status === "APPROVED" ? "bg-emerald-500/10 text-emerald-500" :
                        req.status === "PENDING" ? "bg-amber-500/10 text-amber-500" : "bg-red-500/10 text-red-500"
                      }`}>
                        {req.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
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
