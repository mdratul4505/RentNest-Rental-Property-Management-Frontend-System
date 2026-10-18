"use server";

import { cookies } from "next/headers";

export const registerUser = async (payload: any) => {
  try {
    const apiUrl = process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:5000";
    const res = await fetch(`${apiUrl}/api/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const result = await res.json();

    if (res.ok && result.success) {
      let accessToken = result.data?.accessToken;
      let refreshToken = result.data?.refreshToken;
      let user = result.data?.user;

      // Resilient fallback: If deployed backend didn't return tokens directly, immediately auto-login
      if (!accessToken && payload.email && payload.password) {
        try {
          const loginRes = await fetch(`${apiUrl}/api/auth/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: payload.email,
              password: payload.password,
            }),
          });

          if (loginRes.ok) {
            const loginResult = await loginRes.json();
            if (loginResult.success && loginResult.data?.accessToken) {
              accessToken = loginResult.data.accessToken;
              refreshToken = loginResult.data.refreshToken;
              user = loginResult.data.user || user;
            }
          }
        } catch (loginErr) {
          console.error("Auto-login fallback during registration error:", loginErr);
        }
      }

      if (accessToken) {
        const cookieStore = await cookies();
        cookieStore.set("accessToken", accessToken, {
          httpOnly: true,
          maxAge: 60 * 60 * 24, // 1 day
          sameSite: "lax",
          secure: process.env.NODE_ENV === "production",
          path: "/",
        });

        if (refreshToken) {
          cookieStore.set("refreshToken", refreshToken, {
            httpOnly: true,
            maxAge: 60 * 60 * 24 * 7, // 7 days
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
            path: "/",
          });
        }

        result.data = {
          ...result.data,
          accessToken,
          refreshToken,
          user: user || result.data?.user,
        };
      }
    }

    return result;
  } catch (err: any) {
    return {
      success: false,
      message: err.message || "Failed to register user",
    };
  }
};
