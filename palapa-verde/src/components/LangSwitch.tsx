"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { MouseEvent } from "react";
import type { Locale } from "@/lib/commerce/types";

/** Cambia de idioma conservando la página, los parámetros (filtros, UTM) y el ancla. */
export function LangSwitch({ locale, label, text }: { locale: Locale; label: string; text: string }) {
  const pathname = usePathname() ?? `/${locale}`;
  const router = useRouter();
  const other: Locale = locale === "es" ? "en" : "es";
  const href = pathname.replace(/^\/(es|en)(?=\/|$)/, `/${other}`);

  function onClick(e: MouseEvent<HTMLAnchorElement>) {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    router.push(`${href}${window.location.search}${window.location.hash}`);
  }

  return (
    <Link className="lang" href={href} hrefLang={other} lang={other} aria-label={label} onClick={onClick}>
      {text}
    </Link>
  );
}
