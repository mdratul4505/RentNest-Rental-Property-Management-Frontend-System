"use client";

import { useEffect, useState, useTransition } from "react";
import { getTenantRentals, getTenantPayments, createReview } from "@/service/tenant";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Link } from "lucide-react";
import NextLink from "next/link";
import {
  Loader2,
  Calendar,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  Star,
  MessageSquare,
  Building2,
  CreditCard,
  User,
  LogOut,
} from "lucide-react";
import { logout } from "@/service/logout";
import { useRouter } from "next/navigation";

export default function TenantDashboard() {
  const router = useRouter();
  const [rentals, setRentals] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  // Review Modal State
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewPropertyId, setReviewPropertyId] = useState("");
  const [reviewPropertyName, setReviewPropertyName] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const loadData = async () => {
    try {
      const rentalsRes = await getTenantRentals();
      const paymentsRes = await getTenantPayments();

      if (rentalsRes.success) setRentals(rentalsRes.data || []);
      if (paymentsRes.success) setPayments(paymentsRes.data || []);
    } catch (error) {
      console.error("Error loading tenant dashboard data", error);
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

  // Open review modal
  const openReviewModal = (propertyId: string, propertyName: string) => {
    setReviewPropertyId(propertyId);
    setReviewPropertyName(propertyName);
    setRating(5);
    setComment("");
    setIsReviewModalOpen(true);
  };

  // Submit review
  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!comment.trim()) {
      toast.error("Comment required");
      return;
    }

    startTransition(async () => {
      const res = await createReview({
        propertyId: reviewPropertyId,
        rating,
        comment,
      });

      if (res.success) {
        toast.success("Review submitted successfully!");
        setIsReviewModalOpen(false);
        loadData(); // reload to reflect changes
      } else {
        toast.error(res.message || "Failed to submit review");
      }
    });
  };

  // Get color badges for rental status
  const getStatusBadge = (status: string) => {
    const s = status.toUpperCase();
    switch (s) {
      case "PENDING":
        return (
          <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 border border-amber-200/50 px-2.5 py-1 rounded-full">
            <Clock className="w-3.5 h-3.5" /> Pending Approval
          </span>
        );
      case "APPROVED":
        return (
          <span className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 bg-blue-50 border border-blue-200/50 px-2.5 py-1 rounded-full">
            <CheckCircle className="w-3.5 h-3.5" /> Approved
          </span>
        );
      case "REJECTED":
        return (
          <span className="inline-flex items-center gap-1 text-xs font-bold text-red-600 bg-red-50 border border-red-200/50 px-2.5 py-1 rounded-full">
            <XCircle className="w-3.5 h-3.5" /> Rejected
          </span>
        );
      case "ACTIVE":
        return (
          <span className="inline-flex items-center gap-1 text-xs font-bold text-green-600 bg-green-50 border border-green-200/50 px-2.5 py-1 rounded-full">
            <TrendingUp className="w-3.5 h-3.5" /> Active Rental
          </span>
        );
      case "COMPLETED":
        return (
          <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-full">
            <CheckCircle className="w-3.5 h-3.5" /> Completed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-400 bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-full">
            {status}
          </span>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center space-y-4">
          <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto" />
          <p className="text-slate-400 font-bold text-sm">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  // Calculate statistics
  const totalPaidAmount = payments
    .filter((p) => p.status?.toUpperCase() === "COMPLETED")
    .reduce((sum, p) => sum + p.amount, 0);

  const activeRentalsCount = rentals.filter((r) => r.status?.toUpperCase() === "ACTIVE").length;

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
            <p className="text-[10px] font-bold text-slate-400 mt-1">TENANT CONTROL PANEL</p>
          </div>

          <nav className="space-y-1">
            <button className="w-full flex items-center gap-3 px-4 py-3 bg-white/10 text-white rounded-xl text-sm font-bold text-left focus:outline-none">
              <Calendar className="w-4 h-4 text-orange-400" /> Overview
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
        {/* Top bar header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Tenant Dashboard
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm font-semibold mt-1">
              Manage your property applications, bookings, and payments
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

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-3xl border border-slate-100/80 shadow-[0_4px_20px_rgba(0,0,0,0.01)] flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-500 border border-amber-100 flex items-center justify-center shrink-0">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider leading-none mb-1">
                Total Requests
              </p>
              <p className="text-2xl font-black text-slate-800 leading-none">{rentals.length}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-100/80 shadow-[0_4px_20px_rgba(0,0,0,0.01)] flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-green-50 text-green-500 border border-green-100 flex items-center justify-center shrink-0">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider leading-none mb-1">
                Total Paid
              </p>
              <p className="text-2xl font-black text-slate-800 leading-none">
                ৳{totalPaidAmount.toLocaleString()}
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-100/80 shadow-[0_4px_20px_rgba(0,0,0,0.01)] flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-500 border border-blue-100 flex items-center justify-center shrink-0">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider leading-none mb-1">
                Active Rentals
              </p>
              <p className="text-2xl font-black text-slate-800 leading-none">{activeRentalsCount}</p>
            </div>
          </div>
        </div>

        {/* Content sections */}
        <div className="space-y-10 animate-fade-in-up" style={{ animationDelay: "100ms" }}>
          
          {/* Rental Requests Section */}
          <div className="bg-white rounded-3xl border border-slate-100/80 p-6 shadow-[0_4px_25px_rgba(0,0,0,0.015)]">
            <h2 className="text-lg font-black text-slate-850 mb-5 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" /> Rental Applications
            </h2>

            {rentals.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-slate-400 text-sm font-semibold italic">
                  You have not submitted any rental requests yet.
                </p>
                <NextLink href="/properties" className="inline-block mt-4">
                  <Button className="bg-slate-900 hover:bg-slate-800 text-white font-bold cursor-pointer rounded-xl px-5 text-xs py-4.5">
                    Find Rental Properties
                  </Button>
                </NextLink>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 text-[10px] uppercase font-bold tracking-wider">
                      <th className="pb-3.5 pl-2">Property</th>
                      <th className="pb-3.5">Move-In Date</th>
                      <th className="pb-3.5">Monthly Price</th>
                      <th className="pb-3.5">Status</th>
                      <th className="pb-3.5 pr-2 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {rentals.map((rental) => {
                      const prop = rental.property || {};
                      const isApproved = rental.status?.toUpperCase() === "APPROVED";
                      const isActive = rental.status?.toUpperCase() === "ACTIVE";

                      return (
                        <tr key={rental.id} className="text-slate-600 text-xs font-semibold group hover:bg-slate-50/50">
                          <td className="py-4 pl-2">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200/40 relative overflow-hidden">
                                <Building2 className="w-5 h-5 text-slate-400" />
                              </div>
                              <div>
                                <p className="font-bold text-slate-800 text-sm leading-tight group-hover:text-primary transition-colors">
                                  {prop.title || "Unknown Property"}
                                </p>
                                <p className="text-[10px] text-slate-400 font-semibold mt-0.5 leading-none">
                                  {prop.location || "N/A"}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 font-semibold text-slate-500">
                            {new Date(rental.moveInDate).toLocaleDateString()}
                          </td>
                          <td className="py-4 font-bold text-slate-800">
                            ৳{prop.price ? prop.price.toLocaleString() : "0"}
                          </td>
                          <td className="py-4">{getStatusBadge(rental.status)}</td>
                          <td className="py-4 pr-2 text-right">
                            {isApproved && (
                              <NextLink href={`/dashboard/tenant/requests/${rental.id}/pay`}>
                                <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold cursor-pointer rounded-xl px-4 text-[10px] h-8 shadow-sm">
                                  Pay Now
                                </Button>
                              </NextLink>
                            )}
                            {isActive && (
                              <Button
                                onClick={() => openReviewModal(prop.id, prop.title)}
                                className="bg-slate-900 hover:bg-slate-800 text-white font-bold cursor-pointer rounded-xl px-4 text-[10px] h-8 shadow-sm"
                              >
                                Leave Review
                              </Button>
                            )}
                            {!isApproved && !isActive && (
                              <span className="text-slate-400 text-[10px] font-bold italic">No Actions</span>
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

          {/* Payment History Section */}
          <div className="bg-white rounded-3xl border border-slate-100/80 p-6 shadow-[0_4px_25px_rgba(0,0,0,0.015)] animate-fade-in-up" style={{ animationDelay: "200ms" }}>
            <h2 className="text-lg font-black text-slate-855 mb-5 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-primary" /> Payment History
            </h2>

            {payments.length === 0 ? (
              <p className="text-slate-400 text-xs font-semibold italic text-center py-8">
                No payment history available.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 text-[10px] uppercase font-bold tracking-wider">
                      <th className="pb-3.5 pl-2">Transaction ID</th>
                      <th className="pb-3.5">Property</th>
                      <th className="pb-3.5">Provider / Method</th>
                      <th className="pb-3.5">Amount</th>
                      <th className="pb-3.5">Date</th>
                      <th className="pb-3.5 pr-2 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {payments.map((payment) => {
                      const pStatus = payment.status?.toUpperCase();
                      const isCompleted = pStatus === "COMPLETED";

                      return (
                        <tr key={payment.id} className="text-slate-600 text-xs font-semibold hover:bg-slate-50/50">
                          <td className="py-4 pl-2 font-mono text-[10px] text-slate-500 select-all">
                            {payment.transactionId}
                          </td>
                          <td className="py-4 text-slate-700 font-bold">
                            {payment.rental?.property?.title || "Rental Payment"}
                          </td>
                          <td className="py-4 text-slate-500">
                            {payment.provider} ({payment.method || "card"})
                          </td>
                          <td className="py-4 font-extrabold text-slate-800">
                            ৳{payment.amount.toLocaleString()}
                          </td>
                          <td className="py-4 text-slate-400 font-medium">
                            {payment.paidAt ? new Date(payment.paidAt).toLocaleDateString() : new Date(payment.createdAt).toLocaleDateString()}
                          </td>
                          <td className="py-4 pr-2 text-right">
                            <span
                              className={`inline-flex items-center text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                                isCompleted
                                  ? "text-green-600 bg-green-50 border border-green-200/50"
                                  : pStatus === "FAILED"
                                  ? "text-red-600 bg-red-50 border border-red-200/50"
                                  : "text-amber-600 bg-amber-50 border border-amber-200/50"
                              }`}
                            >
                              {pStatus}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Leave Review Modal */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-3xl border border-slate-100 max-w-md w-full p-6 shadow-2xl relative animate-scale-in">
            <button
              onClick={() => setIsReviewModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-900 font-bold text-lg focus:outline-none cursor-pointer"
            >
              ✕
            </button>

            <h3 className="text-xl font-black text-slate-800 mb-1 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-primary" /> Leave a Review
            </h3>
            <p className="text-slate-500 text-xs font-semibold mb-6">
              Share your experience at <span className="font-bold text-slate-800">{reviewPropertyName}</span>.
            </p>

            <form onSubmit={handleReviewSubmit} className="space-y-4">
              {/* Rating selection (Stars) */}
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2.5 ml-1">
                  Rating (1-5 Stars)
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="focus:outline-none cursor-pointer transition-transform hover:scale-110 duration-100"
                    >
                      <Star
                        className={`w-8 h-8 ${
                          star <= rating
                            ? "text-yellow-400 fill-current"
                            : "text-slate-200"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Comment text area */}
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5 ml-1">
                  Review Comment
                </label>
                <textarea
                  rows={4}
                  required
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Tell us what you liked or disliked about this property..."
                  className="w-full px-4 py-3 bg-slate-50 hover:bg-slate-50 border border-slate-200 focus:border-primary/55 rounded-xl text-slate-850 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:bg-white transition-all text-xs font-semibold"
                />
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={isPending}
                  className="w-full py-6 text-sm font-bold bg-slate-900 hover:bg-slate-800 text-white rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                  Submit Review
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
