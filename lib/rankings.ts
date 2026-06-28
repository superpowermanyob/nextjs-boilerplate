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
import {
  fetchWeeklyFocusRanking,
  getWeeklyFocusRankings,
} from "@/lib/weekly-focus-rankings";

export type { RankingEntry, RankingType } from "@/lib/ranking-types";
export { getWeeklyFocusRankings } from "@/lib/weekly-focus-rankings";

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
      return toRankingEntry(doc.id, data, index + 1, toNumber(data[orderField]));
    })
    .filter((entry): entry is RankingEntry => entry !== null);
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
