import type { Locale, Localized } from "@/lib/commerce/types";

const CONNECTORS = new Set(["de", "con", "y", "del", "al"]);

/**
 * Divide el nombre oficial como en la etiqueta: «PESTO» / «de CILANTRO con SEMILLAS DE AUYAMA».
 * Los conectores quedan en minúscula y el resto en mayúsculas.
 */
export function splitLabelName(name: string): { main: string; sub: string | null } {
  const words = name.trim().split(/\s+/);
  const cut = words.findIndex((w, i) => i > 0 && (w.toLowerCase() === "de" || w.toLowerCase() === "con"));
  if (cut === -1) return { main: name.toUpperCase(), sub: null };
  const main = words.slice(0, cut).join(" ").toUpperCase();
  const sub = words
    .slice(cut)
    .map((w) => (CONNECTORS.has(w.toLowerCase()) ? w.toLowerCase() : w.toUpperCase()))
    .join(" ");
  return { main, sub };
}

type Props = { name: Localized; locale: Locale; as?: "h1" | "h3" | "span"; size?: "card" | "page" };

/**
 * Nombre del producto con el sistema tipográfico de la etiqueta Palapa Verde.
 * El nombre oficial es el español (así va en el envase); en inglés se añade la traducción.
 */
export function ProductName({ name, locale, as: Tag = "span", size = "card" }: Props) {
  const { main, sub } = splitLabelName(name.es);
  return (
    <Tag className={`pname pname--${size}`}>
      <span className="pname-main">{main}</span>
      {sub ? <span className="pname-sub">{sub}</span> : null}
      {locale !== "es" && name[locale] !== name.es ? (
        <span className="pname-tr" lang={locale}>
          {name[locale]}
        </span>
      ) : null}
    </Tag>
  );
}
