import type { Locale } from "@/lib/i18n/locales";
import { DEFAULT_LOCALE, isLocale } from "@/lib/i18n/locales";
import { getDictionary } from "@/lib/i18n/dictionaries";

const REWARD_CONTAINER_KEYS = [
  "rewards",
  "reward",
  "items",
  "attachments",
  "rewardList",
  "prizes",
  "loot",
  "mailRewards",
] as const;

const CURRENCY_FIELDS: Array<{ source: string; target: string }> = [
  { source: "gems", target: "gems" },
  { source: "gem", target: "gem" },
  { source: "gemCount", target: "gem" },
  { source: "rewardGems", target: "gem" },
  { source: "jewel", target: "gem" },
  { source: "jewels", target: "gem" },
  { source: "gold", target: "gold" },
  { source: "coin", target: "gold" },
  { source: "coins", target: "gold" },
  { source: "dia", target: "dia" },
  { source: "diamond", target: "dia" },
  { source: "diamonds", target: "dia" },
];

const LOCALE_LOOKUP_ORDER: Record<Locale, string[]> = {
  en: ["en", "en-US", "english"],
  ko: ["ko", "kr", "korean", "ko-KR"],
  ja: ["ja", "jp", "japanese", "ja-JP"],
  vi: ["vi", "vn", "vietnamese"],
  id: ["id", "indonesian"],
  "zh-CN": ["zh-CN", "zh", "zh-Hans", "cn", "chinese"],
  "zh-TW": ["zh-TW", "zh-Hant", "tw"],
  ru: ["ru", "russian"],
};

const LOCALE_SUFFIX: Record<Locale, string[]> = {
  en: ["En", "EN", "_en", "-en"],
  ko: ["Ko", "KO", "_ko", "-ko", "Kr", "KR"],
  ja: ["Ja", "JA", "_ja", "-ja", "Jp", "JP"],
  vi: ["Vi", "VI", "_vi", "-vi"],
  id: ["Id", "ID", "_id", "-id"],
  "zh-CN": ["ZhCn", "ZhCN", "_zh-CN", "-zh-CN", "Cn", "CN"],
  "zh-TW": ["ZhTw", "ZhTW", "_zh-TW", "-zh-TW", "Tw", "TW"],
  ru: ["Ru", "RU", "_ru", "-ru"],
};

function hasRewardContent(value: unknown): boolean {
  if (value == null) {
    return false;
  }
  if (typeof value === "number") {
    return value > 0;
  }
  if (Array.isArray(value)) {
    return value.length > 0;
  }
  if (typeof value === "object") {
    return Object.keys(value as Record<string, unknown>).length > 0;
  }
  return false;
}

function toPositiveNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value) && value > 0) {
    return value;
  }
  if (typeof value === "string" && value.trim() && !Number.isNaN(Number(value))) {
    const parsed = Number(value);
    return parsed > 0 ? parsed : null;
  }
  return null;
}

function buildCurrencyRewards(data: Record<string, unknown>): Record<string, number> {
  const built: Record<string, number> = {};

  for (const { source, target } of CURRENCY_FIELDS) {
    const amount = toPositiveNumber(data[source]);
    if (amount != null) {
      built[target] = Math.max(built[target] ?? 0, amount);
    }
  }

  return built;
}

function buildArrayGemReward(data: Record<string, unknown>): unknown[] | null {
  const gemAmount =
    toPositiveNumber(data.gem) ??
    toPositiveNumber(data.gems) ??
    toPositiveNumber(data.gemCount) ??
    toPositiveNumber(data.rewardGems);

  if (gemAmount == null) {
    return null;
  }

  return [
    {
      type: "gem",
      itemType: "gem",
      itemId: "gem",
      amount: gemAmount,
      count: gemAmount,
      quantity: gemAmount,
      qty: gemAmount,
    },
  ];
}

export function extractCouponRewards(data: Record<string, unknown>): unknown {
  for (const key of REWARD_CONTAINER_KEYS) {
    const value = data[key];
    if (hasRewardContent(value)) {
      if (
        typeof value === "object" &&
        value !== null &&
        !Array.isArray(value) &&
        Object.keys(value as Record<string, unknown>).length === 0
      ) {
        continue;
      }
      return value;
    }
  }

  const currencyRewards = buildCurrencyRewards(data);
  if (Object.keys(currencyRewards).length > 0) {
    return currencyRewards;
  }

  const arrayReward = buildArrayGemReward(data);
  if (arrayReward) {
    return arrayReward;
  }

  return {};
}

function resolveLocalizedMap(
  value: Record<string, unknown>,
  locale: Locale,
): string | null {
  const candidates = [
    ...LOCALE_LOOKUP_ORDER[locale],
    "ko",
    "en",
    ...Object.keys(value),
  ];

  for (const key of candidates) {
    const text = value[key];
    if (typeof text === "string" && text.trim()) {
      return text.trim();
    }
  }

  return null;
}

function resolveLocalizedField(
  data: Record<string, unknown>,
  baseNames: string[],
  locale: Locale,
): string | null {
  for (const baseName of baseNames) {
    const value = data[baseName];
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
    if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      const localized = resolveLocalizedMap(value as Record<string, unknown>, locale);
      if (localized) {
        return localized;
      }
    }

    for (const suffix of LOCALE_SUFFIX[locale]) {
      const key = `${baseName}${suffix}`;
      const text = data[key];
      if (typeof text === "string" && text.trim()) {
        return text.trim();
      }
    }
  }

  return null;
}

export function resolveCouponLocale(value: unknown): Locale {
  if (typeof value === "string" && isLocale(value)) {
    return value;
  }
  return DEFAULT_LOCALE;
}

export function buildMailboxPayload(
  couponData: Record<string, unknown>,
  couponCode: string,
  localeInput?: string,
): Record<string, unknown> {
  const locale = resolveCouponLocale(localeInput);
  const dictionary = getDictionary(locale);
  const rewards = extractCouponRewards(couponData);

  const title =
    resolveLocalizedField(couponData, ["title", "mailTitle", "subject"], locale) ??
    dictionary.coupon.mailTitle;

  const content =
    resolveLocalizedField(
      couponData,
      ["content", "mailContent", "message", "body", "description", "desc"],
      locale,
    ) ?? dictionary.coupon.mailContent;

  const payload: Record<string, unknown> = {
    title,
    content,
    message: content,
    body: content,
    desc: content,
    rewards,
    isRead: false,
    source: "web_coupon",
    couponCode,
    locale,
  };

  const currencyRewards = buildCurrencyRewards(couponData);
  for (const [key, amount] of Object.entries(currencyRewards)) {
    payload[key] = amount;
  }

  if (typeof rewards === "object" && rewards !== null && !Array.isArray(rewards)) {
    for (const [key, amount] of Object.entries(rewards as Record<string, unknown>)) {
      const numeric = toPositiveNumber(amount);
      if (numeric != null) {
        payload[key] = numeric;
      }
    }
  }

  const passthroughKeys = [
    "rewardType",
    "rewardAmount",
    "rewardValue",
    "rewardCount",
    "type",
    "amount",
    "count",
    "quantity",
    "items",
    "attachments",
  ] as const;

  for (const key of passthroughKeys) {
    if (couponData[key] != null && payload[key] == null) {
      payload[key] = couponData[key];
    }
  }

  if (
    typeof couponData.rewardType === "string" &&
    payload.rewardAmount == null &&
    payload.rewardValue == null
  ) {
    const amount =
      toPositiveNumber(couponData.rewardAmount) ??
      toPositiveNumber(couponData.rewardValue) ??
      toPositiveNumber(couponData.amount) ??
      toPositiveNumber(couponData.gem) ??
      toPositiveNumber(couponData.gems);

    if (amount != null) {
      payload.rewardAmount = amount;
      payload.rewardValue = amount;
    }
  }

  return payload;
}
