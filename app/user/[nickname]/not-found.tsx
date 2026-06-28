"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";

import { DocumentTitle } from "@/components/DocumentTitle";
import { useI18n } from "@/components/I18nProvider";

export default function UserNotFound() {
  const { t } = useI18n();

  return (
    <>
      <DocumentTitle title={t.notFound.title} description={t.notFound.description} />
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#1c1c1f] px-4 text-center text-[#cdd2dc]">
        <h1 className="text-2xl font-bold text-white">{t.notFound.title}</h1>
        <p className="mt-2 text-[#9aa0ae]">{t.notFound.description}</p>
        <Link
          href="/"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#5383e8] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#4171d6]"
        >
          <ChevronLeft className="h-4 w-4" />
          {t.notFound.backHome}
        </Link>
      </div>
    </>
  );
}
