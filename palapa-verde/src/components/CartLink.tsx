"use client";

import Link from "next/link";
import { itemCount } from "@/lib/cart/cart";
import { useCart } from "@/lib/cart/store";

export function CartLink({ href, label }: { href: string; label: string }) {
  const count = itemCount(useCart());
  return (
    <Link className="btn cart-link" href={href}>
      {label}
      <span className="cart-count" aria-live="polite">
        {count > 0 ? <span>{count}</span> : null}
      </span>
    </Link>
  );
}
