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
  type CollectionReference,
  type Firestore,
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
  "focusSeconds",
  "weeklyFocusSeconds",
] as const;

const NICKNAME_KEYS = ["nickname", "displayName", "name", "userName"] as const;

const SORT_FIELDS = [
  "rank",
  "focusTime",
  "weeklyFocus",
  "score",
  "minutes",
  "value",
] as const;

const LIVE_DOCUMENT_IDS = ["rankings", "live", "current", "data"] as const;

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

function finalizeRankings(entries: RankingEntry[]): RankingEntry[] {
  const filtered = entries.filter((entry) => entry.focusTime > 0 && entry.nickname);

  const hasExplicitRank = filtered.some((entry) => entry.rank > 0);
  if (hasExplicitRank) {
    return filtered
      .sort((a, b) => a.rank - b.rank)
      .slice(0, RANKING_LIMIT)
      .map((entry, index) => ({ ...entry, rank: index + 1 }));
  }

  return filtered
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
    rank: toNumber(raw.rank),
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

async function hydrateProfiles(entries: RankingEntry[]): Promise<RankingEntry[]> {
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

function mapRawRecords(records: Record<string, unknown>[]): RankingEntry[] {
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

async function fetchFromRankingDocument(
  data: Record<string, unknown> | null,
): Promise<RankingEntry[]> {
  if (!data) {
    return [];
  }

  for (const key of ["entries", "rankings", "top100", "users", "leaderboard"]) {
    const mapped = mapRawRecords(mapArrayLike(data[key]));
    if (mapped.length > 0) {
      return finalizeRankings(await hydrateProfiles(mapped));
    }
  }

  const direct = mapRawEntry("leaderboard", data);
  return direct ? finalizeRankings([direct]) : [];
}

async function readClientCollectionRecords(
  collectionRef: CollectionReference,
): Promise<Record<string, unknown>[]> {
  for (const field of SORT_FIELDS) {
    for (const direction of ["asc", "desc"] as const) {
      try {
        const snapshot = await getDocs(
          firestoreQuery(
            collectionRef,
            orderBy(field, direction),
            limit(RANKING_LIMIT),
          ),
        );
        if (!snapshot.empty) {
          return snapshot.docs.map((docSnap) => ({
            id: docSnap.id,
            ...(docSnap.data() as Record<string, unknown>),
          }));
        }
      } catch {
        // try next sort
      }
    }
  }

  try {
    const snapshot = await getDocs(
      firestoreQuery(collectionRef, limit(RANKING_LIMIT)),
    );
    return snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...(docSnap.data() as Record<string, unknown>),
    }));
  } catch {
    return [];
  }
}

async function readAdminCollectionRecords(
  collectionRef: AdminCollectionReference,
): Promise<Record<string, unknown>[]> {
  for (const field of SORT_FIELDS) {
    for (const direction of ["asc", "desc"] as const) {
      try {
        const snapshot = await collectionRef
          .orderBy(field, direction)
          .limit(RANKING_LIMIT)
          .get();
        if (!snapshot.empty) {
          return snapshot.docs.map((docSnap) => ({
            id: docSnap.id,
            ...(docSnap.data() as Record<string, unknown>),
          }));
        }
      } catch {
        // try next sort
      }
    }
  }

  try {
    const snapshot = await collectionRef.limit(RANKING_LIMIT).get();
    return snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...(docSnap.data() as Record<string, unknown>),
    }));
  } catch {
    return [];
  }
}

async function fetchFromCollectionCandidates(
  readRecords: (ref: CollectionReference) => Promise<Record<string, unknown>[]>,
  candidates: CollectionReference[],
): Promise<RankingEntry[]> {
  for (const candidate of candidates) {
    const records = await readRecords(candidate);
    if (records.length === 0) {
      continue;
    }

    const rankings = finalizeRankings(
      await hydrateProfiles(mapRawRecords(records)),
    );
    if (rankings.length > 0) {
      return rankings;
    }
  }

  return [];
}

async function fetchFromAdminCollectionCandidates(
  candidates: AdminCollectionReference[],
): Promise<RankingEntry[]> {
  for (const candidate of candidates) {
    const records = await readAdminCollectionRecords(candidate);
    if (records.length === 0) {
      continue;
    }

    const rankings = finalizeRankings(
      await hydrateProfiles(mapRawRecords(records)),
    );
    if (rankings.length > 0) {
      return rankings;
    }
  }

  return [];
}

function getClientLiveCollectionCandidates(db: Firestore): CollectionReference[] {
  const root = doc(db, "leaderboards", "weekly_focus");
  return [
    collection(root, "live", "live", "rankings"),
    collection(root, "live", "current", "rankings"),
    collection(root, "live"),
  ];
}

function getClientWeekCollectionCandidates(
  db: Firestore,
  weekId: string,
): CollectionReference[] {
  const root = doc(db, "leaderboards", "weekly_focus");
  return [collection(root, "weeks", weekId, "rankings")];
}

function getAdminLiveCollectionCandidates(
  adminDb: AdminFirestore,
): AdminCollectionReference[] {
  const root = adminDb.collection("leaderboards").doc("weekly_focus");
  return [
    root.collection("live").doc("live").collection("rankings"),
    root.collection("live").doc("current").collection("rankings"),
    root.collection("live"),
  ];
}

function getAdminWeekCollectionCandidates(
  adminDb: AdminFirestore,
  weekId: string,
): AdminCollectionReference[] {
  const root = adminDb.collection("leaderboards").doc("weekly_focus");
  return [root.collection("weeks").doc(weekId).collection("rankings")];
}

async function fetchFromLiveDocumentsWithClient(
  db: Firestore,
): Promise<RankingEntry[]> {
  for (const documentId of LIVE_DOCUMENT_IDS) {
    try {
      const snapshot = await getDoc(
        doc(db, "leaderboards", "weekly_focus", "live", documentId),
      );
      if (!snapshot.exists()) {
        continue;
      }

      const rankings = await fetchFromRankingDocument(
        snapshot.data() as Record<string, unknown>,
      );
      if (rankings.length > 0) {
        return rankings;
      }
    } catch {
      // try next document id
    }
  }

  return [];
}

async function fetchFromLiveDocumentsWithAdmin(
  adminDb: AdminFirestore,
): Promise<RankingEntry[]> {
  const root = adminDb.collection("leaderboards").doc("weekly_focus");

  for (const documentId of LIVE_DOCUMENT_IDS) {
    try {
      const snapshot = await root.collection("live").doc(documentId).get();
      if (!snapshot.exists) {
        continue;
      }

      const rankings = await fetchFromRankingDocument(
        snapshot.data() as Record<string, unknown>,
      );
      if (rankings.length > 0) {
        return rankings;
      }
    } catch {
      // try next document id
    }
  }

  return [];
}

async function fetchFromRtdbLive(): Promise<RankingEntry[]> {
  const adminRtdb = getAdminDatabase();
  if (!adminRtdb) {
    return [];
  }

  const paths = [
    "leaderboards/weekly_focus/live/rankings",
    "leaderboards/weekly_focus/live",
  ];

  for (const path of paths) {
    try {
      const snapshot = await adminRtdb.ref(path).get();
      if (!snapshot.exists()) {
        continue;
      }

      const records = mapArrayLike(snapshot.val());
      if (records.length === 0) {
        continue;
      }

      const rankings = finalizeRankings(
        await hydrateProfiles(mapRawRecords(records)),
      );
      if (rankings.length > 0) {
        return rankings;
      }
    } catch {
      // try next path
    }
  }

  return [];
}

async function fetchWeeklyRankingsWithAdmin(
  weekId: string,
): Promise<RankingEntry[]> {
  const adminDb = getAdminFirestore();
  if (!adminDb) {
    return fetchFromRtdbLive();
  }

  const fromLiveCollections = await fetchFromAdminCollectionCandidates(
    getAdminLiveCollectionCandidates(adminDb),
  );
  if (fromLiveCollections.length > 0) {
    return fromLiveCollections;
  }

  const fromLiveDocuments = await fetchFromLiveDocumentsWithAdmin(adminDb);
  if (fromLiveDocuments.length > 0) {
    return fromLiveDocuments;
  }

  const fromRtdb = await fetchFromRtdbLive();
  if (fromRtdb.length > 0) {
    return fromRtdb;
  }

  return fetchFromAdminCollectionCandidates(
    getAdminWeekCollectionCandidates(adminDb, weekId),
  );
}

async function fetchWeeklyRankingsWithClient(
  weekId: string,
): Promise<RankingEntry[]> {
  const db = getClientFirestore();

  const fromLiveCollections = await fetchFromCollectionCandidates(
    readClientCollectionRecords,
    getClientLiveCollectionCandidates(db),
  );
  if (fromLiveCollections.length > 0) {
    return fromLiveCollections;
  }

  const fromLiveDocuments = await fetchFromLiveDocumentsWithClient(db);
  if (fromLiveDocuments.length > 0) {
    return fromLiveDocuments;
  }

  return fetchFromCollectionCandidates(
    readClientCollectionRecords,
    getClientWeekCollectionCandidates(db, weekId),
  );
}

export async function fetchWeeklyFocusRanking(
  weekId = getCurrentFocusWeekId(),
): Promise<RankingEntry[]> {
  const sources = [
    () => fetchWeeklyRankingsWithAdmin(weekId),
    () => fetchWeeklyRankingsWithClient(weekId),
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
