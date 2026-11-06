"use client";

import { useEffect } from "react";
import { track, type AnalyticsEvent, type EventProps } from "@/lib/analytics";

/** Envía un evento de vista una vez por carga de página (sin datos personales). */
export function TrackView({ event, props }: { event: AnalyticsEvent; props: EventProps }) {
  const key = JSON.stringify(props);
  useEffect(() => {
    track(event, JSON.parse(key) as EventProps);
  }, [event, key]);
  return null;
}
