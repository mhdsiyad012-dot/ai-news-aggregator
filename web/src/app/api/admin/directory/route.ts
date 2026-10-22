import { NextResponse } from "next/server";
import { checkRequestAdminAuth } from "@/lib/adminAuth";
import {
  getAllDirectoryItems,
  createOrUpdateDirectoryItem,
  deleteDirectoryItem,
} from "@/lib/directoryService";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  if (!checkRequestAdminAuth(request)) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const items = await getAllDirectoryItems();
    return NextResponse.json({ count: items.length, items });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to load directory items";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!checkRequestAdminAuth(request)) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const body = await request.json();
    if (!body?.name || !body?.officialUrl) {
      return NextResponse.json(
        { success: false, error: "Name and Official URL are required" },
        { status: 400 }
      );
    }

    const item = await createOrUpdateDirectoryItem(body);
    return NextResponse.json({ success: true, item });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to save directory item";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  if (!checkRequestAdminAuth(request)) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");

    if (!slug) {
      return NextResponse.json(
        { success: false, error: "Tool slug is required for deletion" },
        { status: 400 }
      );
    }

    await deleteDirectoryItem(slug);
    return NextResponse.json({ success: true, message: `Tool "${slug}" deleted.` });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to delete directory item";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
