import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const STEALTH_COOKIE_NAME = "optimus_stealth_unlocked";
const DEFAULT_STEALTH_KEY = "optimus_prime_stealth_2026";

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  const host = request.headers.get("host") || "";

  // Only apply stealth protection to /admin routes and /api/admin routes
  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
    const isLocalhost =
      host.includes("localhost") ||
      host.includes("127.0.0.1") ||
      host.startsWith("192.168.") ||
      host.startsWith("10.");

    // If locally hosted or explicitly permitted by environment, allow immediately
    if (isLocalhost || process.env.ALLOW_WEB_ADMIN === "true") {
      return NextResponse.next();
    }

    const validStealthKey = process.env.ADMIN_STEALTH_KEY || DEFAULT_STEALTH_KEY;
    const adminPassword = process.env.ADMIN_PASSWORD || "Mhdsiyad@123@";
    const queryUnlockKey = searchParams.get("unlock_key");

    // Case 1: Visitor provides the secret unlock key in the URL (?unlock_key=...)
    if (queryUnlockKey && (queryUnlockKey === validStealthKey || queryUnlockKey === adminPassword)) {
      // Clean URL: redirect to the clean path and set the unlock cookie
      const cleanUrl = request.nextUrl.clone();
      cleanUrl.searchParams.delete("unlock_key");

      const response = NextResponse.redirect(cleanUrl);
      response.cookies.set(STEALTH_COOKIE_NAME, "1", {
        path: "/",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 30, // 30 days
      });
      return response;
    }

    // Case 2: Visitor has already unlocked stealth mode via the signed cookie
    const hasStealthCookie = request.cookies.get(STEALTH_COOKIE_NAME)?.value === "1";
    if (hasStealthCookie) {
      return NextResponse.next();
    }

    // Case 3: Unauthorized public visitor -> Stealth 404 (pretend the route doesn't exist)
    const notFoundUrl = new URL("/_not-found", request.url);
    return NextResponse.rewrite(notFoundUrl, {
      status: 404,
      statusText: "Not Found",
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
