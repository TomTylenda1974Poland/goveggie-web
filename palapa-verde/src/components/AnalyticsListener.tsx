"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { EVENTS, readUtm, track, type AnalyticsEvent, type EventProps } from "@/lib/analytics";

const KNOWN = new Set<string>(EVENTS);

/**
 * - Visitas con UTM: `qr_visit` (utm_source=qr) o `campaign_visit` (resto).
 * - Clics en cualquier elemento con `data-track="evento"`; los `data-track-*`
 *   se envían como propiedades (solo identificadores de contenido).
 */
export function AnalyticsListener() {
  const pathname = usePathname();

  useEffect(() => {
    const utm = readUtm(window.location.search);
    if (!utm.utm_source) return;
    track(utm.utm_source === "qr" ? "qr_visit" : "campaign_visit", { path: pathname ?? "", ...utm });
  }, [pathname]);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      const el = (e.target as Element | null)?.closest<HTMLElement>("[data-track]");
      const name = el?.dataset.track;
      if (!el || !name || !KNOWN.has(name)) return;
      const props: EventProps = {};
      for (const [key, value] of Object.entries(el.dataset)) {
        if (key.startsWith("track") && key !== "track" && value) {
          props[key.slice(5, 6).toLowerCase() + key.slice(6)] = value;
        }
      }
      track(name as AnalyticsEvent, props);
    }
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}
