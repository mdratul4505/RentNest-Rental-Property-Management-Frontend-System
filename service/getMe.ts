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

    const res = await fetch(`${process.env.BACKEND_API_URL}/api/users/me`, {
        headers : {

            Cookie : `accessToken=${accessToken}`
        },

        cache : "force-cache",
        next : {
            revalidate : 60 * 60 * 24, // 1day
            tags : ["my-profile"]
        }
    });

    const result = res.json();


    return result
}