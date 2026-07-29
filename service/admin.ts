"use server";

import { cookies } from "next/headers";

const getApiUrl = () => process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:5000";

// Fetch all users
export const getAdminUsers = async () => {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    if (!accessToken) return { success: false, message: "Unauthorized", data: [] };

    const res = await fetch(`${getApiUrl()}/api/admin/users`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
    });

    const result = await res.json();
    return result;
  } catch (err: any) {
    return { success: false, message: err.message || "Failed to fetch users", data: [] };
  }
};

// Ban / Unban user
export const updateUserStatus = async (id: string, status: "ACTIVE" | "BLOCKED") => {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    if (!accessToken) return { success: false, message: "Unauthorized" };

    const res = await fetch(`${getApiUrl()}/api/admin/users/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ body: { status } }),
    });

    const result = await res.json();
    return result;
  } catch (err: any) {
    return { success: false, message: err.message || "Failed to update user status" };
  }
};

// Fetch all system properties for Admin
export const getAdminProperties = async () => {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    if (!accessToken) return { success: false, message: "Unauthorized", data: [] };

    const res = await fetch(`${getApiUrl()}/api/admin/properties`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
    });

    const result = await res.json();
    return result;
  } catch (err: any) {
    return { success: false, message: err.message || "Failed to fetch admin properties", data: [] };
  }
};

// Fetch all system rental requests for Admin
export const getAdminRentals = async () => {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    if (!accessToken) return { success: false, message: "Unauthorized", data: [] };

    const res = await fetch(`${getApiUrl()}/api/admin/rentals`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
    });

    const result = await res.json();
    return result;
  } catch (err: any) {
    return { success: false, message: err.message || "Failed to fetch admin rentals", data: [] };
  }
};
