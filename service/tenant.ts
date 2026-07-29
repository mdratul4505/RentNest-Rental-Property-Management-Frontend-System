"use server";

import { cookies } from "next/headers";

const getApiUrl = () => process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:5000";

// Fetch tenant rental request history
export const getTenantRentals = async () => {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    if (!accessToken) return { success: false, message: "Unauthorized", data: [] };

    const res = await fetch(`${getApiUrl()}/api/rentals`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
    });

    const result = await res.json();
    return result;
  } catch (err: any) {
    return { success: false, message: err.message || "Failed to fetch rental history", data: [] };
  }
};

// Fetch tenant payment history
export const getTenantPayments = async () => {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    if (!accessToken) return { success: false, message: "Unauthorized", data: [] };

    const res = await fetch(`${getApiUrl()}/api/payments`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
    });

    const result = await res.json();
    return result;
  } catch (err: any) {
    return { success: false, message: err.message || "Failed to fetch payment history", data: [] };
  }
};

// Submit review
export const createReview = async (payload: { propertyId: string; rating: number; comment: string }) => {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    if (!accessToken) return { success: false, message: "Unauthorized" };

    const res = await fetch(`${getApiUrl()}/api/reviews`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ body: payload }),
    });

    const result = await res.json();
    return result;
  } catch (err: any) {
    return { success: false, message: err.message || "Failed to submit review" };
  }
};

// Create Stripe Payment Intent
export const createPaymentIntent = async (rentalId: string) => {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    if (!accessToken) return { success: false, message: "Unauthorized" };

    const res = await fetch(`${getApiUrl()}/api/payments/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ body: { rentalId } }),
    });

    const result = await res.json();
    return result;
  } catch (err: any) {
    return { success: false, message: err.message || "Failed to create payment intent" };
  }
};

// Confirm Stripe Payment
export const confirmPayment = async (transactionId: string) => {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    if (!accessToken) return { success: false, message: "Unauthorized" };

    const res = await fetch(`${getApiUrl()}/api/payments/confirm`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ body: { transactionId } }),
    });

    const result = await res.json();
    return result;
  } catch (err: any) {
    return { success: false, message: err.message || "Failed to confirm payment" };
  }
};
