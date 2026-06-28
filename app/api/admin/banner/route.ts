import { NextRequest, NextResponse } from "next/server";

import {
  getAdminAuthErrorMessage,
  isAdminBannerAuthorized,
} from "@/lib/admin-auth";
import { BANNER_LOCALE_CODES } from "@/lib/banner-text";
import {
  getBannerDocument,
  serializeBannerForAdmin,
  updateBannerDocument,
} from "@/lib/banner-server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function unauthorizedResponse() {
  return NextResponse.json(
    { error: getAdminAuthErrorMessage() },
    { status: 401 },
  );
}

export async function GET(request: NextRequest) {
  if (!isAdminBannerAuthorized(request)) {
    return unauthorizedResponse();
  }

  try {
    const banner = await getBannerDocument();
    return NextResponse.json(serializeBannerForAdmin(banner));
  } catch (error) {
    console.error("[GET /api/admin/banner]", error);

    const message =
      error instanceof Error ? error.message : "Failed to fetch banner";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  if (!isAdminBannerAuthorized(request)) {
    return unauthorizedResponse();
  }

  try {
    const body = (await request.json()) as {
      messages?: Partial<Record<(typeof BANNER_LOCALE_CODES)[number], string>>;
    };

    const messages = body.messages ?? {};
    const hasAnyMessage = BANNER_LOCALE_CODES.some(
      (code) => typeof messages[code] === "string" && messages[code]!.trim(),
    );

    if (!hasAnyMessage) {
      return NextResponse.json(
        { error: "At least one language message is required." },
        { status: 400 },
      );
    }

    await updateBannerDocument(messages);
    const banner = await getBannerDocument();

    return NextResponse.json({
      ok: true,
      ...serializeBannerForAdmin(banner),
    });
  } catch (error) {
    console.error("[PUT /api/admin/banner]", error);

    const message =
      error instanceof Error ? error.message : "Failed to update banner";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
