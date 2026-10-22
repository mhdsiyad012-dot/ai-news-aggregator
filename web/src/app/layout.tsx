import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const jakartaSans = Plus_Jakarta_Sans({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PulseAI — Frontier AI Models, Autonomous Agents & Live Intelligence",
  description: "Premier agency-craft showcase & encyclopedia of released frontier AI systems, autonomous code builders, and daily Gemini-curated dispatches.",
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
      data-scroll-behavior="smooth"
      className={`${jakartaSans.variable} ${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-[#070709] text-[#F8FAFC] font-sans selection:bg-emerald-500/30 selection:text-white">
        {children}
      </body>
    </html>
  );
}
