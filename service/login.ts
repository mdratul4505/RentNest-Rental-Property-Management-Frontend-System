"use server"

import { cookies } from "next/headers";

export const login = async (payload: any) => {
    try {
        const apiUrl = process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:5000";
        const res = await fetch(`${apiUrl}/api/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        const result = await res.json();

        if (res.ok && result.success) {
            const cookieStore = await cookies();
            
            cookieStore.set("accessToken", result.data.accessToken, {
                httpOnly: true,
                maxAge: 60 * 60 * 24, // 1 day
                sameSite: "lax",
                secure: process.env.NODE_ENV === "production",
            });

            cookieStore.set("refreshToken", result.data.refreshToken, {
                httpOnly: true,
                maxAge: 60 * 60 * 24 * 7, // 7 days
                sameSite: "lax",
                secure: process.env.NODE_ENV === "production",
            });
        }

        return result;
    } catch (err: any) {
        return {
            success: false,
            message: err.message || "Failed to log in"
        };
    }
}
