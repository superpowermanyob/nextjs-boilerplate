export const COMMUNITY_LINKS = {
  discord:
    process.env.NEXT_PUBLIC_DISCORD_URL ?? "https://discord.gg/focusrpg",
  bugReport:
    process.env.NEXT_PUBLIC_BUG_REPORT_URL ??
    "https://github.com/focusrpg/focusrpg/issues/new?labels=bug",
} as const;
