"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Trophy } from "lucide-react";

import { DocumentTitle } from "@/components/DocumentTitle";
import { GuildRankingBoard } from "@/components/GuildRankingBoard";
import { useI18n } from "@/components/I18nProvider";
import { RankingBoard } from "@/components/RankingBoard";
import { RankingTabBar } from "@/components/RankingTabBar";
import { getUserProfilePath } from "@/lib/profile-utils";
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
  const router = useRouter();
  const { t } = useI18n();
  const [nickname, setNickname] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<RankingType>("highestFloor");
  const [rankings, setRankings] = useState<RankingEntry[]>([]);
  const [guildRankings, setGuildRankings] = useState<GuildRankingEntry[]>([]);
  const [rankingLoading, setRankingLoading] = useState(true);
  const [rankingError, setRankingError] = useState<string | null>(null);

  const fetchRankings = useCallback(async (type: RankingType) => {
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
      } else {
        setRankings(data.rankings);
        setGuildRankings([]);
      }
    } catch {
      setRankingError(t.errors.network);
      setRankings([]);
      setGuildRankings([]);
    } finally {
      setRankingLoading(false);
    }
  }, [t.errors.network, t.errors.rankingFailed]);

  useEffect(() => {
    void fetchRankings(activeTab);
  }, [activeTab, fetchRankings]);

  async function handleSearch(event?: FormEvent) {
    event?.preventDefault();

    const trimmedNickname = nickname.trim();
    if (!trimmedNickname) {
      setSearchError(t.errors.nicknameRequired);
      return;
    }

    setSearchLoading(true);
    setSearchError(null);

    try {
      const response = await fetch(
        `/api/profiles/search?nickname=${encodeURIComponent(trimmedNickname)}`,
      );

      if (!response.ok) {
        if (response.status === 404) {
          setSearchError(t.errors.profileNotFound);
          return;
        }
        const data = (await response.json()) as ApiErrorResponse;
        setSearchError(data.error ?? t.errors.searchFailed);
        return;
      }

      router.push(getUserProfilePath(trimmedNickname));
    } catch {
      setSearchError(t.errors.searchNetwork);
    } finally {
      setSearchLoading(false);
    }
  }

  function handleTabChange(tab: RankingType) {
    if (tab === activeTab) {
      return;
    }
    setActiveTab(tab);
  }

  return (
    <div className="min-h-screen bg-[#1c1c1f] font-sans text-[#cdd2dc]">
      <DocumentTitle />
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(83,131,232,0.12),transparent_40%),radial-gradient(circle_at_80%_100%,rgba(139,92,246,0.08),transparent_35%)]" />

      <main className="relative mx-auto w-full max-w-6xl px-4 pb-6 pt-20 sm:px-6 sm:pb-10 sm:pt-24 lg:px-8">
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

        <section className="mx-auto mb-10 w-full max-w-3xl">
          <form
            onSubmit={handleSearch}
            className="overflow-hidden rounded-2xl border border-[#3d3d4a] bg-[#282830] p-2 shadow-xl shadow-black/30"
          >
            <div className="flex flex-col gap-2 sm:flex-row">
              <label htmlFor="nickname" className="sr-only">
                {t.home.searchLabel}
              </label>
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#6b7280]" />
                <input
                  id="nickname"
                  type="text"
                  value={nickname}
                  onChange={(event) => setNickname(event.target.value)}
                  placeholder={t.home.searchPlaceholder}
                  autoComplete="off"
                  spellCheck={false}
                  className="h-14 w-full rounded-xl border border-transparent bg-[#1c1c1f] pl-12 pr-5 text-base text-white placeholder:text-[#6b7280] outline-none transition focus:border-[#5383e8]/60 focus:ring-2 focus:ring-[#5383e8]/30 sm:h-16 sm:text-lg"
                />
              </div>
              <button
                type="submit"
                disabled={searchLoading}
                className="h-14 shrink-0 rounded-xl bg-[#5383e8] px-8 text-base font-semibold text-white transition hover:bg-[#4171d6] disabled:cursor-not-allowed disabled:opacity-60 sm:h-16 sm:min-w-[120px] sm:text-lg"
              >
                {searchLoading ? t.common.searching : t.common.search}
              </button>
            </div>
          </form>

          {searchError && (
            <div
              role="alert"
              className="mt-4 rounded-2xl border border-red-500/30 bg-red-500/10 px-5 py-4 text-center"
            >
              <p className="text-sm font-medium text-red-300 sm:text-base">
                {searchError}
              </p>
            </div>
          )}
        </section>

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
      </main>
    </div>
  );
}
