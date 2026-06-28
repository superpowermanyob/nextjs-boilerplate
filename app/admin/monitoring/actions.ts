"use server";

import type { BANNER_LOCALE_CODES } from "@/lib/banner-text";
import {
  getBannerDocument,
  serializeBannerForAdmin,
  updateBannerDocument,
} from "@/lib/banner-server";

export type BannerMessages = Record<
  (typeof BANNER_LOCALE_CODES)[number],
  string
>;

export type BannerActionResult =
  | { ok: true; messages: BannerMessages }
  | { ok: false; error: string };

export async function loadBannerMessagesAction(): Promise<BannerActionResult> {
  try {
    const banner = await getBannerDocument();
    return {
      ok: true,
      messages: serializeBannerForAdmin(banner).messages,
    };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "공지를 불러오지 못했습니다.",
    };
  }
}

export async function saveBannerMessagesAction(
  messages: Partial<BannerMessages>,
): Promise<BannerActionResult> {
  try {
    await updateBannerDocument(messages);
    const banner = await getBannerDocument();
    return {
      ok: true,
      messages: serializeBannerForAdmin(banner).messages,
    };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "공지를 저장하지 못했습니다.",
    };
  }
}
