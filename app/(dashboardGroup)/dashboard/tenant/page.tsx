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
  ArrowRight,
  ShieldAlert,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getMe } from "@/service/getMe";
import { getTenantRentals } from "@/service/tenant";
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
  const itemsPerPage = 5;

  useEffect(() => {
    async function loadTenantData() {
      try {
        const userRes = await getMe();
        if (!userRes.success || !userRes.data?.user) {
          window.location.href = "/auth/login";
          return;
        }

        const user = userRes.data.user;
        const role = user.role?.toUpperCase();

        if (role === "LANDLORD") {
          window.location.href = "/dashboard/landlord";
          return;
        } else if (role === "ADMIN") {
          window.location.href = "/dashboard/admin";
          return;
        }

        setUserData(user);

        // Fetch real rental requests for this specific logged-in tenant
        const rentalsRes = await getTenantRentals();
        if (rentalsRes.success && Array.isArray(rentalsRes.data)) {
          setRequests(rentalsRes.data);
        } else {
          setRequests([]);
        }
      } catch (err) {
        console.error("Failed loading tenant dashboard data", err);
        setRequests([]);
      } finally {
        setIsLoading(false);
      }
    }
    loadTenantData();
  }, []);

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully!");
    window.location.href = "/auth/login";
  };

  // Filter requests
  const filteredRequests = requests.filter((req) => {
    const propTitle = req.property?.title || "";
    const propLoc = req.property?.location || "";
    const matchesSearch =
      propTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      propLoc.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || req.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage) || 1;
  const paginatedRequests = filteredRequests.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Dynamically calculate monthly rental activity from user's requests
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const currentMonthIdx = new Date().getMonth();
  const last5Months = Array.from({ length: 5 }, (_, i) => {
    const d = new Date();
    d.setMonth(currentMonthIdx - (4 - i));
    return {
      month: monthNames[d.getMonth()],
      monthIdx: d.getMonth(),
    };
  });

  const chartData = last5Months.map((m) => {
    const monthlyRequests = requests.filter((r) => {
      const rDate = new Date(r.createdAt || r.moveInDate || Date.now());
      return rDate.getMonth() === m.monthIdx;
    });
    const monthlyTotal = monthlyRequests.reduce(
      (sum, r) => sum + Number(r.rentAmount || r.property?.price || 0),
      0
    );
    return {
      month: m.month,
      count: monthlyRequests.length,
      amount: monthlyTotal,
      label: monthlyTotal >= 1000 ? `৳${Math.round(monthlyTotal / 1000)}k` : `৳${monthlyTotal}`,
    };
  });

  const maxAmount = Math.max(...chartData.map((c) => c.amount), 1);

  const sidebarLinks = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "requests", label: "My Rental Requests", icon: Clock },
    { id: "saved", label: "Saved Wishlist", icon: Heart },
    { id: "profile", label: "My Profile", icon: User },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-bold text-slate-500">Loading your personalized dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
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

          {/* User Identity Chip */}
          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/60 dark:border-slate-700 space-y-1">
            <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Signed In As</p>
            <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{userData?.name}</p>
            <p className="text-[11px] text-slate-500 truncate">{userData?.email}</p>
            {userData?.id && (
              <p className="text-[9px] font-mono text-slate-400 truncate pt-0.5">ID: {userData.id}</p>
            )}
          </div>

          <nav className="space-y-1.5 pt-2">
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
            <p className="text-xs text-slate-500 font-medium">
              Welcome back, <span className="font-bold text-slate-800 dark:text-slate-200">{userData?.name || "Tenant"}</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex text-[10px] font-black uppercase tracking-wider text-orange-500 bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/20">
              Tenant Account
            </span>

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
                  <p className="text-[10px] font-normal text-slate-400">{userData?.email}</p>
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

        {/* Overview Cards (Real Dynamic Counts) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800 shadow-sm space-y-2">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Requests</p>
            <p className="text-3xl font-black text-slate-900 dark:text-white">{requests.length}</p>
            <p className="text-[11px] text-slate-400">Applications submitted by you</p>
          </div>
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800 shadow-sm space-y-2">
            <p className="text-xs font-bold text-emerald-500 uppercase tracking-wider">Approved Requests</p>
            <p className="text-3xl font-black text-slate-900 dark:text-white">
              {requests.filter((r) => r.status === "APPROVED").length}
            </p>
            <p className="text-[11px] text-slate-400">Ready for payment / lease</p>
          </div>
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800 shadow-sm space-y-2">
            <p className="text-xs font-bold text-amber-500 uppercase tracking-wider">Pending Requests</p>
            <p className="text-3xl font-black text-slate-900 dark:text-white">
              {requests.filter((r) => r.status === "PENDING").length}
            </p>
            <p className="text-[11px] text-slate-400">Awaiting landlord response</p>
          </div>
        </div>

        {/* Dynamic Analytics Chart */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white">Monthly Rental Activity & Spending</h3>
              <p className="text-xs text-slate-500 font-medium">Calculated directly from your personal application history</p>
            </div>
            <span className="text-xs font-bold text-orange-500 bg-orange-500/10 px-3 py-1 rounded-full">
              {requests.length > 0 ? "Active User Data" : "New Account"}
            </span>
          </div>

          {/* SVG Bar Chart */}
          <div className="h-44 w-full flex items-end justify-between gap-3 pt-6 px-4 border-b border-slate-100 dark:border-slate-800">
            {chartData.map((bar, i) => {
              const heightPercent = bar.amount > 0 ? Math.max(Math.round((bar.amount / maxAmount) * 100), 15) : 8;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <span className="text-[10px] font-bold text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    {bar.label} ({bar.count} req)
                  </span>
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className={`w-full max-w-[48px] rounded-t-xl transition-all ${
                      bar.amount > 0
                        ? "bg-gradient-to-t from-orange-500 to-amber-400 group-hover:brightness-110"
                        : "bg-slate-100 dark:bg-slate-800"
                    }`}
                  />
                  <span className="text-xs font-bold text-slate-500">{bar.month}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Filtered & Paginated Table */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white">Rental Application History</h3>
              <p className="text-xs text-slate-500 font-medium">Track your submitted rental requests and approval statuses</p>
            </div>

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

          {/* Table or Empty State */}
          {filteredRequests.length === 0 ? (
            <div className="text-center py-12 px-4 space-y-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-orange-500/10 text-orange-500 flex items-center justify-center">
                <Building2 className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-black text-slate-900 dark:text-white">
                  {searchQuery || statusFilter !== "all" ? "No matching requests found" : "No rental requests yet"}
                </h4>
                <p className="text-xs text-slate-500 font-medium max-w-sm mx-auto">
                  {searchQuery || statusFilter !== "all"
                    ? "Try adjusting your search terms or status filters."
                    : "You haven't submitted any rental requests yet. Explore available properties to find your dream apartment!"}
                </p>
              </div>
              <Link
                href="/properties"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs rounded-xl transition-all shadow-md cursor-pointer"
              >
                <Building2 className="w-4 h-4" /> Browse Available Properties
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs font-semibold text-slate-600 dark:text-slate-300">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-extrabold uppercase text-[10px]">
                    <th className="py-3 px-4">Property</th>
                    <th className="py-3 px-4">Move-In Date</th>
                    <th className="py-3 px-4">Rent</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedRequests.map((req) => {
                    const price = req.rentAmount || req.property?.price || 0;
                    const dateStr = req.moveInDate
                      ? new Date(req.moveInDate).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })
                      : "Flexible";
                    return (
                      <tr
                        key={req.id}
                        className="border-b border-slate-100/60 dark:border-slate-800/60 hover:bg-slate-50/50 dark:hover:bg-slate-800/40"
                      >
                        <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                          <div>
                            <p>{req.property?.title || "Property Rental"}</p>
                            <p className="text-[10px] font-normal text-slate-400">{req.property?.location || "Dhaka"}</p>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">{dateStr}</td>
                        <td className="py-3.5 px-4 font-extrabold text-orange-500">৳{Number(price).toLocaleString()}</td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-black ${
                              req.status === "APPROVED"
                                ? "bg-emerald-500/10 text-emerald-500"
                                : req.status === "PENDING"
                                ? "bg-amber-500/10 text-amber-500"
                                : "bg-red-500/10 text-red-500"
                            }`}
                          >
                            {req.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          {req.status === "APPROVED" ? (
                            <Link
                              href={`/dashboard/tenant/requests/${req.id}/pay`}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-[10px] font-extrabold shadow-sm transition-colors"
                            >
                              <CreditCard className="w-3 h-3" /> Pay Now
                            </Link>
                          ) : (
                            <span className="text-[10px] text-slate-400 font-bold">—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800">
              <span>
                Page {currentPage} of {totalPages}
              </span>
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
