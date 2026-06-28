"use client";

import { useEffect, useState } from "react";
import { Bug, MessageCircle, X } from "lucide-react";

import { useI18n } from "@/components/I18nProvider";
import { COMMUNITY_LINKS } from "@/lib/community-links";

export function CommunityWidget() {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 120);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`fixed bottom-5 right-4 z-50 flex flex-col items-end gap-3 transition-all duration-300 sm:right-6 ${
        visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-90"
      }`}
    >
      {open && (
        <div className="w-[min(100vw-2rem,280px)] overflow-hidden rounded-2xl border border-[#3d3d4a] bg-[#282830] shadow-2xl shadow-black/40">
          <div className="flex items-center justify-between border-b border-[#3d3d4a] px-4 py-3">
            <p className="text-sm font-semibold text-white">{t.community.title}</p>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-lg p-1 text-[#9aa0ae] transition hover:bg-[#1c1c1f] hover:text-white"
              aria-label={t.community.close}
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-2 p-3">
            <a
              href={COMMUNITY_LINKS.discord}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-xl border border-[#5865F2]/40 bg-[#5865F2]/10 px-4 py-3 text-sm font-medium text-white transition hover:bg-[#5865F2]/20"
            >
              <MessageCircle className="h-5 w-5 shrink-0 text-[#9eb8ff]" />
              {t.community.discord}
            </a>
            <a
              href={COMMUNITY_LINKS.bugReport}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-xl border border-[#3d3d4a] bg-[#1c1c1f] px-4 py-3 text-sm font-medium text-[#cdd2dc] transition hover:border-[#5383e8]/40 hover:text-white"
            >
              <Bug className="h-5 w-5 shrink-0 text-[#5383e8]" />
              {t.community.bugReport}
            </a>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="inline-flex items-center gap-2 rounded-full border border-[#5383e8]/40 bg-[#282830] px-4 py-3 text-sm font-semibold text-white shadow-xl shadow-black/30 transition hover:border-[#5383e8] hover:bg-[#5383e8]/15"
      >
        <MessageCircle className="h-5 w-5 text-[#5383e8]" />
        {t.community.open}
      </button>
    </div>
  );
}
