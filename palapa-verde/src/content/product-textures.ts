import type { Localized } from "@/lib/commerce/types";

const descriptions: Record<string, Localized> = {
  "hummus-de-zanahoria": {
    es: "Una cucharada de hummus naranja de zanahoria sobre un plato.",
    en: "A spoonful of orange carrot hummus over a small dish.",
  },
  "hummus-de-remolacha": {
    es: "Una cuchara deja un surco en el hummus de remolacha de color intenso.",
    en: "A spoon leaves a ridge in the deep red beet hummus.",
  },
  "pesto-de-cilantro-con-semillas-de-auyama": {
    es: "Una cuchara levanta pesto verde con cilantro y semillas de auyama.",
    en: "A spoon lifts green pesto with cilantro and pumpkin seeds.",
  },
  "chutney-de-cilantro": {
    es: "Una cucharada de chutney verde junto a una ramita de cilantro.",
    en: "A spoonful of green chutney beside a sprig of cilantro.",
  },
  "salsa-de-aguacate-y-jalapeno": {
    es: "Salsa verde de aguacate en una cuchara junto a una rodaja de jalapeño.",
    en: "Green avocado salsa on a spoon beside a slice of jalapeño.",
  },
};

export function productTexture(slug: string, locale: keyof Localized) {
  const alt = descriptions[slug]?.[locale];
  return alt ? { src: `/media/texturas/${slug}.webp`, alt } : null;
}
