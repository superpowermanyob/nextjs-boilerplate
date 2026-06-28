import type { Locale } from "@/lib/i18n/locales";
import type { Dictionary } from "@/lib/i18n/types";

import en from "@/messages/en.json";
import id from "@/messages/id.json";
import ja from "@/messages/ja.json";
import ko from "@/messages/ko.json";
import ru from "@/messages/ru.json";
import vi from "@/messages/vi.json";
import zhCN from "@/messages/zh-CN.json";
import zhTW from "@/messages/zh-TW.json";

export const messageCatalog: Record<Locale, Dictionary> = {
  en: en as Dictionary,
  ko: ko as Dictionary,
  ja: ja as Dictionary,
  vi: vi as Dictionary,
  id: id as Dictionary,
  "zh-CN": zhCN as Dictionary,
  "zh-TW": zhTW as Dictionary,
  ru: ru as Dictionary,
};
