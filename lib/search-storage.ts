const RECENT_SEARCHES_KEY = "focus-rpg-recent-searches";
const FAVORITE_USER_KEY = "focus-rpg-favorite-user";
const MAX_RECENT = 8;

function readRecentSearches(): string[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(RECENT_SEARCHES_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed.filter((item): item is string => typeof item === "string");
  } catch {
    return [];
  }
}

export function getRecentSearches(): string[] {
  return readRecentSearches();
}

export function addRecentSearch(nickname: string): void {
  if (typeof window === "undefined") {
    return;
  }

  const trimmed = nickname.trim();
  if (!trimmed) {
    return;
  }

  const next = [
    trimmed,
    ...readRecentSearches().filter((item) => item !== trimmed),
  ].slice(0, MAX_RECENT);

  window.localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(next));
}

export function clearRecentSearches(): void {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.removeItem(RECENT_SEARCHES_KEY);
}

export function getFavoriteUser(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  const value = window.localStorage.getItem(FAVORITE_USER_KEY)?.trim();
  return value || null;
}

export function setFavoriteUser(nickname: string | null): void {
  if (typeof window === "undefined") {
    return;
  }

  const trimmed = nickname?.trim();
  if (!trimmed) {
    window.localStorage.removeItem(FAVORITE_USER_KEY);
    return;
  }

  window.localStorage.setItem(FAVORITE_USER_KEY, trimmed);
}

export function isFavoriteUser(nickname: string): boolean {
  return getFavoriteUser() === nickname.trim();
}

export function toggleFavoriteUser(nickname: string): boolean {
  const trimmed = nickname.trim();
  if (!trimmed) {
    return false;
  }

  if (getFavoriteUser() === trimmed) {
    setFavoriteUser(null);
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("focus-rpg-storage-update"));
    }
    return false;
  }

  setFavoriteUser(trimmed);
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("focus-rpg-storage-update"));
  }
  return true;
}
