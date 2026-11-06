"use client";

import { Analytics, type BeforeSendEvent } from "@vercel/analytics/next";
import { usePathname } from "next/navigation";

/** Next sends public page views only. Custom actions stay in the separate dataLayer. */
export function SiteAnalytics({ paths }: { paths: string[] }) {
  const pathname = usePathname();
  if (typeof window === "undefined" || !pathname || !paths.includes(pathname)) return null;
  if (navigator.doNotTrack === "1" || (navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl) {
    return null;
  }

  function beforeSend(event: BeforeSendEvent): BeforeSendEvent | null {
    if (event.type !== "pageview") return null;
    try {
      const url = new URL(event.url, location.origin);
      if (url.origin !== location.origin || url.pathname !== location.pathname || !paths.includes(url.pathname)) return null;

      // The provider forwards document.referrer separately. An external referrer
      // containing more than its origin cannot be redacted with beforeSend.
      if (document.referrer) {
        const referrer = new URL(document.referrer);
        if (referrer.origin !== location.origin && referrer.href !== referrer.origin + "/") return null;
      }
      return { type: "pageview", url: url.origin + url.pathname };
    } catch {
      return null;
    }
  }

  return <Analytics beforeSend={beforeSend} debug={false} />;
}
