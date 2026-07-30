"use server";

import { cookies } from "next/headers";

const getApiUrl = () => process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:5000";

// Fetch all properties (we filter client-side for the logged-in landlord)
export const getLandlordProperties = async () => {
  try {
    const res = await fetch(`${getApiUrl()}/api/properties`, { cache: "no-store" });
    const result = await res.json();
    return result;
  } catch (err: any) {
    return { success: false, message: err.message || "Failed to fetch landlord properties", data: [] };
  }
};

// Create property listing
export const createLandlordProperty = async (payload: {
  title: string;
  description: string;
  location: string;
  price: number;
  amenities: string[];
  categoryId: string;
}) => {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    if (!accessToken) return { success: false, message: "Unauthorized" };

    const res = await fetch(`${getApiUrl()}/api/landlord/properties`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(payload),
    });

    const result = await res.json();
    return result;
  } catch (err: any) {
    return { success: false, message: err.message || "Failed to create property" };
  }
};

// Update property listing
export const updateLandlordProperty = async (
  id: string,
  payload: {
    title?: string;
    description?: string;
    location?: string;
    price?: number;
    amenities?: string[];
    categoryId?: string;
    isAvailable?: boolean;
  }
) => {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    if (!accessToken) return { success: false, message: "Unauthorized" };

    const res = await fetch(`${getApiUrl()}/api/landlord/properties/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(payload),
    });

    const result = await res.json();
    return result;
  } catch (err: any) {
    return { success: false, message: err.message || "Failed to update property" };
  }
};

// Delete property listing
export const deleteLandlordProperty = async (id: string) => {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    if (!accessToken) return { success: false, message: "Unauthorized" };

    const res = await fetch(`${getApiUrl()}/api/landlord/properties/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const result = await res.json();
    return result;
  } catch (err: any) {
    return { success: false, message: err.message || "Failed to delete property" };
  }
};

// Get landlord rental requests
export const getLandlordRequests = async () => {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    if (!accessToken) return { success: false, message: "Unauthorized", data: [] };

    const res = await fetch(`${getApiUrl()}/api/landlord/requests`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
    });

    const result = await res.json();
    return result;
  } catch (err: any) {
    return { success: false, message: err.message || "Failed to fetch landlord requests", data: [] };
  }
};

// Approve or reject tenant rental request
export const updateRequestStatus = async (id: string, status: "APPROVED" | "REJECTED") => {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    if (!accessToken) return { success: false, message: "Unauthorized" };

    const res = await fetch(`${getApiUrl()}/api/landlord/requests/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ status }),
    });

    const result = await res.json();
    return result;
  } catch (err: any) {
    return { success: false, message: err.message || "Failed to update request status" };
  }
};
