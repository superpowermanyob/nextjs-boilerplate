import "server-only";

import { FieldValue } from "firebase-admin/firestore";

import {
  BANNER_LOCALE_CODES,
  extractBannerMessages,
} from "@/lib/banner-text";
import { getAdminFirestore } from "@/lib/firebase/admin";

export type BannerDocument = Record<string, unknown>;

export function isAdminBannerConfigured(): boolean {
  return Boolean(getAdminFirestore());
}

export async function getBannerDocument(): Promise<BannerDocument | null> {
  const db = getAdminFirestore();
  if (!db) {
    throw new Error(
      "Firebase Admin is not configured. Set FIREBASE_SERVICE_ACCOUNT_JSON on the server.",
    );
  }

  const snapshot = await db.collection("settings").doc("banner").get();
  return snapshot.exists ? (snapshot.data() as BannerDocument) : null;
}

export async function updateBannerDocument(
  messages: Partial<Record<(typeof BANNER_LOCALE_CODES)[number], string>>,
): Promise<void> {
  const db = getAdminFirestore();
  if (!db) {
    throw new Error(
      "Firebase Admin is not configured. Set FIREBASE_SERVICE_ACCOUNT_JSON on the server.",
    );
  }

  const payload: Record<string, unknown> = {
    enabled: true,
    updatedAt: FieldValue.serverTimestamp(),
  };

  for (const code of BANNER_LOCALE_CODES) {
    const value = messages[code]?.trim() ?? "";
    payload[code] = value;
  }

  await db.collection("settings").doc("banner").set(payload, { merge: true });
}

export function serializeBannerForAdmin(data: BannerDocument | null) {
  return {
    enabled: typeof data?.enabled === "boolean" ? data.enabled : true,
    messages: extractBannerMessages(data),
  };
}
