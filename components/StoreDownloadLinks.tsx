"use client";

import { Apple } from "lucide-react";

import { STORE_LINKS } from "@/lib/community-links";

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

const storeLinks = [
  {
    href: STORE_LINKS.appStore,
    label: "App Store",
    title: "Download on the App Store",
    icon: Apple,
    iconClassName: "h-4 w-4",
    chipClassName:
      "border-white/15 bg-black/40 hover:border-white/30 hover:bg-black/55",
    iconWrapClassName: "bg-white/10 ring-white/20",
    textClassName: "text-white",
  },
  {
    href: STORE_LINKS.googlePlay,
    label: "Google Play",
    title: "Get it on Google Play",
    icon: GooglePlayIcon,
    iconClassName: "h-4 w-4 text-[#34d399]",
    chipClassName:
      "border-[#34A853]/35 bg-[#34A853]/10 hover:border-[#34A853]/60 hover:bg-[#34A853]/20",
    iconWrapClassName: "bg-[#34A853]/15 ring-[#34A853]/30",
    textClassName: "text-white",
  },
] as const;

export function StoreDownloadLinks() {
  return (
    <div className="fixed left-1/2 top-[4.75rem] z-[60] flex -translate-x-1/2 items-center gap-2 sm:top-[5.25rem] sm:gap-2.5">
      {storeLinks.map(
        ({
          href,
          label,
          title,
          icon: Icon,
          iconClassName,
          chipClassName,
          iconWrapClassName,
          textClassName,
        }) => (
          <a
            key={href}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            title={title}
            aria-label={title}
            className={`inline-flex items-center gap-2 rounded-2xl border px-2.5 py-2 shadow-xl shadow-black/30 backdrop-blur-sm transition sm:px-3 sm:py-2.5 ${chipClassName}`}
          >
            <span
              className={`flex h-8 w-8 items-center justify-center rounded-xl ring-1 ${iconWrapClassName}`}
            >
              {label === "Google Play" ? (
                <GooglePlayIcon className={iconClassName} />
              ) : (
                <Icon className={iconClassName} strokeWidth={2.25} />
              )}
            </span>
            <span className={`hidden text-sm font-semibold sm:inline ${textClassName}`}>
              {label}
            </span>
          </a>
        ),
      )}
    </div>
  );
}
