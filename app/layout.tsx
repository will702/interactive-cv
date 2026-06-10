import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans, Fira_Code, Lora } from "next/font/google";
import "./globals.css";
import "katex/dist/katex.min.css";
import { Sidebar } from "@/components/layout/Sidebar";
import { BottomNav } from "@/components/layout/BottomNav";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-heading",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
});

const fira = Fira_Code({
  variable: "--font-fira",
  subsets: ["latin"],
});

const lora = Lora({
  variable: "--font-serif",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Computer Vision Interactive Learning",
  description: "Learn Computer Vision concepts through interactive demos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${plusJakarta.variable} ${inter.variable} ${fira.variable} ${lora.variable} h-full antialiased`}
    >
      <body className="flex h-screen bg-[#FDFCFB] text-slate-900 font-body">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-4 md:p-12 pb-24 md:pb-12 relative">
          {/* Subtle Paper Texture Overlay */}
          <div className="absolute inset-0 z-0 opacity-[0.02] pointer-events-none grayscale" 
               style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/natural-paper.png")' }} />
          <div className="relative z-10 max-w-6xl mx-auto">
            {children}
          </div>
        </main>
        <BottomNav />
      </body>
    </html>
  );
}
