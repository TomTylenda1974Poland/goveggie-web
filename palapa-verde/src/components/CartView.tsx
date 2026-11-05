"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { ProductThumb } from "@/components/ProductThumb";
import { cartTotals, lineLimit, removeItem, setQuantity } from "@/lib/cart/cart";
import { updateCart, useCart } from "@/lib/cart/store";
import type { Locale, Order, Product } from "@/lib/commerce/types";
import { formatMoney } from "@/lib/format";
import { fill, type Dictionary } from "@/lib/i18n";

type CartProduct = Pick<Product, "id" | "slug" | "name" | "price" | "images" | "art">;

type Props = {
  locale: Locale;
  products: CartProduct[];
  stock: Record<string, number>;
  isTestData: boolean;
  t: Dictionary["cart"];
};

type Status =
  | { kind: "idle" }
  | { kind: "sending" }
  | { kind: "error"; message: string }
  | { kind: "done"; order: Order };

export function CartView({ locale, products, stock, isTestData, t }: Props) {
  const cart = useCart();
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const byId = new Map(products.map((p) => [p.id, p]));
  const totals = cartTotals(cart, products);

  if (status.kind === "done") {
    return (
      <section className="panel pad" aria-live="polite">
        <h2 className="h-md">{t.successTitle}</h2>
        <p className="lead">{fill(t.successText, { id: status.order.id })}</p>
        <Link className="btn arrow" href={`/${locale}/productos`}>
          {t.continue}
        </Link>
      </section>
    );
  }

  if (cart.items.length === 0) {
    return (
      <section className="panel pad">
        <p className="lead">{t.empty}</p>
        <Link className="btn arrow" href={`/${locale}/productos`}>
          {t.continue}
        </Link>
      </section>
    );
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setStatus({ kind: "sending" });
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          locale,
          lines: cart.items.filter((i) => byId.has(i.productId)),
          customer: { name: form.get("name"), phone: form.get("phone"), email: form.get("email") },
          notes: form.get("notes"),
        }),
      });
      const data: { order?: Order; error?: { code?: string; message?: string } } = await res.json();
      if (res.ok && data.order) {
        updateCart(() => ({ items: [] }));
        setStatus({ kind: "done", order: data.order });
      } else {
        setStatus({
          kind: "error",
          message: data.error?.code === "OUT_OF_STOCK" ? t.errorStock : `${t.error} ${data.error?.message ?? ""}`.trim(),
        });
      }
    } catch {
      setStatus({ kind: "error", message: t.error });
    }
  }

  return (
    <div className="cart-grid">
      <section className="panel" aria-label={t.title}>
        <ul className="cart-lines">
          {cart.items.map((item) => {
            const product = byId.get(item.productId);
            if (!product) {
              return (
                <li key={item.productId} className="cart-line">
                  <span className="note">{t.unknownItem}</span>
                  <button type="button" className="link-btn" onClick={() => updateCart((c) => removeItem(c, item.productId))}>
                    {t.remove}
                  </button>
                </li>
              );
            }
            const available = stock[product.id];
            const limit = lineLimit(available);
            return (
              <li key={item.productId} className="cart-line">
                <ProductThumb product={product} />
                <div className="cart-line-main">
                  <Link href={`/${locale}/productos/${product.slug}`} className="cart-line-name">
                    {product.name[locale]}
                  </Link>
                  <span className="note">{product.price ? formatMoney(product.price, locale) : t.totalPending}</span>
                  {available !== undefined && item.quantity >= available ? (
                    <span className="note">{fill(t.stockLimited, { n: available })}</span>
                  ) : null}
                </div>
                <div className="stepper" role="group" aria-label={`${t.quantity}: ${product.name[locale]}`}>
                  <button
                    type="button"
                    aria-label={t.decrease}
                    onClick={() => updateCart((c) => setQuantity(c, product.id, item.quantity - 1, available))}
                  >
                    −
                  </button>
                  <output>{item.quantity}</output>
                  <button
                    type="button"
                    aria-label={t.increase}
                    disabled={item.quantity >= limit}
                    onClick={() => updateCart((c) => setQuantity(c, product.id, item.quantity + 1, available))}
                  >
                    +
                  </button>
                </div>
                <span className="cart-line-total">
                  {product.price ? formatMoney({ ...product.price, amountMinor: product.price.amountMinor * item.quantity }, locale) : "—"}
                </span>
                <button type="button" className="link-btn" onClick={() => updateCart((c) => removeItem(c, product.id))}>
                  {t.remove}
                </button>
              </li>
            );
          })}
        </ul>
        <div className="cart-total">
          <span>{t.total}</span>
          <strong>{totals.total ? formatMoney(totals.total, locale) : t.totalPending}</strong>
        </div>
        {totals.total === null ? <p className="note pad-x">{t.totalPendingNote}</p> : null}
      </section>

      <section className="panel pad">
        <h2 className="h-md">{t.checkoutTitle}</h2>
        {isTestData ? <p className="notice">{t.testMode}</p> : null}
        <form className="form" onSubmit={submit}>
          <label>
            {t.name}
            <input name="name" required maxLength={120} autoComplete="name" />
          </label>
          <label>
            {t.phone}
            <input name="phone" required type="tel" maxLength={40} autoComplete="tel" pattern="[+0-9][0-9 ().\-]{6,}" />
          </label>
          <label>
            {t.email}
            <input name="email" type="email" maxLength={200} autoComplete="email" />
          </label>
          <label>
            {t.notes}
            <textarea name="notes" rows={3} maxLength={1000} />
          </label>
          <p className="note">{t.payments}</p>
          {status.kind === "error" ? (
            <p className="error" role="alert">
              {status.message}
            </p>
          ) : null}
          <button className="btn" type="submit" disabled={status.kind === "sending"}>
            {status.kind === "sending" ? t.sending : t.submit}
          </button>
        </form>
      </section>
    </div>
  );
}
