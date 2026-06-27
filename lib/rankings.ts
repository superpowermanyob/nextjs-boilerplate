import "server-only";

import {
  collection,
  getDocs,
  limit,
  orderBy,
  query as firestoreQuery,
  type QueryConstraint,
} from "firebase/firestore";

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

function toRankingEntry(
  id: string,
  data: Record<string, unknown>,
  rank: number,
): RankingEntry | null {
  const nickname = data.nickname;
  if (typeof nickname !== "string" || !nickname.trim()) {
    return null;
  }

  const weeklyFocus = toNumber(data.weeklyFocus, NaN);
  const totalFocusTime = toNumber(data.totalFocusTime);

  return {
    id,
    nickname: nickname.trim(),
    level: toNumber(data.level),
    highestFloor: toNumber(data.highestFloor),
    focusTime: Number.isFinite(weeklyFocus) ? weeklyFocus : totalFocusTime,
    combatPower: toNumber(data.combatPower),
    rank,
  };
}

async function fetchOrderedProfiles(
  orderField: string,
  maxResults: number,
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
    .map((doc, index) =>
      toRankingEntry(doc.id, doc.data() as Record<string, unknown>, index + 1),
    )
    .filter((entry): entry is RankingEntry => entry !== null);
}

async function fetchWeeklyFocusRanking(): Promise<RankingEntry[]> {
  const weeklyResults = await fetchOrderedProfiles("weeklyFocus", RANKING_LIMIT);
  if (weeklyResults.length > 0) {
    return weeklyResults;
  }

  return fetchOrderedProfiles("totalFocusTime", RANKING_LIMIT);
}

export async function getRankings(type: RankingType): Promise<RankingEntry[]> {
  switch (type) {
    case "highestFloor":
      return fetchOrderedProfiles("highestFloor", RANKING_LIMIT);
    case "combatPower":
      return fetchOrderedProfiles("combatPower", RANKING_LIMIT);
    case "weeklyFocus":
      return fetchWeeklyFocusRanking();
    default:
      return fetchOrderedProfiles("highestFloor", RANKING_LIMIT);
  }
}
