import type { Money, OrderLineResult } from "./types";

/** Suma de líneas; `null` si alguna línea no tiene precio todavía. */
export function orderTotal(lines: readonly OrderLineResult[]): Money | null {
  let amountMinor = 0;
  for (const line of lines) {
    if (line.unitPrice === null) return null;
    amountMinor += line.unitPrice.amountMinor * line.quantity;
  }
  return { amountMinor, currency: "DOP" };
}
