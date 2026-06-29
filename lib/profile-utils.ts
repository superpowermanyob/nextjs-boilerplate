import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/locales";
import { resolveLocalizedItemName } from "@/lib/item-names";
import { resolveLocalizedPrefixName } from "@/lib/prefix-names";

export type PublicProfile = {
  id: string;
  nickname: string;
  [key: string]: unknown;
};

export type EquipmentSlotKey = "weapon" | "armor" | "accessory";

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
  slotKey: EquipmentSlotKey;
  itemId: string;
  nameKo: string;
  nameEn: string;
  rarity: string;
  enhancementLevel: number;
  prefixes: string[];
  options: EquipmentOption[];
  empty: boolean;
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

export function formatNumber(value: number | null, locale = "en"): string {
  if (value === null) {
    return "—";
  }
  return value.toLocaleString(locale);
}

export function formatRarity(value: string, rarityDict: Dictionary["rarity"]): string {
  const key = value.toLowerCase() as keyof Dictionary["rarity"];
  return rarityDict[key] ?? value;
}

export function getRarityColorClass(value: string): string {
  return RARITY_COLORS[value.toLowerCase()] ?? "border-[#3d3d4a] text-[#cdd2dc]";
}

function formatStatType(statType: string | undefined, stats: Dictionary["stats"]): string {
  if (!statType) {
    return stats.generic;
  }
  const key = statType as keyof Dictionary["stats"];
  return stats[key] ?? statType.toUpperCase();
}

export function formatEquipmentOption(
  option: EquipmentOption,
  stats: Dictionary["stats"],
  locale: Locale,
): string {
  const stat = formatStatType(option.statType, stats);
  const prefix = option.name
    ? resolveLocalizedPrefixName(option.name, locale)
    : "";

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

  return prefix || stats.subOption;
}

export function getLocalizedPrefixName(
  rawName: string,
  locale: Locale,
): string {
  return resolveLocalizedPrefixName(rawName, locale);
}

function parseEquipmentItem(item: unknown, slotKey: EquipmentSlotKey): ParsedEquipment {
  if (item === null || item === undefined) {
    return {
      slotKey,
      itemId: "",
      nameKo: "",
      nameEn: "",
      rarity: "",
      enhancementLevel: 0,
      prefixes: [],
      options: [],
      empty: true,
    };
  }

  if (typeof item !== "object") {
    const fallback = String(item);
    return {
      slotKey,
      itemId: "",
      nameKo: fallback,
      nameEn: fallback,
      rarity: "",
      enhancementLevel: 0,
      prefixes: [],
      options: [],
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

  const standalonePrefix = pickString(record, ["prefix", "affix", "prefixName"], "");
  if (standalonePrefix !== "—" && !prefixes.includes(standalonePrefix)) {
    prefixes.unshift(standalonePrefix);
  }

  return {
    slotKey,
    itemId: pickString(record, ["id", "itemId"], ""),
    nameKo: pickString(record, ["nameKo"], ""),
    nameEn: pickString(record, ["nameEn"], ""),
    rarity,
    enhancementLevel: pickNumber(record, ["enhancementLevel", "enhance"]) ?? 0,
    prefixes,
    options,
    empty: false,
  };
}

export function getLocalizedEquipmentName(
  item: ParsedEquipment,
  locale: Locale,
): string {
  if (item.empty) {
    return "";
  }

  if (typeof item !== "object") {
    return "";
  }

  return resolveLocalizedItemName(
    {
      id: item.itemId,
      nameKo: item.nameKo,
      nameEn: item.nameEn,
    },
    locale,
  );
}

export function extractEquipment(profile: PublicProfile): ParsedEquipment[] {
  return [
    parseEquipmentItem(profile.weapon, "weapon"),
    parseEquipmentItem(profile.armor, "armor"),
    parseEquipmentItem(profile.accessory, "accessory"),
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

export function getEquipmentSlotLabel(
  slotKey: EquipmentSlotKey,
  equipmentDict: Dictionary["equipment"],
): string {
  return equipmentDict[slotKey];
}
