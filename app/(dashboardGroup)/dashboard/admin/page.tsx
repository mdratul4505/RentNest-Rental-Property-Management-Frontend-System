/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Users,
  Building2,
  Clock,
  FolderTree,
  BarChart3,
  User,
  Settings,
  LogOut,
  Search,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  ShieldAlert,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getMe } from "@/service/getMe";
import { getAdminUsers, getAdminProperties, getAdminRentals, updateUserStatus } from "@/service/admin";
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

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<
    "overview" | "users" | "properties" | "requests" | "categories" | "analytics" | "profile" | "settings"
  >("overview");
  const [userData, setUserData] = useState<any>(null);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [propertiesList, setPropertiesList] = useState<any[]>([]);
  const [rentalsList, setRentalsList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);

  // Search & Filter & Pagination state
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    async function loadAdminData() {
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
        } else if (role === "LANDLORD") {
          window.location.href = "/dashboard/landlord";
          return;
        }

        setUserData(user);

        // Fetch real database records for Admin
        const [usersRes, propsRes, rentalsRes] = await Promise.all([
          getAdminUsers(),
          getAdminProperties(),
          getAdminRentals(),
        ]);

        if (usersRes.success && Array.isArray(usersRes.data)) {
          setUsersList(usersRes.data);
        } else {
          setUsersList([]);
        }

        if (propsRes.success && Array.isArray(propsRes.data)) {
          setPropertiesList(propsRes.data);
        } else {
          setPropertiesList([]);
        }

        if (rentalsRes.success && Array.isArray(rentalsRes.data)) {
          setRentalsList(rentalsRes.data);
        } else {
          setRentalsList([]);
        }
      } catch (err) {
        console.error("Failed loading admin dashboard data", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadAdminData();
  }, []);

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully!");
    window.location.href = "/auth/login";
  };

  const handleToggleStatus = async (user: any) => {
    const newStatus = user.status?.toUpperCase() === "BLOCKED" ? "ACTIVE" : "BLOCKED";
    setUpdatingUserId(user.id);
    try {
      const res = await updateUserStatus(user.id, newStatus);
      if (res.success) {
        setUsersList((prev) =>
          prev.map((u) => (u.id === user.id ? { ...u, status: newStatus } : u))
        );
        toast.success(`User status changed to ${newStatus}`);
      } else {
        toast.error(res.message || "Failed to update user status");
      }
    } catch (err: any) {
      toast.error(err.message || "An error occurred");
    } finally {
      setUpdatingUserId(null);
    }
  };

  const filteredUsers = usersList.filter((u) => {
    const matchesSearch =
      u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "all" || u.role?.toUpperCase() === roleFilter;
    return matchesSearch && matchesRole;
  });

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage) || 1;
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Platform calculations
  const totalVolume = rentalsList.reduce(
    (acc, r) => acc + Number(r.property?.price || r.rentAmount || 0),
    0
  );

  const sidebarLinks = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "users", label: "Manage Users", icon: Users },
    { id: "properties", label: "Manage Properties", icon: Building2 },
    { id: "requests", label: "Rental Requests", icon: Clock },
    { id: "categories", label: "Categories", icon: FolderTree },
    { id: "analytics", label: "Financial Analytics", icon: BarChart3 },
    { id: "profile", label: "Admin Profile", icon: User },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-bold text-slate-500">Loading system administration console...</p>
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
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
              Admin<span className="text-orange-500">Control</span>
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
                    if (link.id === "profile") router.push("/dashboard/profile");
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
            <h2 className="text-lg font-black text-slate-900 dark:text-white">Admin Administration Portal</h2>
            <p className="text-xs text-slate-500 font-medium">
              System metrics, user directory & platform governance for <span className="font-bold text-slate-800 dark:text-slate-200">{userData?.name || "Admin"}</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex text-[10px] font-black uppercase tracking-wider text-rose-500 bg-rose-500/10 px-3 py-1 rounded-full border border-rose-500/20">
              Admin Access
            </span>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 p-1.5 pr-3 bg-slate-100 dark:bg-slate-800 rounded-full cursor-pointer hover:bg-slate-200 border border-slate-200/60 dark:border-slate-700">
                  <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-black flex items-center justify-center text-xs">
                    {userData?.name ? userData.name.charAt(0).toUpperCase() : "A"}
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
                  <User className="w-4 h-4 mr-2 text-orange-500" /> Admin Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push("/properties")} className="cursor-pointer text-xs font-bold">
                  <Building2 className="w-4 h-4 mr-2 text-emerald-500" /> Public Site
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
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800 shadow-sm space-y-2">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Registered Users</p>
            <p className="text-3xl font-black text-slate-900 dark:text-white">{usersList.length}</p>
            <p className="text-[11px] text-slate-400">Live DB records</p>
          </div>
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800 shadow-sm space-y-2">
            <p className="text-xs font-bold text-emerald-500 uppercase tracking-wider">Active Properties</p>
            <p className="text-3xl font-black text-slate-900 dark:text-white">{propertiesList.length}</p>
            <p className="text-[11px] text-slate-400">Published listings</p>
          </div>
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800 shadow-sm space-y-2">
            <p className="text-xs font-bold text-orange-500 uppercase tracking-wider">Rental Requests</p>
            <p className="text-3xl font-black text-slate-900 dark:text-white">{rentalsList.length}</p>
            <p className="text-[11px] text-slate-400">Applications submitted</p>
          </div>
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800 shadow-sm space-y-2">
            <p className="text-xs font-bold text-blue-500 uppercase tracking-wider">Platform Volume</p>
            <p className="text-3xl font-black text-slate-900 dark:text-white">
              ৳{totalVolume >= 100000 ? `${(totalVolume / 100000).toFixed(1)}L` : totalVolume.toLocaleString()}
            </p>
            <p className="text-[11px] text-slate-400">Total requested rents</p>
          </div>
        </div>

        {/* Filtered & Paginated User Management Table */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white">Platform Users Directory</h3>
              <p className="text-xs text-slate-500 font-medium">Real-time user accounts registered in database</p>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search user or email..."
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
                value={roleFilter}
                onChange={(e) => {
                  setRoleFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-slate-100 focus:outline-none cursor-pointer"
              >
                <option value="all">All Roles</option>
                <option value="TENANT">Tenant</option>
                <option value="LANDLORD">Landlord</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>
          </div>

          {filteredUsers.length === 0 ? (
            <div className="text-center py-12 px-4 space-y-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-orange-500/10 text-orange-500 flex items-center justify-center">
                <Users className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-black text-slate-900 dark:text-white">No users found</h4>
                <p className="text-xs text-slate-500 font-medium max-w-sm mx-auto">
                  {searchQuery || roleFilter !== "all"
                    ? "No users matched your query filter."
                    : "No users currently registered in database."}
                </p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs font-semibold text-slate-600 dark:text-slate-300">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-extrabold uppercase text-[10px]">
                    <th className="py-3 px-4">User Name</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Joined Date</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedUsers.map((u) => {
                    const joinedStr = u.createdAt
                      ? new Date(u.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })
                      : "Recent";
                    const isUpdating = updatingUserId === u.id;
                    const isBlocked = u.status?.toUpperCase() === "BLOCKED";

                    return (
                      <tr
                        key={u.id}
                        className="border-b border-slate-100/60 dark:border-slate-800/60 hover:bg-slate-50/50 dark:hover:bg-slate-800/40"
                      >
                        <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                          <div>
                            <p>{u.name}</p>
                            <p className="text-[10px] font-mono font-normal text-slate-400">ID: {u.id?.slice(0, 8)}...</p>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">{u.email}</td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-black ${
                              u.role === "ADMIN"
                                ? "bg-rose-500/10 text-rose-500"
                                : u.role === "LANDLORD"
                                ? "bg-blue-500/10 text-blue-500"
                                : "bg-orange-500/10 text-orange-500"
                            }`}
                          >
                            {u.role}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                              !isBlocked
                                ? "bg-emerald-500/10 text-emerald-500"
                                : "bg-red-500/10 text-red-500"
                            }`}
                          >
                            {!isBlocked ? "ACTIVE" : "BLOCKED"}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">{joinedStr}</td>
                        <td className="py-3.5 px-4 text-right">
                          {u.role !== "ADMIN" && (
                            <button
                              onClick={() => handleToggleStatus(u)}
                              disabled={isUpdating}
                              className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold transition-colors cursor-pointer ${
                                isBlocked
                                  ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-200"
                                  : "bg-red-50 text-red-600 hover:bg-red-100 border border-red-200"
                              }`}
                            >
                              {isUpdating ? (
                                <Loader2 className="w-3 h-3 animate-spin mx-auto" />
                              ) : isBlocked ? (
                                "Unblock"
                              ) : (
                                "Block"
                              )}
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
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
      </main>
    </div>
  );
}
