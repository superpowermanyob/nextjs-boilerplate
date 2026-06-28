import type { Locale } from "@/lib/i18n/locales";

export const BANNER_LOCALE_CODES = [
  "ko",
  "en",
  "ja",
  "vi",
  "id",
  "zh-TW",
  "zh-CN",
  "ru",
] as const satisfies readonly Locale[];

export const BANNER_FALLBACK_LOCALE = "ko" as const;

const LEGACY_TEXT_KEYS = ["text", "message", "content", "bannerText"] as const;

export function resolveBannerText(
  data: Record<string, unknown> | null | undefined,
  locale: Locale,
): string {
  if (!data) {
    return "";
  }

  const localized = data[locale];
  if (typeof localized === "string" && localized.trim()) {
    return localized.trim();
  }

  const fallback = data[BANNER_FALLBACK_LOCALE];
  if (typeof fallback === "string" && fallback.trim()) {
    return fallback.trim();
  }

  for (const key of LEGACY_TEXT_KEYS) {
    const value = data[key];
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }

  for (const code of BANNER_LOCALE_CODES) {
    const value = data[code];
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }

  return "";
}

export function extractBannerMessages(
  data: Record<string, unknown> | null | undefined,
): Record<(typeof BANNER_LOCALE_CODES)[number], string> {
  const messages = Object.fromEntries(
    BANNER_LOCALE_CODES.map((code) => [code, ""]),
  ) as Record<(typeof BANNER_LOCALE_CODES)[number], string>;

  if (!data) {
    return messages;
  }

  for (const code of BANNER_LOCALE_CODES) {
    const value = data[code];
    if (typeof value === "string") {
      messages[code] = value;
    }
  }

  const legacyText = LEGACY_TEXT_KEYS.map((key) => data[key]).find(
    (value): value is string => typeof value === "string" && value.trim().length > 0,
  );

  if (legacyText && !messages.ko.trim()) {
    messages.ko = legacyText.trim();
  }

  return messages;
}
