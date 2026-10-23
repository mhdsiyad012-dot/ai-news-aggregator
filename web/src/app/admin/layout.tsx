import { headers, cookies } from "next/headers";
import { notFound } from "next/navigation";
import React from "react";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headerList = await headers();
  const host = headerList.get("host") || "";
  const cookieStore = await cookies();

  const isLocalhost =
    host.includes("localhost") ||
    host.includes("127.0.0.1") ||
    host.startsWith("192.168.") ||
    host.startsWith("10.");

  const isAllowed =
    isLocalhost ||
    process.env.ALLOW_WEB_ADMIN === "true" ||
    cookieStore.get("optimus_stealth_unlocked")?.value === "1";

  if (!isAllowed) {
    notFound();
  }

  return <>{children}</>;
}
