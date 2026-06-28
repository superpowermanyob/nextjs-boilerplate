"use client";

import { useEffect, useRef } from "react";

const ADSENSE_CLIENT = "ca-pub-3255200122193250";

type AdBannerProps = {
  dataAdSlot: string;
  dataAdFormat?: string;
  dataAdLayout?: string;
  dataFullWidthResponsive?: boolean;
  className?: string;
};

declare global {
  interface Window {
    adsbygoogle?: Record<string, unknown>[];
  }
}

export function AdBanner({
  dataAdSlot,
  dataAdFormat = "auto",
  dataAdLayout,
  dataFullWidthResponsive = true,
  className,
}: AdBannerProps) {
  const insRef = useRef<HTMLModElement>(null);

  useEffect(() => {
    const element = insRef.current;
    if (!element || element.getAttribute("data-adsbygoogle-status")) {
      return;
    }

    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (error) {
      console.error("[AdBanner] Failed to load ad slot:", dataAdSlot, error);
    }
  }, [dataAdSlot]);

  return (
    <div className={className}>
      <ins
        ref={insRef}
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={dataAdSlot}
        data-ad-format={dataAdFormat}
        {...(dataAdLayout ? { "data-ad-layout": dataAdLayout } : {})}
        {...(dataFullWidthResponsive ? { "data-full-width-responsive": "true" } : {})}
      />
    </div>
  );
}
