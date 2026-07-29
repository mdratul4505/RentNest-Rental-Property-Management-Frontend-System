"use client";

import { useEffect, useState, useTransition } from "react";
import { getLandlordRequests, updateRequestStatus } from "@/service/landlord";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { logout } from "@/service/logout";
import {
  Loader2,
  Calendar,
  Building2,
  Clock,
  LogOut,
  ClipboardList,
  CheckCircle,
  XCircle,
  User,
  Check,
  X,
  TrendingUp,
} from "lucide-react";

export default function LandlordRequestsPage() {
  const router = useRouter();
  const [requests, setRequests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  const loadRequests = async () => {
    try {
      const res = await getLandlordRequests();
      if (res.success) {
        setRequests(res.data || []);
      } else {
        toast.error("Failed to load rental requests.");
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred fetching requests.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully");
    router.push("/auth/login");
    router.refresh();
  };

  const handleStatusChange = (id: string, status: "APPROVED" | "REJECTED") => {
    // Optimistic UI update
    const previousRequests = [...requests];
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: status } : r))
    );

    startTransition(async () => {
      const res = await updateRequestStatus(id, status);
      if (res.success) {
        toast.success(`Application has been successfully ${status.toLowerCase()}!`);
      } else {
        // Rollback on failure
        setRequests(previousRequests);
        toast.error(res.message || `Failed to update status to ${status.toLowerCase()}`);
      }
    });
  };

  // Get color badges for rental status
  const getStatusBadge = (status: string) => {
    const s = status.toUpperCase();
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
            <TrendingUp className="w-3 h-3" /> Active Rental
          </span>
        );
      case "COMPLETED":
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-500 bg-slate-100 border border-slate-200 px-2.5 py-0.5 rounded-full">
            <CheckCircle className="w-3 h-3" /> Completed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-400 bg-slate-50 border border-slate-100 px-2.5 py-0.5 rounded-full">
            {status}
          </span>
        );
    }
  };

  const pendingRequestsCount = requests.filter((r) => r.status?.toUpperCase() === "PENDING").length;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center space-y-4">
          <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto" />
          <p className="text-slate-400 font-bold text-sm">Loading rental requests...</p>
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
            <p className="text-[10px] font-bold text-slate-400 mt-1">LANDLORD CONTROL PANEL</p>
          </div>

          <nav className="space-y-1">
            <NextLink
              href="/dashboard/landlord"
              className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl text-sm font-semibold transition-all"
            >
              <Building2 className="w-4 h-4" /> My Properties
            </NextLink>
            <button className="w-full flex items-center gap-3 px-4 py-3 bg-white/10 text-white rounded-xl text-sm font-bold text-left focus:outline-none">
              <ClipboardList className="w-4 h-4 text-orange-400" /> Rental Requests
              {pendingRequestsCount > 0 && (
                <span className="ml-auto w-5 h-5 rounded-full bg-orange-500 text-white text-[10px] font-extrabold flex items-center justify-center">
                  {pendingRequestsCount}
                </span>
              )}
            </button>
            <NextLink
              href="/properties"
              className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl text-sm font-semibold transition-all"
            >
              <Building2 className="w-4 h-4" /> Browse Properties
            </NextLink>
          </nav>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl text-sm font-bold transition-all text-left cursor-pointer focus:outline-none"
        >
          <LogOut className="w-4.5 h-4.5" /> Logout
        </button>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-8 lg:p-10">
        {/* Top Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Rental Applications
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm font-semibold mt-1">
              Approve or reject applications submitted by tenants
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

        {/* Requests Table */}
        <div className="bg-white rounded-3xl border border-slate-100/80 p-6 shadow-[0_4px_25px_rgba(0,0,0,0.015)] animate-fade-in-up">
          <h2 className="text-lg font-black text-slate-850 mb-5 flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-primary" /> Incoming Requests Log
          </h2>

          {requests.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-400 text-sm font-semibold italic">
                No rental requests have been submitted for your properties yet.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 text-[10px] uppercase font-bold tracking-wider">
                    <th className="pb-3.5 pl-2">Tenant</th>
                    <th className="pb-3.5">Property</th>
                    <th className="pb-3.5">Monthly Rent</th>
                    <th className="pb-3.5">Move-In Date</th>
                    <th className="pb-3.5">Status</th>
                    <th className="pb-3.5 pr-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {requests.map((r) => {
                    const tenant = r.tenant || {};
                    const prop = r.property || {};
                    const isPendingRequest = r.status?.toUpperCase() === "PENDING";

                    return (
                      <tr key={r.id} className="text-slate-600 text-xs font-semibold hover:bg-slate-50/50">
                        {/* Tenant Info */}
                        <td className="py-4 pl-2">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 font-bold flex items-center justify-center text-xs border border-slate-200/40">
                              <User className="w-3.5 h-3.5 text-slate-500" />
                            </div>
                            <div>
                              <p className="font-bold text-slate-850 text-xs leading-tight">{tenant.name || "N/A"}</p>
                              <p className="text-[9px] text-slate-400 font-semibold leading-none mt-0.5">{tenant.email || "N/A"}</p>
                            </div>
                          </div>
                        </td>

                        {/* Property Title */}
                        <td className="py-4 font-bold text-slate-800">
                          {prop.title || "N/A"}
                        </td>

                        {/* Rent */}
                        <td className="py-4 font-extrabold text-slate-800">
                          ৳{prop.price ? prop.price.toLocaleString() : "0"}
                        </td>

                        {/* Move-In Date */}
                        <td className="py-4 text-slate-500">
                          {new Date(r.moveInDate).toLocaleDateString()}
                        </td>

                        {/* Status Badge */}
                        <td className="py-4">
                          {getStatusBadge(r.status)}
                        </td>

                        {/* Action Buttons */}
                        <td className="py-4 pr-2 text-right">
                          {isPendingRequest ? (
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                onClick={() => handleStatusChange(r.id, "APPROVED")}
                                className="bg-green-600 hover:bg-green-700 text-white font-extrabold text-[10px] h-7.5 px-3 rounded-lg shadow-sm cursor-pointer flex items-center gap-1"
                              >
                                <Check className="w-3 h-3" /> Approve
                              </Button>
                              <Button
                                onClick={() => handleStatusChange(r.id, "REJECTED")}
                                className="bg-red-600 hover:bg-red-700 text-white font-extrabold text-[10px] h-7.5 px-3 rounded-lg shadow-sm cursor-pointer flex items-center gap-1"
                              >
                                <X className="w-3 h-3" /> Reject
                              </Button>
                            </div>
                          ) : (
                            <span className="text-slate-400 text-[10px] font-bold italic">Moderated</span>
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
      </main>
    </div>
  );
}
