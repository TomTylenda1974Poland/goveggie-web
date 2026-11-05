"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { addItem, lineLimit } from "@/lib/cart/cart";
import { updateCart, useCart } from "@/lib/cart/store";

type Props = {
  productId: string;
  /** Existencias; `undefined` si se desconocen. */
  stock: number | undefined;
  cartHref: string;
  labels: { quantity: string; addToCart: string; added: string; unavailable: string; cart: string; decrease: string; increase: string };
};

export function AddToCart({ productId, stock, cartHref, labels }: Props) {
  const cart = useCart();
  const inCart = cart.items.find((i) => i.productId === productId)?.quantity ?? 0;
  const room = Math.max(0, lineLimit(stock) - inCart);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!added) return;
    const timer = setTimeout(() => setAdded(false), 2500);
    return () => clearTimeout(timer);
  }, [added]);

  const q = Math.min(quantity, Math.max(room, 1));

  if (stock === 0) {
    return (
      <button className="btn" type="button" disabled>
        {labels.unavailable}
      </button>
    );
  }

  return (
    <div className="add-to-cart">
      <div className="stepper" role="group" aria-label={labels.quantity}>
        <button type="button" onClick={() => setQuantity(Math.max(1, q - 1))} disabled={q <= 1} aria-label={labels.decrease}>
          −
        </button>
        <output aria-live="polite">{q}</output>
        <button type="button" onClick={() => setQuantity(q + 1)} disabled={q >= room} aria-label={labels.increase}>
          +
        </button>
      </div>
      <button
        className="btn"
        type="button"
        disabled={room === 0}
        onClick={() => {
          updateCart((c) => addItem(c, productId, q, stock));
          setQuantity(1);
          setAdded(true);
        }}
      >
        {room === 0 ? labels.unavailable : labels.addToCart}
      </button>
      <p className="add-note" role="status">
        {added ? (
          <>
            {labels.added} · <Link href={cartHref}>{labels.cart} →</Link>
          </>
        ) : null}
      </p>
    </div>
  );
}
