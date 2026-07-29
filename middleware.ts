import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Helper function to decode JWT payload in Next.js Edge Middleware
function decodeJwt(token: string) {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const payload = parts[1];
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
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

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Read accessToken from cookies
  const accessToken = request.cookies.get("accessToken")?.value;

  // Protect /dashboard routes
  if (pathname.startsWith("/dashboard")) {
    if (!accessToken) {
      const loginUrl = new URL("/auth/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    const decoded = decodeJwt(accessToken);
    if (!decoded || !decoded.role) {
      const response = NextResponse.redirect(new URL("/auth/login", request.url));
      response.cookies.delete("accessToken");
      response.cookies.delete("refreshToken");
      return response;
    }

    const userRole = decoded.role.toUpperCase();

    // Check Tenant access
    if (pathname.startsWith("/dashboard/tenant") && userRole !== "TENANT") {
      if (userRole === "LANDLORD") {
        return NextResponse.redirect(new URL("/dashboard/landlord", request.url));
      }
      if (userRole === "ADMIN") {
        return NextResponse.redirect(new URL("/dashboard/admin", request.url));
      }
    }

    // Check Landlord access
    if (pathname.startsWith("/dashboard/landlord") && userRole !== "LANDLORD") {
      if (userRole === "TENANT") {
        return NextResponse.redirect(new URL("/dashboard/tenant", request.url));
      }
      if (userRole === "ADMIN") {
        return NextResponse.redirect(new URL("/dashboard/admin", request.url));
      }
    }

    // Check Admin access
    if (pathname.startsWith("/dashboard/admin") && userRole !== "ADMIN") {
      if (userRole === "TENANT") {
        return NextResponse.redirect(new URL("/dashboard/tenant", request.url));
      }
      if (userRole === "LANDLORD") {
        return NextResponse.redirect(new URL("/dashboard/landlord", request.url));
      }
    }
  }

  // Redirect shorthand /login and /register paths
  if (pathname === "/login") {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }
  if (pathname === "/register") {
    return NextResponse.redirect(new URL("/auth/register", request.url));
  }

  // Redirect authenticated users trying to access login/register to their dashboard
  if (pathname.startsWith("/auth/login") || pathname.startsWith("/auth/register")) {
    if (accessToken) {
      const decoded = decodeJwt(accessToken);
      if (decoded && decoded.role) {
        const userRole = decoded.role.toUpperCase();
        if (userRole === "TENANT") {
          return NextResponse.redirect(new URL("/dashboard/tenant", request.url));
        }
        if (userRole === "LANDLORD") {
          return NextResponse.redirect(new URL("/dashboard/landlord", request.url));
        }
        if (userRole === "ADMIN") {
          return NextResponse.redirect(new URL("/dashboard/admin", request.url));
        }
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/auth/login", "/auth/register", "/login", "/register"],
};
