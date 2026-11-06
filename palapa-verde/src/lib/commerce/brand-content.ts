import type { ArtKey, LaunchStatus, Localized, ProductImage } from "./types";

/**
 * Contenido editorial que vive en este repositorio, no en la API: imágenes
 * ilustrativas, vegetales protagonistas (del nombre), estado de lanzamiento,
 * ideas de uso y el identificador QR permanente. Se cruza por `slug` con los
 * datos comerciales de cualquier proveedor. Fotos reales de la API tienen prioridad.
 *
 * Para añadir un producto: ver docs/CONTENT_GUIDE.md.
 */
export type BrandContent = {
  art: ArtKey[];
  images: ProductImage[];
  launch: LaunchStatus;
  servingIdeas: Localized[];
  qrId: string | null;
};

function illustration(slug: string, es: string, en: string): ProductImage {
  const alt: Localized = {
    es: `${es} en envase Palapa Verde — imagen ilustrativa`,
    en: `${en} in Palapa Verde packaging — illustrative image`,
  };
  return { src: `/media/productos/${slug}.jpg`, alt, kind: "illustration", width: 1536, height: 1024 };
}

const idea = (es: string, en: string): Localized => ({ es, en });

export const BRAND_CONTENT: Readonly<Record<string, BrandContent>> = {
  "chutney-de-cilantro": {
    art: ["cilantro"],
    images: [illustration("chutney-de-cilantro", "Chutney de cilantro", "Cilantro chutney")],
    launch: "concept",
    qrId: "chutney-cilantro",
    servingIdeas: [
      idea("Con yuca hervida o frita y cebolla.", "With boiled or fried yuca and onions."),
      idea("Untado en sándwiches de pollo o de queso.", "Spread on chicken or cheese sandwiches."),
      idea("Al lado de huevos, arroz o carnes a la plancha.", "Next to eggs, rice or grilled meat."),
    ],
  },
  "pesto-de-cilantro-con-semillas-de-auyama": {
    art: ["cilantro", "auyama"],
    images: [
      illustration(
        "pesto-de-cilantro-con-semillas-de-auyama",
        "Pesto de cilantro con semillas de auyama",
        "Cilantro pesto with pumpkin seeds",
      ),
    ],
    launch: "concept",
    qrId: "pesto-cilantro-auyama",
    servingIdeas: [
      idea("Sobre huevos revueltos y pan tostado.", "On scrambled eggs and toast."),
      idea("Mezclado con pasta caliente y un poco de su agua.", "Tossed with hot pasta and a splash of its water."),
      idea("Sobre auyama, berenjena u otros vegetales asados.", "Over roasted pumpkin, eggplant or other vegetables."),
    ],
  },
  "hummus-de-zanahoria": {
    art: ["zanahoria"],
    images: [illustration("hummus-de-zanahoria", "Hummus de zanahoria", "Carrot hummus")],
    launch: "concept",
    qrId: "hummus-zanahoria",
    servingIdeas: [
      idea("En una picadera con vegetales crudos y casabe.", "On a snack board with raw vegetables and cassava bread."),
      idea("Untado en wraps y sándwiches.", "Spread in wraps and sandwiches."),
      idea("Al lado de arroz o vegetales asados.", "Next to rice or roasted vegetables."),
    ],
  },
  "hummus-de-remolacha": {
    art: ["remolacha"],
    images: [illustration("hummus-de-remolacha", "Hummus de remolacha", "Beet hummus")],
    launch: "concept",
    qrId: "hummus-remolacha",
    servingIdeas: [
      idea("Sobre casabe o pan tostado con aguacate.", "On cassava bread or toast with avocado."),
      idea("Como base de un bowl de arroz y vegetales.", "As the base of a rice and vegetable bowl."),
      idea("En una picadera con pepino y zanahoria.", "On a snack board with cucumber and carrot."),
    ],
  },
  "salsa-de-aguacate-y-jalapeno": {
    art: ["aguacate", "jalapeno"],
    images: [illustration("salsa-de-aguacate-y-jalapeno", "Salsa de aguacate y jalapeño", "Avocado & jalapeño salsa")],
    launch: "concept",
    qrId: "salsa-aguacate-jalapeno",
    servingIdeas: [
      idea("En tacos de pescado o de pollo.", "In fish or chicken tacos."),
      idea("Con tostones o plátano frito.", "With tostones or fried plantain."),
      idea("Sobre arroz, huevos o carnes a la plancha.", "Over rice, eggs or grilled meat."),
    ],
  },
};

const EMPTY: BrandContent = { art: [], images: [], launch: "concept", servingIdeas: [], qrId: null };

export function brandContentFor(slug: string): BrandContent {
  const found = BRAND_CONTENT[slug];
  return structuredClone(found ?? EMPTY);
}

/** Fotos de vegetales de Go Veggie Life disponibles en el repositorio de la familia. */
export const PRODUCE_PHOTOS: Partial<Record<ArtKey, string>> = {
  cilantro: "/media/ingrediente-cilantro.jpg",
  zanahoria: "/media/ingrediente-zanahoria.jpg",
  aguacate: "/media/ingrediente-aguacate.jpg",
};
