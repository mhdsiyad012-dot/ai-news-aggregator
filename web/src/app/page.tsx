import { Suspense } from "react";
import { getAIDirectory, getNewsArticles } from "@/lib/supabase";
import { MainDashboard } from "@/components/MainDashboard";

export const dynamic = "force-dynamic";

async function DashboardLoader() {
  const [directoryItems, newsArticles] = await Promise.all([
    getAIDirectory(),
    getNewsArticles(),
  ]);

  return (
    <MainDashboard
      initialDirectory={directoryItems}
      initialArticles={newsArticles}
    />
  );
}

export default function HomePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#070709] text-white">
          <div className="flex flex-col items-center space-y-4">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 p-[1px] animate-pulse">
              <div className="h-full w-full rounded-full bg-[#070709]" />
            </div>
            <span className="text-xs font-mono text-slate-400">
              Loading PulseAI Intelligence Hub...
            </span>
          </div>
        </div>
      }
    >
      <DashboardLoader />
    </Suspense>
  );
}
