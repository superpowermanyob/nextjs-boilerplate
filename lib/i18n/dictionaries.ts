import type { Locale } from "@/lib/i18n/locales";
import { messageCatalog } from "@/lib/i18n/messages";
import type { Dictionary } from "@/lib/i18n/types";

export type { Dictionary } from "@/lib/i18n/types";

export function getDictionary(locale: Locale): Dictionary {
  return messageCatalog[locale] ?? messageCatalog.en;
}

export function interpolate(
  template: string,
  values: Record<string, string | number>,
): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) =>
    String(values[key] ?? `{${key}}`),
  );
}
