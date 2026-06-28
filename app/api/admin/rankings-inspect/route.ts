import { NextRequest, NextResponse } from "next/server";

import type { CollectionReference as AdminCollectionReference } from "firebase-admin/firestore";

import {
  getAdminAuthErrorMessage,
  isAdminBannerAuthorized,
} from "@/lib/admin-auth";
import { getCurrentFocusWeekId } from "@/lib/focus-week";
import { getAdminFirestore, getFirebaseAdminStatus } from "@/lib/firebase/admin";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

async function probeCollection(
  label: string,
  ref: AdminCollectionReference,
) {
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

export async function GET(request: NextRequest) {
  if (!isAdminBannerAuthorized(request)) {
    return NextResponse.json(
      { ok: false, error: getAdminAuthErrorMessage() },
      { status: 401 },
    );
  }

  const adminDb = getAdminFirestore();
  if (!adminDb) {
    return NextResponse.json(
      { ok: false, error: getFirebaseAdminStatus().message },
      { status: 500 },
    );
  }

  const weekId = getCurrentFocusWeekId();
  const root = adminDb.collection("leaderboards").doc("weekly_focus");

  let liveQuery: Record<string, unknown> = { size: 0 };
  try {
    const snapshot = await root
      .collection("rankings")
      .where("currentWeekId", "==", weekId)
      .where("score", ">", 0)
      .orderBy("score", "desc")
      .limit(3)
      .get();

    liveQuery = {
      size: snapshot.size,
      sample: snapshot.docs.map((doc) => ({
        id: doc.id,
        keys: Object.keys(doc.data()),
        data: doc.data(),
      })),
    };
  } catch (error) {
    liveQuery = {
      error: error instanceof Error ? error.message : "query failed",
    };
  }

  const firestore = await Promise.all([
    Promise.resolve({
      label: "rankings (live query)",
      weekId,
      ...liveQuery,
    }),
    probeCollection(
      "weeks/{weekId}/rankings (snapshot fallback)",
      root.collection("weeks").doc(weekId).collection("rankings"),
    ),
  ]);

  return NextResponse.json({ ok: true, weekId, firestore });
}
