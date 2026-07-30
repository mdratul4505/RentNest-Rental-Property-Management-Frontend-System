/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState, useTransition } from "react";
import { getAdminUsers, updateUserStatus, getAdminProperties, getAdminRentals } from "@/service/admin";
import { logout } from "@/service/logout";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import {
  Loader2,
  Users,
  Building2,
  ClipboardList,
  LogOut,
  Ban,
  Unlock,
  Shield,
  Search,
  ChevronLeft,
  ChevronRight,
  User,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
} from "lucide-react";

export default function AdminDashboard() {
  const router = useRouter();
  const [users, setUsers] = useState<any[]>([]);
  const [properties, setProperties] = useState<any[]>([]);
  const [rentals, setRentals] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  // Navigation tabs
  const [activeTab, setActiveTab] = useState<"users" | "properties" | "rentals">("users");

  // User Management State
  const [userSearch, setUserSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  const loadData = async () => {
    try {
      const usersRes = await getAdminUsers();
      const propsRes = await getAdminProperties();
      const rentalsRes = await getAdminRentals();

      if (usersRes.success) setUsers(usersRes.data || []);
      if (propsRes.success) setProperties(propsRes.data || []);
      if (rentalsRes.success) setRentals(rentalsRes.data || []);
    } catch (error) {
      console.error("Error loading admin dashboard data", error);
      toast.error("Failed to load platform data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully");
    router.push("/auth/login");
    router.refresh();
  };

  const handleToggleUserBan = (id: string, currentStatus: string) => {
    const isCurrentlyBlocked = currentStatus?.toUpperCase() === "BLOCKED";
    const nextStatus = isCurrentlyBlocked ? "ACTIVE" : "BLOCKED";
    const actionLabel = isCurrentlyBlocked ? "unban" : "ban";

    if (!confirm(`Are you sure you want to ${actionLabel} this user?`)) {
      return;
    }

    // Optimistic UI update
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, status: nextStatus } : u))
    );

    startTransition(async () => {
      const res = await updateUserStatus(id, nextStatus);
      if (res.success) {
        toast.success(`User has been successfully ${isCurrentlyBlocked ? "unbanned" : "banned"}!`);
      } else {
        // Rollback
        setUsers((prev) =>
          prev.map((u) => (u.id === id ? { ...u, status: currentStatus } : u))
        );
        toast.error(res.message || `Failed to ${actionLabel} user.`);
      }
    });
  };

  // Helper status color badges
  const getStatusBadge = (status: string) => {
    const s = status?.toUpperCase() || "ACTIVE";
    if (s === "BLOCKED") {
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-600 bg-red-50 border border-red-200/50 px-2.5 py-0.5 rounded-full">
          <Ban className="w-3 h-3" /> Blocked
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-green-600 bg-green-50 border border-green-200/50 px-2.5 py-0.5 rounded-full">
        <CheckCircle className="w-3 h-3" /> Active
      </span>
    );
  };

  const getRentalStatusBadge = (status: string) => {
    const s = status?.toUpperCase() || "PENDING";
    switch (s) {
      case "PENDING":
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-600 bg-amber-50 border border-amber-200/50 px-2.5 py-0.5 rounded-full">
            <Clock className="w-3 h-3" /> Pending
          </span>
        );
      case "APPROVED":
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-600 bg-blue-50 border border-blue-200/50 px-2.5 py-0.5 rounded-full">
            <CheckCircle className="w-3 h-3" /> Approved
          </span>
        );
      case "REJECTED":
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-600 bg-red-50 border border-red-200/50 px-2.5 py-0.5 rounded-full">
            <XCircle className="w-3 h-3" /> Rejected
          </span>
        );
      case "ACTIVE":
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-green-600 bg-green-50 border border-green-200/50 px-2.5 py-0.5 rounded-full">
            <TrendingUp className="w-3 h-3" /> Active
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-500 bg-slate-100 border border-slate-200 px-2.5 py-0.5 rounded-full">
            {status}
          </span>
        );
    }
  };

  // Filter users by search term
  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.role.toLowerCase().includes(userSearch.toLowerCase())
  );

  // Paginated users logic
  const totalUserPages = Math.ceil(filteredUsers.length / usersPerPage);
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsersList = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const goToNextPage = () => {
    if (currentPage < totalUserPages) setCurrentPage((prev) => prev + 1);
  };
  const goToPrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  // Stats computation
  const totalUsers = users.length;
  const systemPropertiesCount = properties.length;
  const totalBookingsCount = rentals.length;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center space-y-4">
          <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto" />
          <p className="text-slate-400 font-bold text-sm">Loading admin console...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 flex">
      {/* Sidebar for Premium Layout */}
      <aside className="hidden lg:flex w-64 bg-slate-900 flex-col justify-between shrink-0 p-6 text-white relative">
        <div className="space-y-8">
          <div>
            <NextLink href="/" className="flex items-center gap-2">
              <Building2 className="w-6 h-6 text-orange-500" />
              <span className="text-xl font-black tracking-tight">RentNest.</span>
            </NextLink>
            <p className="text-[10px] font-bold text-slate-400 mt-1">ADMIN CONTROL HUB</p>
          </div>

          <nav className="space-y-1">
            <button
              onClick={() => setActiveTab("users")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-left transition-all focus:outline-none ${
                activeTab === "users" ? "bg-white/10 text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              <Users className="w-4 h-4 text-orange-400" /> User Management
            </button>
            <button
              onClick={() => setActiveTab("properties")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-left transition-all focus:outline-none ${
                activeTab === "properties" ? "bg-white/10 text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              <Building2 className="w-4 h-4" /> Properties Moderation
            </button>
            <button
              onClick={() => setActiveTab("rentals")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-left transition-all focus:outline-none ${
                activeTab === "rentals" ? "bg-white/10 text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              <ClipboardList className="w-4 h-4" /> Rentals Audit
            </button>
          </nav>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl text-sm font-bold transition-all text-left cursor-pointer focus:outline-none"
        >
          <LogOut className="w-4.5 h-4.5" /> Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-8 lg:p-10">
        {/* Top Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Admin Console
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm font-semibold mt-1">
              Oversee users, listings, and global transactions of RentNest platform
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="lg:hidden p-2 text-slate-500 bg-white border border-slate-200 rounded-xl hover:text-red-500 transition-colors cursor-pointer focus:outline-none"
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>

        {/* Global Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-3xl border border-slate-100/80 shadow-[0_4px_20px_rgba(0,0,0,0.01)] flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-500 border border-amber-100 flex items-center justify-center shrink-0">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider leading-none mb-1">
                Total Users
              </p>
              <p className="text-2xl font-black text-slate-800 leading-none">{totalUsers}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-100/80 shadow-[0_4px_20px_rgba(0,0,0,0.01)] flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-500 border border-blue-100 flex items-center justify-center shrink-0">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider leading-none mb-1">
                Total Listings
              </p>
              <p className="text-2xl font-black text-slate-800 leading-none">{systemPropertiesCount}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-100/80 shadow-[0_4px_20px_rgba(0,0,0,0.01)] flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-green-50 text-green-500 border border-green-100 flex items-center justify-center shrink-0">
              <ClipboardList className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider leading-none mb-1">
                Rental Applications
              </p>
              <p className="text-2xl font-black text-slate-800 leading-none">{totalBookingsCount}</p>
            </div>
          </div>
        </div>

        {/* Tab-driven Dashboard viewports */}
        {activeTab === "users" && (
          <div className="bg-white rounded-3xl border border-slate-100/80 p-6 shadow-[0_4px_25px_rgba(0,0,0,0.015)] animate-fade-in-up">
            {/* Header controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <h2 className="text-lg font-black text-slate-850 flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" /> User Directory
              </h2>

              {/* Search bar */}
              <div className="relative max-w-sm w-full">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Search className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  placeholder="Search by name, email, or role..."
                  value={userSearch}
                  onChange={(e) => {
                    setUserSearch(e.target.value);
                    setCurrentPage(1); // reset to page 1 on search change
                  }}
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-primary/45 rounded-xl text-xs font-semibold focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* Users directory table */}
            {currentUsersList.length === 0 ? (
              <p className="text-slate-400 text-xs font-semibold italic text-center py-12">
                No users found matching your search.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 text-[10px] uppercase font-bold tracking-wider">
                      <th className="pb-3.5 pl-2">User details</th>
                      <th className="pb-3.5">Email</th>
                      <th className="pb-3.5">System Role</th>
                      <th className="pb-3.5">Status</th>
                      <th className="pb-3.5 pr-2 text-right">Moderate</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {currentUsersList.map((userItem) => {
                      const isBlocked = userItem.status?.toUpperCase() === "BLOCKED";

                      return (
                        <tr key={userItem.id} className="text-slate-600 text-xs font-semibold hover:bg-slate-50/50">
                          <td className="py-4 pl-2 font-bold text-slate-800 text-sm">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 font-bold flex items-center justify-center text-xs">
                                <User className="w-3.5 h-3.5 text-slate-500" />
                              </div>
                              <span>{userItem.name}</span>
                            </div>
                          </td>
                          <td className="py-4 text-slate-500">{userItem.email}</td>
                          <td className="py-4">
                            <span className="bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-full font-bold text-[10px]">
                              {userItem.role}
                            </span>
                          </td>
                          <td className="py-4">{getStatusBadge(userItem.status)}</td>
                          <td className="py-4 pr-2 text-right">
                            {userItem.role?.toUpperCase() === "ADMIN" ? (
                              <span className="text-slate-400 text-[10px] font-bold italic">Immutable</span>
                            ) : (
                              <Button
                                onClick={() => handleToggleUserBan(userItem.id, userItem.status)}
                                disabled={isPending}
                                className={`text-[10px] font-extrabold h-7.5 px-3 rounded-lg shadow-sm cursor-pointer ${
                                  isBlocked
                                    ? "bg-slate-900 hover:bg-slate-800 text-white"
                                    : "bg-red-50 text-red-600 hover:bg-red-100 border border-red-200/50"
                                }`}
                              >
                                {isBlocked ? (
                                  <>
                                    <Unlock className="w-3 h-3 mr-1" /> Unban User
                                  </>
                                ) : (
                                  <>
                                    <Ban className="w-3 h-3 mr-1" /> Ban User
                                  </>
                                )}
                              </Button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                {/* Pagination Controls */}
                {totalUserPages > 1 && (
                  <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-6">
                    <p className="text-[10px] font-semibold text-slate-400">
                      Showing {indexOfFirstUser + 1} to {Math.min(indexOfLastUser, filteredUsers.length)} of{" "}
                      {filteredUsers.length} users
                    </p>
                    <div className="flex items-center gap-2">
                      <Button
                        onClick={goToPrevPage}
                        disabled={currentPage === 1}
                        variant="outline"
                        className="p-1 h-8 w-8 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 cursor-pointer disabled:opacity-50"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                      <span className="text-[11px] font-extrabold text-slate-700">
                        {currentPage} / {totalUserPages}
                      </span>
                      <Button
                        onClick={goToNextPage}
                        disabled={currentPage === totalUserPages}
                        variant="outline"
                        className="p-1 h-8 w-8 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 cursor-pointer disabled:opacity-50"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === "properties" && (
          <div className="bg-white rounded-3xl border border-slate-100/80 p-6 shadow-[0_4px_25px_rgba(0,0,0,0.015)] animate-fade-in-up">
            <h2 className="text-lg font-black text-slate-850 mb-5 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-primary" /> Listings Directory
            </h2>

            {properties.length === 0 ? (
              <p className="text-slate-400 text-xs font-semibold italic text-center py-12">
                No properties exist in the system.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 text-[10px] uppercase font-bold tracking-wider">
                      <th className="pb-3.5 pl-2">Listing</th>
                      <th className="pb-3.5">Landlord</th>
                      <th className="pb-3.5">Location</th>
                      <th className="pb-3.5">Monthly Rent</th>
                      <th className="pb-3.5">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {properties.map((p) => (
                      <tr key={p.id} className="text-slate-600 text-xs font-semibold hover:bg-slate-50/50">
                        <td className="py-4 pl-2 font-bold text-slate-800 text-sm">{p.title}</td>
                        <td className="py-4 text-slate-500">
                          <div>
                            <p className="font-bold text-slate-700 leading-tight">{p.landlord?.name || "N/A"}</p>
                            <p className="text-[9px] text-slate-400 mt-0.5 leading-none">{p.landlord?.email || "N/A"}</p>
                          </div>
                        </td>
                        <td className="py-4 text-slate-500">{p.location}</td>
                        <td className="py-4 font-extrabold text-slate-800">৳{p.price.toLocaleString()}</td>
                        <td className="py-4">
                          {p.isAvailable ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-green-600 bg-green-50 border border-green-200/50 px-2.5 py-0.5 rounded-full">
                              Available
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-500 bg-slate-100 border border-slate-200 px-2.5 py-0.5 rounded-full">
                              Rented
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === "rentals" && (
          <div className="bg-white rounded-3xl border border-slate-100/80 p-6 shadow-[0_4px_25px_rgba(0,0,0,0.015)] animate-fade-in-up">
            <h2 className="text-lg font-black text-slate-850 mb-5 flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-primary" /> System Rental Applications Log
            </h2>

            {rentals.length === 0 ? (
              <p className="text-slate-400 text-xs font-semibold italic text-center py-12">
                No rental applications exist in the system.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 text-[10px] uppercase font-bold tracking-wider">
                      <th className="pb-3.5 pl-2">Tenant</th>
                      <th className="pb-3.5">Property Requested</th>
                      <th className="pb-3.5">Landlord</th>
                      <th className="pb-3.5">Move-In Date</th>
                      <th className="pb-3.5">Rent</th>
                      <th className="pb-3.5">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {rentals.map((r) => {
                      const tenant = r.tenant || {};
                      const prop = r.property || {};
                      const landlord = prop.landlord || {};

                      return (
                        <tr key={r.id} className="text-slate-600 text-xs font-semibold hover:bg-slate-50/50">
                          <td className="py-4 pl-2">
                            <div>
                              <p className="font-bold text-slate-800 leading-tight">{tenant.name || "N/A"}</p>
                              <p className="text-[9px] text-slate-400 mt-0.5 leading-none">{tenant.email || "N/A"}</p>
                            </div>
                          </td>
                          <td className="py-4 font-bold text-slate-700">{prop.title || "N/A"}</td>
                          <td className="py-4 text-slate-500">
                            <div>
                              <p className="font-bold text-slate-700 leading-tight">{landlord.name || "N/A"}</p>
                              <p className="text-[9px] text-slate-400 mt-0.5 leading-none">{landlord.email || "N/A"}</p>
                            </div>
                          </td>
                          <td className="py-4 text-slate-500">{new Date(r.moveInDate).toLocaleDateString()}</td>
                          <td className="py-4 font-extrabold text-slate-800">৳{prop.price ? prop.price.toLocaleString() : "0"}</td>
                          <td className="py-4">{getRentalStatusBadge(r.status)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
