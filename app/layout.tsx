import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { headers } from "next/headers";

import { CommunityWidget } from "@/components/CommunityWidget";
import { I18nProvider } from "@/components/I18nProvider";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import {
  buildRootMetadata,
  resolveLocaleFromAcceptLanguage,
} from "@/lib/i18n/metadata";
import { getHtmlLang } from "@/lib/i18n/locales";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers();
  const locale = resolveLocaleFromAcceptLanguage(
    headersList.get("accept-language"),
  );

  return buildRootMetadata(locale);
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const locale = resolveLocaleFromAcceptLanguage(
    headersList.get("accept-language"),
  );

  return (
    <html
      lang={getHtmlLang(locale)}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <I18nProvider>
          <LanguageSwitcher />
          {children}
          <CommunityWidget />
        </I18nProvider>
      </body>
    </html>
  );
}
