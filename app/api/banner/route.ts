import { NextResponse } from "next/server";

import { getBannerDocument } from "@/lib/banner-server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const banner = await getBannerDocument();
    return NextResponse.json({ banner });
  } catch (error) {
    console.error("[GET /api/banner]", error);

    const message =
      error instanceof Error ? error.message : "Failed to fetch banner";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
