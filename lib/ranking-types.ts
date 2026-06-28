export type RankingType =
  | "highestFloor"
  | "weeklyFocus"
  | "combatPower"
  | "guild";

export type RankingEntry = {
  id: string;
  nickname: string;
  level: number;
  highestFloor: number;
  focusTime: number;
  combatPower: number;
  rank: number;
};

export type GuildRankingEntry = {
  rank: number;
  guildName: string;
  memberCount: number;
  totalCombatPower: number;
  averageHighestFloor: number;
  topMemberNickname: string;
  topMemberFloor: number;
};

export type RankingsResponse = {
  type: RankingType;
  rankings: RankingEntry[];
  guildRankings?: GuildRankingEntry[];
  /** 주간 집중 랭킹 요청 시 현재 ISO 주차 (예: 2026-W26) */
  weekId?: string;
};
