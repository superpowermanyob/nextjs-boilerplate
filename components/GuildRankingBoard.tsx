"use client";

import Link from "next/link";
import { Crown, Shield, Sparkles, Users } from "lucide-react";

import { useI18n } from "@/components/I18nProvider";
import { getUserProfilePath } from "@/lib/profile-utils";
import type { GuildRankingEntry } from "@/lib/ranking-types";

type GuildRankingBoardProps = {
  guildRankings: GuildRankingEntry[];
  loading: boolean;
};

const PODIUM_STYLES = {
  1: "border-[#f5c451]/70 bg-gradient-to-b from-[#3d3420] to-[#282830]",
  2: "border-[#c8d0dc]/50 bg-gradient-to-b from-[#2a3038] to-[#282830]",
  3: "border-[#c17f4a]/60 bg-gradient-to-b from-[#35261c] to-[#282830]",
} as const;

function GuildPodiumCard({
  entry,
  place,
}: {
  entry: GuildRankingEntry;
  place: 1 | 2 | 3;
}) {
  const { t, formatNumber } = useI18n();

  return (
    <article className={`rounded-2xl border p-5 ${PODIUM_STYLES[place]}`}>
      <div className="mb-3 flex items-center justify-between">
        <span className="rounded-full bg-[#5383e8]/15 px-2.5 py-1 text-xs font-bold text-[#9eb8ff]">
          #{entry.rank}
        </span>
        <Shield className="h-5 w-5 text-[#5383e8]" />
      </div>
      <h3 className="truncate text-xl font-bold text-white">{entry.guildName}</h3>
      <p className="mt-1 text-sm text-[#9aa0ae]">
        <Users className="mr-1 inline h-3.5 w-3.5" />
        {formatNumber(entry.memberCount)}
      </p>
      <div className="mt-4 space-y-2 text-sm">
        <p className="text-[#cdd2dc]">
          {t.guild.totalPower}{" "}
          <span className="font-bold text-[#9eb8ff]">
            {formatNumber(Math.round(entry.totalCombatPower))}
          </span>
        </p>
        <p className="text-[#cdd2dc]">
          {t.guild.avgFloor}{" "}
          <span className="font-bold text-white">
            {formatNumber(entry.averageHighestFloor)}
            {t.common.floorUnit}
          </span>
        </p>
      </div>
    </article>
  );
}

export function GuildRankingBoard({
  guildRankings,
  loading,
}: GuildRankingBoardProps) {
  const { t, formatNumber } = useI18n();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20">
        <div className="relative h-12 w-12">
          <div className="absolute inset-0 rounded-full border-4 border-[#3d3d4a]" />
          <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-[#5383e8] border-r-[#5383e8]" />
        </div>
        <p className="text-sm text-[#9aa0ae]">{t.guild.loading}</p>
      </div>
    );
  }

  if (guildRankings.length === 0) {
    return (
      <div className="rounded-2xl border border-[#3d3d4a] bg-[#282830] px-6 py-16 text-center">
        <Sparkles className="mx-auto mb-3 h-8 w-8 text-[#5383e8]" />
        <p className="text-[#9aa0ae]">{t.guild.empty}</p>
      </div>
    );
  }

  const podium = guildRankings.slice(0, 3);
  const rest = guildRankings.slice(3);

  return (
    <section className="transition-opacity duration-300">
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[2, 1, 3].map((place) => {
          const entry = podium.find((item) => item.rank === place);
          if (!entry) {
            return null;
          }
          return (
            <GuildPodiumCard key={entry.guildName} entry={entry} place={place as 1 | 2 | 3} />
          );
        })}
      </div>

      {rest.length > 0 && (
        <div className="overflow-hidden rounded-2xl border border-[#3d3d4a] bg-[#282830]">
          <div className="hidden border-b border-[#3d3d4a] bg-[#1c1c1f]/80 px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[#9aa0ae] sm:grid sm:grid-cols-[56px_1.2fr_repeat(4,minmax(0,1fr))] sm:gap-4">
            <span className="text-center">{t.common.rank}</span>
            <span>{t.guild.guildName}</span>
            <span className="text-center">{t.common.members}</span>
            <span className="text-center">{t.guild.totalPower}</span>
            <span className="text-center">{t.guild.avgFloor}</span>
            <span className="text-center">{t.guild.topMember}</span>
          </div>

          {rest.map((entry) => (
            <div
              key={entry.guildName}
              className="grid grid-cols-[auto_1fr] gap-3 border-b border-[#3d3d4a]/70 px-3 py-3 last:border-b-0 hover:bg-[#31313c]/50 sm:grid-cols-[56px_1.2fr_repeat(4,minmax(0,1fr))] sm:items-center sm:gap-4 sm:px-4"
            >
              <div className="flex items-center gap-3 sm:contents">
                <span className="w-10 text-center text-sm font-bold text-[#9aa0ae] sm:w-auto">
                  {entry.rank}
                </span>
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[#3d3d4a] bg-[#1c1c1f]">
                    <Crown className="h-4 w-4 text-[#5383e8]" />
                  </div>
                  <span className="truncate font-semibold text-white">
                    {entry.guildName}
                  </span>
                </div>
              </div>

              <div className="col-span-2 grid grid-cols-2 gap-2 text-sm sm:col-span-1 sm:contents">
                <span className="text-[#cdd2dc] sm:text-center">
                  {formatNumber(entry.memberCount)}
                </span>
                <span className="font-medium text-[#9eb8ff] sm:text-center">
                  {formatNumber(Math.round(entry.totalCombatPower))}
                </span>
                <span className="text-[#cdd2dc] sm:text-center">
                  {formatNumber(entry.averageHighestFloor)}
                  {t.common.floorUnit}
                </span>
                <Link
                  href={getUserProfilePath(entry.topMemberNickname)}
                  className="truncate text-[#5383e8] hover:underline sm:text-center"
                >
                  {entry.topMemberNickname} ({formatNumber(entry.topMemberFloor)}
                  {t.common.floorUnit})
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
