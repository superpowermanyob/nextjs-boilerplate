import "server-only";

import type {
  CollectionReference as AdminCollectionReference,
  Firestore as AdminFirestore,
} from "firebase-admin/firestore";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query as firestoreQuery,
  where,
  type CollectionReference,
} from "firebase/firestore";

import { getCurrentFocusWeekId } from "@/lib/focus-week";
import { getAdminFirestore } from "@/lib/firebase/admin";
import { getClientFirestore } from "@/lib/firebase";
import type { RankingEntry } from "@/lib/ranking-types";

const RANKING_LIMIT = 100;
const LEADERBOARD_DOC = ["leaderboards", "weekly_focus"] as const;

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

function pickNickname(data: Record<string, unknown>): string {
  for (const key of NICKNAME_KEYS) {
    const value = data[key];
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }
  return "";
}

function pickScore(data: Record<string, unknown>): number {
  return toNumber(data.score);
}

function mapRankingDoc(id: string, data: Record<string, unknown>): RankingEntry | null {
  const score = pickScore(data);
  if (score <= 0) {
    return null;
  }

  return {
    id,
    nickname: pickNickname(data),
    level: toNumber(data.level),
    highestFloor: toNumber(data.highestFloor),
    focusTime: score,
    combatPower: toNumber(data.combatPower),
    rank: 0,
  };
}

async function hydrateProfiles(entries: RankingEntry[]): Promise<RankingEntry[]> {
  if (entries.length === 0) {
    return entries;
  }

  const db = getClientFirestore();

  return Promise.all(
    entries.map(async (entry) => {
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
}

function finalizeRankings(entries: RankingEntry[]): RankingEntry[] {
  return entries
    .filter((entry) => entry.focusTime > 0 && entry.nickname)
    .sort((a, b) => b.focusTime - a.focusTime)
    .slice(0, RANKING_LIMIT)
    .map((entry, index) => ({ ...entry, rank: index + 1 }));
}

function mapSnapshotDocs(
  docs: Array<{ id: string; data: () => Record<string, unknown> }>,
): RankingEntry[] {
  return docs
    .map((docSnap) => mapRankingDoc(docSnap.id, docSnap.data()))
    .filter((entry): entry is RankingEntry => entry !== null);
}

async function fetchLiveWeeklyRankingsWithAdmin(
  adminDb: AdminFirestore,
  weekId: string,
): Promise<RankingEntry[]> {
  const rankingsRef = adminDb
    .collection(LEADERBOARD_DOC[0])
    .doc(LEADERBOARD_DOC[1])
    .collection("rankings");

  try {
    const snapshot = await rankingsRef
      .where("currentWeekId", "==", weekId)
      .where("score", ">", 0)
      .orderBy("score", "desc")
      .limit(RANKING_LIMIT)
      .get();

    const entries = mapSnapshotDocs(
      snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        data: () => docSnap.data() as Record<string, unknown>,
      })),
    );

    return finalizeRankings(await hydrateProfiles(entries));
  } catch (error) {
    console.warn("[fetchLiveWeeklyRankingsWithAdmin]", error);
    return [];
  }
}

async function fetchLiveWeeklyRankingsWithClient(
  weekId: string,
): Promise<RankingEntry[]> {
  const db = getClientFirestore();
  const rankingsRef = collection(
    doc(db, LEADERBOARD_DOC[0], LEADERBOARD_DOC[1]),
    "rankings",
  );

  try {
    const snapshot = await getDocs(
      firestoreQuery(
        rankingsRef,
        where("currentWeekId", "==", weekId),
        where("score", ">", 0),
        orderBy("score", "desc"),
        limit(RANKING_LIMIT),
      ),
    );

    const entries = mapSnapshotDocs(
      snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        data: () => docSnap.data() as Record<string, unknown>,
      })),
    );

    return finalizeRankings(await hydrateProfiles(entries));
  } catch (error) {
    console.warn("[fetchLiveWeeklyRankingsWithClient]", error);
    return [];
  }
}

async function readAdminFallbackRankings(
  ref: AdminCollectionReference,
): Promise<RankingEntry[]> {
  const records = await readAdminFallbackRecords(ref);
  if (records.length === 0) {
    return [];
  }

  const entries = records
    .map((record) => {
      const id =
        (typeof record.id === "string" && record.id) ||
        (typeof record.uid === "string" && record.uid) ||
        (typeof record.userId === "string" && record.userId) ||
        "";

      if (!id) {
        return null;
      }

      return mapRankingDoc(id, record);
    })
    .filter((entry): entry is RankingEntry => entry !== null);

  return finalizeRankings(await hydrateProfiles(entries));
}

async function readClientFallbackRankings(
  ref: CollectionReference,
): Promise<RankingEntry[]> {
  const records = await readClientFallbackRecords(ref);
  if (records.length === 0) {
    return [];
  }

  const entries = records
    .map((record) => {
      const id =
        (typeof record.id === "string" && record.id) ||
        (typeof record.uid === "string" && record.uid) ||
        (typeof record.userId === "string" && record.userId) ||
        "";

      if (!id) {
        return null;
      }

      return mapRankingDoc(id, record);
    })
    .filter((entry): entry is RankingEntry => entry !== null);

  return finalizeRankings(await hydrateProfiles(entries));
}

async function readClientFallbackRecords(
  ref: CollectionReference,
): Promise<Record<string, unknown>[]> {
  for (const field of ["score", "rank", "focusTime", "weeklyFocus"] as const) {
    try {
      const snapshot = await getDocs(
        firestoreQuery(ref, orderBy(field, "desc"), limit(RANKING_LIMIT)),
      );
      if (!snapshot.empty) {
        return snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...(docSnap.data() as Record<string, unknown>),
        }));
      }
    } catch {
      // try next field
    }
  }

  try {
    const snapshot = await getDocs(firestoreQuery(ref, limit(RANKING_LIMIT)));
    return snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...(docSnap.data() as Record<string, unknown>),
    }));
  } catch {
    return [];
  }
}

async function readAdminFallbackRecords(
  ref: AdminCollectionReference,
): Promise<Record<string, unknown>[]> {
  for (const field of ["score", "rank", "focusTime", "weeklyFocus"] as const) {
    try {
      const snapshot = await ref.orderBy(field, "desc").limit(RANKING_LIMIT).get();
      if (!snapshot.empty) {
        return snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...(docSnap.data() as Record<string, unknown>),
        }));
      }
    } catch {
      // try next field
    }
  }

  try {
    const snapshot = await ref.limit(RANKING_LIMIT).get();
    return snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...(docSnap.data() as Record<string, unknown>),
    }));
  } catch {
    return [];
  }
}

async function fetchWeekSnapshotRankingsWithAdmin(
  adminDb: AdminFirestore,
  weekId: string,
): Promise<RankingEntry[]> {
  const ref = adminDb
    .collection(LEADERBOARD_DOC[0])
    .doc(LEADERBOARD_DOC[1])
    .collection("weeks")
    .doc(weekId)
    .collection("rankings");

  return readAdminFallbackRankings(ref);
}

async function fetchWeekSnapshotRankingsWithClient(
  weekId: string,
): Promise<RankingEntry[]> {
  const db = getClientFirestore();
  const ref = collection(
    doc(db, LEADERBOARD_DOC[0], LEADERBOARD_DOC[1], "weeks", weekId),
    "rankings",
  );

  return readClientFallbackRankings(ref);
}

export async function fetchWeeklyFocusRanking(
  weekId = getCurrentFocusWeekId(),
): Promise<RankingEntry[]> {
  const adminDb = getAdminFirestore();

  if (adminDb) {
    const live = await fetchLiveWeeklyRankingsWithAdmin(adminDb, weekId);
    if (live.length > 0) {
      return live;
    }

    const snapshot = await fetchWeekSnapshotRankingsWithAdmin(adminDb, weekId);
    if (snapshot.length > 0) {
      return snapshot;
    }
  }

  const liveClient = await fetchLiveWeeklyRankingsWithClient(weekId);
  if (liveClient.length > 0) {
    return liveClient;
  }

  return fetchWeekSnapshotRankingsWithClient(weekId);
}

export async function getWeeklyFocusRankings() {
  const weekId = getCurrentFocusWeekId();
  const rankings = await fetchWeeklyFocusRanking(weekId);
  return { weekId, rankings };
}
