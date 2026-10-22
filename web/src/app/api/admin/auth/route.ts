import { NextResponse } from "next/server";
import {
  setAdminSessionCookie,
  clearAdminSessionCookie,
  checkRequestAdminAuth,
} from "@/lib/adminAuth";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const authenticated = checkRequestAdminAuth(request);
  return NextResponse.json({ authenticated });
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const password = body?.password || "";
    const expectedPassword = process.env.ADMIN_PASSWORD || "Mhdsiyad@123@";

    if (password && password === expectedPassword) {
      const response = NextResponse.json({
        success: true,
        message: "Admin authentication successful",
      });
      setAdminSessionCookie(response);
      return response;
    }

    return NextResponse.json(
      { success: false, error: "Invalid admin passcode" },
      { status: 401 }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Authentication error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({
    success: true,
    message: "Admin logged out",
  });
  clearAdminSessionCookie(response);
  return response;
}
