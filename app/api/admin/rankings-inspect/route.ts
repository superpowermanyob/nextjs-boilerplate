import { NextRequest, NextResponse } from "next/server";

import type {
  CollectionReference as AdminCollectionReference,
  DocumentReference,
  Firestore as AdminFirestore,
} from "firebase-admin/firestore";

import {
  getAdminAuthErrorMessage,
  isAdminBannerAuthorized,
} from "@/lib/admin-auth";
import { getCurrentFocusWeekId } from "@/lib/focus-week";
import { getAdminDatabase, getAdminFirestore, getFirebaseAdminStatus } from "@/lib/firebase/admin";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const SORT_FIELDS = [
  "rank",
  "focusTime",
  "weeklyFocus",
  "score",
  "minutes",
  "value",
] as const;

async function probeCollection(label: string, ref: AdminCollectionReference) {
  for (const field of SORT_FIELDS) {
    for (const direction of ["asc", "desc"] as const) {
      try {
        const snapshot = await ref.orderBy(field, direction).limit(3).get();
        if (!snapshot.empty) {
          return {
            label,
            sortField: `${field}:${direction}`,
            size: snapshot.size,
            sample: snapshot.docs.map((doc) => ({
              id: doc.id,
              keys: Object.keys(doc.data()),
            })),
          };
        }
      } catch {
        // try next sort
      }
    }
  }

  try {
    const snapshot = await ref.limit(3).get();
    return {
      label,
      size: snapshot.size,
      sample: snapshot.docs.map((doc) => ({
        id: doc.id,
        keys: Object.keys(doc.data()),
      })),
    };
  } catch (error) {
    return {
      label,
      error: error instanceof Error ? error.message : "read failed",
    };
  }
}

async function probeDocument(label: string, ref: DocumentReference) {
  try {
    const snapshot = await ref.get();
    return {
      label,
      exists: snapshot.exists,
      keys: snapshot.exists ? Object.keys(snapshot.data() ?? {}) : [],
      sample: snapshot.exists ? snapshot.data() : null,
    };
  } catch (error) {
    return {
      label,
      error: error instanceof Error ? error.message : "read failed",
    };
  }
}

export async function GET(request: NextRequest) {
  if (!isAdminBannerAuthorized(request)) {
    return NextResponse.json(
      { ok: false, error: getAdminAuthErrorMessage() },
      { status: 401 },
    );
  }

  const adminDb = getAdminFirestore();
  const adminRtdb = getAdminDatabase();
  if (!adminDb) {
    return NextResponse.json(
      { ok: false, error: getFirebaseAdminStatus().message },
      { status: 500 },
    );
  }

  const weekId = getCurrentFocusWeekId();
  const root = adminDb.collection("leaderboards").doc("weekly_focus");

  const firestore = await Promise.all([
    probeCollection(
      "live/live/rankings",
      root.collection("live").doc("live").collection("rankings"),
    ),
    probeCollection(
      "live/current/rankings",
      root.collection("live").doc("current").collection("rankings"),
    ),
    probeDocument("live/rankings (doc)", root.collection("live").doc("rankings")),
    probeCollection("live (direct)", root.collection("live")),
    probeCollection(
      `weeks/${weekId}/rankings`,
      root.collection("weeks").doc(weekId).collection("rankings"),
    ),
  ]);

  const rtdbPaths = [
    "leaderboards/weekly_focus/live/rankings",
    "leaderboards/weekly_focus/live",
    `leaderboards/weekly_focus/weeks/${weekId}/rankings`,
  ];

  const rtdb = [];
  if (adminRtdb) {
    for (const path of rtdbPaths) {
      try {
        const snapshot = await adminRtdb.ref(path).get();
        rtdb.push({
          path,
          exists: snapshot.exists(),
          preview: snapshot.exists()
            ? JSON.stringify(snapshot.val()).slice(0, 1500)
            : null,
        });
      } catch (error) {
        rtdb.push({
          path,
          error: error instanceof Error ? error.message : "read failed",
        });
      }
    }
  }

  return NextResponse.json({ ok: true, weekId, firestore, rtdb });
}
