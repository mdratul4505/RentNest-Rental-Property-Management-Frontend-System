/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { cookies } from "next/headers";

function decodeJwtPayload(token: string) {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (err) {
    return null;
  }
}

export const getMe = async () => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value || null;

  if (!accessToken) {
    return {
      success: false,
      message: "User not logged in!",
    };
  }

  // First try backend API
  try {
    const apiUrl = process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:5000";
    const res = await fetch(`${apiUrl}/api/auth/me`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
    });

    if (res.ok) {
      const result = await res.json();
      if (result.success) return result;
    }
  } catch (err: any) {
    // API offline fallback
  }

  // Fallback: decode active token directly
  const decoded = decodeJwtPayload(accessToken);
  if (decoded && decoded.email) {
    return {
      success: true,
      data: {
        user: {
          id: decoded.id,
          name: decoded.name || "Logged In User",
          email: decoded.email,
          role: decoded.role || "TENANT",
          image: decoded.image || "",
        },
      },
    };
  }

  return {
    success: false,
    message: "Invalid session token",
  };
};