import "server-only";

import { FieldValue, Timestamp } from "firebase-admin/firestore";

import { buildMailboxPayload, extractGemAmount, scoreMailboxRewardTemplate } from "@/lib/coupon-mail";
import { CouponError } from "@/lib/coupon-errors";
import { getAdminFirestore, getFirebaseAdminStatus } from "@/lib/firebase/admin";

type UserRecord = {
  id: string;
  data: Record<string, unknown>;
};

type CouponRecord = {
  id: string;
  data: Record<string, unknown>;
};

function ensureAdminDb() {
  const db = getAdminFirestore();
  if (!db) {
    throw new CouponError("SERVER_ERROR", getFirebaseAdminStatus().message);
  }
  return db;
}

function normalizeCouponCode(code: string): string {
  return code.trim().toUpperCase();
}

function isCouponActive(data: Record<string, unknown>): boolean {
  if (data.active === false || data.enabled === false || data.isActive === false) {
    return false;
  }
  return true;
}

function isCouponExpired(expireDate: unknown): boolean {
  if (expireDate == null) {
    return false;
  }

  if (expireDate instanceof Timestamp) {
    return expireDate.toMillis() < Date.now();
  }

  if (expireDate instanceof Date) {
    return expireDate.getTime() < Date.now();
  }

  if (typeof expireDate === "string" || typeof expireDate === "number") {
    const time = new Date(expireDate).getTime();
    return Number.isFinite(time) && time < Date.now();
  }

  if (typeof expireDate === "object" && expireDate !== null && "seconds" in expireDate) {
    const seconds = Number((expireDate as { seconds: unknown }).seconds);
    return Number.isFinite(seconds) && seconds * 1000 < Date.now();
  }

  return false;
}

async function findUserByIdentifier(
  identifier: string,
): Promise<UserRecord | null> {
  const db = ensureAdminDb();
  const trimmed = identifier.trim();
  const normalizedEmail = trimmed.toLowerCase();

  const direct = await db.collection("users").doc(trimmed).get();
  if (direct.exists) {
    return { id: direct.id, data: direct.data() as Record<string, unknown> };
  }

  const emailFields = ["email", "userEmail", "mail"];
  for (const field of emailFields) {
    for (const value of [trimmed, normalizedEmail]) {
      const snapshot = await db
        .collection("users")
        .where(field, "==", value)
        .limit(1)
        .get();
      if (!snapshot.empty) {
        const doc = snapshot.docs[0];
        return { id: doc.id, data: doc.data() as Record<string, unknown> };
      }
    }
  }

  const idFields = ["uuid", "userId", "uid"];
  for (const field of idFields) {
    const snapshot = await db
      .collection("users")
      .where(field, "==", trimmed)
      .limit(1)
      .get();
    if (!snapshot.empty) {
      const doc = snapshot.docs[0];
      return { id: doc.id, data: doc.data() as Record<string, unknown> };
    }
  }

  return null;
}

async function findCouponByCode(code: string): Promise<CouponRecord | null> {
  const db = ensureAdminDb();
  const trimmed = code.trim();
  const normalized = normalizeCouponCode(trimmed);

  for (const docId of [normalized, trimmed]) {
    const doc = await db.collection("coupons").doc(docId).get();
    if (doc.exists) {
      return { id: doc.id, data: doc.data() as Record<string, unknown> };
    }
  }

  for (const field of ["code", "couponCode"]) {
    for (const value of [normalized, trimmed]) {
      const snapshot = await db
        .collection("coupons")
        .where(field, "==", value)
        .limit(1)
        .get();
      if (!snapshot.empty) {
        const doc = snapshot.docs[0];
        return { id: doc.id, data: doc.data() as Record<string, unknown> };
      }
    }
  }

  return null;
}

async function findMailboxRewardTemplate(
  userId: string,
): Promise<Record<string, unknown> | null> {
  const db = ensureAdminDb();
  const snapshot = await db
    .collection("users")
    .doc(userId)
    .collection("mailbox")
    .limit(30)
    .get();

  let best: Record<string, unknown> | null = null;
  let bestScore = 0;

  for (const doc of snapshot.docs) {
    const data = doc.data() as Record<string, unknown>;
    const score = scoreMailboxRewardTemplate(data);
    if (score > bestScore) {
      bestScore = score;
      best = data;
    }
  }

  return bestScore > 0 ? best : null;
}

export async function redeemCoupon(
  identifier: string,
  couponCode: string,
  locale?: string,
): Promise<{ userId: string; couponCode: string }> {
  const trimmedIdentifier = identifier.trim();
  const trimmedCode = couponCode.trim();

  if (!trimmedIdentifier || !trimmedCode) {
    throw new CouponError("INVALID_INPUT", "Identifier and coupon code are required.");
  }

  const db = ensureAdminDb();

  const user = await findUserByIdentifier(trimmedIdentifier);
  if (!user) {
    throw new CouponError("USER_NOT_FOUND", "User not found.");
  }

  const coupon = await findCouponByCode(trimmedCode);
  if (!coupon || !isCouponActive(coupon.data) || isCouponExpired(coupon.data.expireDate)) {
    throw new CouponError("COUPON_INVALID", "Coupon is invalid or expired.");
  }

  if (extractGemAmount(coupon.data) == null) {
    throw new CouponError(
      "COUPON_INVALID",
      "Coupon gem reward is missing or unreadable.",
    );
  }

  const normalizedCode = normalizeCouponCode(coupon.id);
  const historyId = `${user.id}_${normalizedCode}`;
  const historyRef = db.collection("coupon_history").doc(historyId);
  const mailboxRef = db
    .collection("users")
    .doc(user.id)
    .collection("mailbox")
    .doc();
  const rewardTemplate = await findMailboxRewardTemplate(user.id);

  await db.runTransaction(async (transaction) => {
    const historySnap = await transaction.get(historyRef);
    if (historySnap.exists) {
      throw new CouponError("COUPON_ALREADY_USED", "Coupon already redeemed.");
    }

    transaction.set(
      mailboxRef,
      {
        ...buildMailboxPayload(
          coupon.data,
          normalizedCode,
          locale,
          rewardTemplate,
        ),
        createdAt: FieldValue.serverTimestamp(),
      },
    );
    transaction.set(historyRef, {
      userId: user.id,
      couponCode: normalizedCode,
      redeemedAt: FieldValue.serverTimestamp(),
      source: "web",
    });
  });

  return { userId: user.id, couponCode: normalizedCode };
}
