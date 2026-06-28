import "server-only";

import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query as firestoreQuery,
} from "firebase/firestore";

import { getCurrentFocusWeekId } from "@/lib/focus-week";
import { getAdminDatabase, getAdminFirestore } from "@/lib/firebase/admin";
import { getClientFirestore } from "@/lib/firebase";
import type { RankingEntry } from "@/lib/ranking-types";

const RANKING_LIMIT = 100;

const FOCUS_TIME_KEYS = [
  "weeklyFocus",
  "focusTime",
  "focusMinutes",
  "weeklyFocusMinutes",
  "minutes",
  "score",
  "totalFocusTime",
  "value",
] as const;

const NICKNAME_KEYS = ["nickname", "displayName", "name", "userName"] as const;

function toNumber(value: unknown, fallback = 0): number {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === "string" && value.trim() && !Number.isNaN(Number(value))) {
    return Number(value);
  }
  return fallback;
}

function pickFocusTime(data: Record<string, unknown>): number {
  for (const key of FOCUS_TIME_KEYS) {
    const value = toNumber(data[key], NaN);
    if (Number.isFinite(value) && value > 0) {
      return value;
    }
  }
  return 0;
}

function pickNickname(data: Record<string, unknown>, fallback = ""): string {
  for (const key of NICKNAME_KEYS) {
    const value = data[key];
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }
  return fallback;
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

  return 0;
}

function finalizeRankings(entries: RankingEntry[]): RankingEntry[] {
  return entries
    .filter((entry) => entry.focusTime > 0 && entry.nickname)
    .sort((a, b) => b.focusTime - a.focusTime)
    .slice(0, RANKING_LIMIT)
    .map((entry, index) => ({ ...entry, rank: index + 1 }));
}

function mapRawEntry(
  id: string,
  raw: Record<string, unknown>,
  profile?: Record<string, unknown>,
): RankingEntry | null {
  const focusTime = pickFocusTime(raw);
  if (focusTime <= 0) {
    return null;
  }

  const nickname =
    pickNickname(raw) ||
    (profile ? pickNickname(profile) : "") ||
    (typeof profile?.nickname === "string" ? profile.nickname.trim() : "");

  if (!nickname) {
    return null;
  }

  const profileData = profile ?? raw;

  return {
    id,
    nickname,
    level: toNumber(profileData.level),
    highestFloor: toNumber(profileData.highestFloor),
    focusTime,
    combatPower: toNumber(profileData.combatPower),
    rank: 0,
  };
}

function mapArrayLike(value: unknown): Record<string, unknown>[] {
  if (Array.isArray(value)) {
    return value.filter(
      (item): item is Record<string, unknown> =>
        Boolean(item) && typeof item === "object" && !Array.isArray(item),
    );
  }

  if (value && typeof value === "object") {
    return Object.entries(value as Record<string, unknown>).map(([id, item]) => {
      if (item && typeof item === "object" && !Array.isArray(item)) {
        return { id, ...(item as Record<string, unknown>) };
      }
      return { id, value: item };
    });
  }

  return [];
}

async function hydrateProfiles(
  entries: RankingEntry[],
): Promise<RankingEntry[]> {
  if (entries.length === 0) {
    return entries;
  }

  const db = getClientFirestore();
  const hydrated = await Promise.all(
    entries.map(async (entry) => {
      if (entry.level > 0 && entry.highestFloor > 0) {
        return entry;
      }

      try {
        const snapshot = await getDoc(doc(db, "public_profiles", entry.id));
        if (!snapshot.exists()) {
          return entry;
        }

        const data = snapshot.data() as Record<string, unknown>;
        return {
          ...entry,
          nickname: entry.nickname || pickNickname(data),
          level: entry.level || toNumber(data.level),
          highestFloor: entry.highestFloor || toNumber(data.highestFloor),
          combatPower: entry.combatPower || toNumber(data.combatPower),
        };
      } catch {
        return entry;
      }
    }),
  );

  return hydrated;
}

function mapRawRecords(
  records: Record<string, unknown>[],
): RankingEntry[] {
  return records
    .map((record) => {
      const id =
        (typeof record.id === "string" && record.id) ||
        (typeof record.uid === "string" && record.uid) ||
        (typeof record.userId === "string" && record.userId) ||
        "";

      if (!id) {
        return null;
      }

      return mapRawEntry(id, record);
    })
    .filter((entry): entry is RankingEntry => entry !== null);
}

async function fetchFromWeeklyRankingsDoc(
  readDoc: (weekId: string) => Promise<Record<string, unknown> | null>,
  weekId: string,
): Promise<RankingEntry[]> {
  const data = await readDoc(weekId);
  if (!data) {
    return [];
  }

  for (const key of ["entries", "rankings", "top100", "users", "leaderboard"]) {
    const mapped = mapRawRecords(mapArrayLike(data[key]));
    if (mapped.length > 0) {
      return finalizeRankings(await hydrateProfiles(mapped));
    }
  }

  const direct = mapRawEntry(weekId, data);
  return direct ? finalizeRankings([direct]) : [];
}

async function fetchFromWeeklyRankingsSubcollection(
  readEntries: (weekId: string) => Promise<Record<string, unknown>[]>,
  weekId: string,
): Promise<RankingEntry[]> {
  const records = await readEntries(weekId);
  if (records.length === 0) {
    return [];
  }

  return finalizeRankings(await hydrateProfiles(mapRawRecords(records)));
}

async function fetchFromRtdbPath(
  readPath: (path: string) => Promise<unknown>,
  weekId: string,
): Promise<RankingEntry[]> {
  const paths = [
    `rankings/${weekId}/users`,
    `rankings/${weekId}`,
    `weeklyLeaderboards/${weekId}/focusTime`,
    `weeklyLeaderboards/${weekId}`,
    `weeklyFocusLeaderboard/${weekId}`,
    `leaderboards/weeklyFocus/${weekId}`,
    `weekly_rankings/${weekId}`,
  ];

  for (const path of paths) {
    const value = await readPath(path);
    const records = mapArrayLike(value);
    if (records.length === 0) {
      continue;
    }

    const rankings = finalizeRankings(await hydrateProfiles(mapRawRecords(records)));
    if (rankings.length > 0) {
      return rankings;
    }
  }

  return [];
}

async function fetchWeeklyRankingsWithAdmin(
  weekId: string,
): Promise<RankingEntry[]> {
  const adminDb = getAdminFirestore();
  const adminRtdb = getAdminDatabase();

  if (adminDb) {
    const fromDoc = await fetchFromWeeklyRankingsDoc(async (currentWeekId) => {
      const snapshot = await adminDb
        .collection("weekly_rankings")
        .doc(currentWeekId)
        .get();
      return snapshot.exists ? (snapshot.data() as Record<string, unknown>) : null;
    }, weekId);
    if (fromDoc.length > 0) {
      return fromDoc;
    }

    for (const subcollection of ["entries", "rankings", "users"]) {
      const fromSub = await fetchFromWeeklyRankingsSubcollection(
        async (currentWeekId) => {
          const base = adminDb
            .collection("weekly_rankings")
            .doc(currentWeekId)
            .collection(subcollection);

          for (const field of [
            "focusTime",
            "weeklyFocus",
            "score",
            "minutes",
          ]) {
            try {
              const snapshot = await base
                .orderBy(field, "desc")
                .limit(RANKING_LIMIT)
                .get();

              if (!snapshot.empty) {
                return snapshot.docs.map((docSnap) => ({
                  id: docSnap.id,
                  ...(docSnap.data() as Record<string, unknown>),
                }));
              }
            } catch {
              // Try the next sort field.
            }
          }

          try {
            const snapshot = await base.limit(RANKING_LIMIT).get();
            return snapshot.docs.map((docSnap) => ({
              id: docSnap.id,
              ...(docSnap.data() as Record<string, unknown>),
            }));
          } catch {
            return [];
          }
        },
        weekId,
      );

      if (fromSub.length > 0) {
        return fromSub;
      }
    }
  }

  if (adminRtdb) {
    return fetchFromRtdbPath(async (path) => {
      const snapshot = await adminRtdb.ref(path).get();
      return snapshot.exists() ? snapshot.val() : null;
    }, weekId);
  }

  return [];
}

async function fetchWeeklyRankingsWithClient(
  weekId: string,
): Promise<RankingEntry[]> {
  const db = getClientFirestore();

  const fromDoc = await fetchFromWeeklyRankingsDoc(async (currentWeekId) => {
    try {
      const snapshot = await getDoc(doc(db, "weekly_rankings", currentWeekId));
      return snapshot.exists()
        ? (snapshot.data() as Record<string, unknown>)
        : null;
    } catch {
      return null;
    }
  }, weekId);
  if (fromDoc.length > 0) {
    return fromDoc;
  }

  for (const subcollection of ["entries", "rankings", "users"]) {
    const fromSub = await fetchFromWeeklyRankingsSubcollection(
      async (currentWeekId) => {
        try {
          const snapshot = await getDocs(
            firestoreQuery(
              collection(db, "weekly_rankings", currentWeekId, subcollection),
              limit(RANKING_LIMIT),
            ),
          );
          return snapshot.docs.map((docSnap) => ({
            id: docSnap.id,
            ...(docSnap.data() as Record<string, unknown>),
          }));
        } catch {
          return [];
        }
      },
      weekId,
    );

    if (fromSub.length > 0) {
      return fromSub;
    }
  }

  return [];
}

async function fetchFromPublicProfiles(
  weekId: string,
): Promise<RankingEntry[]> {
  const db = getClientFirestore();

  for (const orderField of [
    "weeklyFocus",
    `focusHistory.${weekId}`,
    `weeklyFocus.${weekId}`,
  ]) {
    try {
      const snapshot = await getDocs(
        firestoreQuery(
          collection(db, "public_profiles"),
          orderBy(orderField, "desc"),
          limit(RANKING_LIMIT),
        ),
      );

      const entries = snapshot.docs
        .map((docSnap) => {
          const data = docSnap.data() as Record<string, unknown>;
          const focusTime =
            orderField === "weeklyFocus"
              ? resolveWeeklyFocusMinutes(data, weekId)
              : toNumber(data[orderField]);
          return toRankingEntry(docSnap.id, data, focusTime);
        })
        .filter((entry): entry is RankingEntry => entry !== null && entry.focusTime > 0);

      if (entries.length > 0) {
        return finalizeRankings(entries);
      }
    } catch {
      // Field/index may not exist yet for the current week.
    }
  }

  return [];
}

function toRankingEntry(
  id: string,
  data: Record<string, unknown>,
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
    rank: 0,
  };
}

export async function fetchWeeklyFocusRanking(
  weekId = getCurrentFocusWeekId(),
): Promise<RankingEntry[]> {
  const sources = [
    () => fetchWeeklyRankingsWithAdmin(weekId),
    () => fetchWeeklyRankingsWithClient(weekId),
    () => fetchFromPublicProfiles(weekId),
  ];

  for (const load of sources) {
    try {
      const rankings = await load();
      if (rankings.length > 0) {
        return rankings;
      }
    } catch (error) {
      console.warn("[fetchWeeklyFocusRanking]", error);
    }
  }

  return [];
}

export async function getWeeklyFocusRankings() {
  const weekId = getCurrentFocusWeekId();
  const rankings = await fetchWeeklyFocusRanking(weekId);
  return { weekId, rankings };
}
