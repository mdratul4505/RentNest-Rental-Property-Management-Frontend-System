"use server"

import { cookies } from "next/headers";

export const getMe = async () => {
    const cookieStore = await cookies();

    const accessToken = cookieStore.get("accessToken")?.value || null;

    if(!accessToken){
        // throw new Error("User Not Logged In!");

        return {
            success : false,
            message : "User not logged in!"
        }
    }

    try {
        const apiUrl = process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:5000";
        const res = await fetch(`${apiUrl}/api/auth/me`, { // Wait, the route in backend is '/api/auth/me' or '/api/users/me'? Let's check!
            headers : {
                "Authorization": `Bearer ${accessToken}`
            },
            cache : "no-store"
        });

        if (!res.ok) {
            return {
                success: false,
                message: "Failed to fetch user profile"
            };
        }

        const result = await res.json();
        return result;
    } catch (err: any) {
        return {
            success: false,
            message: err.message || "Network error"
        };
    }
}