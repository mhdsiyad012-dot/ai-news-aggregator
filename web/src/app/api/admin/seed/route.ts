import { NextResponse } from "next/server";
import { checkRequestAdminAuth } from "@/lib/adminAuth";
import { seedDefaultDirectoryTools } from "@/lib/directoryService";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!checkRequestAdminAuth(request)) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const result = await seedDefaultDirectoryTools();
    return NextResponse.json({
      success: true,
      message: result.message,
      count: result.count,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to seed default directory tools";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
