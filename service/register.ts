"use server"

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
        return result;
    } catch (err: any) {
        return {
            success: false,
            message: err.message || "Failed to register user"
        };
    }
}
