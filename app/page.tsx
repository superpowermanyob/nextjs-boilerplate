"use client";

import { useCallback, useEffect, useState } from "react";
import { Trophy } from "lucide-react";

import { DocumentTitle } from "@/components/DocumentTitle";
import { AdBanner } from "@/components/AdBanner";
import {
  EnhancedSearchBar,
  FavoriteUserBanner,
} from "@/components/EnhancedSearchBar";
import { GuildRankingBoard } from "@/components/GuildRankingBoard";
import { PatchNotesMarquee } from "@/components/PatchNotesMarquee";
import { useI18n } from "@/components/I18nProvider";
import { RankingBoard } from "@/components/RankingBoard";
import { RankingTabBar } from "@/components/RankingTabBar";
import { WeeklyResetCountdown } from "@/components/WeeklyResetCountdown";
import type {
  GuildRankingEntry,
  RankingEntry,
  RankingType,
  RankingsResponse,
} from "@/lib/ranking-types";

type ApiErrorResponse = {
  error: string;
};

export default function Home() {
  const { t } = useI18n();
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<RankingType>("highestFloor");
  const [rankings, setRankings] = useState<RankingEntry[]>([]);
  const [guildRankings, setGuildRankings] = useState<GuildRankingEntry[]>([]);
  const [rankingLoading, setRankingLoading] = useState(true);
  const [rankingError, setRankingError] = useState<string | null>(null);
  const [weeklyWeekId, setWeeklyWeekId] = useState<string | undefined>();

  const fetchRankings = useCallback(
    async (type: RankingType) => {
      setRankingLoading(true);
      setRankingError(null);

      try {
        const response = await fetch(`/api/rankings?type=${type}`);
        const data = (await response.json()) as RankingsResponse & ApiErrorResponse;

        if (!response.ok) {
          setRankingError(data.error ?? t.errors.rankingFailed);
          setRankings([]);
          setGuildRankings([]);
          return;
        }

        if (type === "guild") {
          setGuildRankings(data.guildRankings ?? []);
          setRankings([]);
          setWeeklyWeekId(undefined);
        } else {
          setRankings(data.rankings);
          setGuildRankings([]);
          setWeeklyWeekId(type === "weeklyFocus" ? data.weekId : undefined);
        }
      } catch {
        setRankingError(t.errors.network);
        setRankings([]);
        setGuildRankings([]);
      } finally {
        setRankingLoading(false);
      }
    },
    [t.errors.network, t.errors.rankingFailed],
  );

  useEffect(() => {
    void fetchRankings(activeTab);
  }, [activeTab, fetchRankings]);

  function handleTabChange(tab: RankingType) {
    if (tab === activeTab) {
      return;
    }
    setActiveTab(tab);
  }

  return (
    <div className="min-h-screen bg-[#1c1c1f] font-sans text-[#cdd2dc]">
      <DocumentTitle />
      <PatchNotesMarquee />
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(83,131,232,0.12),transparent_40%),radial-gradient(circle_at_80%_100%,rgba(139,92,246,0.08),transparent_35%)]" />

      <main className="relative mx-auto w-full max-w-7xl px-4 pb-6 pt-36 sm:px-6 sm:pb-10 sm:pt-40 lg:px-8">
        <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_160px] lg:gap-8">
          <div className="min-w-0">
        <header className="mb-8 text-center">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#5383e8]/30 bg-[#5383e8]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[#9eb8ff]">
            <Trophy className="h-3.5 w-3.5" />
            {t.home.badge}
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            {t.home.title}
          </h1>
          <p className="mx-auto mt-2 max-w-2xl text-sm text-[#9aa0ae] sm:text-base">
            {t.home.subtitle}
          </p>
        </header>

        <FavoriteUserBanner />

        <EnhancedSearchBar
          loading={searchLoading}
          error={searchError}
          onClearError={() => setSearchError(null)}
          onLoadingChange={setSearchLoading}
          onError={setSearchError}
        />

        <section className="border-t border-[#3d3d4a]/80 pt-10">
          <div className="mb-6 flex items-center justify-between gap-4">
            <h2 className="text-xl font-bold text-white sm:text-2xl">
              {t.home.rankingBoard}
            </h2>
            <span className="text-xs text-[#9aa0ae] sm:text-sm">
              {activeTab === "guild" ? t.home.top50Guilds : t.home.top100}
            </span>
          </div>

          <RankingTabBar activeTab={activeTab} onTabChange={handleTabChange} />

          {activeTab === "weeklyFocus" && (
            <WeeklyResetCountdown weekId={weeklyWeekId} />
          )}

          <AdBanner
            dataAdSlot="6425037619"
            dataAdFormat="auto"
            className="mb-6 overflow-hidden rounded-2xl border border-[#3d3d4a]/60 bg-[#282830]/40 p-2"
          />

          {rankingError && (
            <div
              role="alert"
              className="mb-6 rounded-2xl border border-red-500/30 bg-red-500/10 px-5 py-4 text-center"
            >
              <p className="text-sm text-red-300">{rankingError}</p>
            </div>
          )}

          {activeTab === "guild" ? (
            <GuildRankingBoard
              guildRankings={guildRankings}
              loading={rankingLoading}
            />
          ) : (
            <RankingBoard
              activeTab={activeTab}
              rankings={rankings}
              loading={rankingLoading}
            />
          )}
        </section>

        <AdBanner
          dataAdSlot="9186932329"
          dataAdFormat="auto"
          className="mt-10 overflow-hidden rounded-2xl border border-[#3d3d4a]/60 bg-[#282830]/40 p-2"
        />
          </div>

          <aside className="hidden lg:block">
            <div className="sticky top-32">
              <AdBanner
                dataAdSlot="9036712917"
                dataAdFormat="auto"
                className="overflow-hidden rounded-2xl border border-[#3d3d4a]/60 bg-[#282830]/40 p-2"
              />
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
