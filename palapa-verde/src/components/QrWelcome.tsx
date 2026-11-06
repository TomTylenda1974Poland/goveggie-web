"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};
const fromQr = () => new URLSearchParams(window.location.search).get("utm_source") === "qr";

/** Saludo para quien llega desde el código QR del envase (sin cookies ni datos personales). */
export function QrWelcome({ text }: { text: string }) {
  const visible = useSyncExternalStore(subscribe, fromQr, () => false);
  if (!visible) return null;
  return (
    <p className="qr-welcome" role="status">
      {text}
    </p>
  );
}
