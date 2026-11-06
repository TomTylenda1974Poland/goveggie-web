"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import type { Locale } from "@/lib/commerce/types";
import styles from "./MobileNavigation.module.css";

type Props = { links: [string, string][]; label: string; locale: Locale };

export function MobileNavigation({ links, label, locale }: Props) {
  const disclosure = useRef<HTMLDetailsElement>(null);
  const summary = useRef<HTMLElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    function closeOutside(event: PointerEvent) {
      const panel = disclosure.current;
      if (panel?.open && event.target instanceof Node && !panel.contains(event.target)) panel.open = false;
    }
    document.addEventListener("pointerdown", closeOutside);
    return () => document.removeEventListener("pointerdown", closeOutside);
  }, []);

  return (
    <details
      className={styles.menu}
      ref={disclosure}
      onBlur={event => {
        if (event.relatedTarget && !event.currentTarget.contains(event.relatedTarget)) event.currentTarget.open = false;
      }}
      onKeyDown={event => {
        if (event.key !== "Escape" || !event.currentTarget.open) return;
        event.preventDefault();
        event.currentTarget.open = false;
        summary.current?.focus();
      }}
    >
      <summary className={styles.trigger} ref={summary}>{locale === "es" ? "Menú" : "Menu"}</summary>
      <nav className={styles.links} aria-label={label}>
        {links.map(([href, name]) => (
          <Link
            key={href}
            href={href}
            aria-current={pathname === href ? "page" : undefined}
            onNavigate={() => { if (disclosure.current) disclosure.current.open = false; }}
          >
            {name}
          </Link>
        ))}
      </nav>
    </details>
  );
}
