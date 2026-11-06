import type { Ingredient, Noun, Unit } from "@/content/recipes";
import type { Locale, Localized } from "./commerce/types";

const UNIT_LABELS: Record<Locale, Record<Exclude<Unit, "g" | "ml">, [string, string]>> = {
  es: { cup: ["taza", "tazas"], tbsp: ["cda.", "cdas."], tsp: ["cdta.", "cdtas."], pinch: ["pizca", "pizcas"] },
  en: { cup: ["cup", "cups"], tbsp: ["tbsp", "tbsp"], tsp: ["tsp", "tsp"], pinch: ["pinch", "pinches"] },
};

const FRACTIONS = new Map<number, string>([
  [1 / 8, "⅛"], [1 / 4, "¼"], [3 / 8, "⅜"], [1 / 2, "½"], [5 / 8, "⅝"], [3 / 4, "¾"], [7 / 8, "⅞"],
  [1 / 3, "⅓"], [2 / 3, "⅔"],
]);

const isNoun = (name: Localized | Noun): name is Noun => Array.isArray((name as Noun).es);

/** Metric quantities use tenths; household measures retain enough precision for scaled teaspoons. */
export function roundQty(value: number, unit: Unit | null): number {
  const precision = unit === "g" || unit === "ml" ? 10 : 1000;
  return Math.round(value * precision) / precision;
}

export function formatQty(value: number, unit: Unit | null, locale: Locale = "es"): string {
  if (unit !== "g" && unit !== "ml") {
    const whole = Math.floor(value);
    const remainder = value - whole;
    const fraction = [...FRACTIONS.entries()].find(([n]) => Math.abs(remainder - n) < 0.000001);
    if (fraction) return whole === 0 ? fraction[1] : `${whole}${fraction[1]}`;
    // Very small kitchen measures such as half of ⅛ tsp are clearer as fractions.
    for (const denominator of [12, 16, 24, 32]) {
      const numerator = Math.round(remainder * denominator);
      if (numerator > 0 && numerator < denominator && Math.abs(remainder - numerator / denominator) < 0.000001) {
        return `${whole ? `${whole} ` : ""}${numerator}/${denominator}`;
      }
    }
  }
  return new Intl.NumberFormat(locale === "es" ? "es-DO" : "en", { maximumFractionDigits: 3, useGrouping: false }).format(roundQty(value, unit));
}

function unitLabel(unit: Unit, qty: number, locale: Locale): string {
  if (unit === "g" || unit === "ml") return unit;
  const [one, many] = UNIT_LABELS[locale][unit];
  return qty > 1 ? many : one;
}

export type IngredientLine = { qty: string | null; text: string };

/** Línea de ingrediente escalada por `factor` (porciones elegidas / porciones base). */
export function ingredientLine(ing: Ingredient, factor: number, locale: Locale): IngredientLine {
  const optional = ing.optional ? (locale === "es" ? " (opcional)" : " (optional)") : "";
  const note = ing.note ? `, ${ing.note[locale]}` : "";

  if (ing.qty === null) {
    const name = isNoun(ing.name) ? ing.name[locale][1] : ing.name[locale];
    const toTaste = locale === "es" ? "al gusto" : "to taste";
    return { qty: null, text: `${capitalize(name)}, ${toTaste}${note}${optional}` };
  }

  const scale = ing.scale === "per-pan" ? 1 : factor;
  const scaled = ing.qty * scale;
  const shown = roundQty(scaled, ing.unit);
  const qty = formatQty(scaled, ing.unit, locale);

  if (ing.unit === null) {
    const name = isNoun(ing.name) ? ing.name[locale][shown > 1 ? 1 : 0] : ing.name[locale];
    return { qty, text: `${name}${note}${optional}` };
  }

  const alt = ing.alt
    ? ` (${formatQty(ing.alt.qty * scale, ing.alt.unit, locale)} ${unitLabel(ing.alt.unit, roundQty(ing.alt.qty * scale, ing.alt.unit), locale)})`
    : "";
  const name = isNoun(ing.name) ? ing.name[locale][1] : ing.name[locale];
  const of = locale === "es" ? "de " : "";
  return { qty: `${qty} ${unitLabel(ing.unit, shown, locale)}`, text: `${alt ? alt.trim() + " " : ""}${of}${name}${note}${optional}` };
}

export function ingredientText(ing: Ingredient, factor: number, locale: Locale): string {
  const line = ingredientLine(ing, factor, locale);
  return line.qty ? `${line.qty} ${line.text}` : line.text;
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/** Enlace de WhatsApp iniciado por el usuario. Solo texto público: título, lista y URL. */
export function whatsappShareUrl(text: string): string {
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}

/** Duración ISO-8601 para datos estructurados (solo recetas probadas). */
export function isoDuration(minutes: number): string {
  return `PT${minutes}M`;
}
