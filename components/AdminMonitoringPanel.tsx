"use client";

import { useState, useTransition } from "react";

import {
  loadBannerMessagesAction,
  saveBannerMessagesAction,
  type BannerMessages,
} from "@/app/admin/monitoring/actions";
import { BANNER_LOCALE_CODES } from "@/lib/banner-text";
import { LOCALES } from "@/lib/i18n/locales";

const LOCALE_META = Object.fromEntries(
  LOCALES.map(({ code, flag, label }) => [code, { flag, label }]),
) as Record<
  (typeof BANNER_LOCALE_CODES)[number],
  { flag: string; label: string }
>;

type AdminMonitoringPanelProps = {
  initialMessages: BannerMessages;
  initialError?: string;
};

export function AdminMonitoringPanel({
  initialMessages,
  initialError,
}: AdminMonitoringPanelProps) {
  const [messages, setMessages] = useState(initialMessages);
  const [status, setStatus] = useState(initialError ?? "");
  const [isError, setIsError] = useState(Boolean(initialError));
  const [isPending, startTransition] = useTransition();

  function updateMessage(code: keyof BannerMessages, value: string) {
    setMessages((current) => ({ ...current, [code]: value }));
  }

  function handleSave() {
    const hasAnyMessage = BANNER_LOCALE_CODES.some((code) => messages[code].trim());
    if (!hasAnyMessage) {
      setStatus("최소 1개 언어의 공지를 입력해 주세요.");
      setIsError(true);
      return;
    }

    startTransition(async () => {
      setStatus("저장 중...");
      setIsError(false);

      const result = await saveBannerMessagesAction(messages);
      if (!result.ok) {
        setStatus(result.error);
        setIsError(true);
        alert(`업데이트 실패: ${result.error}`);
        return;
      }

      setMessages(result.messages);
      setStatus("배너가 업데이트되었습니다.");
      setIsError(false);
      alert("업데이트 성공!");
    });
  }

  function handleReload() {
    startTransition(async () => {
      setStatus("불러오는 중...");
      setIsError(false);

      const result = await loadBannerMessagesAction();
      if (!result.ok) {
        setStatus(result.error);
        setIsError(true);
        return;
      }

      setMessages(result.messages);
      setStatus("기존 공지를 불러왔습니다.");
      setIsError(false);
    });
  }

  return (
    <div className="mx-auto max-w-4xl px-5 py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-white">Focus RPG Admin Monitoring</h1>
        <p className="mt-2 text-sm text-[#9aa0ae]">
          8개 언어 패치노트 전광판을 수정합니다. (Server Actions — fetch 없음)
        </p>
      </header>

      <section className="rounded-2xl border border-[#3d3d4a] bg-[#282830] p-5">
        <div className="mb-5 flex items-center justify-between gap-3">
          <h2 className="text-lg font-bold text-white">패치노트 전광판</h2>
          <button
            type="button"
            onClick={handleReload}
            disabled={isPending}
            className="rounded-xl border border-[#3d3d4a] px-4 py-2 text-sm font-semibold text-[#cdd2dc] transition hover:border-[#5383e8]/40 disabled:opacity-60"
          >
            다시 불러오기
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {BANNER_LOCALE_CODES.map((code) => {
            const meta = LOCALE_META[code];
            return (
              <div
                key={code}
                className="rounded-xl border border-[#3d3d4a] bg-[#1c1c1f] p-4"
              >
                <label
                  htmlFor={`banner-${code}`}
                  className="mb-2 flex items-center gap-2 text-sm font-bold text-white"
                >
                  <span>{meta.flag}</span>
                  <span>{meta.label}</span>
                  <span className="ml-auto text-xs font-semibold tracking-wider text-[#9aa0ae]">
                    {code}
                  </span>
                </label>
                <textarea
                  id={`banner-${code}`}
                  value={messages[code]}
                  onChange={(event) => updateMessage(code, event.target.value)}
                  placeholder={`${meta.label} 공지를 입력하세요`}
                  className="min-h-24 w-full rounded-xl border border-[#3d3d4a] bg-[#121216] px-3 py-3 text-sm text-white outline-none focus:border-[#5383e8]/60 focus:ring-2 focus:ring-[#5383e8]/20"
                />
              </div>
            );
          })}
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={isPending}
          className="mt-5 w-full rounded-xl bg-[#5383e8] px-4 py-3 text-sm font-bold text-white transition hover:brightness-110 disabled:opacity-60"
        >
          {isPending ? "처리 중..." : "배너 업데이트"}
        </button>

        {status && (
          <p
            className={`mt-3 text-sm ${isError ? "text-red-300" : "text-[#9aa0ae]"}`}
            role={isError ? "alert" : "status"}
          >
            {status}
          </p>
        )}

        {initialError?.includes("FIREBASE_SERVICE_ACCOUNT_JSON") && (
          <div className="mt-4 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
            Vercel(또는 `.env.local`)에{" "}
            <code className="text-amber-100">FIREBASE_SERVICE_ACCOUNT_JSON</code> 환경
            변수를 추가한 뒤 재배포해야 저장됩니다. Firebase Console → 프로젝트 설정 →
            서비스 계정 → 새 비공개 키 생성.
          </div>
        )}
      </section>
    </div>
  );
}
