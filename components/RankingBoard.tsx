"use client";

import Link from "next/link";
import {
  Castle,
  Crown,
  Medal,
  Shield,
  Sparkles,
  Swords,
  Timer,
  Trophy,
} from "lucide-react";

import { useI18n } from "@/components/I18nProvider";
import { getUserProfilePath } from "@/lib/profile-utils";
import type { RankingEntry, RankingType } from "@/lib/ranking-types";

const TAB_ICONS = {
  highestFloor: Castle,
  weeklyFocus: Timer,
  combatPower: Swords,
  guild: Shield,
} as const;

const METRIC_KEYS = {
  highestFloor: "metricHighestFloor",
  weeklyFocus: "metricFocusTime",
  combatPower: "metricCombatPower",
  guild: "metricGuild",
} as const;

function AvatarPlaceholder({ rank }: { rank: number }) {
  const { t } = useI18n();

  return (
    <div
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[#3d3d4a] bg-[#1c1c1f] text-[#5383e8]"
      aria-hidden="true"
      title={t.ranking.avatarPlaceholder}
    >
      {rank <= 3 ? (
        <Crown className="h-4 w-4" />
      ) : (
        <Shield className="h-4 w-4 opacity-70" />
      )}
    </div>
  );
}

const PODIUM_STYLES = {
  1: {
    order: "order-1 sm:order-2",
    height: "sm:mt-0",
    card: "border-[#f5c451]/70 bg-gradient-to-b from-[#3d3420] to-[#282830] shadow-[0_0_30px_rgba(245,196,81,0.15)]",
    badge: "bg-gradient-to-r from-[#f5c451] to-[#e8a317] text-[#1c1c1f]",
    rank: "1st",
  },
  2: {
    order: "order-2 sm:order-1",
    height: "sm:mt-8",
    card: "border-[#c8d0dc]/50 bg-gradient-to-b from-[#2a3038] to-[#282830] shadow-[0_0_24px_rgba(200,208,220,0.08)]",
    badge: "bg-gradient-to-r from-[#c8d0dc] to-[#9aa0ae] text-[#1c1c1f]",
    rank: "2nd",
  },
  3: {
    order: "order-3",
    height: "sm:mt-12",
    card: "border-[#c17f4a]/60 bg-gradient-to-b from-[#35261c] to-[#282830] shadow-[0_0_24px_rgba(193,127,74,0.1)]",
    badge: "bg-gradient-to-r from-[#c17f4a] to-[#9a6035] text-white",
    rank: "3rd",
  },
} as const;

function PodiumCard({
  entry,
  type,
  place,
}: {
  entry: RankingEntry;
  type: RankingType;
  place: 1 | 2 | 3;
}) {
  const { t, formatFocusTime, formatNumber } = useI18n();
  const style = PODIUM_STYLES[place];
  const TabIcon = TAB_ICONS[type as keyof typeof TAB_ICONS] ?? Trophy;
  const metricKey = METRIC_KEYS[type as keyof typeof METRIC_KEYS];

  const metricValue =
    type === "highestFloor"
      ? `${formatNumber(entry.highestFloor)}${t.common.floorUnit}`
      : type === "weeklyFocus"
        ? formatFocusTime(entry.focusTime)
        : formatNumber(Math.round(entry.combatPower));

  return (
    <Link
      href={getUserProfilePath(entry.nickname)}
      className={`relative flex flex-col ${style.order} ${style.height} transition-all duration-300 hover:scale-[1.02]`}
    >
      <article className={`rounded-2xl border p-4 sm:p-5 ${style.card}`}>
        <div className="mb-4 flex items-start justify-between">
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${style.badge}`}
          >
            <Medal className="h-3.5 w-3.5" />
            {style.rank}
          </span>
          <AvatarPlaceholder rank={place} />
        </div>

        <h3 className="truncate text-lg font-bold text-white sm:text-xl">
          {entry.nickname}
        </h3>
        <p className="mt-1 text-sm text-[#9aa0ae]">
          {t.common.level}. {formatNumber(entry.level)}
        </p>

        <div className="mt-4 rounded-xl border border-[#3d3d4a]/80 bg-[#1c1c1f]/70 p-3">
          <div className="flex items-center gap-2 text-xs text-[#9aa0ae]">
            <TabIcon className="h-4 w-4 text-[#5383e8]" />
            {t.tabs[metricKey]}
          </div>
          <p className="mt-1 text-2xl font-bold tabular-nums text-white">{metricValue}</p>
        </div>

        <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
          <div className="rounded-lg bg-[#1c1c1f]/60 px-2 py-2">
            <p className="text-[#6b7280]">{t.ranking.floor}</p>
            <p className="mt-0.5 font-semibold text-[#cdd2dc]">
              {formatNumber(entry.highestFloor)}
              {t.common.floorUnit}
            </p>
          </div>
          <div className="rounded-lg bg-[#1c1c1f]/60 px-2 py-2">
            <p className="text-[#6b7280]">{t.ranking.focus}</p>
            <p className="mt-0.5 font-semibold text-[#cdd2dc]">
              {formatFocusTime(entry.focusTime)}
            </p>
          </div>
          <div className="rounded-lg bg-[#1c1c1f]/60 px-2 py-2">
            <p className="text-[#6b7280]">{t.ranking.power}</p>
            <p className="mt-0.5 font-semibold text-[#cdd2dc]">
              {formatNumber(Math.round(entry.combatPower))}
            </p>
          </div>
        </div>
      </article>
    </Link>
  );
}

function RankingListRow({ entry }: { entry: RankingEntry }) {
  const { t, formatFocusTime, formatNumber } = useI18n();

  return (
    <Link
      href={getUserProfilePath(entry.nickname)}
      className="grid grid-cols-[auto_1fr] gap-3 border-b border-[#3d3d4a]/70 px-3 py-3 transition-colors last:border-b-0 hover:bg-[#31313c]/50 sm:grid-cols-[56px_minmax(140px,1.2fr)_repeat(4,minmax(0,1fr))] sm:items-center sm:gap-4 sm:px-4"
    >
      <div className="flex items-center gap-3 sm:contents">
        <span className="w-10 text-center text-sm font-bold tabular-nums text-[#9aa0ae] sm:w-auto">
          {entry.rank}
        </span>
        <div className="flex min-w-0 items-center gap-3 sm:min-w-[140px]">
          <AvatarPlaceholder rank={entry.rank} />
          <span className="truncate font-semibold text-white">{entry.nickname}</span>
        </div>
      </div>

      <div className="col-span-2 grid grid-cols-2 gap-2 text-sm sm:col-span-1 sm:contents">
        <span className="tabular-nums text-[#cdd2dc] sm:text-center">
          {t.common.level}. {formatNumber(entry.level)}
        </span>
        <span className="tabular-nums text-[#cdd2dc] sm:text-center">
          {formatNumber(entry.highestFloor)}
          {t.common.floorUnit}
        </span>
        <span className="tabular-nums text-[#cdd2dc] sm:text-center">
          {formatFocusTime(entry.focusTime)}
        </span>
        <span className="tabular-nums font-medium text-[#9eb8ff] sm:text-center">
          {formatNumber(Math.round(entry.combatPower))}
        </span>
      </div>
    </Link>
  );
}

type RankingBoardProps = {
  activeTab: RankingType;
  rankings: RankingEntry[];
  loading: boolean;
};

export function RankingBoard({ activeTab, rankings, loading }: RankingBoardProps) {
  const { t } = useI18n();
  const podium = rankings.slice(0, 3);
  const rest = rankings.slice(3);

  return (
    <section className="w-full">
      <div
        key={activeTab}
        className="transition-opacity duration-300"
        style={{ opacity: loading ? 0.55 : 1 }}
      >
        {loading ? (
          <div className="flex flex-col items-center justify-center gap-4 py-20">
            <div className="relative h-12 w-12">
              <div className="absolute inset-0 rounded-full border-4 border-[#3d3d4a]" />
              <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-[#5383e8] border-r-[#5383e8]" />
            </div>
            <p className="text-sm text-[#9aa0ae]">{t.ranking.loading}</p>
          </div>
        ) : rankings.length === 0 ? (
          <div className="rounded-2xl border border-[#3d3d4a] bg-[#282830] px-6 py-16 text-center">
            <Sparkles className="mx-auto mb-3 h-8 w-8 text-[#5383e8]" />
            <p className="text-[#9aa0ae]">{t.ranking.empty}</p>
          </div>
        ) : (
          <>
            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-5">
              {[2, 1, 3].map((place) => {
                const entry = podium.find((item) => item.rank === place);
                if (!entry) {
                  return null;
                }
                return (
                  <PodiumCard
                    key={entry.id}
                    entry={entry}
                    type={activeTab}
                    place={place as 1 | 2 | 3}
                  />
                );
              })}
            </div>

            {rest.length > 0 && (
              <div className="overflow-hidden rounded-2xl border border-[#3d3d4a] bg-[#282830]">
                <div className="hidden border-b border-[#3d3d4a] bg-[#1c1c1f]/80 px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[#9aa0ae] sm:grid sm:grid-cols-[56px_minmax(140px,1.2fr)_repeat(4,minmax(0,1fr))] sm:gap-4">
                  <span className="text-center">{t.common.rank}</span>
                  <span>{t.common.nickname}</span>
                  <span className="text-center">{t.common.level}</span>
                  <span className="text-center">{t.common.highestFloor}</span>
                  <span className="text-center">{t.common.focusTime}</span>
                  <span className="text-center">{t.common.combatPower}</span>
                </div>

                <div className="divide-y divide-[#3d3d4a]/70 sm:divide-y-0">
                  {rest.map((entry) => (
                    <RankingListRow key={entry.id} entry={entry} />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
