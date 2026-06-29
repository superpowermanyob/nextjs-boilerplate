import type { Locale } from "@/lib/i18n/locales";

export type PrefixNameEntry = Record<Locale, string>;

/** Canonical prefix id → localized display name */
export const PREFIX_NAME_CATALOG: Record<string, PrefixNameEntry> = {
  swift: {
    ko: "빠른",
    en: "Swift",
    ja: "迅速な",
    vi: "Nhanh",
    id: "Cepat",
    "zh-CN": "迅捷",
    "zh-TW": "迅捷",
    ru: "Быстрый",
  },
  powerful: {
    ko: "강력한",
    en: "Powerful",
    ja: "強力な",
    vi: "Mạnh mẽ",
    id: "Kuat",
    "zh-CN": "强力的",
    "zh-TW": "強力的",
    ru: "Мощный",
  },
  hardy: {
    ko: "견고한",
    en: "Hardy",
    ja: "堅固な",
    vi: "Chắc chắn",
    id: "Kokoh",
    "zh-CN": "坚固",
    "zh-TW": "堅固",
    ru: "Крепкий",
  },
  focus_efficiency: {
    ko: "집중 효율",
    en: "Focus Efficiency",
    ja: "集中効率",
    vi: "Hiệu suất tập trung",
    id: "Efisiensi Fokus",
    "zh-CN": "专注效率",
    "zh-TW": "專注效率",
    ru: "Эффективность фокуса",
  },
  focused: {
    ko: "집중된",
    en: "Focused",
    ja: "集中した",
    vi: "Tập trung",
    id: "Terfokus",
    "zh-CN": "专注",
    "zh-TW": "專注",
    ru: "Сфокусированный",
  },
  fortunate: {
    ko: "행운의",
    en: "Fortunate",
    ja: "幸運の",
    vi: "May mắn",
    id: "Keberuntungan",
    "zh-CN": "幸运",
    "zh-TW": "幸運",
    ru: "Везучий",
  },
  golden: {
    ko: "황금의",
    en: "Golden",
    ja: "黄金の",
    vi: "Hoàng kim",
    id: "Emas",
    "zh-CN": "黄金",
    "zh-TW": "黃金",
    ru: "Золотой",
  },
  blessed: {
    ko: "축복받은",
    en: "Blessed",
    ja: "祝福された",
    vi: "Được ban phước",
    id: "Diberkati",
    "zh-CN": "受到祝福的",
    "zh-TW": "受到祝福的",
    ru: "Святой",
  },
  sharp: {
    ko: "날카로운",
    en: "Sharp",
    ja: "鋭い",
    vi: "Sắc bén",
    id: "Tajam",
    "zh-CN": "锋利",
    "zh-TW": "鋒利",
    ru: "Острый",
  },
  reinforced: {
    ko: "강화된",
    en: "Reinforced",
    ja: "強化された",
    vi: "Củng cố",
    id: "Diperkuat",
    "zh-CN": "强化",
    "zh-TW": "強化",
    ru: "Укреплённый",
  },
  ironclad: {
    ko: "철벽의",
    en: "Ironclad",
    ja: "鉄壁の",
    vi: "Sắt thép",
    id: "Baja",
    "zh-CN": "铁壁",
    "zh-TW": "鐵壁",
    ru: "Железный",
  },
  guardian: {
    ko: "수호의",
    en: "Guardian",
    ja: "守護の",
    vi: "Hộ vệ",
    id: "Penjaga",
    "zh-CN": "守护",
    "zh-TW": "守護",
    ru: "Страж",
  },
  shielded: {
    ko: "보호받은",
    en: "Shielded",
    ja: "保護された",
    vi: "Được bảo vệ",
    id: "Terlindungi",
    "zh-CN": "受保护",
    "zh-TW": "受保護",
    ru: "Защищённый",
  },
  unwavering: {
    ko: "불굴의",
    en: "Unwavering",
    ja: "不屈の",
    vi: "Bất khuất",
    id: "Tak Goyah",
    "zh-CN": "不屈",
    "zh-TW": "不屈",
    ru: "Несгибаемый",
  },
  radiant: {
    ko: "빛나는",
    en: "Radiant",
    ja: "輝く",
    vi: "Rực rỡ",
    id: "Bersinar",
    "zh-CN": "闪耀",
    "zh-TW": "閃耀",
    ru: "Сияющий",
  },
  vital: {
    ko: "생명의",
    en: "Vital",
    ja: "生命の",
    vi: "Sinh mệnh",
    id: "Vital",
    "zh-CN": "生命",
    "zh-TW": "生命",
    ru: "Жизненный",
  },
  vigorous: {
    ko: "활력의",
    en: "Vigorous",
    ja: "活力の",
    vi: "Sức sống",
    id: "Bertenaga",
    "zh-CN": "活力",
    "zh-TW": "活力",
    ru: "Энергичный",
  },
  critical: {
    ko: "치명타의",
    en: "Critical",
    ja: "クリティカル",
    vi: "Chí mạng",
    id: "Kritis",
    "zh-CN": "暴击",
    "zh-TW": "暴擊",
    ru: "Критический",
  },
  absolute_stat: {
    ko: "절대 옵션",
    en: "Absolute Stat",
    ja: "絶対オプション",
    vi: "Chỉ số tuyệt đối",
    id: "Stat Absolut",
    "zh-CN": "绝对属性",
    "zh-TW": "絕對屬性",
    ru: "Абсолютный стат",
  },
  barrier: {
    ko: "결계의",
    en: "Warded",
    ja: "結界の",
    vi: "Kết giới",
    id: "Penghalang",
    "zh-CN": "结界",
    "zh-TW": "結界",
    ru: "Барьерный",
  },
  battle_worn: {
    ko: "전투의",
    en: "Battle-Worn",
    ja: "戦闘の",
    vi: "Chiến trận",
    id: "Bekas Perang",
    "zh-CN": "战痕",
    "zh-TW": "戰痕",
    ru: "Закалённый в бою",
  },
};

/** All known raw prefix strings from Firestore → canonical id */
const PREFIX_ALIAS_MAP: Record<string, string> = {
  // swift
  빠른: "swift",
  신속한: "swift",
  "신속의": "swift",
  경쾌한: "swift",
  민첩한: "swift",
  Swift: "swift",
  Fast: "swift",
  Agile: "swift",
  Nimble: "swift",
  Nhanh: "swift",
  Cepat: "swift",
  迅速な: "swift",
  迅捷: "swift",
  迅速的: "swift",
  Быстрый: "swift",
  // powerful
  강력한: "powerful",
  맹렬한: "powerful",
  Powerful: "powerful",
  Fierce: "powerful",
  Kuat: "powerful",
  "Mạnh mẽ": "powerful",
  強力: "powerful",
  強力な: "powerful",
  强力的: "powerful",
  Мощный: "powerful",
  // hardy
  견고한: "hardy",
  단단한: "hardy",
  튼튼한: "hardy",
  강인한: "hardy",
  Hardy: "hardy",
  Sturdy: "hardy",
  Tough: "hardy",
  Resilient: "hardy",
  Steadfast: "hardy",
  Kokoh: "hardy",
  Ulet: "hardy",
  "Bền bỉ": "hardy",
  "Chắc chắn": "hardy",
  堅固: "hardy",
  堅固な: "hardy",
  堅韌: "hardy",
  Крепкий: "hardy",
  Прочный: "hardy",
  // focus efficiency
  "집중 효율": "focus_efficiency",
  집중효율: "focus_efficiency",
  "Focus Efficiency": "focus_efficiency",
  // focused
  집중된: "focused",
  "집중의": "focused",
  Focused: "focused",
  // fortunate
  "행운의": "fortunate",
  Lucky: "fortunate",
  Fortunate: "fortunate",
  "May mắn": "fortunate",
  Keberuntungan: "fortunate",
  幸運: "fortunate",
  Везучий: "fortunate",
  // golden
  "황금의": "golden",
  Golden: "golden",
  Emas: "golden",
  "Hoàng kim": "golden",
  黃金: "golden",
  黄金的: "golden",
  Золотой: "golden",
  // blessed
  축복받은: "blessed",
  Blessed: "blessed",
  "Được ban phước": "blessed",
  Diberkati: "blessed",
  祝福: "blessed",
  祝福された: "blessed",
  受到祝福的: "blessed",
  Святой: "blessed",
  // sharp
  날카로운: "sharp",
  예리한: "sharp",
  Sharp: "sharp",
  Sharpened: "sharp",
  "Sắc bén": "sharp",
  Tajam: "sharp",
  鋒利: "sharp",
  鋭い: "sharp",
  锋利的: "sharp",
  Острый: "sharp",
  // reinforced
  강화된: "reinforced",
  보강된: "reinforced",
  Reinforced: "reinforced",
  Fortified: "reinforced",
  Empowered: "reinforced",
  Diperkuat: "reinforced",
  "Củng cố": "reinforced",
  強化: "reinforced",
  強化された: "reinforced",
  "Укреплённый": "reinforced",
  // ironclad
  "철벽의": "ironclad",
  Ironclad: "ironclad",
  // guardian
  "수호의": "guardian",
  Guardian: "guardian",
  // shielded
  보호받은: "shielded",
  Shielded: "shielded",
  Warded: "shielded",
  // unwavering
  "불굴의": "unwavering",
  不屈的: "unwavering",
  // radiant
  빛나는: "radiant",
  Radiant: "radiant",
  // vital
  "생명의": "vital",
  Vital: "vital",
  // vigorous
  "활력의": "vigorous",
  Vigorous: "vigorous",
  // critical
  "치명타의": "critical",
  Critical: "critical",
  // absolute stat
  "절대 옵션": "absolute_stat",
  "Absolute Stat": "absolute_stat",
  // barrier
  "결계의": "barrier",
  // battle worn
  "Battle-Worn": "battle_worn",
};

function normalizePrefixKey(raw: string): string {
  return raw.trim().replace(/\s+/g, " ");
}

function lookupCanonicalId(raw: string): string | null {
  const normalized = normalizePrefixKey(raw);
  if (!normalized) {
    return null;
  }

  const direct = PREFIX_ALIAS_MAP[normalized];
  if (direct) {
    return direct;
  }

  const noSpaces = normalized.replace(/\s/g, "");
  const noSpaceAlias = PREFIX_ALIAS_MAP[noSpaces];
  if (noSpaceAlias) {
    return noSpaceAlias;
  }

  const lower = normalized.toLowerCase();
  for (const [alias, canonicalId] of Object.entries(PREFIX_ALIAS_MAP)) {
    if (alias.toLowerCase() === lower) {
      return canonicalId;
    }
  }

  for (const [canonicalId, entry] of Object.entries(PREFIX_NAME_CATALOG)) {
    for (const localized of Object.values(entry)) {
      if (localized === normalized) {
        return canonicalId;
      }
      if (localized.replace(/\s/g, "") === noSpaces) {
        return canonicalId;
      }
    }
  }

  return null;
}

export function resolveLocalizedPrefixName(
  rawName: string | undefined | null,
  locale: Locale,
): string {
  if (!rawName?.trim()) {
    return "";
  }

  const trimmed = rawName.trim();
  const canonicalId = lookupCanonicalId(trimmed);
  if (canonicalId && PREFIX_NAME_CATALOG[canonicalId]?.[locale]) {
    return PREFIX_NAME_CATALOG[canonicalId][locale];
  }

  return trimmed;
}
