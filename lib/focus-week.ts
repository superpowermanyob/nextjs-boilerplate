/** ISO 주차 ID (예: 2026-W26). 주차 경계는 UTC 월요일 00:00 (= KST 월요일 09:00). */

export function getCurrentFocusWeekId(from = new Date()): string {
  const date = new Date(
    Date.UTC(
      from.getUTCFullYear(),
      from.getUTCMonth(),
      from.getUTCDate(),
      from.getUTCHours(),
      from.getUTCMinutes(),
      from.getUTCSeconds(),
      from.getUTCMilliseconds(),
    ),
  );

  const dayNum = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - dayNum);

  const isoYear = date.getUTCFullYear();
  const yearStart = new Date(Date.UTC(isoYear, 0, 1));
  const weekNo = Math.ceil(
    ((date.getTime() - yearStart.getTime()) / 86_400_000 + 1) / 7,
  );

  return `${isoYear}-W${String(weekNo).padStart(2, "0")}`;
}

export function getNextWeeklyResetDate(from = new Date()): Date {
  const utcDay = from.getUTCDay();
  let daysUntilMonday = (8 - utcDay) % 7;

  if (daysUntilMonday === 0) {
    const isPastMidnight =
      from.getUTCHours() > 0 ||
      from.getUTCMinutes() > 0 ||
      from.getUTCSeconds() > 0 ||
      from.getUTCMilliseconds() > 0;
    daysUntilMonday = isPastMidnight ? 7 : 0;
  }

  const next = new Date(from);
  next.setUTCDate(next.getUTCDate() + daysUntilMonday);
  next.setUTCHours(0, 0, 0, 0);
  return next;
}

export function getWeeklyResetRemaining(from = new Date()) {
  const target = getNextWeeklyResetDate(from).getTime() - from.getTime();
  const totalSeconds = Math.max(0, Math.floor(target / 1000));
  const days = Math.floor(totalSeconds / 86_400);
  const hours = Math.floor((totalSeconds % 86_400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const time = [hours, minutes, seconds]
    .map((value) => String(value).padStart(2, "0"))
    .join(":");

  return { days, time, totalSeconds };
}
