"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

import { useI18n } from "@/components/I18nProvider";
import { LOCALES, type Locale } from "@/lib/i18n/locales";

export function LanguageSwitcher() {
  const { locale, setLocale, t } = useI18n();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const active = LOCALES.find((item) => item.code === locale) ?? LOCALES[0];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed right-4 top-4 z-[60] sm:right-6 sm:top-5"
    >
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="inline-flex items-center gap-2 rounded-2xl border border-[#3d3d4a] bg-[#282830]/95 px-3 py-2 text-sm font-semibold text-white shadow-xl shadow-black/30 backdrop-blur-sm transition hover:border-[#5383e8]/40"
        aria-label={t.language.select}
      >
        <span className="text-lg">{active.flag}</span>
        <span className="hidden sm:inline">{active.label}</span>
        <ChevronDown
          className={`h-4 w-4 text-[#9aa0ae] transition ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-56 overflow-hidden rounded-2xl border border-[#3d3d4a] bg-[#282830] shadow-2xl shadow-black/40">
          <div className="border-b border-[#3d3d4a] px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[#9aa0ae]">
            {t.language.select}
          </div>
          <ul className="max-h-80 overflow-y-auto py-1">
            {LOCALES.map((item) => {
              const isActive = item.code === locale;

              return (
                <li key={item.code}>
                  <button
                    type="button"
                    onClick={() => {
                      setLocale(item.code as Locale);
                      setOpen(false);
                    }}
                    className={`flex w-full items-center gap-3 px-4 py-3 text-left text-sm transition ${
                      isActive
                        ? "bg-[#5383e8]/15 text-white"
                        : "text-[#cdd2dc] hover:bg-[#1c1c1f]"
                    }`}
                  >
                    <span className="text-lg">{item.flag}</span>
                    <span>{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
