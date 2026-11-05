"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Locale } from "@/lib/commerce/types";

export function LangSwitch({ locale, label, text }: { locale: Locale; label: string; text: string }) {
  const pathname = usePathname() ?? `/${locale}`;
  const other: Locale = locale === "es" ? "en" : "es";
  const href = pathname.replace(/^\/(es|en)(?=\/|$)/, `/${other}`);
  return (
    <Link className="lang" href={href} hrefLang={other} lang={other} aria-label={label}>
      {text}
    </Link>
  );
}
