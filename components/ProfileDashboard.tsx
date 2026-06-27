"use client";

type PublicProfile = {
  id: string;
  nickname: string;
  [key: string]: unknown;
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

function formatRarity(value: string): string {
  const rarityLabels: Record<string, string> = {
    common: "일반",
    rare: "레어",
    epic: "에픽",
    legendary: "전설",
  };
  return rarityLabels[value.toLowerCase()] ?? value;
}

function parseEquipmentItem(item: unknown, label: string): EquipmentSlot {
  if (item === null || item === undefined) {
    return { label, name: "미장착" };
  }

  if (typeof item === "string") {
    return { label, name: item };
  }

  if (item && typeof item === "object") {
    const record = item as Record<string, unknown>;
    const name = pickString(record as PublicProfile, [
      "nameKo",
      "nameEn",
      "name",
      "itemName",
      "title",
    ]);
    const rarity = pickString(record as PublicProfile, ["rarity", "grade", "tier"], "");
    const enhancementLevel = pickNumber(record as PublicProfile, [
      "enhancementLevel",
      "enhance",
    ]);

    const detailParts: string[] = [];
    if (rarity !== "—" && rarity !== "") {
      detailParts.push(formatRarity(rarity));
    }
    if (enhancementLevel !== null) {
      detailParts.push(`+${enhancementLevel}`);
    }

    return {
      label,
      name: name === "—" ? "미장착" : name,
      detail: detailParts.length > 0 ? detailParts.join(" · ") : undefined,
    };
  }

  return { label, name: "미장착" };
}

function extractEquipment(profile: PublicProfile): EquipmentSlot[] {
  if ("weapon" in profile || "armor" in profile || "accessory" in profile) {
    return [
      parseEquipmentItem(profile.weapon, "무기"),
      parseEquipmentItem(profile.armor, "방어구"),
      parseEquipmentItem(profile.accessory, "장신구"),
    ];
  }

  return EQUIPMENT_SLOT_LABELS.map((label) => ({ label, name: "미장착" }));
}

export function ProfileDashboard({ profile }: { profile: PublicProfile }) {
  const title = pickString(profile, [
    "activeTitle",
    "title",
    "honorTitle",
    "badge",
    "rankTitle",
  ]);
  const level = pickNumber(profile, ["level", "lv", "playerLevel", "characterLevel"]);
  const combatPower = pickNumber(profile, ["combatPower", "power", "totalPower"]);
  const highestFloor = pickNumber(profile, ["highestFloor", "maxFloor", "bestFloor"]);
  const equipment = extractEquipment(profile);

  const stats = [
    { label: "레벨", value: formatNumber(level) },
    { label: "전투력", value: formatNumber(combatPower) },
    {
      label: "최고 층수",
      value: highestFloor !== null ? `${formatNumber(highestFloor)}F` : "—",
    },
  ];

  return (
    <section className="w-full">
      <div className="overflow-hidden rounded-2xl border border-[#3d3d4a] bg-[#282830] shadow-2xl shadow-black/40">
        <div className="border-b border-[#3d3d4a] bg-gradient-to-r from-[#1a2744] via-[#282830] to-[#1f2937] px-5 py-6 sm:px-8">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#5383e8]">
            Player Profile
          </p>
          <h2 className="text-2xl font-bold text-white sm:text-3xl">{profile.nickname}</h2>
          <p className="mt-2 inline-flex rounded-full border border-[#5383e8]/40 bg-[#5383e8]/10 px-3 py-1 text-sm text-[#9eb8ff]">
            {title === "—" ? "칭호 없음" : title}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-3 sm:p-6">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-[#3d3d4a] bg-[#1c1c1f] p-4"
            >
              <p className="text-sm text-[#9aa0ae]">{stat.label}</p>
              <p className="mt-1 text-2xl font-bold tabular-nums text-white">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="border-t border-[#3d3d4a] px-4 py-5 sm:px-6">
          <h3 className="mb-3 text-lg font-semibold text-white">장착 장비</h3>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {equipment.map((slot) => (
              <div
                key={slot.label}
                className="rounded-xl border border-[#3d3d4a] bg-[#1c1c1f] p-4"
              >
                <p className="mb-1 text-xs font-semibold text-[#5383e8]">{slot.label}</p>
                <p className="font-semibold text-white">{slot.name}</p>
                {slot.detail && (
                  <p className="mt-1 text-sm text-[#9aa0ae]">{slot.detail}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export type { PublicProfile };
