import type { Metadata } from "next";
import "./globals.css";
import DeepMindNavigation from "@/components/DeepMindNavigation";
import { ShowcaseFooter } from "@/components/ShowcaseFooter";
import CommandPalette from "@/components/CommandPalette";

export const metadata: Metadata = {
  title: "Optimus Prime — Live AI Intelligence & Ecosystem Index",
  description:
    "Our next era of live AI intelligence, built to track frontier breakthroughs and every AI system.",
};

export const dynamic = "force-dynamic";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className="h-full antialiased dark"
      suppressHydrationWarning
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var t = localStorage.getItem('theme');
                if (t === 'light') {
                  document.documentElement.classList.remove('dark');
                } else {
                  document.documentElement.classList.add('dark');
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-[var(--background)] text-[var(--foreground)] font-sans selection:bg-[#4285F4]/30 selection:text-white relative transition-colors duration-200">
        <CommandPalette />
        <DeepMindNavigation />
        <main className="flex-1 w-full relative z-10">
          {children}
        </main>
        <ShowcaseFooter />
      </body>
    </html>
  );
}
