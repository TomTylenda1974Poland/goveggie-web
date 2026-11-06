import type { Ingredient, Noun, Unit } from "@/content/recipes";
import type { Locale, Localized } from "./commerce/types";

const UNIT_LABELS: Record<Locale, Record<Exclude<Unit, "g" | "ml">, [string, string]>> = {
  es: { cup: ["taza", "tazas"], tbsp: ["cda.", "cdas."], tsp: ["cdta.", "cdtas."], pinch: ["pizca", "pizcas"] },
  en: { cup: ["cup", "cups"], tbsp: ["tbsp", "tbsp"], tsp: ["tsp", "tsp"], pinch: ["pinch", "pinches"] },
};

const FRACTIONS: Record<number, string> = { 0.25: "¼", 0.5: "½", 0.75: "¾" };

const isNoun = (name: Localized | Noun): name is Noun => Array.isArray((name as Noun).es);

/** Redondea según la unidad: gramos/ml a 5 (o 1 si es poco), medidas caseras y unidades a ¼. */
export function roundQty(value: number, unit: Unit | null): number {
  if (unit === "g" || unit === "ml") {
    if (value >= 50) return Math.round(value / 5) * 5;
    return Math.max(1, Math.round(value));
  }
  return Math.max(0.25, Math.round(value * 4) / 4);
}

export function formatQty(value: number, unit: Unit | null): string {
  const v = roundQty(value, unit);
  if (unit === "g" || unit === "ml") return String(v);
  const whole = Math.floor(v);
  const frac = FRACTIONS[Math.round((v - whole) * 100) / 100];
  if (!frac) return String(whole);
  return whole === 0 ? frac : `${whole}${frac}`;
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

  const scaled = ing.qty * factor;
  const shown = roundQty(scaled, ing.unit);
  const qty = formatQty(scaled, ing.unit);

  if (ing.unit === null) {
    const name = isNoun(ing.name) ? ing.name[locale][shown > 1 ? 1 : 0] : ing.name[locale];
    return { qty, text: `${name}${note}${optional}` };
  }

  const alt = ing.alt
    ? ` (${formatQty(ing.alt.qty * factor, ing.alt.unit)} ${unitLabel(ing.alt.unit, roundQty(ing.alt.qty * factor, ing.alt.unit), locale)})`
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
