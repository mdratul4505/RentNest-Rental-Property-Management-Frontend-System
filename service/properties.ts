"use server";

import { cookies } from "next/headers";

const getApiUrl = () => process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:5000";

// Fetch properties with filters
export const getProperties = async (params: Record<string, string | number> = {}) => {
  try {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        query.append(key, String(value));
      }
    });

    const url = `${getApiUrl()}/api/properties?${query.toString()}`;
    const res = await fetch(url, { cache: "no-store" });
    const result = await res.json();
    return result;
  } catch (err: any) {
    return { success: false, message: err.message || "Failed to fetch properties", data: [] };
  }
};

// Fetch single property details
export const getPropertyById = async (id: string) => {
  try {
    const res = await fetch(`${getApiUrl()}/api/properties/${id}`, { cache: "no-store" });
    const result = await res.json();
    return result;
  } catch (err: any) {
    return { success: false, message: err.message || "Failed to fetch property details" };
  }
};

// Fetch all categories
export const getCategories = async () => {
  try {
    const res = await fetch(`${getApiUrl()}/api/categories`, { cache: "no-store" });
    const result = await res.json();
    return result;
  } catch (err: any) {
    return { success: false, message: err.message || "Failed to fetch categories", data: [] };
  }
};

// Create a rental request (Tenant only)
export const createRentalRequest = async (payload: { propertyId: string; moveInDate: string }) => {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    if (!accessToken) {
      return { success: false, message: "You must be logged in to book a property." };
    }

    const res = await fetch(`${getApiUrl()}/api/rentals`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ body: payload }), // backend validates body inside 'body' object
    });

    const result = await res.json();
    return result;
  } catch (err: any) {
    return { success: false, message: err.message || "Failed to submit rental request" };
  }
};
