"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  getDictionary,
  interpolate,
  type Dictionary,
} from "@/lib/i18n/dictionaries";
import {
  DEFAULT_LOCALE,
  getHtmlLang,
  isLocale,
  LOCALE_STORAGE_KEY,
  type Locale,
} from "@/lib/i18n/locales";

type I18nContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Dictionary;
  format: (template: string, values: Record<string, string | number>) => string;
  formatFocusTime: (minutes: number) => string;
  formatNumber: (value: number) => string;
};

const I18nContext = createContext<I18nContextValue | null>(null);

function readStoredLocale(): Locale {
  if (typeof window === "undefined") {
    return DEFAULT_LOCALE;
  }

  const stored = window.localStorage.getItem(LOCALE_STORAGE_KEY);
  return stored && isLocale(stored) ? stored : DEFAULT_LOCALE;
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);

  useEffect(() => {
    setLocaleState(readStoredLocale());
  }, []);

  useEffect(() => {
    document.documentElement.lang = getHtmlLang(locale);
  }, [locale]);

  const setLocale = useCallback((nextLocale: Locale) => {
    setLocaleState(nextLocale);
    window.localStorage.setItem(LOCALE_STORAGE_KEY, nextLocale);
  }, []);

  const t = useMemo(() => getDictionary(locale), [locale]);

  const format = useCallback(
    (template: string, values: Record<string, string | number>) =>
      interpolate(template, values),
    [],
  );

  const formatFocusTime = useCallback(
    (minutes: number) => {
      const totalMinutes = Number.isFinite(minutes)
        ? Math.floor(Math.max(minutes, 0))
        : 0;
      const hours = Math.floor(totalMinutes / 60);
      return format(t.focus.hoursOnly, { hours });
    },
    [format, t],
  );

  const formatNumber = useCallback(
    (value: number) => {
      const localeMap: Record<Locale, string> = {
        en: "en-US",
        ko: "ko-KR",
        ja: "ja-JP",
        vi: "vi-VN",
        id: "id-ID",
        "zh-CN": "zh-CN",
        "zh-TW": "zh-TW",
        ru: "ru-RU",
      };
      return value.toLocaleString(localeMap[locale]);
    },
    [locale],
  );

  const value = useMemo(
    () => ({ locale, setLocale, t, format, formatFocusTime, formatNumber }),
    [locale, setLocale, t, format, formatFocusTime, formatNumber],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within I18nProvider");
  }
  return context;
}
