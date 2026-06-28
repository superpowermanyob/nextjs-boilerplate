"use client";

import type { ReactNode } from "react";
import { Apple, MessageCircle } from "lucide-react";

import { COMMUNITY_LINKS, STORE_LINKS } from "@/lib/community-links";

function GooglePlayIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill="currentColor"
    >
      <path d="M3.6 1.8c-.3.2-.6.6-.6 1.1v18.2c0 .5.3.9.6 1.1l.1.1 10.2-10.2v-.2L3.7 1.7l-.1.1z" />
      <path d="M16.9 14.9 13.7 11.7l-2.8 2.8 2.8 2.8 3.2-2.4z" />
      <path d="m13.7 11.7 8.6-4.9c.5-.3 1-.1 1.2.4l-9.8 9.8 2.8-2.8z" />
      <path d="M13.7 11.7 3.9 21.5c.2.5.7.7 1.2.4l8.6-4.9-2.8-2.8z" />
    </svg>
  );
}

type TopLinkProps = {
  href: string;
  title: string;
  label: string;
  chipClassName: string;
  iconWrapClassName: string;
  children: ReactNode;
};

function TopLink({
  href,
  title,
  label,
  chipClassName,
  iconWrapClassName,
  children,
}: TopLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      title={title}
      aria-label={title}
      className={`inline-flex items-center gap-2 rounded-2xl border px-2.5 py-2 shadow-xl shadow-black/30 backdrop-blur-sm transition sm:px-3 sm:py-2.5 ${chipClassName}`}
    >
      <span
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ring-1 ${iconWrapClassName}`}
      >
        {children}
      </span>
      <span className="hidden text-sm font-semibold text-white sm:inline">{label}</span>
    </a>
  );
}

export function TopCenterLinks() {
  return (
    <div className="pointer-events-none fixed left-1/2 top-4 z-[60] flex -translate-x-1/2 items-center gap-2 sm:top-5 sm:gap-3">
      <div className="pointer-events-auto flex items-center gap-2 sm:gap-3">
        <TopLink
          href={STORE_LINKS.appStore}
          title="Download on the App Store"
          label="App Store"
          chipClassName="border-white/15 bg-black/40 hover:border-white/30 hover:bg-black/55"
          iconWrapClassName="bg-white/10 ring-white/20"
        >
          <Apple className="h-4 w-4 text-white" strokeWidth={2.25} />
        </TopLink>

        <TopLink
          href={COMMUNITY_LINKS.discord}
          title="Discord Link"
          label="Discord Link"
          chipClassName="border-[#5865F2]/40 bg-[#282830]/95 hover:border-[#5865F2] hover:bg-[#5865F2]/15"
          iconWrapClassName="bg-[#5865F2]/20 ring-[#5865F2]/40"
        >
          <MessageCircle className="h-4 w-4 text-[#9eb8ff]" strokeWidth={2.25} />
        </TopLink>

        <TopLink
          href={STORE_LINKS.googlePlay}
          title="Get it on Google Play"
          label="Google Play"
          chipClassName="border-[#34A853]/35 bg-[#34A853]/10 hover:border-[#34A853]/60 hover:bg-[#34A853]/20"
          iconWrapClassName="bg-[#34A853]/15 ring-[#34A853]/30"
        >
          <GooglePlayIcon className="h-4 w-4 text-[#34d399]" />
        </TopLink>
      </div>
    </div>
  );
}
