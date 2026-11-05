import type { ArtKey, Localized, ProductImage } from "./types";

/**
 * Contenido de marca que vive en este repositorio, no en la API: imágenes
 * ilustrativas de cada producto y los vegetales protagonistas (del nombre).
 * Se cruza por `slug` con los datos comerciales de cualquier proveedor.
 * Las fotos reales que sirva la API de goveggie.life tienen prioridad.
 */
export type BrandContent = { art: ArtKey[]; images: ProductImage[] };

function illustration(slug: string, es: string, en: string): ProductImage {
  const alt: Localized = {
    es: `${es} en frasco Palapa Verde — imagen ilustrativa`,
    en: `${en} in a Palapa Verde jar — illustrative image`,
  };
  return { src: `/media/productos/${slug}.jpg`, alt, kind: "illustration", width: 1536, height: 1024 };
}

const entry = (slug: string, art: ArtKey[], es: string, en: string): [string, BrandContent] => [
  slug,
  { art, images: [illustration(slug, es, en)] },
];

export const BRAND_CONTENT: Readonly<Record<string, BrandContent>> = Object.fromEntries([
  entry("chutney-de-cilantro", ["cilantro"], "Chutney de cilantro", "Cilantro chutney"),
  entry(
    "pesto-de-cilantro-con-semillas-de-auyama",
    ["cilantro", "auyama"],
    "Pesto de cilantro con semillas de auyama",
    "Cilantro pesto with pumpkin seeds",
  ),
  entry("hummus-de-zanahoria", ["zanahoria"], "Hummus de zanahoria", "Carrot hummus"),
  entry("hummus-de-remolacha", ["remolacha"], "Hummus de remolacha", "Beet hummus"),
  entry("salsa-de-aguacate-y-jalapeno", ["aguacate", "jalapeno"], "Salsa de aguacate y jalapeño", "Avocado & jalapeño salsa"),
]);

export function brandContentFor(slug: string): BrandContent {
  const found = BRAND_CONTENT[slug];
  return found ? structuredClone(found) : { art: [], images: [] };
}

/** Fotos de vegetales de Go Veggie Life disponibles en el repositorio de la familia. */
export const PRODUCE_PHOTOS: Partial<Record<ArtKey, string>> = {
  cilantro: "/media/ingrediente-cilantro.jpg",
  zanahoria: "/media/ingrediente-zanahoria.jpg",
  aguacate: "/media/ingrediente-aguacate.jpg",
};
