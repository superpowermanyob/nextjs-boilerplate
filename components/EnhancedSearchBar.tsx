"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Star } from "lucide-react";

import { useI18n } from "@/components/I18nProvider";
import { getUserProfilePath } from "@/lib/profile-utils";
import {
  addRecentSearch,
  clearRecentSearches,
  getFavoriteUser,
  getRecentSearches,
  toggleFavoriteUser,
} from "@/lib/search-storage";

type EnhancedSearchBarProps = {
  loading: boolean;
  error: string | null;
  onClearError: () => void;
  onLoadingChange: (loading: boolean) => void;
  onError: (message: string) => void;
};

export function useSearchFavoriteSync() {
  const [favoriteNickname, setFavoriteNickname] = useState<string | null>(null);

  useEffect(() => {
    function syncFavorite() {
      setFavoriteNickname(getFavoriteUser());
    }

    syncFavorite();
    window.addEventListener("focus-rpg-storage-update", syncFavorite);
    window.addEventListener("storage", syncFavorite);
    return () => {
      window.removeEventListener("focus-rpg-storage-update", syncFavorite);
      window.removeEventListener("storage", syncFavorite);
    };
  }, []);

  return favoriteNickname;
}

export function FavoriteUserBanner() {
  const { t } = useI18n();
  const favoriteNickname = useSearchFavoriteSync();

  if (!favoriteNickname) {
    return null;
  }

  return (
    <div className="mx-auto mb-6 w-full max-w-3xl">
      <div className="flex flex-col gap-3 rounded-2xl border border-[#f5c451]/30 bg-gradient-to-r from-[#3d3420]/80 via-[#282830] to-[#282830] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#f5c451]/40 bg-[#f5c451]/10">
            <Star className="h-5 w-5 fill-[#f5c451] text-[#f5c451]" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#f5c451]">
              {t.search.favoriteBannerTitle}
            </p>
            <p className="text-lg font-bold text-white">{favoriteNickname}</p>
          </div>
        </div>

        <a
          href={getUserProfilePath(favoriteNickname)}
          className="inline-flex items-center justify-center rounded-xl bg-[#5383e8] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#4171d6]"
        >
          {t.search.viewProfile}
        </a>
      </div>
    </div>
  );
}

export function EnhancedSearchBar({
  loading,
  error,
  onClearError,
  onLoadingChange,
  onError,
}: EnhancedSearchBarProps) {
  const router = useRouter();
  const { t } = useI18n();
  const containerRef = useRef<HTMLDivElement>(null);
  const [nickname, setNickname] = useState("");
  const [open, setOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [favoriteNickname, setFavoriteNickname] = useState<string | null>(null);

  function refreshLists() {
    setRecentSearches(getRecentSearches());
    setFavoriteNickname(getFavoriteUser());
  }

  useEffect(() => {
    refreshLists();
  }, [open]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function submitNickname(value: string) {
    const trimmedNickname = value.trim();
    if (!trimmedNickname) {
      onError(t.errors.nicknameRequired);
      return;
    }

    onClearError();
    onLoadingChange(true);

    try {
      const response = await fetch(
        `/api/profiles/search?nickname=${encodeURIComponent(trimmedNickname)}`,
      );

      if (!response.ok) {
        if (response.status === 404) {
          onError(t.errors.profileNotFound);
          return;
        }
        const data = (await response.json()) as { error?: string };
        onError(data.error ?? t.errors.searchFailed);
        return;
      }

      addRecentSearch(trimmedNickname);
      refreshLists();
      setOpen(false);
      router.push(getUserProfilePath(trimmedNickname));
    } catch {
      onError(t.errors.searchNetwork);
    } finally {
      onLoadingChange(false);
    }
  }

  async function handleSearch(event?: FormEvent) {
    event?.preventDefault();
    await submitNickname(nickname);
  }

  function handleSelectRecent(value: string) {
    setNickname(value);
    void submitNickname(value);
  }

  function handleToggleFavorite(value: string, event: React.MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    toggleFavoriteUser(value);
    refreshLists();
  }

  function handleClearRecent() {
    clearRecentSearches();
    refreshLists();
  }

  return (
    <section className="mx-auto mb-10 w-full max-w-3xl">
      <form
        onSubmit={handleSearch}
        className="overflow-hidden rounded-2xl border border-[#3d3d4a] bg-[#282830] p-2 shadow-xl shadow-black/30"
      >
        <div className="flex flex-col gap-2 sm:flex-row">
          <label htmlFor="nickname" className="sr-only">
            {t.home.searchLabel}
          </label>
          <div ref={containerRef} className="relative flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#6b7280]" />
            <input
              id="nickname"
              type="text"
              value={nickname}
              onFocus={() => setOpen(true)}
              onChange={(event) => {
                setNickname(event.target.value);
                onClearError();
              }}
              placeholder={t.home.searchPlaceholder}
              autoComplete="off"
              spellCheck={false}
              className="h-14 w-full rounded-xl border border-transparent bg-[#1c1c1f] pl-12 pr-5 text-base text-white placeholder:text-[#6b7280] outline-none transition focus:border-[#5383e8]/60 focus:ring-2 focus:ring-[#5383e8]/30 sm:h-16 sm:text-lg"
            />

            {open && (
              <div className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-20 overflow-hidden rounded-xl border border-[#3d3d4a] bg-[#282830] shadow-2xl shadow-black/40">
                <div className="flex items-center justify-between border-b border-[#3d3d4a] px-4 py-3">
                  <p className="text-sm font-semibold text-white">
                    {t.search.recentTitle}
                  </p>
                  {recentSearches.length > 0 && (
                    <button
                      type="button"
                      onClick={handleClearRecent}
                      className="text-xs text-[#9aa0ae] transition hover:text-white"
                    >
                      {t.search.clearRecent}
                    </button>
                  )}
                </div>

                {recentSearches.length === 0 ? (
                  <p className="px-4 py-5 text-sm text-[#9aa0ae]">
                    {t.search.noRecent}
                  </p>
                ) : (
                  <ul className="max-h-64 overflow-y-auto py-1">
                    {recentSearches.map((item) => {
                      const isFavorite = favoriteNickname === item;

                      return (
                        <li key={item}>
                          <button
                            type="button"
                            onClick={() => handleSelectRecent(item)}
                            className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition hover:bg-[#1c1c1f]"
                          >
                            <span className="truncate font-medium text-white">
                              {item}
                            </span>
                            <button
                              type="button"
                              onClick={(event) => handleToggleFavorite(item, event)}
                              aria-label={
                                isFavorite
                                  ? t.search.removeFavorite
                                  : t.search.addFavorite
                              }
                              className="shrink-0 rounded-lg p-1.5 transition hover:bg-[#31313c]"
                            >
                              <Star
                                className={`h-4 w-4 ${
                                  isFavorite
                                    ? "fill-[#f5c451] text-[#f5c451]"
                                    : "text-[#6b7280]"
                                }`}
                              />
                            </button>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="h-14 shrink-0 rounded-xl bg-[#5383e8] px-8 text-base font-semibold text-white transition hover:bg-[#4171d6] disabled:cursor-not-allowed disabled:opacity-60 sm:h-16 sm:min-w-[120px] sm:text-lg"
          >
            {loading ? t.common.searching : t.common.search}
          </button>
        </div>
      </form>

      {error && (
        <div
          role="alert"
          className="mt-4 rounded-2xl border border-red-500/30 bg-red-500/10 px-5 py-4 text-center"
        >
          <p className="text-sm font-medium text-red-300 sm:text-base">{error}</p>
        </div>
      )}
    </section>
  );
}
