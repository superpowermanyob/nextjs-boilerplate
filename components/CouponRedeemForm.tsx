"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { Gift, Loader2, Ticket } from "lucide-react";

import { DocumentTitle } from "@/components/DocumentTitle";
import { useI18n } from "@/components/I18nProvider";
import type { CouponErrorCode } from "@/lib/coupon-errors";

type RedeemResponse = {
  ok: boolean;
  errorCode?: CouponErrorCode;
  error?: string;
};

export function CouponRedeemForm() {
  const { t, locale } = useI18n();
  const [identifier, setIdentifier] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);

  function resolveErrorMessage(errorCode?: CouponErrorCode, fallback?: string) {
    if (errorCode && errorCode in t.coupon.errors) {
      return t.coupon.errors[errorCode as keyof typeof t.coupon.errors];
    }
    return fallback ?? t.coupon.errors.SERVER_ERROR;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    setIsError(false);

    if (!identifier.trim()) {
      setMessage(t.coupon.errors.identifierRequired);
      setIsError(true);
      return;
    }

    if (!couponCode.trim()) {
      setMessage(t.coupon.errors.couponRequired);
      setIsError(true);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/coupon/redeem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier: identifier.trim(),
          couponCode: couponCode.trim(),
          locale,
        }),
      });

      const data = (await response.json()) as RedeemResponse;

      if (!response.ok || !data.ok) {
        const errorText = resolveErrorMessage(data.errorCode, data.error);
        setMessage(errorText);
        setIsError(true);
        window.alert(errorText);
        return;
      }

      setMessage(t.coupon.success);
      setIsError(false);
      setCouponCode("");
      window.alert(t.coupon.success);
    } catch {
      const errorText = t.coupon.errors.SERVER_ERROR;
      setMessage(errorText);
      setIsError(true);
      window.alert(errorText);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#1c1c1f] font-sans text-[#cdd2dc]">
      <DocumentTitle
        title={t.coupon.metaTitle}
        description={t.coupon.metaDescription}
      />

      <main className="relative mx-auto w-full max-w-xl px-4 pb-16 pt-28 sm:px-6 sm:pt-32">
        <div className="mb-8 text-center">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#5383e8]/30 bg-[#5383e8]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[#9eb8ff]">
            <Ticket className="h-3.5 w-3.5" />
            {t.coupon.badge}
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            {t.coupon.title}
          </h1>
          <p className="mx-auto mt-3 max-w-md text-sm text-[#9aa0ae] sm:text-base">
            {t.coupon.subtitle}
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="overflow-hidden rounded-2xl border border-[#3d3d4a] bg-[#282830] p-6 shadow-xl shadow-black/20"
        >
          <div className="mb-5 flex items-center gap-3 rounded-xl border border-[#5383e8]/20 bg-[#5383e8]/10 px-4 py-3 text-sm text-[#cdd2dc]">
            <Gift className="h-5 w-5 shrink-0 text-[#9eb8ff]" />
            <p>{t.coupon.hint}</p>
          </div>

          <div className="space-y-5">
            <div>
              <label
                htmlFor="coupon-identifier"
                className="mb-2 block text-sm font-semibold text-white"
              >
                {t.coupon.identifierLabel}
              </label>
              <input
                id="coupon-identifier"
                type="text"
                value={identifier}
                onChange={(event) => setIdentifier(event.target.value)}
                placeholder={t.coupon.identifierPlaceholder}
                autoComplete="off"
                className="w-full rounded-xl border border-[#3d3d4a] bg-[#1c1c1f] px-4 py-3 text-sm text-white outline-none transition focus:border-[#5383e8]/60 focus:ring-2 focus:ring-[#5383e8]/20"
              />
            </div>

            <div>
              <label
                htmlFor="coupon-code"
                className="mb-2 block text-sm font-semibold text-white"
              >
                {t.coupon.codeLabel}
              </label>
              <input
                id="coupon-code"
                type="text"
                value={couponCode}
                onChange={(event) => setCouponCode(event.target.value.toUpperCase())}
                placeholder={t.coupon.codePlaceholder}
                autoComplete="off"
                className="w-full rounded-xl border border-[#3d3d4a] bg-[#1c1c1f] px-4 py-3 font-mono text-sm uppercase tracking-wider text-white outline-none transition focus:border-[#5383e8]/60 focus:ring-2 focus:ring-[#5383e8]/20"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#5383e8] px-4 py-3 text-sm font-bold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {t.coupon.submitting}
              </>
            ) : (
              t.coupon.submit
            )}
          </button>

          {message && (
            <p
              role={isError ? "alert" : "status"}
              className={`mt-4 text-center text-sm ${isError ? "text-red-300" : "text-[#9eb8ff]"}`}
            >
              {message}
            </p>
          )}
        </form>

        <p className="mt-6 text-center text-sm">
          <Link
            href="/"
            className="font-semibold text-[#9eb8ff] transition hover:text-white"
          >
            {t.coupon.backHome}
          </Link>
        </p>
      </main>
    </div>
  );
}
