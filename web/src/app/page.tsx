import { getAIDirectory, getNewsArticles } from "@/lib/supabase";
import { MainDashboard } from "@/components/MainDashboard";


export default async function HomePage() {
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
