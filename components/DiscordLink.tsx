"use client";

import { MessageCircle } from "lucide-react";

import { COMMUNITY_LINKS } from "@/lib/community-links";

export function DiscordLink() {
  return (
    <a
      href={COMMUNITY_LINKS.discord}
      target="_blank"
      rel="noopener noreferrer"
      title="Discord Link"
      aria-label="Discord Link"
      className="fixed left-1/2 top-4 z-[60] inline-flex -translate-x-1/2 items-center gap-2 rounded-2xl border border-[#5865F2]/40 bg-[#282830]/95 px-3 py-2 shadow-xl shadow-black/30 backdrop-blur-sm transition hover:border-[#5865F2] hover:bg-[#5865F2]/15 sm:top-5 sm:px-4 sm:py-2.5"
    >
      <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#5865F2]/20 ring-1 ring-[#5865F2]/40">
        <MessageCircle className="h-4 w-4 text-[#9eb8ff]" strokeWidth={2.25} />
      </span>
      <span className="text-sm font-semibold text-white">Discord Link</span>
    </a>
  );
}
