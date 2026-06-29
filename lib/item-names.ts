import type { Locale } from "@/lib/i18n/locales";

export type ItemNameEntry = Record<Locale, string>;

/** Base item id: weapon_01, armor_03, accessory_05, ... */
export const ITEM_NAME_CATALOG: Record<string, ItemNameEntry> = {
  weapon_01: {
    ko: "낡은 연필",
    en: "Old Pencil",
    ja: "古い鉛筆",
    vi: "Bút chì cũ",
    id: "Pensil Tua",
    "zh-CN": "旧铅笔",
    "zh-TW": "舊鉛筆",
    ru: "Старый карандаш",
  },
  weapon_02: {
    ko: "나무 막대기",
    en: "Wooden Stick",
    ja: "木の棒",
    vi: "Gậy gỗ",
    id: "Tongkat Kayu",
    "zh-CN": "木棍",
    "zh-TW": "木棍",
    ru: "Деревянная палка",
  },
  weapon_03: {
    ko: "녹슨 검",
    en: "Rusty Sword",
    ja: "錆びた剣",
    vi: "Kiếm gỉ",
    id: "Pedang Berkarat",
    "zh-CN": "生锈的剑",
    "zh-TW": "生鏽的劍",
    ru: "Ржавый меч",
  },
  weapon_04: {
    ko: "수련용 목검",
    en: "Training Wooden Sword",
    ja: "訓練用木刀",
    vi: "Kiếm gỗ luyện tập",
    id: "Pedang Kayu Latihan",
    "zh-CN": "训练用木剑",
    "zh-TW": "訓練用木劍",
    ru: "Тренировочный деревянный меч",
  },
  weapon_05: {
    ko: "마법 지팡이",
    en: "Magic Staff",
    ja: "魔法の杖",
    vi: "Gậy phép",
    id: "Tongkat Sihir",
    "zh-CN": "魔法杖",
    "zh-TW": "魔法杖",
    ru: "Магический посох",
  },
  armor_01: {
    ko: "누더기 옷",
    en: "Ragged Clothes",
    ja: "ぼろ着",
    vi: "Quần áo rách",
    id: "Pakaian Compang-camping",
    "zh-CN": "破衣服",
    "zh-TW": "破衣服",
    ru: "Рваная одежда",
  },
  armor_02: {
    ko: "가죽 조끼",
    en: "Leather Vest",
    ja: "革のベスト",
    vi: "Áo giáp da",
    id: "Rompi Kulit",
    "zh-CN": "皮背心",
    "zh-TW": "皮背心",
    ru: "Кожаный жилет",
  },
  armor_03: {
    ko: "구리 갑옷",
    en: "Copper Armor",
    ja: "銅の鎧",
    vi: "Giáp đồng",
    id: "Armor Tembaga",
    "zh-CN": "铜盔甲",
    "zh-TW": "銅盔甲",
    ru: "Медная броня",
  },
  armor_04: {
    ko: "낡은 망토",
    en: "Old Cloak",
    ja: "古いマント",
    vi: "Áo choàng cũ",
    id: "Jubah Tua",
    "zh-CN": "旧斗篷",
    "zh-TW": "舊斗篷",
    ru: "Старый плащ",
  },
  armor_05: {
    ko: "훈련용 도복",
    en: "Training Robe",
    ja: "訓練用道服",
    vi: "Đạo phục luyện tập",
    id: "Jubah Latihan",
    "zh-CN": "训练道服",
    "zh-TW": "訓練道服",
    ru: "Тренировочная мантия",
  },
  accessory_01: {
    ko: "행운의 동전",
    en: "Lucky Coin",
    ja: "幸運のコイン",
    vi: "Đồng xu may mắn",
    id: "Koin Keberuntungan",
    "zh-CN": "幸运硬币",
    "zh-TW": "幸運硬幣",
    ru: "Счастливая монета",
  },
  accessory_02: {
    ko: "유리 반지",
    en: "Glass Ring",
    ja: "ガラスの指輪",
    vi: "Nhẫn thủy tinh",
    id: "Cincin Kaca",
    "zh-CN": "玻璃戒指",
    "zh-TW": "玻璃戒指",
    ru: "Стеклянное кольцо",
  },
  accessory_03: {
    ko: "가죽 목걸이",
    en: "Leather Necklace",
    ja: "革のネックレス",
    vi: "Vòng cổ da",
    id: "Kalung Kulit",
    "zh-CN": "皮项链",
    "zh-TW": "皮項鍊",
    ru: "Кожаное ожерелье",
  },
  accessory_04: {
    ko: "투명 귀걸이",
    en: "Transparent Earring",
    ja: "透明なイヤリング",
    vi: "Bông tai trong suốt",
    id: "Anting Transparan",
    "zh-CN": "透明耳环",
    "zh-TW": "透明耳環",
    ru: "Прозрачная серьга",
  },
  accessory_05: {
    ko: "낡은 부적",
    en: "Old Talisman",
    ja: "古いお守り",
    vi: "Bùa cũ",
    id: "Jimat Tua",
    "zh-CN": "旧护符",
    "zh-TW": "舊護符",
    ru: "Старый талисман",
  },
};

const LOCALE_FIELD_MAP: Record<Locale, string[]> = {
  ko: ["nameKo", "name_ko", "ko"],
  en: ["nameEn", "name_en", "en"],
  ja: ["nameJa", "name_ja", "ja"],
  vi: ["nameVi", "name_vi", "vi"],
  id: ["nameId", "name_id"],
  "zh-CN": ["nameZhCN", "name_zh_CN", "nameZhCn", "zh-CN", "zhCN"],
  "zh-TW": ["nameZhTW", "name_zh_TW", "nameZhTw", "zh-TW", "zhTW"],
  ru: ["nameRu", "name_ru", "ru"],
};

export function getItemBaseId(itemId: string): string | null {
  const match = itemId.match(/^(weapon|armor|accessory)_\d+/);
  return match?.[0] ?? null;
}

export function resolveLocalizedItemName(
  record: Record<string, unknown>,
  locale: Locale,
): string {
  for (const field of LOCALE_FIELD_MAP[locale]) {
    const value = record[field];
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }

  const names = record.names;
  if (names && typeof names === "object" && !Array.isArray(names)) {
    const localized = (names as Record<string, unknown>)[locale];
    if (typeof localized === "string" && localized.trim()) {
      return localized.trim();
    }
  }

  const itemId = typeof record.id === "string" ? record.id : "";
  const baseId = itemId ? getItemBaseId(itemId) : null;
  if (baseId && ITEM_NAME_CATALOG[baseId]?.[locale]) {
    return ITEM_NAME_CATALOG[baseId][locale];
  }

  const nameKo =
    typeof record.nameKo === "string" && record.nameKo.trim()
      ? record.nameKo.trim()
      : "";
  const nameEn =
    typeof record.nameEn === "string" && record.nameEn.trim()
      ? record.nameEn.trim()
      : "";

  if (nameKo || nameEn) {
    for (const [baseIdKey, entry] of Object.entries(ITEM_NAME_CATALOG)) {
      if (
        (nameKo && entry.ko === nameKo) ||
        (nameEn && entry.en === nameEn)
      ) {
        return entry[locale];
      }
    }
  }

  if (locale === "ko" && nameKo) {
    return nameKo;
  }
  if (locale === "en" && nameEn) {
    return nameEn;
  }

  const genericName =
    typeof record.name === "string" && record.name.trim()
      ? record.name.trim()
      : typeof record.itemName === "string" && record.itemName.trim()
        ? record.itemName.trim()
        : "";

  if (genericName) {
    return genericName;
  }

  return nameKo || nameEn || "";
}
