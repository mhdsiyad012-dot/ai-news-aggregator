import crypto from "crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const ADMIN_COOKIE_NAME = "optimus_admin_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

function getAdminSecret(): string {
  return process.env.ADMIN_PASSWORD || "Mhdsiyad@123@";
}

function getSigningSecret(): string {
  // Derive a 32-byte secret based on admin password and pepper
  return crypto
    .createHash("sha256")
    .update(`${getAdminSecret()}::optimus_prime_secret_salt_2026`)
    .digest("hex");
}

export function createAdminSessionToken(): string {
  const timestamp = Date.now().toString();
  const signature = crypto
    .createHmac("sha256", getSigningSecret())
    .update(timestamp)
    .digest("hex");
  return `${timestamp}.${signature}`;
}

export function verifyAdminSessionToken(token: string | undefined | null): boolean {
  if (!token || typeof token !== "string") return false;
  const parts = token.split(".");
  if (parts.length !== 2) return false;

  const [timestampStr, providedSignature] = parts;
  const timestamp = parseInt(timestampStr, 10);
  if (isNaN(timestamp)) return false;

  // Check expiration (7 days)
  const age = Date.now() - timestamp;
  if (age < 0 || age > SESSION_MAX_AGE_SECONDS * 1000) return false;

  // Recalculate expected signature
  const expectedSignature = crypto
    .createHmac("sha256", getSigningSecret())
    .update(timestampStr)
    .digest("hex");

  try {
    return crypto.timingSafeEqual(
      Buffer.from(providedSignature, "hex"),
      Buffer.from(expectedSignature, "hex")
    );
  } catch {
    return false;
  }
}

export async function checkServerAdminAuth(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
    return verifyAdminSessionToken(token);
  } catch {
    return false;
  }
}

export function checkRequestAdminAuth(request: Request): boolean {
  try {
    const cookieHeader = request.headers.get("cookie") || "";
    const cookiesObj: Record<string, string> = {};
    cookieHeader.split(";").forEach((cookie) => {
      const [name, ...rest] = cookie.trim().split("=");
      if (name && rest.length > 0) {
        cookiesObj[name] = decodeURIComponent(rest.join("="));
      }
    });

    const token = cookiesObj[ADMIN_COOKIE_NAME];
    return verifyAdminSessionToken(token);
  } catch {
    return false;
  }
}

export function setAdminSessionCookie(response: NextResponse): void {
  const token = createAdminSessionToken();
  response.cookies.set(ADMIN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
}

export function clearAdminSessionCookie(response: NextResponse): void {
  response.cookies.set(ADMIN_COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

/**
 * Mask an API key so that only the first 6 and last 4 characters are visible.
 * Requirement 1: Never expose the full key to client-side.
 */
export function maskApiKey(key: string | undefined | null): string {
  if (!key) return "Not Configured";
  const cleanKey = key.trim();
  if (cleanKey.length <= 10) return "••••••••";
  const first6 = cleanKey.slice(0, 6);
  const last4 = cleanKey.slice(-4);
  return `${first6}...${"•".repeat(Math.min(12, cleanKey.length - 10))}...${last4}`;
}
