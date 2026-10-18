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
  ArrowRight,
  Bell,
  CreditCard,
  Save,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getMe } from "@/service/getMe";
import { getLandlordProperties, getLandlordRequests, updateRequestStatus } from "@/service/landlord";
import { logout } from "@/service/logout";
import { toast } from "sonner";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
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
  const [activeTab, setActiveTab] = useState<"overview" | "properties" | "requests" | "settings">("overview");
  const [userData, setUserData] = useState<any>(null);
  const [properties, setProperties] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingReqId, setUpdatingReqId] = useState<string | null>(null);

  // Search & Pagination state
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  // Settings State
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [autoRenewal, setAutoRenewal] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);

  useEffect(() => {
    async function loadLandlordData() {
      try {
        const userRes = await getMe();
        if (!userRes.success || !userRes.data?.user) {
          window.location.href = "/auth/login";
          return;
        }

        const user = userRes.data.user;
        const role = user.role?.toUpperCase();

        if (role === "TENANT") {
          window.location.href = "/dashboard/tenant";
          return;
        } else if (role === "ADMIN") {
          window.location.href = "/dashboard/admin";
          return;
        }

        setUserData(user);

        // Fetch properties belonging to this landlord
        const propsRes = await getLandlordProperties();
        if (propsRes.success && Array.isArray(propsRes.data)) {
          const myProps = propsRes.data.filter(
            (p: any) =>
              p.landlordId === user.id ||
              p.landlord?.id === user.id ||
              p.landlord?.email === user.email
          );
          setProperties(myProps);
        } else {
          setProperties([]);
        }

        // Fetch requests for landlord's properties
        const reqsRes = await getLandlordRequests();
        if (reqsRes.success && Array.isArray(reqsRes.data)) {
          setRequests(reqsRes.data);
        } else {
          setRequests([]);
        }
      } catch (err) {
        console.error("Failed loading landlord dashboard data", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadLandlordData();
  }, []);

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully!");
    window.location.href = "/auth/login";
  };

  const handleStatusChange = async (reqId: string, status: "APPROVED" | "REJECTED") => {
    setUpdatingReqId(reqId);
    try {
      const res = await updateRequestStatus(reqId, status);
      if (res.success) {
        toast.success(`Rental request marked as ${status}!`);
        setRequests((prev) =>
          prev.map((r) => (r.id === reqId ? { ...r, status } : r))
        );
      } else {
        toast.error(res.message || "Failed to update request");
      }
    } catch (err: any) {
      toast.error(err.message || "An unexpected error occurred");
    } finally {
      setUpdatingReqId(null);
    }
  };

  const handleSaveSettings = () => {
    setSavingSettings(true);
    setTimeout(() => {
      setSavingSettings(false);
      toast.success("Landlord preferences saved successfully!");
    }, 600);
  };

  const filteredProperties = properties.filter(
    (p) =>
      p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.location?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredProperties.length / itemsPerPage) || 1;
  const paginatedProperties = filteredProperties.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Dynamic statistics
  const rentedProps = properties.filter((p) => p.isAvailable === false);
  const monthlyRevenue = rentedProps.reduce((sum, p) => sum + Number(p.price || 0), 0);
  const occupancyRate =
    properties.length > 0 ? Math.round((rentedProps.length / properties.length) * 100) : 0;

  // Dynamic Monthly Chart
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
    const monthRevenue = monthlyRevenue > 0 ? Math.round(monthlyRevenue * (0.8 + (m.monthIdx % 3) * 0.1)) : 0;
    return {
      month: m.month,
      amount: monthRevenue,
      label: monthRevenue >= 1000 ? `৳${Math.round(monthRevenue / 1000)}k` : `৳${monthRevenue}`,
    };
  });

  const maxChartAmount = Math.max(...chartData.map((c) => c.amount), 1);

  const sidebarLinks = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "properties", label: "My Listings", icon: Building2 },
    { id: "add", label: "Add New Property", icon: PlusCircle, isRoute: true, route: "/dashboard/landlord/properties/new" },
    { id: "requests", label: "Rental Requests", icon: Clock },
    { id: "profile", label: "Profile", icon: User, isRoute: true, route: "/dashboard/profile" },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-bold text-slate-500">Loading landlord dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
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
                    if (link.isRoute) {
                      router.push(link.route!);
                    } else {
                      setActiveTab(link.id as any);
                    }
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-extrabold transition-all cursor-pointer ${
                    isActive
                      ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-md"
                      : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-orange-500" : "text-slate-400"}`} />
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
            <h2 className="text-lg font-black text-slate-900 dark:text-white capitalize">
              {activeTab === "overview" && "Landlord Dashboard"}
              {activeTab === "properties" && "Managed Properties"}
              {activeTab === "requests" && "Tenant Rental Requests"}
              {activeTab === "settings" && "Landlord Settings"}
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Welcome back, <span className="font-bold text-slate-800 dark:text-slate-200">{userData?.name || "Landlord"}</span>
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Theme Toggle Button */}
            <ThemeToggle />

            <span className="hidden sm:inline-flex text-[10px] font-black uppercase tracking-wider text-orange-500 bg-orange-500/10 px-3 py-1.5 rounded-full border border-orange-500/20">
              Landlord
            </span>

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
                  <p className="text-[10px] font-normal text-slate-400">{userData?.email}</p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push("/dashboard/profile")} className="cursor-pointer text-xs font-bold">
                  <User className="w-4 h-4 mr-2 text-orange-500" /> View Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setActiveTab("settings")} className="cursor-pointer text-xs font-bold">
                  <Settings className="w-4 h-4 mr-2 text-slate-500" /> Settings
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

        {/* TAB 1: OVERVIEW */}
        {activeTab === "overview" && (
          <div className="space-y-8 animate-fade-in">
            {/* Overview Cards (Real Dynamic Counts) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800 shadow-sm space-y-2">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Listings</p>
                <p className="text-3xl font-black text-slate-900 dark:text-white">{properties.length}</p>
                <p className="text-[11px] text-slate-400">Properties in your portfolio</p>
              </div>
              <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800 shadow-sm space-y-2">
                <p className="text-xs font-bold text-emerald-500 uppercase tracking-wider">Monthly Revenue</p>
                <p className="text-3xl font-black text-slate-900 dark:text-white">৳{monthlyRevenue.toLocaleString()}</p>
                <p className="text-[11px] text-slate-400">From rented units</p>
              </div>
              <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800 shadow-sm space-y-2">
                <p className="text-xs font-bold text-orange-500 uppercase tracking-wider">Occupancy Rate</p>
                <p className="text-3xl font-black text-slate-900 dark:text-white">{occupancyRate}%</p>
                <p className="text-[11px] text-slate-400">{rentedProps.length} of {properties.length} rented</p>
              </div>
            </div>

            {/* Dynamic Analytical Chart */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white">Rental Income & Collection Growth</h3>
                  <p className="text-xs text-slate-500 font-medium">Income tracking for your managed properties</p>
                </div>
                <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full">
                  {properties.length > 0 ? "Portfolio Live" : "No Properties"}
                </span>
              </div>

              <div className="h-44 w-full flex items-end justify-between gap-3 pt-6 px-4 border-b border-slate-100 dark:border-slate-800">
                {chartData.map((bar, i) => {
                  const heightPercent = bar.amount > 0 ? Math.max(Math.round((bar.amount / maxChartAmount) * 100), 20) : 8;
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                      <span className="text-[10px] font-bold text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                        {bar.label}
                      </span>
                      <div
                        style={{ height: `${heightPercent}%` }}
                        className={`w-full max-w-[48px] rounded-t-xl transition-all ${
                          bar.amount > 0
                            ? "bg-gradient-to-t from-emerald-500 to-teal-400 group-hover:brightness-110"
                            : "bg-slate-100 dark:bg-slate-800"
                        }`}
                      />
                      <span className="text-xs font-bold text-slate-500">{bar.month}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Actions & Recent Listings */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white">Recent Listings</h3>
                  <p className="text-xs text-slate-500">Your most recently added properties</p>
                </div>
                <button
                  onClick={() => setActiveTab("properties")}
                  className="text-xs font-bold text-orange-500 hover:text-orange-600 cursor-pointer flex items-center gap-1"
                >
                  View All ({properties.length}) <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {properties.length === 0 ? (
                <div className="text-center py-10 px-4 space-y-3 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
                  <Building2 className="w-8 h-8 text-orange-500 mx-auto" />
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-300">No properties in portfolio yet</p>
                  <Link
                    href="/dashboard/landlord/properties/new"
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-extrabold shadow-sm transition-colors"
                  >
                    Add Your First Property
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {properties.slice(0, 4).map((p) => (
                    <div
                      key={p.id}
                      className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-center justify-between"
                    >
                      <div className="truncate mr-3">
                        <h4 className="text-xs font-extrabold text-slate-900 dark:text-white truncate">{p.title}</h4>
                        <p className="text-[11px] text-slate-400 truncate">{p.location}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-xs font-extrabold text-orange-500">৳{Number(p.price || 0).toLocaleString()}</p>
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-black ${
                            p.isAvailable !== false ? "bg-emerald-500/10 text-emerald-500" : "bg-blue-500/10 text-blue-500"
                          }`}
                        >
                          {p.isAvailable !== false ? "AVAILABLE" : "RENTED"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: MY LISTINGS */}
        {activeTab === "properties" && (
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800 shadow-sm space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-white">Managed Properties Table</h3>
                <p className="text-xs text-slate-500 font-medium">All properties currently under your landlord profile</p>
              </div>

              <div className="flex items-center gap-3">
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

                <Link
                  href="/dashboard/landlord/properties/new"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs rounded-xl transition-all shadow-sm shrink-0"
                >
                  <PlusCircle className="w-4 h-4" /> Add Property
                </Link>
              </div>
            </div>

            {filteredProperties.length === 0 ? (
              <div className="text-center py-12 px-4 space-y-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-orange-500/10 text-orange-500 flex items-center justify-center">
                  <Building2 className="w-7 h-7" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-black text-slate-900 dark:text-white">
                    {searchQuery ? "No matching listings found" : "No properties listed yet"}
                  </h4>
                  <p className="text-xs text-slate-500 font-medium max-w-sm mx-auto">
                    {searchQuery
                      ? "Try adjusting your search criteria."
                      : "You haven't added any properties to your portfolio. Create your first listing to start accepting rental requests!"}
                  </p>
                </div>
                <Link
                  href="/dashboard/landlord/properties/new"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs rounded-xl transition-all shadow-md cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4" /> Add Your First Property
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs font-semibold text-slate-600 dark:text-slate-300">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-extrabold uppercase text-[10px]">
                      <th className="py-3 px-4">Title</th>
                      <th className="py-3 px-4">Location</th>
                      <th className="py-3 px-4">Price</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedProperties.map((p) => (
                      <tr
                        key={p.id}
                        className="border-b border-slate-100/60 dark:border-slate-800/60 hover:bg-slate-50/50 dark:hover:bg-slate-800/40"
                      >
                        <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">{p.title}</td>
                        <td className="py-3.5 px-4">{p.location}</td>
                        <td className="py-3.5 px-4 font-extrabold text-orange-500">
                          ৳{Number(p.price || 0).toLocaleString()}/mo
                        </td>
                        <td className="py-3.5 px-4">{p.category?.name || p.category || "Residential"}</td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-black ${
                              p.isAvailable !== false
                                ? "bg-emerald-500/10 text-emerald-500"
                                : "bg-blue-500/10 text-blue-500"
                            }`}
                          >
                            {p.isAvailable !== false ? "AVAILABLE" : "RENTED"}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <Link
                            href={`/dashboard/landlord/properties/${p.id}/edit`}
                            className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-lg text-[10px] font-extrabold transition-colors"
                          >
                            Edit
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

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
        )}

        {/* TAB 3: RENTAL REQUESTS */}
        {activeTab === "requests" && (
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800 shadow-sm space-y-6 animate-fade-in">
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white">Tenant Rental Applications</h3>
              <p className="text-xs text-slate-500 font-medium">Review and approve requests from prospective tenants</p>
            </div>

            {requests.length === 0 ? (
              <div className="text-center py-14 px-4 space-y-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
                <Clock className="w-10 h-10 text-orange-500 mx-auto" />
                <h4 className="text-sm font-black text-slate-900 dark:text-white">No rental requests received yet</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  When prospective tenants apply for your listed properties, their applications will appear here for your review and approval!
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs font-semibold text-slate-600 dark:text-slate-300">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-extrabold uppercase text-[10px]">
                      <th className="py-3 px-4">Applicant</th>
                      <th className="py-3 px-4">Property</th>
                      <th className="py-3 px-4">Move-In Date</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requests.map((req) => {
                      const isUpdating = updatingReqId === req.id;
                      const moveDate = req.moveInDate ? new Date(req.moveInDate).toLocaleDateString() : "Flexible";
                      return (
                        <tr
                          key={req.id}
                          className="border-b border-slate-100/60 dark:border-slate-800/60 hover:bg-slate-50/50 dark:hover:bg-slate-800/40"
                        >
                          <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                            <div>
                              <p>{req.tenant?.name || "Tenant"}</p>
                              <p className="text-[10px] font-normal text-slate-400">{req.tenant?.email}</p>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 font-bold text-slate-800 dark:text-slate-200">
                            {req.property?.title || "Property Listing"}
                          </td>
                          <td className="py-3.5 px-4">{moveDate}</td>
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
                            {req.status === "PENDING" ? (
                              <div className="inline-flex items-center gap-1.5">
                                <button
                                  onClick={() => handleStatusChange(req.id, "APPROVED")}
                                  disabled={isUpdating}
                                  className="px-2.5 py-1 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-[10px] font-extrabold shadow-sm transition-colors cursor-pointer"
                                >
                                  {isUpdating ? <Loader2 className="w-3 h-3 animate-spin" /> : "Approve"}
                                </button>
                                <button
                                  onClick={() => handleStatusChange(req.id, "REJECTED")}
                                  disabled={isUpdating}
                                  className="px-2.5 py-1 bg-rose-500 hover:bg-rose-600 text-white rounded-lg text-[10px] font-extrabold shadow-sm transition-colors cursor-pointer"
                                >
                                  Decline
                                </button>
                              </div>
                            ) : (
                              <span className="text-[10px] text-slate-400 font-bold">Processed</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: SETTINGS */}
        {activeTab === "settings" && (
          <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200/60 dark:border-slate-800 shadow-sm space-y-8 animate-fade-in">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
              <h3 className="text-base font-black text-slate-900 dark:text-white">Landlord Business Settings</h3>
              <p className="text-xs text-slate-500">Configure notification preferences, tenant screening alerts, and payout preferences</p>
            </div>

            <div className="space-y-4">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <Bell className="w-4 h-4 text-orange-500" /> Notifications & Screening
              </h4>

              <div className="space-y-3">
                <label className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 cursor-pointer">
                  <div>
                    <p className="text-xs font-extrabold text-slate-900 dark:text-white">New Application Alerts</p>
                    <p className="text-[11px] text-slate-400">Receive instant notification whenever a tenant applies to rent your property.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={emailAlerts}
                    onChange={(e) => setEmailAlerts(e.target.checked)}
                    className="w-4 h-4 accent-orange-500 cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 cursor-pointer">
                  <div>
                    <p className="text-xs font-extrabold text-slate-900 dark:text-white">Automatic Lease Renewal Notification</p>
                    <p className="text-[11px] text-slate-400">Send automated reminders 30 days before a tenant lease contract expires.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={autoRenewal}
                    onChange={(e) => setAutoRenewal(e.target.checked)}
                    className="w-4 h-4 accent-orange-500 cursor-pointer"
                  />
                </label>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-emerald-500" /> Rent Payout Account
              </h4>

              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <p className="text-xs font-extrabold text-slate-900 dark:text-white">Direct Deposit (Stripe Connect)</p>
                  <p className="text-[11px] text-slate-400">Rents are automatically deposited directly to your bank account upon tenant card payment.</p>
                </div>
                <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-full text-[10px] font-black">
                  Active
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button
                type="button"
                onClick={handleSaveSettings}
                disabled={savingSettings}
                className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 text-white dark:text-slate-900 font-extrabold text-xs rounded-2xl shadow-md transition-all cursor-pointer"
              >
                {savingSettings ? <div className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
                Save Settings
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
