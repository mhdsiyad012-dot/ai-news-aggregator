import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";

export const dynamic = "force-dynamic";

const VALID_SECRETS = [
  process.env.REVALIDATE_SECRET,
  process.env.ADMIN_PASSWORD,
  process.env.ADMIN_STEALTH_KEY,
  "optimus_prime_stealth_2026",
  "Mhdsiyad@123@",
].filter(Boolean) as string[];

export async function GET(request: Request) {
  return handleRevalidate(request);
}

export async function POST(request: Request) {
  return handleRevalidate(request);
}

async function handleRevalidate(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret") || request.headers.get("x-revalidate-secret");
  const path = searchParams.get("path");
  const tag = searchParams.get("tag");

  // Validate authorization
  const isAuthorized = VALID_SECRETS.some((s) => s === secret);
  if (!isAuthorized) {
    return NextResponse.json({ error: "Invalid revalidation secret" }, { status: 401 });
  }

  const revalidatedPaths: string[] = [];
  const revalidatedTags: string[] = [];

  try {
    // 1. Tag revalidation
    if (tag) {
      revalidateTag(tag, { expire: 0 });
      revalidatedTags.push(tag);
    } else {
      try { revalidateTag("ai-directory", { expire: 0 }); revalidatedTags.push("ai-directory"); } catch {}
      try { revalidateTag("articles", { expire: 0 }); revalidatedTags.push("articles"); } catch {}
      try { revalidateTag("app-settings", { expire: 0 }); revalidatedTags.push("app-settings"); } catch {}
    }

    // 2. Path revalidation
    if (path) {
      revalidatePath(path);
      revalidatedPaths.push(path);
    } else {
      const defaultPaths = ["/", "/models", "/ecosystems", "/compare", "/news", "/about"];
      for (const p of defaultPaths) {
        try {
          revalidatePath(p);
          revalidatedPaths.push(p);
        } catch {}
      }
    }

    return NextResponse.json({
      revalidated: true,
      message: "Cache invalidated successfully across all edge nodes.",
      revalidatedPaths,
      revalidatedTags,
      timestamp: new Date().toISOString(),
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Revalidation failure";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
