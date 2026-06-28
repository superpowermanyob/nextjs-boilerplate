"use client";

import { useI18n } from "@/components/I18nProvider";
import { LOCALES, type Locale } from "@/lib/i18n/locales";

export function LanguageSwitcher() {
  const { locale, setLocale } = useI18n();

  return (
    <div className="fixed right-4 top-4 z-[60] flex items-center justify-end gap-1 rounded-2xl border border-[#3d3d4a] bg-[#282830]/95 p-1.5 shadow-xl shadow-black/30 backdrop-blur-sm sm:right-6 sm:top-5">
      {LOCALES.map((item) => {
        const isActive = locale === item.code;

        return (
          <button
            key={item.code}
            type="button"
            onClick={() => setLocale(item.code as Locale)}
            title={item.label}
            aria-label={item.label}
            aria-pressed={isActive}
            className={`flex h-9 w-9 items-center justify-center rounded-xl text-lg transition ${
              isActive
                ? "bg-[#5383e8]/20 ring-2 ring-[#5383e8]/60"
                : "opacity-80 hover:bg-[#1c1c1f] hover:opacity-100"
            }`}
          >
            {item.flag}
          </button>
        );
      })}
    </div>
  );
}
