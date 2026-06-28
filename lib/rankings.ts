import "server-only";

import {
  collection,
  getDocs,
  limit,
  orderBy,
  query as firestoreQuery,
  type QueryConstraint,
} from "firebase/firestore";

import { getCurrentFocusWeekId } from "@/lib/focus-week";
import { getClientFirestore } from "@/lib/firebase";
import type { RankingEntry, RankingType } from "@/lib/ranking-types";

export type { RankingEntry, RankingType } from "@/lib/ranking-types";

const RANKING_LIMIT = 100;

function toNumber(value: unknown, fallback = 0): number {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === "string" && value.trim() && !Number.isNaN(Number(value))) {
    return Number(value);
  }
  return fallback;
}

function readNestedWeekValue(
  container: unknown,
  weekId: string,
): number {
  if (!container || typeof container !== "object" || Array.isArray(container)) {
    return 0;
  }

  return toNumber((container as Record<string, unknown>)[weekId], 0);
}

function resolveWeeklyFocusMinutes(
  data: Record<string, unknown>,
  weekId: string,
): number {
  const liveFocus = toNumber(data.weeklyFocus, NaN);
  if (Number.isFinite(liveFocus) && liveFocus > 0) {
    return liveFocus;
  }

  const flattenedKeys = [
    `focusHistory.${weekId}`,
    `weeklyFocus.${weekId}`,
    `weeklyFocusTime.${weekId}`,
  ];

  for (const key of flattenedKeys) {
    const value = toNumber(data[key], NaN);
    if (Number.isFinite(value) && value > 0) {
      return value;
    }
  }

  const nestedSources = [data.focusHistory, data.weeklyFocusHistory];
  for (const source of nestedSources) {
    const value = readNestedWeekValue(source, weekId);
    if (value > 0) {
      return value;
    }
  }

  return 0;
}

function toRankingEntry(
  id: string,
  data: Record<string, unknown>,
  rank: number,
  focusTime: number,
): RankingEntry | null {
  const nickname = data.nickname;
  if (typeof nickname !== "string" || !nickname.trim()) {
    return null;
  }

  return {
    id,
    nickname: nickname.trim(),
    level: toNumber(data.level),
    highestFloor: toNumber(data.highestFloor),
    focusTime,
    combatPower: toNumber(data.combatPower),
    rank,
  };
}

async function fetchOrderedProfiles(
  orderField: string,
  maxResults: number,
  mapFocusTime?: (data: Record<string, unknown>) => number,
): Promise<RankingEntry[]> {
  const db = getClientFirestore();
  const constraints: QueryConstraint[] = [
    orderBy(orderField, "desc"),
    limit(maxResults),
  ];

  const snapshot = await getDocs(
    firestoreQuery(collection(db, "public_profiles"), ...constraints),
  );

  return snapshot.docs
    .map((doc, index) => {
      const data = doc.data() as Record<string, unknown>;
      const focusTime = mapFocusTime
        ? mapFocusTime(data)
        : toNumber(data[orderField]);
      return toRankingEntry(doc.id, data, index + 1, focusTime);
    })
    .filter((entry): entry is RankingEntry => entry !== null);
}

async function fetchWeeklyFocusRanking(weekId: string): Promise<RankingEntry[]> {
  try {
    const orderedResults = await fetchOrderedProfiles(
      "weeklyFocus",
      RANKING_LIMIT,
      (data) => resolveWeeklyFocusMinutes(data, weekId),
    );

    return orderedResults
      .filter((entry) => entry.focusTime > 0)
      .map((entry, index) => ({ ...entry, rank: index + 1 }));
  } catch (error) {
    console.warn("[fetchWeeklyFocusRanking] weeklyFocus orderBy failed:", error);
    return [];
  }
}

export type WeeklyFocusRankingsResult = {
  weekId: string;
  rankings: RankingEntry[];
};

export async function getWeeklyFocusRankings(): Promise<WeeklyFocusRankingsResult> {
  const weekId = getCurrentFocusWeekId();
  const rankings = await fetchWeeklyFocusRanking(weekId);
  return { weekId, rankings };
}

export async function getRankings(type: RankingType): Promise<RankingEntry[]> {
  switch (type) {
    case "highestFloor":
      return fetchOrderedProfiles("highestFloor", RANKING_LIMIT);
    case "combatPower":
      return fetchOrderedProfiles("combatPower", RANKING_LIMIT);
    case "weeklyFocus": {
      const { rankings } = await getWeeklyFocusRankings();
      return rankings;
    }
    default:
      return fetchOrderedProfiles("highestFloor", RANKING_LIMIT);
  }
}
