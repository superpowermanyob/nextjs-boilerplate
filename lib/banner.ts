import "server-only";

import { doc, getDoc } from "firebase/firestore";

import { getClientFirestore } from "@/lib/firebase";

export type BannerDocument = {
  text: string;
  enabled?: boolean;
};

function pickBannerText(data: Record<string, unknown>): string {
  for (const key of ["text", "message", "content", "bannerText"]) {
    const value = data[key];
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }
  return "";
}

export async function getBannerDocument(): Promise<BannerDocument | null> {
  const db = getClientFirestore();
  const snapshot = await getDoc(doc(db, "settings", "banner"));

  if (!snapshot.exists()) {
    return null;
  }

  const data = snapshot.data() as Record<string, unknown>;
  const text = pickBannerText(data);
  const enabled = typeof data.enabled === "boolean" ? data.enabled : true;

  if (!enabled || !text) {
    return null;
  }

  return { text, enabled };
}
