"use client";

import { use, useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { getTenantRentals, createPaymentIntent, confirmPayment } from "@/service/tenant";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, CreditCard, ShieldCheck, ArrowLeft, Building2, Calendar, AlertCircle } from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

// Initialize Stripe Publishable Key (using fallback matching backend's test account format)
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ||
    "pk_test_51PwhP5K1YgB2xP9xf14GkMubR0dskhC8D3Jp39QYp9m7NlWkHq8gUa0vjI7E7R5V8x9Z1YmR2l3D4w"
);

// Stripe Checkout Form Component
function CheckoutForm({ clientSecret, transactionId, rental, amount }: { clientSecret: string; transactionId: string; rental: any; amount: number }) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      return;
    }

    setIsProcessing(true);
    setErrorMessage("");

    try {
      // 1. Confirm payment with Stripe using clientSecret
      const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        },
      });

      if (error) {
        setErrorMessage(error.message || "An error occurred with card confirmation.");
        setIsProcessing(false);
        return;
      }

      if (paymentIntent && paymentIntent.status === "succeeded") {
        // 2. Confirm payment in backend database
        const res = await confirmPayment(transactionId);
        if (res.success) {
          toast.success("Payment successful!", {
            description: "Your rental agreement is now active.",
          });
          router.push(`/payment/success?amount=${amount}&rentalId=${rental.id}&transactionId=${transactionId}`);
        } else {
          setErrorMessage(res.message || "Stripe payment succeeded, but database confirmation failed. Please contact support.");
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Payment process failed.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl">
        <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mb-3 ml-1">
          Credit or Debit Card
        </label>
        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-[0_2px_6px_rgba(0,0,0,0.015)]">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: "14px",
                  color: "#1e293b",
                  fontFamily: '"Inter", sans-serif',
                  "::placeholder": {
                    color: "#94a3b8",
                  },
                },
                invalid: {
                  color: "#ef4444",
                },
              },
            }}
          />
        </div>
      </div>

      {errorMessage && (
        <div className="flex items-center gap-2.5 p-4 text-xs font-bold text-red-600 bg-red-50 border border-red-200/50 rounded-2xl">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <Button
        type="submit"
        disabled={isProcessing || !stripe}
        className="w-full py-6.5 text-sm font-bold bg-slate-900 hover:bg-slate-800 text-white rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
      >
        {isProcessing ? (
          <>
            <Loader2 className="w-4.5 h-4.5 animate-spin" /> Processing Payment...
          </>
        ) : (
          `Pay ৳${amount.toLocaleString()}`
        )}
      </Button>
    </form>
  );
}

// Wrapper Page
export default function PayPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const rentalId = unwrappedParams.id;
  const router = useRouter();

  const [rental, setRental] = useState<any>(null);
  const [clientSecret, setClientSecret] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function initializePayment() {
      try {
        // Fetch rentals to check details
        const rentalsRes = await getTenantRentals();
        if (rentalsRes.success) {
          const matchedRental = rentalsRes.data.find((r: any) => r.id === rentalId);
          if (!matchedRental) {
            setError("Rental application not found.");
            setIsLoading(false);
            return;
          }
          setRental(matchedRental);
        } else {
          setError("Failed to fetch rental application details.");
          setIsLoading(false);
          return;
        }

        // Create Payment Intent
        const intentRes = await createPaymentIntent(rentalId);
        if (intentRes.success && intentRes.data) {
          setClientSecret(intentRes.data.clientSecret);
          setTransactionId(intentRes.data.transactionId);
        } else {
          setError(intentRes.message || "Failed to create Stripe payment intent. Landlord must approve the request before paying.");
        }
      } catch (err: any) {
        setError(err.message || "An error occurred during payment initiation.");
      } finally {
        setIsLoading(false);
      }
    }

    initializePayment();
  }, [rentalId]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center space-y-4">
          <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto" />
          <p className="text-slate-400 font-bold text-sm">Initiating secure Stripe payment session...</p>
        </div>
      </div>
    );
  }

  if (error || !rental) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="max-w-md w-full text-center space-y-4 p-8 bg-white rounded-3xl border border-slate-100 shadow-lg">
          <div className="w-14 h-14 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto border border-red-100">
            <AlertCircle className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-black text-slate-800">Payment Error</h3>
          <p className="text-slate-500 text-xs font-semibold leading-relaxed">{error}</p>
          <Button onClick={() => router.push("/dashboard/tenant")} className="bg-slate-900 text-white font-bold cursor-pointer rounded-xl py-6.5 px-6">
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const prop = rental.property || {};
  const amount = prop.price || 0;

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

      <div className="max-w-lg w-full space-y-8 bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.015)] border border-slate-100 relative z-10 animate-fade-in-up">
        {/* Back navigation */}
        <button
          onClick={() => router.push("/dashboard/tenant")}
          className="text-xs font-bold text-slate-400 hover:text-slate-800 transition-colors flex items-center gap-1.5 focus:outline-none cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </button>

        {/* Title */}
        <div className="text-center">
          <div className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider text-green-600 bg-green-50 border border-green-200/50 px-3 py-1.5 rounded-full mb-3">
            <ShieldCheck className="w-3.5 h-3.5" /> Secure Checkout
          </div>
          <h2 className="text-2xl font-black text-slate-850 tracking-tight">Complete Rental Booking</h2>
          <p className="text-slate-400 text-xs font-semibold mt-1">Review property details and complete card payment</p>
        </div>

        {/* Property Brief */}
        <div className="p-4 bg-slate-50/50 border border-slate-200/40 rounded-2xl flex items-center gap-3.5">
          <div className="w-12 h-12 bg-white rounded-xl border border-slate-200/50 flex items-center justify-center shrink-0">
            <Building2 className="w-6 h-6 text-slate-400" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-bold text-slate-800 text-sm truncate leading-tight">{prop.title}</p>
            <p className="text-[10px] text-slate-400 font-semibold truncate mt-0.5 leading-none">{prop.location}</p>
            <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-bold mt-1 leading-none">
              <Calendar className="w-3.5 h-3.5 text-slate-400" /> Move-In: {new Date(rental.moveInDate).toLocaleDateString()}
            </div>
          </div>
          <div className="text-right shrink-0">
            <p className="text-xs text-slate-400 font-semibold">Total Rent</p>
            <p className="text-base font-extrabold text-slate-900 leading-none">৳{amount.toLocaleString()}</p>
          </div>
        </div>

        {/* Stripe Elements Provider Wrapper */}
        {clientSecret && (
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <CheckoutForm
              clientSecret={clientSecret}
              transactionId={transactionId}
              rental={rental}
              amount={amount}
            />
          </Elements>
        )}
      </div>
    </div>
  );
}
