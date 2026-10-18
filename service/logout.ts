"use server";

import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";

export const logout = async () => {
  const cookieStore = await cookies();

  cookieStore.set("accessToken", "", {
    httpOnly: true,
    maxAge: 0,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });

  cookieStore.set("refreshToken", "", {
    httpOnly: true,
    maxAge: 0,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });

  cookieStore.delete("accessToken");
  cookieStore.delete("refreshToken");

  revalidateTag("my-profile", "max");
};