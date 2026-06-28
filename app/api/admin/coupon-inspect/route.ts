import { NextRequest, NextResponse } from "next/server";

import {
  getAdminAuthErrorMessage,
  isAdminBannerAuthorized,
} from "@/lib/admin-auth";
import { buildMailboxPayload, extractGemAmount } from "@/lib/coupon-mail";
import { getAdminFirestore, getFirebaseAdminStatus } from "@/lib/firebase/admin";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function sanitizeData(data: Record<string, unknown>) {
  return JSON.parse(JSON.stringify(data));
}

export async function GET(request: NextRequest) {
  if (!isAdminBannerAuthorized(request)) {
    return NextResponse.json(
      { ok: false, error: getAdminAuthErrorMessage() },
      { status: 401 },
    );
  }

  const db = getAdminFirestore();
  if (!db) {
    return NextResponse.json(
      { ok: false, error: getFirebaseAdminStatus().message },
      { status: 500 },
    );
  }

  const couponCode = request.nextUrl.searchParams.get("code")?.trim();

  try {
    const couponSamples: Array<{ id: string; data: Record<string, unknown> }> =
      [];

    if (couponCode) {
      for (const docId of [couponCode.toUpperCase(), couponCode]) {
        const doc = await db.collection("coupons").doc(docId).get();
        if (doc.exists) {
          couponSamples.push({
            id: doc.id,
            data: sanitizeData(doc.data() as Record<string, unknown>),
          });
        }
      }
    } else {
      const snapshot = await db.collection("coupons").limit(5).get();
      snapshot.docs.forEach((doc) => {
        couponSamples.push({
          id: doc.id,
          data: sanitizeData(doc.data() as Record<string, unknown>),
        });
      });
    }

    const mailboxSamples: Array<{
      userId: string;
      mailId: string;
      data: Record<string, unknown>;
    }> = [];

    const users = await db.collection("users").limit(20).get();
    for (const user of users.docs) {
      const mails = await db
        .collection("users")
        .doc(user.id)
        .collection("mailbox")
        .limit(10)
        .get();

      for (const mail of mails.docs) {
        mailboxSamples.push({
          userId: user.id,
          mailId: mail.id,
          data: sanitizeData(mail.data() as Record<string, unknown>),
        });
        if (mailboxSamples.length >= 8) {
          break;
        }
      }
      if (mailboxSamples.length >= 8) {
        break;
      }
    }

    const preview =
      couponSamples[0] != null
        ? buildMailboxPayload(couponSamples[0].data, couponSamples[0].id, "ja")
        : null;

    return NextResponse.json({
      ok: true,
      couponSamples: couponSamples.map((sample) => ({
        ...sample,
        extractedGemAmount: extractGemAmount(sample.data),
      })),
      mailboxSamples,
      previewMailboxPayload: preview,
    });
  } catch (error) {
    console.error("[GET /api/admin/coupon-inspect]", error);
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Inspect failed.",
      },
      { status: 500 },
    );
  }
}
