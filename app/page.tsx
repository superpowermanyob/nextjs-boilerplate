"use client";

import { FormEvent, useState } from "react";

type PublicProfile = {
  id: string;
  nickname: string;
  [key: string]: unknown;
};

type ApiSuccessResponse = {
  profile: PublicProfile;
};

type ApiErrorResponse = {
  error: string;
  nickname?: string;
};

type EquipmentSlot = {
  label: string;
  name: string;
  detail?: string;
};

const EQUIPMENT_SLOT_LABELS = ["무기", "방어구", "장신구"] as const;

function pickString(
  profile: PublicProfile,
  keys: string[],
  fallback = "—",
): string {
  for (const key of keys) {
    const value = profile[key];
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
    if (typeof value === "number" && Number.isFinite(value)) {
      return String(value);
    }
  }
  return fallback;
}

function pickNumber(profile: PublicProfile, keys: string[]): number | null {
  for (const key of keys) {
    const value = profile[key];
    if (typeof value === "number" && Number.isFinite(value)) {
      return value;
    }
    if (typeof value === "string" && value.trim() && !Number.isNaN(Number(value))) {
      return Number(value);
    }
  }
  return null;
}

function formatNumber(value: number | null): string {
  if (value === null) {
    return "—";
  }
  return value.toLocaleString("ko-KR");
}

function extractEquipment(profile: PublicProfile): EquipmentSlot[] {
  const raw =
    profile.equippedItems ??
    profile.equipment ??
    profile.gear ??
    profile.loadout ??
    profile.items;

  if (Array.isArray(raw)) {
    return EQUIPMENT_SLOT_LABELS.map((label, index) => {
      const item = raw[index];
      if (typeof item === "string") {
        return { label, name: item };
      }
      if (item && typeof item === "object") {
        const record = item as Record<string, unknown>;
        const name = pickString(record as PublicProfile, [
          "name",
          "itemName",
          "title",
          "label",
        ]);
        const detail = pickString(record as PublicProfile, [
          "grade",
          "rarity",
          "tier",
          "enhance",
          "level",
        ], "");
        return {
          label,
          name: name === "—" ? "미장착" : name,
          detail: detail === "—" ? undefined : detail,
        };
      }
      return { label, name: "미장착" };
    });
  }

  if (raw && typeof raw === "object") {
    const record = raw as Record<string, unknown>;
    const slotKeys = [
      ["weapon", "무기"],
      ["armor", "방어구"],
      ["accessory", "장신구"],
    ] as const;

    return slotKeys.map(([key, label]) => {
      const item = record[key] ?? record[label];
      if (typeof item === "string") {
        return { label, name: item };
      }
      if (item && typeof item === "object") {
        const itemRecord = item as Record<string, unknown>;
        const name = pickString(itemRecord as PublicProfile, [
          "name",
          "itemName",
          "title",
        ]);
        const detail = pickString(itemRecord as PublicProfile, [
          "grade",
          "rarity",
          "tier",
        ], "");
        return {
          label,
          name: name === "—" ? "미장착" : name,
          detail: detail === "—" ? undefined : detail,
        };
      }
      return { label, name: "미장착" };
    });
  }

  return EQUIPMENT_SLOT_LABELS.map((label) => ({ label, name: "미장착" }));
}

function ProfileDashboard({ profile }: { profile: PublicProfile }) {
  const title = pickString(profile, ["title", "honorTitle", "badge", "rankTitle"]);
  const level = pickNumber(profile, ["level", "lv", "playerLevel", "characterLevel"]);
  const combatPower = pickNumber(profile, [
    "combatPower",
    "power",
    "totalPower",
    "combat_power",
    "battlePower",
  ]);
  const highestFloor = pickNumber(profile, [
    "highestFloor",
    "maxFloor",
    "bestFloor",
    "highest_floor",
    "max_floor",
    "floor",
  ]);
  const equipment = extractEquipment(profile);

  const stats = [
    {
      label: "레벨",
      value: formatNumber(level),
      accent: "from-sky-400 to-blue-500",
      icon: (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
          <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6L12 2z" />
        </svg>
      ),
    },
    {
      label: "전투력",
      value: formatNumber(combatPower),
      accent: "from-violet-400 to-purple-500",
      icon: (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
          <path d="M14 2l-1 4H9L8 2H2v7.5l3.5 2.5L2 14.5V22h6l1-4h4l1 4h6v-7.5l-3.5-2.5L22 9.5V2h-8z" />
        </svg>
      ),
    },
    {
      label: "최고 층수",
      value: highestFloor !== null ? `${formatNumber(highestFloor)}F` : "—",
      accent: "from-amber-400 to-orange-500",
      icon: (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
          <path d="M12 3l9 18H3L12 3zm0 5.5L7.5 18h9L12 8.5z" />
        </svg>
      ),
    },
  ];

  return (
    <section className="w-full opacity-100 transition-opacity duration-500">
      <div className="overflow-hidden rounded-2xl border border-[#3d3d4a] bg-[#282830] shadow-2xl shadow-black/40">
        <div className="relative border-b border-[#3d3d4a] bg-gradient-to-r from-[#1a2744] via-[#282830] to-[#1f2937] px-5 py-6 sm:px-8 sm:py-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(83,131,232,0.18),transparent_55%)]" />
          <div className="relative flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#5383e8]">
                Player Profile
              </p>
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                {profile.nickname}
              </h2>
              <p className="mt-2 inline-flex items-center rounded-full border border-[#5383e8]/40 bg-[#5383e8]/10 px-3 py-1 text-sm font-medium text-[#9eb8ff]">
                {title === "—" ? "칭호 없음" : title}
              </p>
            </div>
            <div className="rounded-xl border border-[#3d3d4a] bg-[#1c1c1f]/80 px-4 py-3 text-right backdrop-blur-sm">
              <p className="text-xs text-[#9aa0ae]">UID</p>
              <p className="mt-1 max-w-[220px] truncate font-mono text-sm text-[#cdd2dc] sm:max-w-xs">
                {profile.id}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-3 sm:gap-4 sm:p-6">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="group rounded-xl border border-[#3d3d4a] bg-[#1c1c1f] p-4 transition-colors hover:border-[#5383e8]/50"
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm font-medium text-[#9aa0ae]">{stat.label}</span>
                <span
                  className={`rounded-lg bg-gradient-to-br ${stat.accent} p-2 text-white shadow-lg`}
                >
                  {stat.icon}
                </span>
              </div>
              <p className="text-2xl font-bold tabular-nums text-white sm:text-3xl">
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        <div className="border-t border-[#3d3d4a] px-4 py-5 sm:px-6 sm:py-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">장착 장비</h3>
            <span className="text-xs text-[#9aa0ae]">3 Slots</span>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {equipment.map((slot) => (
              <div
                key={slot.label}
                className="rounded-xl border border-[#3d3d4a] bg-gradient-to-b from-[#31313c] to-[#282830] p-4"
              >
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[#5383e8]">
                  {slot.label}
                </p>
                <p className="truncate text-base font-semibold text-white">{slot.name}</p>
                {slot.detail ? (
                  <p className="mt-1 text-sm text-[#9aa0ae]">{slot.detail}</p>
                ) : (
                  <p className="mt-1 text-sm text-[#6b7280]">등급 정보 없음</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16">
      <div className="relative h-14 w-14">
        <div className="absolute inset-0 rounded-full border-4 border-[#3d3d4a]" />
        <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-[#5383e8] border-r-[#5383e8]" />
      </div>
      <p className="text-sm font-medium text-[#9aa0ae]">전적 데이터를 불러오는 중...</p>
    </div>
  );
}

export default function Home() {
  const [nickname, setNickname] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<PublicProfile | null>(null);

  async function handleSearch(event?: FormEvent) {
    event?.preventDefault();

    const trimmedNickname = nickname.trim();
    if (!trimmedNickname) {
      setError("닉네임을 입력해 주세요.");
      setProfile(null);
      return;
    }

    setLoading(true);
    setError(null);
    setProfile(null);

    try {
      const response = await fetch(
        `/api/profiles/search?nickname=${encodeURIComponent(trimmedNickname)}`,
      );
      const data = (await response.json()) as ApiSuccessResponse | ApiErrorResponse;

      if (!response.ok) {
        if (response.status === 404) {
          setError("존재하지 않는 닉네임입니다.");
          return;
        }
        setError(
          "error" in data ? data.error : "검색 중 오류가 발생했습니다.",
        );
        return;
      }

      if ("profile" in data) {
        setProfile(data.profile);
      }
    } catch {
      setError("네트워크 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#1c1c1f] font-sans text-[#cdd2dc]">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(83,131,232,0.12),transparent_40%),radial-gradient(circle_at_80%_100%,rgba(139,92,246,0.08),transparent_35%)]" />

      <main className="relative mx-auto flex min-h-screen w-full max-w-5xl flex-col px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <header className="mb-10 text-center sm:mb-14">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-[#5383e8]">
            Focus RPG
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            전적 검색
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-[#9aa0ae] sm:text-base">
            플레이어 닉네임으로 레벨, 전투력, 최고 층수, 장착 장비, 칭호를 한눈에 확인하세요.
          </p>
        </header>

        <section className="mx-auto w-full max-w-3xl">
          <form
            onSubmit={handleSearch}
            className="overflow-hidden rounded-2xl border border-[#3d3d4a] bg-[#282830] p-2 shadow-xl shadow-black/30"
          >
            <div className="flex flex-col gap-2 sm:flex-row">
              <label htmlFor="nickname" className="sr-only">
                플레이어 닉네임
              </label>
              <input
                id="nickname"
                type="text"
                value={nickname}
                onChange={(event) => setNickname(event.target.value)}
                placeholder="플레이어 닉네임을 입력하세요"
                autoComplete="off"
                spellCheck={false}
                className="h-14 flex-1 rounded-xl border border-transparent bg-[#1c1c1f] px-5 text-base text-white placeholder:text-[#6b7280] outline-none transition focus:border-[#5383e8]/60 focus:ring-2 focus:ring-[#5383e8]/30 sm:h-16 sm:text-lg"
              />
              <button
                type="submit"
                disabled={loading}
                className="h-14 shrink-0 rounded-xl bg-[#5383e8] px-8 text-base font-semibold text-white transition hover:bg-[#4171d6] disabled:cursor-not-allowed disabled:opacity-60 sm:h-16 sm:min-w-[120px] sm:text-lg"
              >
                {loading ? "검색 중..." : "검색"}
              </button>
            </div>
          </form>
        </section>

        <section className="mx-auto mt-8 w-full max-w-3xl sm:mt-10">
          {loading && <LoadingSpinner />}

          {!loading && error && (
            <div
              role="alert"
              className="rounded-2xl border border-red-500/30 bg-red-500/10 px-5 py-4 text-center"
            >
              <p className="text-sm font-medium text-red-300 sm:text-base">{error}</p>
            </div>
          )}

          {!loading && !error && profile && <ProfileDashboard profile={profile} />}
        </section>
      </main>
    </div>
  );
}
