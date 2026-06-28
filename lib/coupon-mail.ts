import type { Locale } from "@/lib/i18n/locales";
import { DEFAULT_LOCALE, isLocale } from "@/lib/i18n/locales";
import { getDictionary } from "@/lib/i18n/dictionaries";

const REWARD_CONTAINER_KEYS = [
  "rewards",
  "reward",
  "rewardList",
  "rewardItems",
  "items",
  "attachments",
  "giftItems",
  "prizes",
  "loot",
  "mailRewards",
  "compensation",
] as const;

const GEM_FIELD_NAMES = [
  "gem",
  "gems",
  "gemCount",
  "gemAmount",
  "rewardGems",
  "rewardGem",
  "premiumGem",
  "jewel",
  "jewels",
  "dia",
  "diamond",
  "diamonds",
  "amount",
  "rewardAmount",
  "rewardValue",
  "value",
  "count",
  "quantity",
  "qty",
] as const;

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

function isGemLikeType(value: unknown): boolean {
  return typeof value === "string" && /gem|jewel|dia|diamond|premium/i.test(value);
}

function extractGemAmountFromObject(
  data: Record<string, unknown>,
  depth = 0,
): number | null {
  if (depth > 4) {
    return null;
  }

  for (const field of GEM_FIELD_NAMES) {
    const amount = toPositiveNumber(data[field]);
    if (amount != null) {
      return amount;
    }
  }

  if (isGemLikeType(data.rewardType) || isGemLikeType(data.type) || isGemLikeType(data.itemType)) {
    for (const field of GEM_FIELD_NAMES) {
      const amount = toPositiveNumber(data[field]);
      if (amount != null) {
        return amount;
      }
    }
  }

  for (const key of REWARD_CONTAINER_KEYS) {
    const nested = data[key];
    if (Array.isArray(nested)) {
      for (const entry of nested) {
        if (typeof entry === "object" && entry !== null) {
          const amount = extractGemAmountFromObject(
            entry as Record<string, unknown>,
            depth + 1,
          );
          if (amount != null) {
            return amount;
          }
        }
      }
    } else if (typeof nested === "object" && nested !== null) {
      const amount = extractGemAmountFromObject(
        nested as Record<string, unknown>,
        depth + 1,
      );
      if (amount != null) {
        return amount;
      }
    }
  }

  return null;
}

export function extractGemAmount(data: Record<string, unknown>): number | null {
  return extractGemAmountFromObject(data);
}

function cloneWithGemAmount(value: unknown, gemAmount: number): unknown {
  if (Array.isArray(value)) {
    if (value.length === 0) {
      return value;
    }
    return value.map((entry, index) =>
      index === 0 && typeof entry === "object" && entry !== null
        ? cloneWithGemAmount(entry, gemAmount)
        : entry,
    );
  }

  if (typeof value !== "object" || value === null) {
    return value;
  }

  const source = value as Record<string, unknown>;
  const cloned: Record<string, unknown> = { ...source };

  for (const key of GEM_FIELD_NAMES) {
    if (key in cloned && toPositiveNumber(cloned[key]) != null) {
      cloned[key] = gemAmount;
    }
  }

  for (const key of ["type", "itemType", "itemId", "rewardType", "rewardId", "id"]) {
    if (typeof cloned[key] === "string" && isGemLikeType(cloned[key])) {
      for (const amountKey of ["amount", "count", "quantity", "value", "qty"]) {
        if (amountKey in cloned) {
          cloned[amountKey] = gemAmount;
        }
      }
    }
  }

  return cloned;
}

function buildRewardFieldsFromTemplate(
  template: Record<string, unknown>,
  gemAmount: number,
): Record<string, unknown> {
  const result: Record<string, unknown> = {};

  for (const key of REWARD_CONTAINER_KEYS) {
    const value = template[key];
    if (!hasRewardContent(value)) {
      continue;
    }
    result[key] = cloneWithGemAmount(value, gemAmount);
  }

  for (const key of GEM_FIELD_NAMES) {
    if (key in template && toPositiveNumber(template[key]) != null) {
      result[key] = gemAmount;
    }
  }

  if (typeof template.rewardType === "string") {
    result.rewardType = template.rewardType;
    if (result.rewardAmount == null) {
      result.rewardAmount = gemAmount;
    }
    if (result.rewardValue == null) {
      result.rewardValue = gemAmount;
    }
  }

  return result;
}

function buildDefaultRewardFields(gemAmount: number): Record<string, unknown> {
  return {
    gem: gemAmount,
    gems: gemAmount,
    rewardType: "gem",
    rewardAmount: gemAmount,
    rewardValue: gemAmount,
    rewards: [
      {
        type: "gem",
        itemType: "gem",
        itemId: "gem",
        rewardType: "gem",
        amount: gemAmount,
        count: gemAmount,
        quantity: gemAmount,
        value: gemAmount,
      },
    ],
    rewardList: [
      {
        type: "Gem",
        rewardType: "Gem",
        amount: gemAmount,
        count: gemAmount,
      },
    ],
    rewardItems: [
      {
        itemType: "gem",
        itemId: "gem",
        quantity: gemAmount,
        count: gemAmount,
      },
    ],
    items: [
      {
        type: "GEM",
        id: "gem",
        amount: gemAmount,
        count: gemAmount,
      },
    ],
  };
}

export function buildRewardFields(
  couponData: Record<string, unknown>,
  templateMail?: Record<string, unknown> | null,
): Record<string, unknown> {
  const gemAmount = extractGemAmount(couponData);
  if (gemAmount == null) {
    return {};
  }

  if (templateMail) {
    const fromTemplate = buildRewardFieldsFromTemplate(templateMail, gemAmount);
    if (Object.keys(fromTemplate).length > 0) {
      return fromTemplate;
    }
  }

  return buildDefaultRewardFields(gemAmount);
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

function resolveCouponLocalizedText(
  data: Record<string, unknown>,
  baseNames: string[],
  locale: Locale,
): string | null {
  for (const baseName of baseNames) {
    const value = data[baseName];
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

export function scoreMailboxRewardTemplate(
  data: Record<string, unknown>,
): number {
  let score = 0;

  for (const key of REWARD_CONTAINER_KEYS) {
    if (hasRewardContent(data[key])) {
      score += 10;
    }
  }

  for (const key of GEM_FIELD_NAMES) {
    if (toPositiveNumber(data[key]) != null) {
      score += 5;
    }
  }

  if (typeof data.rewardType === "string") {
    score += 3;
  }

  if (data.source === "web_coupon") {
    score -= 20;
  }

  return score;
}

export function buildMailboxPayload(
  couponData: Record<string, unknown>,
  couponCode: string,
  localeInput?: string,
  templateMail?: Record<string, unknown> | null,
): Record<string, unknown> {
  const locale = resolveCouponLocale(localeInput);
  const dictionary = getDictionary(locale);
  const rewardFields = buildRewardFields(couponData, templateMail);

  const title =
    resolveCouponLocalizedText(
      couponData,
      ["title", "mailTitle", "subject"],
      locale,
    ) ?? dictionary.coupon.mailTitle;

  const content =
    resolveCouponLocalizedText(
      couponData,
      ["content", "mailContent", "message", "body", "description", "desc"],
      locale,
    ) ?? dictionary.coupon.mailContent;

  return {
    title,
    content,
    message: content,
    body: content,
    desc: content,
    ...rewardFields,
    isRead: false,
    source: "web_coupon",
    couponCode,
    locale,
  };
}
