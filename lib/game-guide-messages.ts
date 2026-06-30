import type { Locale } from "@/lib/i18n/locales";

import en from "@/assets/lang/en.json";
import id from "@/assets/lang/id.json";
import ja from "@/assets/lang/ja.json";
import ko from "@/assets/lang/ko.json";
import ru from "@/assets/lang/ru.json";
import vi from "@/assets/lang/vi.json";
import zhCN from "@/assets/lang/zh_CN.json";
import zhTW from "@/assets/lang/zh_TW.json";

type MessageValue = string | Record<string, unknown>;
type MessageMap = Record<string, MessageValue>;

const GAME_GUIDE_MESSAGES: Record<Locale, MessageMap> = {
  en: en as unknown as MessageMap,
  ko: ko as unknown as MessageMap,
  ja: ja as unknown as MessageMap,
  vi: vi as unknown as MessageMap,
  id: id as unknown as MessageMap,
  "zh-CN": zhCN as unknown as MessageMap,
  "zh-TW": zhTW as unknown as MessageMap,
  ru: ru as unknown as MessageMap,
};

function resolveMessage(value: MessageValue | undefined, fallback: string): string {
  if (typeof value === "string") {
    return value;
  }
  return fallback;
}

/** LocaleManager.t() equivalent for assets/lang keys */
export function gt(
  locale: Locale,
  key: string,
  params?: Record<string, string | number>,
): string {
  const catalog = GAME_GUIDE_MESSAGES[locale] ?? GAME_GUIDE_MESSAGES.en;
  const fallback = GAME_GUIDE_MESSAGES.en;
  let text = resolveMessage(catalog[key], resolveMessage(fallback[key], key));

  if (params) {
    text = text.replace(/\{(\w+)\}/g, (_, paramKey: string) =>
      String(params[paramKey] ?? `{${paramKey}}`),
    );
  }

  return text;
}
