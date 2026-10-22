import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { ShowcaseFooter } from "@/components/ShowcaseFooter";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

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
      className={`${plusJakartaSans.variable} ${inter.variable} ${jetbrainsMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-[#000000] text-[#FFFFFF] font-sans selection:bg-[#4285F4]/30 selection:text-[#FFFFFF] relative">
        {/* DeepMind Hero Radial Aura */}
        <div className="deepmind-hero-aura" />

        <Navbar />
        <main className="flex-1 w-full relative z-10">
          {children}
        </main>
        <ShowcaseFooter />
      </body>
    </html>
  );
}
