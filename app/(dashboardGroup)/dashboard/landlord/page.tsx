"use client";

import { useEffect, useState, useTransition } from "react";
import { getMe } from "@/service/getMe";
import { getLandlordProperties, deleteLandlordProperty, getLandlordRequests } from "@/service/landlord";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { logout } from "@/service/logout";
import {
  Loader2,
  Calendar,
  DollarSign,
  Building2,
  Clock,
  LogOut,
  Plus,
  Trash2,
  Edit,
  ClipboardList,
  User,
  ShieldCheck,
  CheckCircle,
} from "lucide-react";

export default function LandlordDashboard() {
  const router = useRouter();
  const [properties, setProperties] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [userId, setUserId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  const loadData = async () => {
    try {
      const userRes = await getMe();
      if (userRes.success && userRes.data?.user) {
        const uId = userRes.data.user.id;
        setUserId(uId);

        // Fetch properties & requests
        const propertiesRes = await getLandlordProperties();
        const requestsRes = await getLandlordRequests();

        if (propertiesRes.success) {
          // Filter properties to only show this landlord's properties
          const filtered = (propertiesRes.data || []).filter(
            (p: any) => p.landlordId === uId || p.landlord?.id === uId
          );
          setProperties(filtered);
        }

        if (requestsRes.success) {
          setRequests(requestsRes.data || []);
        }
      } else {
        toast.error("Failed to load user session.");
        router.push("/auth/login");
      }
    } catch (error) {
      console.error("Error loading landlord dashboard data", error);
      toast.error("An error occurred loading dashboard data.");
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

  const handleDeleteProperty = (id: string) => {
    if (!confirm("Are you sure you want to delete this property? All associated records will be removed.")) {
      return;
    }

    startTransition(async () => {
      const res = await deleteLandlordProperty(id);
      if (res.success) {
        toast.success("Property deleted successfully");
        // Optimistic UI update
        setProperties((prev) => prev.filter((p) => p.id !== id));
      } else {
        toast.error(res.message || "Failed to delete property");
      }
    });
  };

  // Calculate dashboard stats
  const totalProperties = properties.length;
  const pendingRequestsCount = requests.filter((r) => r.status?.toUpperCase() === "PENDING").length;

  // Earnings are computed from completed payments for the landlord's properties
  const earnings = requests
    .filter((r) => r.status?.toUpperCase() === "ACTIVE" || r.status?.toUpperCase() === "COMPLETED")
    .reduce((sum, r) => {
      const amount = r.payment?.amount || r.property?.price || 0;
      return sum + amount;
    }, 0);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 transition-colors">
        <div className="text-center space-y-4">
          <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto" />
          <p className="text-slate-400 dark:text-slate-500 font-bold text-sm">Loading landlord dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950/20 flex transition-colors">
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
            <button className="w-full flex items-center gap-3 px-4 py-3 bg-white/10 text-white rounded-xl text-sm font-bold text-left focus:outline-none">
              <Building2 className="w-4 h-4 text-orange-400" /> My Properties
            </button>
            <NextLink
              href="/dashboard/landlord/requests"
              className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl text-sm font-semibold transition-all"
            >
              <ClipboardList className="w-4 h-4" /> Rental Requests
              {pendingRequestsCount > 0 && (
                <span className="ml-auto w-5 h-5 rounded-full bg-orange-500 text-white text-[10px] font-extrabold flex items-center justify-center">
                  {pendingRequestsCount}
                </span>
              )}
            </NextLink>
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
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Landlord Dashboard
            </h1>
            <p className="text-slate-400 dark:text-slate-450 text-xs sm:text-sm font-semibold mt-1">
              Manage your listings, monitor rentals, and view earnings
            </p>
          </div>
          <div className="flex items-center gap-3">
            <NextLink href="/dashboard/landlord/properties/new">
              <Button className="bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-slate-200 text-white dark:text-slate-900 font-bold cursor-pointer rounded-xl px-4 py-2.5 text-xs flex items-center gap-2">
                <Plus className="w-4 h-4" /> Add Property
              </Button>
            </NextLink>
            <button
              onClick={handleLogout}
              className="lg:hidden p-2 text-slate-500 bg-white border border-slate-200 rounded-xl hover:text-red-500 transition-colors cursor-pointer focus:outline-none"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100/80 dark:border-slate-800/80 shadow-[0_4px_20px_rgba(0,0,0,0.015)] flex items-center gap-4 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/30 text-blue-500 border border-blue-100 dark:border-blue-900/40 flex items-center justify-center shrink-0">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider leading-none mb-1">
                My Properties
              </p>
              <p className="text-2xl font-black text-slate-800 dark:text-white leading-none">{totalProperties}</p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100/80 dark:border-slate-800/80 shadow-[0_4px_20px_rgba(0,0,0,0.015)] flex items-center gap-4 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/30 text-amber-500 border border-amber-100 dark:border-amber-900/40 flex items-center justify-center shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider leading-none mb-1">
                Pending Requests
              </p>
              <p className="text-2xl font-black text-slate-800 dark:text-white leading-none">{pendingRequestsCount}</p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100/80 dark:border-slate-800/80 shadow-[0_4px_20px_rgba(0,0,0,0.015)] flex items-center gap-4 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-green-50 dark:bg-green-950/30 text-green-500 border border-green-100 dark:border-green-900/40 flex items-center justify-center shrink-0">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider leading-none mb-1">
                Total Earnings
              </p>
              <p className="text-2xl font-black text-slate-800 dark:text-white leading-none">
                ৳{earnings.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Properties Listings Section */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100/80 dark:border-slate-800/80 p-6 shadow-[0_4px_25px_rgba(0,0,0,0.015)] animate-fade-in-up transition-colors">
          <h2 className="text-lg font-black text-slate-800 dark:text-white mb-5 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-primary" /> Active Property Listings
          </h2>

          {properties.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-400 dark:text-slate-500 text-sm font-semibold italic">
                You have not posted any property listings yet.
              </p>
              <NextLink href="/dashboard/landlord/properties/new" className="inline-block mt-4">
                <Button className="bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-slate-200 text-white dark:text-slate-900 font-bold cursor-pointer rounded-xl px-5 text-xs py-4.5">
                  Create Your First Listing
                </Button>
              </NextLink>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-500 text-[10px] uppercase font-bold tracking-wider">
                    <th className="pb-3.5 pl-2">Title</th>
                    <th className="pb-3.5">Location</th>
                    <th className="pb-3.5">Price</th>
                    <th className="pb-3.5">Category</th>
                    <th className="pb-3.5">Availability</th>
                    <th className="pb-3.5 pr-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-slate-800/60">
                  {properties.map((prop) => (
                    <tr key={prop.id} className="text-slate-600 dark:text-slate-350 text-xs font-semibold group hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-4 pl-2 font-bold text-slate-800 dark:text-slate-200 text-sm group-hover:text-primary transition-colors">
                        {prop.title}
                      </td>
                      <td className="py-4 text-slate-500 dark:text-slate-400">{prop.location}</td>
                      <td className="py-4 font-extrabold text-slate-800 dark:text-slate-100">৳{prop.price.toLocaleString()}</td>
                      <td className="py-4">
                        <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2.5 py-0.5 rounded-full font-bold text-[10px]">
                          {prop.category?.name || "Apartment"}
                        </span>
                      </td>
                      <td className="py-4">
                        {prop.isAvailable ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-green-600 bg-green-50 dark:bg-green-950/20 border border-green-200/50 dark:border-green-900/40 px-2.5 py-0.5 rounded-full">
                            <CheckCircle className="w-3 h-3" /> Available
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 px-2.5 py-0.5 rounded-full">
                            Rented Out
                          </span>
                        )}
                      </td>
                      <td className="py-4 pr-2 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <NextLink href={`/dashboard/landlord/properties/${prop.id}/edit`}>
                            <button
                              className="p-1.5 text-slate-400 dark:text-slate-350 hover:text-slate-700 dark:hover:text-white bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors cursor-pointer border border-slate-200/10"
                              title="Edit listing"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                          </NextLink>
                          <button
                            onClick={() => handleDeleteProperty(prop.id)}
                            disabled={isPending}
                            className="p-1.5 text-red-400 hover:text-red-600 dark:text-red-450 dark:hover:text-red-400 bg-red-50 dark:bg-red-950 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg transition-colors cursor-pointer border border-red-200/10"
                            title="Remove listing"
                          >
                            {isPending ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
