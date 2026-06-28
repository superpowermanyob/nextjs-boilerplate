import "server-only";

import { FieldValue } from "firebase-admin/firestore";

import {
  BANNER_LOCALE_CODES,
  extractBannerMessages,
} from "@/lib/banner-text";
import {
  getAdminFirestore,
  getFirebaseAdminStatus,
} from "@/lib/firebase/admin";

export type BannerDocument = Record<string, unknown>;

function getFirestoreOrThrow() {
  const db = getAdminFirestore();
  if (db) {
    return db;
  }

  throw new Error(getFirebaseAdminStatus().message);
}

export function isAdminBannerConfigured(): boolean {
  return Boolean(getAdminFirestore());
}

export async function getBannerDocument(): Promise<BannerDocument | null> {
  const db = getFirestoreOrThrow();
  const snapshot = await db.collection("settings").doc("banner").get();
  return snapshot.exists ? (snapshot.data() as BannerDocument) : null;
}

export async function updateBannerDocument(
  messages: Partial<Record<(typeof BANNER_LOCALE_CODES)[number], string>>,
): Promise<void> {
  const db = getFirestoreOrThrow();

  const payload: Record<string, unknown> = {
    enabled: true,
    updatedAt: FieldValue.serverTimestamp(),
  };

  for (const code of BANNER_LOCALE_CODES) {
    payload[code] = messages[code]?.trim() ?? "";
  }

  await db.collection("settings").doc("banner").set(payload, { merge: true });
}

export function serializeBannerForAdmin(data: BannerDocument | null) {
  return {
    enabled: typeof data?.enabled === "boolean" ? data.enabled : true,
    messages: extractBannerMessages(data),
  };
}

export { getFirebaseAdminStatus };
