import { NextRequest, NextResponse } from "next/server";

import { searchPublicProfileByNickname } from "@/lib/public-profiles";

export async function GET(request: NextRequest) {
  const nickname = request.nextUrl.searchParams.get("nickname");

  if (!nickname?.trim()) {
    return NextResponse.json(
      { error: "nickname query parameter is required" },
      { status: 400 },
    );
  }

  try {
    const profile = await searchPublicProfileByNickname(nickname);

    if (!profile) {
      return NextResponse.json(
        { error: "Profile not found", nickname: nickname.trim() },
        { status: 404 },
      );
    }

    return NextResponse.json({ profile });
  } catch (error) {
    console.error("[GET /api/profiles/search]", error);

    const message =
      error instanceof Error ? error.message : "Failed to fetch public profile";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
