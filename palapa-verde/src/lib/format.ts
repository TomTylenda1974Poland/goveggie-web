import type { Locale, Money } from "./commerce/types";

const formatters = new Map<Locale, Intl.NumberFormat>();

export function formatMoney(money: Money, locale: Locale): string {
  let f = formatters.get(locale);
  if (!f) {
    f = new Intl.NumberFormat(locale === "es" ? "es-DO" : "en-US", {
      style: "currency",
      currency: money.currency,
      currencyDisplay: "symbol",
    });
    formatters.set(locale, f);
  }
  return f.format(money.amountMinor / 100);
}

/**
 * Las fotos que sirva la API de goveggie.life vienen de otro dominio: se muestran
 * sin el optimizador de Next.js para no depender de `images.remotePatterns`.
 */
export function isRemote(src: string): boolean {
  return /^https?:\/\//i.test(src);
}
