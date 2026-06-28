import { NextRequest, NextResponse } from "next/server";

import { getGuildRankings } from "@/lib/guild-rankings";
import { getRankings } from "@/lib/rankings";
import type { RankingType } from "@/lib/ranking-types";

export const dynamic = "force-dynamic";

const VALID_TYPES: RankingType[] = [
  "highestFloor",
  "weeklyFocus",
  "combatPower",
  "guild",
];

function parseRankingType(value: string | null): RankingType | null {
  if (!value || !VALID_TYPES.includes(value as RankingType)) {
    return null;
  }
  return value as RankingType;
}

export async function GET(request: NextRequest) {
  const type = parseRankingType(request.nextUrl.searchParams.get("type"));

  if (!type) {
    return NextResponse.json(
      {
        error:
          "type query parameter is required (highestFloor | weeklyFocus | combatPower | guild)",
      },
      { status: 400 },
    );
  }

  try {
    if (type === "guild") {
      const guildRankings = await getGuildRankings();
      return NextResponse.json({ type, rankings: [], guildRankings });
    }

    const rankings = await getRankings(type);
    return NextResponse.json({ type, rankings });
  } catch (error) {
    console.error("[GET /api/rankings]", error);

    const message =
      error instanceof Error ? error.message : "Failed to fetch rankings";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
