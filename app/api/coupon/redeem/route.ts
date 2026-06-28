import { NextRequest, NextResponse } from "next/server";

import { CouponError } from "@/lib/coupon-errors";
import { redeemCoupon } from "@/lib/coupon-redeem";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const ERROR_STATUS: Record<CouponError["code"], number> = {
  INVALID_INPUT: 400,
  USER_NOT_FOUND: 404,
  COUPON_INVALID: 400,
  COUPON_ALREADY_USED: 409,
  SERVER_ERROR: 500,
};

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      identifier?: string;
      couponCode?: string;
      locale?: string;
    };

    const identifier = body.identifier?.trim() ?? "";
    const couponCode = body.couponCode?.trim() ?? "";
    const locale = body.locale?.trim();

    const result = await redeemCoupon(identifier, couponCode, locale);

    return NextResponse.json({
      ok: true,
      userId: result.userId,
      couponCode: result.couponCode,
    });
  } catch (error) {
    if (error instanceof CouponError) {
      return NextResponse.json(
        {
          ok: false,
          errorCode: error.code,
          error: error.message,
        },
        { status: ERROR_STATUS[error.code] ?? 500 },
      );
    }

    console.error("[POST /api/coupon/redeem]", error);

    return NextResponse.json(
      {
        ok: false,
        errorCode: "SERVER_ERROR",
        error: error instanceof Error ? error.message : "Coupon redeem failed.",
      },
      { status: 500 },
    );
  }
}
