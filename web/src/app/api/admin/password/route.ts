import { NextResponse } from "next/server";
import { checkRequestAdminAuth } from "@/lib/adminAuth";
import { updateAdminCredentials } from "@/lib/settingsService";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!checkRequestAdminAuth(request)) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const body = await request.json().catch(() => ({}));
    const { newPassword, newUnlockKey } = body;

    if (!newPassword && !newUnlockKey) {
      return NextResponse.json(
        { success: false, error: "Please provide a new password or unlock key" },
        { status: 400 }
      );
    }

    await updateAdminCredentials(newPassword, newUnlockKey);

    return NextResponse.json({
      success: true,
      message: "Admin credentials successfully updated in database. Effective immediately with zero rebuilds required.",
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to update admin credentials";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
