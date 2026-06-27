import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { CommunityWidget } from "@/components/CommunityWidget";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Focus RPG | 전적 · 랭킹",
  description: "Focus RPG 플레이어 전적 검색 및 랭킹 보드",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <CommunityWidget />
      </body>
    </html>
  );
}
