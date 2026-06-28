"use client";

import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { Megaphone } from "lucide-react";

import { useI18n } from "@/components/I18nProvider";
import { resolveBannerText } from "@/lib/banner-text";
import { getClientFirestore } from "@/lib/firebase";

export function PatchNotesMarquee() {
  const { locale, t } = useI18n();
  const [bannerData, setBannerData] = useState<Record<string, unknown> | null>(
    null,
  );
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    const db = getClientFirestore();
    const bannerRef = doc(db, "settings", "banner");

    const unsubscribe = onSnapshot(
      bannerRef,
      (snapshot) => {
        if (!snapshot.exists()) {
          setBannerData(null);
          setEnabled(true);
          return;
        }

        const data = snapshot.data() as Record<string, unknown>;
        setBannerData(data);
        setEnabled(typeof data.enabled === "boolean" ? data.enabled : true);
      },
      () => {
        setBannerData(null);
        setEnabled(true);
      },
    );

    return () => unsubscribe();
  }, []);

  const text = enabled ? resolveBannerText(bannerData, locale) : "";

  if (!text) {
    return null;
  }

  return (
    <div className="fixed left-0 right-0 top-14 z-50 overflow-hidden border-b border-[#5383e8]/20 bg-[#1a2744]/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-2.5 sm:px-6">
        <div className="flex shrink-0 items-center gap-2 rounded-full border border-[#5383e8]/30 bg-[#5383e8]/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#9eb8ff]">
          <Megaphone className="h-3.5 w-3.5" />
          {t.banner.patchNotes}
        </div>
        <div className="relative min-w-0 flex-1 overflow-hidden">
          <div className="patchnotes-marquee whitespace-nowrap text-sm text-[#cdd2dc]">
            <span className="mx-8 inline-block">{text}</span>
            <span className="mx-8 inline-block" aria-hidden="true">
              {text}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
