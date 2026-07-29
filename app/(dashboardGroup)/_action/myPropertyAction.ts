/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { isAccessTokenExist } from "@/service/refreshToken";
import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";


type PostState = {
    success: true,
    statusCode: number,
    message: string,
    data: Record<string, any>
}



export const createPost = async (prevState : PostState, formData : FormData ) =>{
  
    console.log({
        title : formData.get("title"),
        content : formData.get("content"),
        thumbnail : formData.get("thumbnail"),
        tags : (formData.get("tags") as string).split(", "),
        isPremium : formData.get("isPremium") === "on"
    });

    const payload = {
        title: formData.get("title"),
        content: formData.get("content"),
        thumbnail: formData.get("thumbnail"),
        tags: (formData.get("tags") as string).split(", "),
        isPremium: formData.get("isPremium") === "on"
    }


    const accessToken = await isAccessTokenExist()


    

    const res = await fetch(`${process.env.BACKEND_API_URL}/api/posts`, {
        method : "POST",
        headers: {
            Cookie: `accessToken=${accessToken}`,
            "Content-Type": "application/json"
        },
        body : JSON.stringify(payload)
    });

    const result = await res.json();

    if(result.success){
        revalidateTag("my-posts", {
            expire : 0
        })
    }

    if(result.success && result.data.isPremium){
        revalidateTag("premium-posts", {
            expire : 0
        })
    }else{
        revalidateTag("public-posts", {
            expire:0
        })
    }



    return result
}
export const updatePost = async (postId: string, prevState : PostState, formData : FormData ) =>{
    console.log({
        postId
    });
    console.log({
        title : formData.get("title"),
        content : formData.get("content"),
        thumbnail : formData.get("thumbnail"),
        tags : (formData.get("tags") as string).split(", "),
        isPremium : formData.get("isPremium") === "on"
    });

    const payload = {
        title: formData.get("title") ?? "",
        content: formData.get("content") ?? "",
        thumbnail: formData.get("thumbnail") ?? "",
        tags: (formData.get("tags") as string).split(", ") ?? "",
        isPremium: formData.get("isPremium") === "on"
    }



    const accessToken = await isAccessTokenExist()

    const res = await fetch(`${process.env.BACKEND_API_URL}/api/posts/${postId}`, {
        method : "PATCH",
        headers: {

            Cookie: `accessToken=${accessToken}`,
            "Content-Type": "application/json"
        },
        body : JSON.stringify(payload)
    });

    const result = await res.json();

    if(result.success){
        revalidateTag("my-posts", {
            expire : 0
        })
    }

    if(result.success && result.data.isPremium){
        revalidateTag("premium-posts", {
            expire : 0
        })
    }else{
        revalidateTag("public-posts", {
            expire:0
        })
    }



    return result
}

export const getMyPosts = async () => {
    const cookieStore = await cookies();
    
        const accessToken = cookieStore.get("accessToken")?.value || null;
    
        if(!accessToken){
            // throw new Error("User Not Logged In!");
    
            return {
                success : false,
                message : "User not logged in!"
            }
        }
    
    const res = await fetch(`${process.env.BACKEND_API_URL}/api/posts/my-posts`, {
            headers : {
    
                Cookie : `accessToken=${accessToken}`
            },
    
            cache : "force-cache",
            next : {
                revalidate : 60 * 60 * 24, // 1day
                tags : ["my-posts"]
            }
        });
    
        const result = res.json();
    
    
        return result
}