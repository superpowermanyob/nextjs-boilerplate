export const LOCALES = [
  { code: "en", flag: "🇺🇸", label: "English" },
  { code: "ko", flag: "🇰🇷", label: "한국어" },
  { code: "ja", flag: "🇯🇵", label: "日本語" },
  { code: "vi", flag: "🇻🇳", label: "Tiếng Việt" },
  { code: "id", flag: "🇮🇩", label: "Bahasa Indonesia" },
  { code: "zh-CN", flag: "🇨🇳", label: "简体中文" },
  { code: "zh-TW", flag: "🇹🇼", label: "繁體中文" },
  { code: "ru", flag: "🇷🇺", label: "Русский" },
] as const;

export type Locale = (typeof LOCALES)[number]["code"];

export const DEFAULT_LOCALE: Locale = "en";

export const LOCALE_STORAGE_KEY = "focus-rpg-locale";

export function isLocale(value: string): value is Locale {
  return LOCALES.some((locale) => locale.code === value);
}

export function getHtmlLang(locale: Locale): string {
  if (locale === "zh-CN") return "zh-Hans";
  if (locale === "zh-TW") return "zh-Hant";
  return locale;
}
