import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { ShowcaseFooter } from "@/components/ShowcaseFooter";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Optimus Prime — Live AI Intelligence & Ecosystem Index",
  description:
    "Premier Daily AI News Aggregator & Comprehensive AI Ecosystem Directory. Live verified dispatches, frontier foundation models, and autonomous coding agents.",
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
      className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-[#050507] text-[#FAFAFA] font-sans selection:bg-[#38BDF8]/20 selection:text-[#FAFAFA] relative">
        {/* Subtle Gemini Atmospheric Ambient Glow */}
        <div className="gemini-ambient-glow" />

        <Navbar />
        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full relative z-10">
          {children}
        </main>
        <ShowcaseFooter />
      </body>
    </html>
  );
}
