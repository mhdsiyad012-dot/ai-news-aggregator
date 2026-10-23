import { NextResponse } from "next/server";
import { getAllDirectoryItems } from "@/lib/directoryService";
import { DirectoryCategory, CompanyFilter } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") as DirectoryCategory | null;
    const company = searchParams.get("company") as CompanyFilter | null;
    const query = searchParams.get("q")?.toLowerCase();

    let items = await getAllDirectoryItems();

    if (category && category !== "All Purpose") {
      items = items.filter(
        (item) =>
          item.category?.toLowerCase() === category.toLowerCase() ||
          (Array.isArray(item.secondaryCategories) ? item.secondaryCategories : []).some(
            (sc) => sc.toLowerCase() === category.toLowerCase()
          )
      );
    }

    if (company && company !== "All Companies") {
      items = items.filter(
        (item) => (item.company || "").toLowerCase() === company.toLowerCase()
      );
    }

    if (query) {
      items = items.filter(
        (item) =>
          (item.name || "").toLowerCase().includes(query) ||
          (item.company || "").toLowerCase().includes(query) ||
          (item.tagline || "").toLowerCase().includes(query) ||
          (item.description || "").toLowerCase().includes(query) ||
          (Array.isArray(item.keyFeatures) ? item.keyFeatures : []).some((kf) =>
            (kf || "").toLowerCase().includes(query)
          )
      );
    }

    return NextResponse.json({
      count: items.length,
      items,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to filter directory";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
