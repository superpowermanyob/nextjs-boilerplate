"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Ticket } from "lucide-react";

import { useI18n } from "@/components/I18nProvider";

export function CouponShortcut() {
  const { t } = useI18n();
  const pathname = usePathname();

  if (pathname === "/coupon") {
    return null;
  }

  return (
    <Link
      href="/coupon"
      className="group fixed left-4 top-4 z-[60] inline-flex items-center gap-2.5 rounded-2xl border border-[#5383e8]/35 bg-[#282830]/95 py-2 pl-2.5 pr-3.5 shadow-xl shadow-black/30 backdrop-blur-sm transition hover:border-[#5383e8]/60 hover:bg-[#5383e8]/10 sm:left-6 sm:top-5 sm:py-2.5 sm:pl-3 sm:pr-4"
    >
      <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-[#5383e8]/30 to-[#8b5cf6]/20 ring-1 ring-[#5383e8]/40 transition group-hover:from-[#5383e8]/45 group-hover:to-[#8b5cf6]/30">
        <Ticket className="h-4 w-4 text-[#b8ccff]" strokeWidth={2.25} />
      </span>
      <span className="text-sm font-semibold text-white">{t.nav.coupon}</span>
    </Link>
  );
}
