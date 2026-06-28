export const COMMUNITY_LINKS = {
  discord:
    process.env.NEXT_PUBLIC_DISCORD_URL ?? "https://discord.gg/pCkxuHMy",
  bugReport:
    process.env.NEXT_PUBLIC_BUG_REPORT_URL ??
    "https://github.com/focusrpg/focusrpg/issues/new?labels=bug",
} as const;

export const STORE_LINKS = {
  appStore:
    process.env.NEXT_PUBLIC_APP_STORE_URL ??
    "https://apps.apple.com/app/id6761639896",
  googlePlay:
    process.env.NEXT_PUBLIC_GOOGLE_PLAY_URL ??
    "https://play.google.com/store/apps/details?id=com.jystudio.focusrpg",
} as const;
