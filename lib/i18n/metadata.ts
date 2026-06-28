import type { Metadata } from "next";

import { messageCatalog } from "@/lib/i18n/messages";
import {
  DEFAULT_LOCALE,
  isLocale,
  type Locale,
} from "@/lib/i18n/locales";

const OG_LOCALE_MAP: Record<Locale, string> = {
  en: "en_US",
  ko: "ko_KR",
  ja: "ja_JP",
  vi: "vi_VN",
  id: "id_ID",
  "zh-CN": "zh_CN",
  "zh-TW": "zh_TW",
  ru: "ru_RU",
};

function getMetadataBase(): URL {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return new URL(process.env.NEXT_PUBLIC_SITE_URL);
  }

  if (process.env.VERCEL_URL) {
    return new URL(`https://${process.env.VERCEL_URL}`);
  }

  return new URL("http://localhost:3000");
}

export function resolveLocaleFromAcceptLanguage(
  acceptLanguage: string | null,
): Locale {
  if (!acceptLanguage) {
    return DEFAULT_LOCALE;
  }

  const preferences = acceptLanguage
    .split(",")
    .map((part) => {
      const [lang, ...params] = part.trim().split(";");
      const qParam = params.find((param) => param.trim().startsWith("q="));
      const q = qParam ? Number.parseFloat(qParam.trim().slice(2)) : 1;

      return {
        lang: lang.trim().toLowerCase(),
        q: Number.isFinite(q) ? q : 0,
      };
    })
    .sort((a, b) => b.q - a.q);

  for (const { lang } of preferences) {
    if (lang === "zh-cn" || lang === "zh-hans" || lang === "zh-sg") {
      return "zh-CN";
    }
    if (lang === "zh-tw" || lang === "zh-hant" || lang === "zh-hk") {
      return "zh-TW";
    }
    if (isLocale(lang)) {
      return lang;
    }

    const base = lang.split("-")[0];
    if (isLocale(base)) {
      return base;
    }
  }

  return DEFAULT_LOCALE;
}

export function buildRootMetadata(locale: Locale = DEFAULT_LOCALE): Metadata {
  const { meta } = messageCatalog[locale];

  return {
    metadataBase: getMetadataBase(),
    title: meta.title,
    description: meta.description,
    openGraph: {
      type: "website",
      locale: OG_LOCALE_MAP[locale],
      siteName: meta.siteName,
      title: meta.title,
      description: meta.description,
      images: [
        {
          url: "/og-image.webp",
          width: 1200,
          height: 630,
          alt: meta.siteName,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
      images: ["/og-image.webp"],
    },
  };
}
