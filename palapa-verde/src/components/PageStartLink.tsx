"use client";

import type { ComponentPropsWithoutRef, MouseEvent } from "react";

type Props = Omit<ComponentPropsWithoutRef<"a">, "href"> & { href: string };

/** A section entrance opens a new document at its start. Back retains the old page position. */
export function PageStartLink({ href, children, ...props }: Props) {
  function navigate(event: MouseEvent<HTMLAnchorElement>) {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const panel = event.currentTarget.closest("details");
    if (panel) panel.open = false;
    if (event.currentTarget.href === window.location.href) {
      event.preventDefault();
      panel?.querySelector("summary")?.focus({ preventScroll: true });
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  }

  return <a {...props} href={href} onClick={navigate}>{children}</a>;
}
