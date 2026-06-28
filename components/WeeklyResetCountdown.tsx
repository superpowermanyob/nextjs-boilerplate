"use client";

import { useEffect, useState } from "react";
import { Clock3 } from "lucide-react";

import { useI18n } from "@/components/I18nProvider";
import { getWeeklyResetRemaining } from "@/lib/weekly-reset";

export function WeeklyResetCountdown() {
  const { t, format } = useI18n();
  const [remaining, setRemaining] = useState(() => getWeeklyResetRemaining());

  useEffect(() => {
    const timer = window.setInterval(() => {
      setRemaining(getWeeklyResetRemaining());
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="mb-6 overflow-hidden rounded-2xl border border-[#5383e8]/30 bg-[#5383e8]/10">
      <div className="flex flex-col gap-2 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <div className="flex items-center gap-2 text-sm font-semibold text-[#9eb8ff]">
          <Clock3 className="h-4 w-4" />
          {t.countdown.label}
        </div>
        <p className="font-mono text-base font-bold tabular-nums text-white sm:text-lg">
          {format(t.countdown.resetIn, {
            days: remaining.days,
            time: remaining.time,
          })}
        </p>
      </div>
    </div>
  );
}
