import { MAX_QUANTITY_PER_LINE } from "../commerce/validation";
import type { Money, Product } from "../commerce/types";

/** El carrito solo guarda qué y cuánto; precios y nombres se leen siempre del proveedor. */
export type CartItem = { productId: string; quantity: number };
export type Cart = { items: CartItem[] };

export const EMPTY_CART: Cart = { items: [] };

const clamp = (n: number, max: number) => Math.max(0, Math.min(Math.floor(n), max));

/** Límite efectivo de una línea: el menor entre el máximo por pedido y las existencias. */
export function lineLimit(stock: number | undefined): number {
  return stock === undefined ? MAX_QUANTITY_PER_LINE : Math.min(MAX_QUANTITY_PER_LINE, Math.max(0, stock));
}

export function setQuantity(cart: Cart, productId: string, quantity: number, stock?: number): Cart {
  const q = clamp(quantity, lineLimit(stock));
  const rest = cart.items.filter((i) => i.productId !== productId);
  if (q === 0) return { items: rest };
  const exists = cart.items.some((i) => i.productId === productId);
  return {
    items: exists
      ? cart.items.map((i) => (i.productId === productId ? { productId, quantity: q } : i))
      : [...cart.items, { productId, quantity: q }],
  };
}

export function addItem(cart: Cart, productId: string, quantity: number, stock?: number): Cart {
  const current = cart.items.find((i) => i.productId === productId)?.quantity ?? 0;
  return setQuantity(cart, productId, current + quantity, stock);
}

export function removeItem(cart: Cart, productId: string): Cart {
  return { items: cart.items.filter((i) => i.productId !== productId) };
}

export function itemCount(cart: Cart): number {
  return cart.items.reduce((n, i) => n + i.quantity, 0);
}

export type CartTotals = {
  /** `null` si falta el precio de algún producto del carrito. */
  total: Money | null;
  /** Suma de las líneas con precio conocido. */
  knownSubtotal: Money;
  pricedLines: number;
  unpricedLines: number;
};

export function cartTotals(cart: Cart, products: readonly Pick<Product, "id" | "price">[]): CartTotals {
  let known = 0;
  let priced = 0;
  let unpriced = 0;
  for (const item of cart.items) {
    const price = products.find((p) => p.id === item.productId)?.price ?? null;
    if (price === null) {
      unpriced++;
    } else {
      priced++;
      known += price.amountMinor * item.quantity;
    }
  }
  const knownSubtotal: Money = { amountMinor: known, currency: "DOP" };
  return { total: unpriced === 0 ? knownSubtotal : null, knownSubtotal, pricedLines: priced, unpricedLines: unpriced };
}

/** Lee un carrito guardado sin confiar en su forma. */
export function parseStoredCart(raw: string | null): Cart {
  if (!raw) return EMPTY_CART;
  try {
    const data: unknown = JSON.parse(raw);
    if (typeof data !== "object" || data === null || !Array.isArray((data as Cart).items)) return EMPTY_CART;
    let cart = EMPTY_CART;
    for (const item of (data as Cart).items) {
      if (
        typeof item === "object" &&
        item !== null &&
        typeof item.productId === "string" &&
        typeof item.quantity === "number" &&
        Number.isFinite(item.quantity)
      ) {
        cart = addItem(cart, item.productId, item.quantity);
      }
    }
    return cart;
  } catch {
    return EMPTY_CART;
  }
}
