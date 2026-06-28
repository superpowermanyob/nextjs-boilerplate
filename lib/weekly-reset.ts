const RESET_TIMEZONE = "Asia/Seoul";

type KSTDateParts = {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
  weekday: number;
};

function getKSTParts(date: Date): KSTDateParts {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: RESET_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    weekday: "short",
  });

  const parts = Object.fromEntries(
    formatter
      .formatToParts(date)
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, part.value]),
  );

  const weekdayMap: Record<string, number> = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
  };

  return {
    year: Number(parts.year),
    month: Number(parts.month),
    day: Number(parts.day),
    hour: Number(parts.hour),
    minute: Number(parts.minute),
    second: Number(parts.second),
    weekday: weekdayMap[parts.weekday ?? "Mon"] ?? 1,
  };
}

function toKSTMidnightISO(parts: KSTDateParts): string {
  return `${parts.year}-${String(parts.month).padStart(2, "0")}-${String(parts.day).padStart(2, "0")}T00:00:00+09:00`;
}

function addDaysToKSTParts(parts: KSTDateParts, days: number): KSTDateParts {
  const anchor = new Date(toKSTMidnightISO(parts));
  anchor.setUTCDate(anchor.getUTCDate() + days);
  return getKSTParts(anchor);
}

export function getNextWeeklyResetDate(from = new Date()): Date {
  const kst = getKSTParts(from);
  let daysUntilMonday = (8 - kst.weekday) % 7;

  if (daysUntilMonday === 0) {
    const isExactlyMidnight =
      kst.hour === 0 && kst.minute === 0 && kst.second === 0;
    daysUntilMonday = isExactlyMidnight ? 0 : 7;
  }

  const targetParts = addDaysToKSTParts(kst, daysUntilMonday);
  return new Date(toKSTMidnightISO(targetParts));
}

export function getWeeklyResetRemaining(from = new Date()) {
  const target = getNextWeeklyResetDate(from).getTime() - from.getTime();
  const totalSeconds = Math.max(0, Math.floor(target / 1000));
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const time = [hours, minutes, seconds]
    .map((value) => String(value).padStart(2, "0"))
    .join(":");

  return { days, time, totalSeconds };
}
