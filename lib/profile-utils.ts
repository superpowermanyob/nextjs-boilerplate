export type PublicProfile = {
  id: string;
  nickname: string;
  [key: string]: unknown;
};

export type EquipmentOption = {
  name?: string;
  statType?: string;
  type?: string;
  flatValue?: number | null;
  percentageValue?: number | null;
  specialValue?: unknown;
  specialType?: string | null;
};

export type ParsedEquipment = {
  slot: "무기" | "방어구" | "장신구";
  name: string;
  nameEn: string;
  rarity: string;
  rarityLabel: string;
  enhancementLevel: number;
  prefixes: string[];
  subOptions: string[];
  empty: boolean;
};

const STAT_LABELS: Record<string, string> = {
  atk: "공격력",
  def: "방어력",
  hp: "체력",
  spd: "속도",
  luk: "운",
  focusMulti: "집중 배율",
};

const RARITY_LABELS: Record<string, string> = {
  common: "일반",
  rare: "레어",
  epic: "에픽",
  legendary: "전설",
};

const RARITY_COLORS: Record<string, string> = {
  common: "border-zinc-500/50 text-zinc-300",
  rare: "border-blue-500/60 text-blue-300",
  epic: "border-purple-500/60 text-purple-300",
  legendary: "border-amber-500/70 text-amber-300",
};

export function pickString(
  profile: Record<string, unknown>,
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

export function pickNumber(
  profile: Record<string, unknown>,
  keys: string[],
): number | null {
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

export function formatNumber(value: number | null): string {
  if (value === null) {
    return "—";
  }
  return value.toLocaleString("ko-KR");
}

export function formatRarity(value: string): string {
  return RARITY_LABELS[value.toLowerCase()] ?? value;
}

export function getRarityColorClass(value: string): string {
  return RARITY_COLORS[value.toLowerCase()] ?? "border-[#3d3d4a] text-[#cdd2dc]";
}

function formatStatType(statType?: string): string {
  if (!statType) {
    return "스탯";
  }
  return STAT_LABELS[statType] ?? statType.toUpperCase();
}

function formatEquipmentOption(option: EquipmentOption): string {
  const stat = formatStatType(option.statType);
  const prefix = option.name?.trim();

  if (option.type === "percentage" && option.percentageValue != null) {
    const pct = Math.round(option.percentageValue * 1000) / 10;
    return prefix ? `${prefix} · ${stat} +${pct}%` : `${stat} +${pct}%`;
  }

  if (option.flatValue != null) {
    return prefix ? `${prefix} · ${stat} +${option.flatValue}` : `${stat} +${option.flatValue}`;
  }

  if (option.specialValue != null) {
    return prefix ? `${prefix} · ${String(option.specialValue)}` : String(option.specialValue);
  }

  return prefix ?? "부옵션";
}

function parseEquipmentItem(
  item: unknown,
  slot: ParsedEquipment["slot"],
): ParsedEquipment {
  if (item === null || item === undefined) {
    return {
      slot,
      name: "미장착",
      nameEn: "",
      rarity: "",
      rarityLabel: "—",
      enhancementLevel: 0,
      prefixes: [],
      subOptions: [],
      empty: true,
    };
  }

  if (typeof item !== "object") {
    return {
      slot,
      name: String(item),
      nameEn: "",
      rarity: "",
      rarityLabel: "—",
      enhancementLevel: 0,
      prefixes: [],
      subOptions: [],
      empty: false,
    };
  }

  const record = item as Record<string, unknown>;
  const rarity = pickString(record, ["rarity"], "");
  const rawOptions = Array.isArray(record.options) ? record.options : [];
  const options = rawOptions as EquipmentOption[];
  const prefixes = options
    .map((option) => option.name?.trim())
    .filter((name): name is string => Boolean(name));
  const subOptions = options.map(formatEquipmentOption);

  const standalonePrefix = pickString(record, ["prefix", "affix", "prefixName"], "");
  if (standalonePrefix !== "—" && !prefixes.includes(standalonePrefix)) {
    prefixes.unshift(standalonePrefix);
  }

  return {
    slot,
    name: pickString(record, ["nameKo", "nameEn", "name"], "미장착"),
    nameEn: pickString(record, ["nameEn"], ""),
    rarity,
    rarityLabel: rarity ? formatRarity(rarity) : "—",
    enhancementLevel: pickNumber(record, ["enhancementLevel", "enhance"]) ?? 0,
    prefixes,
    subOptions,
    empty: false,
  };
}

export function extractEquipment(profile: PublicProfile): ParsedEquipment[] {
  return [
    parseEquipmentItem(profile.weapon, "무기"),
    parseEquipmentItem(profile.armor, "방어구"),
    parseEquipmentItem(profile.accessory, "장신구"),
  ];
}

export function extractTitles(profile: PublicProfile): {
  activeTitle: string;
  ownedTitles: string[];
} {
  const activeTitle = pickString(profile, ["activeTitle", "title", "honorTitle"], "");
  const rawOwned = profile.ownedTitles;
  const ownedTitles = Array.isArray(rawOwned)
    ? rawOwned.filter((title): title is string => typeof title === "string" && title.trim().length > 0)
    : [];

  return {
    activeTitle: activeTitle === "—" ? "" : activeTitle,
    ownedTitles,
  };
}

export function getUserProfilePath(nickname: string): string {
  return `/user/${encodeURIComponent(nickname)}`;
}
