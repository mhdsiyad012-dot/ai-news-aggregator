import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const STEALTH_COOKIE_NAME = "optimus_stealth_unlocked";
const DEFAULT_STEALTH_KEY = "optimus2026";

async function verifyUnlockKey(key: string): Promise<boolean> {
  const staticKeys = [
    process.env.ADMIN_STEALTH_KEY,
    process.env.ADMIN_PASSWORD,
    DEFAULT_STEALTH_KEY,
    "Mhdsiyad@123@",
    "optimus_prime_stealth_2026",
  ].filter(Boolean);

  if (staticKeys.includes(key)) return true;

  // Check dynamic credentials in Supabase app_settings
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (supabaseUrl && serviceKey) {
    try {
      const res = await fetch(
        `${supabaseUrl}/rest/v1/app_settings?select=value&key=in.(admin_passcode,admin_unlock_key)`,
        {
          headers: {
            apikey: serviceKey,
            Authorization: `Bearer ${serviceKey}`,
          },
          cache: "no-store",
        }
      );
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          return data.some((item: { value: string }) => item.value === key);
        }
      }
    } catch {
      // Fallback
    }
  }

  return false;
}

export async function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  const host = request.headers.get("x-forwarded-host") || request.headers.get("host") || "";

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

    // Allow authenticated API calls (Vercel Cron, GitHub Actions, webhooks) via headers or query
    const authHeader = request.headers.get("authorization");
    const bearer = authHeader?.startsWith("Bearer ") ? authHeader.slice(7).trim() : "";
    const directKey =
      request.headers.get("x-admin-key") ||
      request.headers.get("x-admin-password") ||
      bearer ||
      searchParams.get("key") ||
      searchParams.get("secret");

    if (directKey) {
      const isCronMatch = Boolean(process.env.CRON_SECRET && directKey === process.env.CRON_SECRET);
      if (isCronMatch || (await verifyUnlockKey(directKey))) {
        return NextResponse.next();
      }
    }

    const queryUnlockKey = searchParams.get("unlock_key");

    // Case 1: Visitor provides secret unlock key in URL (?unlock_key=...)
    if (queryUnlockKey) {
      const isValid = await verifyUnlockKey(queryUnlockKey);
      if (isValid) {
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
    }

    // Case 2: Visitor has already unlocked stealth mode via the cookie
    const hasStealthCookie = request.cookies.get(STEALTH_COOKIE_NAME)?.value === "1";
    if (hasStealthCookie) {
      return NextResponse.next();
    }

    // Case 3: Unauthorized public visitor -> Stealth 404 (route appears nonexistent)
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
