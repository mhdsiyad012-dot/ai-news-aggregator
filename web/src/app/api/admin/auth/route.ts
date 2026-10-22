import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    let password = "";
    try {
      const body = await request.json();
      password = body?.password || "";
    } catch {
      password = "";
    }

    const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

    if (password && password === adminPassword) {
      return NextResponse.json({ authenticated: true });
    }

    return NextResponse.json(
      { authenticated: false, error: "Invalid admin password" },
      { status: 401 }
    );
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
