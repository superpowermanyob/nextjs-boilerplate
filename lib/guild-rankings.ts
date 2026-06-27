import "server-only";

import { collection, getDocs } from "firebase/firestore";

import { getClientFirestore } from "@/lib/firebase";
import type { GuildRankingEntry } from "@/lib/ranking-types";

const GUILD_LIMIT = 50;

function toNumber(value: unknown, fallback = 0): number {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === "string" && value.trim() && !Number.isNaN(Number(value))) {
    return Number(value);
  }
  return fallback;
}

export async function getGuildRankings(): Promise<GuildRankingEntry[]> {
  const db = getClientFirestore();
  const snapshot = await getDocs(collection(db, "public_profiles"));

  const guildMap = new Map<
    string,
    {
      memberCount: number;
      totalCombatPower: number;
      totalHighestFloor: number;
      topMemberNickname: string;
      topMemberFloor: number;
    }
  >();

  snapshot.forEach((doc) => {
    const data = doc.data() as Record<string, unknown>;
    const guildName =
      typeof data.guildName === "string" ? data.guildName.trim() : "";

    if (!guildName) {
      return;
    }

    const combatPower = toNumber(data.combatPower);
    const highestFloor = toNumber(data.highestFloor);
    const nickname =
      typeof data.nickname === "string" ? data.nickname.trim() : "Unknown";

    const current = guildMap.get(guildName) ?? {
      memberCount: 0,
      totalCombatPower: 0,
      totalHighestFloor: 0,
      topMemberNickname: nickname,
      topMemberFloor: highestFloor,
    };

    current.memberCount += 1;
    current.totalCombatPower += combatPower;
    current.totalHighestFloor += highestFloor;

    if (highestFloor > current.topMemberFloor) {
      current.topMemberFloor = highestFloor;
      current.topMemberNickname = nickname;
    }

    guildMap.set(guildName, current);
  });

  const sorted = [...guildMap.entries()]
    .map(([guildName, stats]) => ({
      guildName,
      memberCount: stats.memberCount,
      totalCombatPower: stats.totalCombatPower,
      averageHighestFloor:
        stats.memberCount > 0
          ? Math.round((stats.totalHighestFloor / stats.memberCount) * 10) / 10
          : 0,
      topMemberNickname: stats.topMemberNickname,
      topMemberFloor: stats.topMemberFloor,
    }))
    .sort((a, b) => {
      if (b.totalCombatPower !== a.totalCombatPower) {
        return b.totalCombatPower - a.totalCombatPower;
      }
      return b.averageHighestFloor - a.averageHighestFloor;
    })
    .slice(0, GUILD_LIMIT);

  return sorted.map((entry, index) => ({
    rank: index + 1,
    ...entry,
  }));
}
