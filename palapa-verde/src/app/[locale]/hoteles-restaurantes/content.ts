import type { Locale } from "@/lib/commerce/types";

type KitchenCopy = {
  title: string;
  intro: string;
  inquiry: string;
  explore: string;
  imageAlt: string;
  imageCaption: string;
  restaurant: { title: string; text: string };
  hotel: { title: string; text: string };
  range: string;
  rangeIntro: string;
  rows: { brand: string; product: string; format: string; use: string }[];
};

export const kitchenCopy: Record<Locale, KitchenCopy> = {
  es: {
    title: "Hoteles y restaurantes",
    intro: "Vegetales frescos de Go Veggie Life y preparaciones de Palapa Verde. Explore los formatos de prueba según lo que consume su cocina por servicio.",
    inquiry: "Preparar mi consulta",
    explore: "Ver formatos de prueba",
    imageAlt: "Hummus servido con cuchara en una mesa de trabajo junto a vegetales frescos.",
    imageCaption: "Propuesta de uso en cocina · Imagen ilustrativa",
    restaurant: {
      title: "Cocina a la carta",
      text: "Para un sándwich o un plato por encargo, pruebe un formato que pueda utilizar durante un turno. Pese lo que sobra al terminar.",
    },
    hotel: {
      title: "Bufé y banquetes",
      text: "Para un desayuno o un evento, calcule cuántas porciones necesitará por tanda. Compare un envase grande con varios pequeños para reponer el bufé.",
    },
    range: "Formatos para probar",
    rangeIntro: "Estas son propuestas para una prueba de cocina. El formato final, la disponibilidad y la entrega se confirman al cotizar.",
    rows: [
      { brand: "Palapa Verde", product: "Hummus de zanahoria o de remolacha", format: "500 g · 1 kg", use: "Envase apilable con tapa. Pruebe 500 g para la carta y 1 kg para reponer el bufé por tandas." },
      { brand: "Palapa Verde", product: "Pesto de cilantro con semillas de auyama o chutney de cilantro", format: "500 g", use: "Envase de boca ancha con tapa para servir con cuchara y medir la cantidad por plato." },
      { brand: "Palapa Verde", product: "Salsa de aguacate y jalapeño", format: "500 g", use: "Bolsa sellada para la estación de tacos o sándwiches. El envase y su desempeño al abrirlo están en evaluación." },
      { brand: "Go Veggie Life", product: "Vegetales frescos", format: "Por caja o por peso", use: "Indique el vegetal, la unidad y el consumo semanal. Una primera prueba puede ser una bolsa de 5 lb de zanahorias enteras." },
    ],
  },
  en: {
    title: "Hotels & restaurants",
    intro: "Fresh produce from Go Veggie Life and prepared foods from Palapa Verde. Explore trial packs based on how much your kitchen uses per service.",
    inquiry: "Prepare my enquiry",
    explore: "Explore trial packs",
    imageAlt: "Hummus with a serving spoon on a kitchen worktop beside fresh vegetables.",
    imageCaption: "Kitchen serving suggestion · Illustrative image",
    restaurant: {
      title: "À la carte service",
      text: "For sandwiches or dishes made to order, test a pack your team can use in one shift. Weigh what is left at the end of service.",
    },
    hotel: {
      title: "Buffets & banquets",
      text: "For breakfast or an event, estimate portions for each round of service. Compare one larger tub with several smaller packs for buffet refills.",
    },
    range: "Packs for a kitchen trial",
    rangeIntro: "These are proposals for kitchen trials. Final pack size, availability and delivery are confirmed when quoting.",
    rows: [
      { brand: "Palapa Verde", product: "Carrot or beet hummus", format: "500 g · 1 kg", use: "Stackable tub with a lid. Try 500 g for à la carte service or 1 kg for buffet refills." },
      { brand: "Palapa Verde", product: "Cilantro and pumpkin seed pesto or cilantro chutney", format: "500 g", use: "Wide-mouth tub with a lid for spooning out a measured amount per dish." },
      { brand: "Palapa Verde", product: "Avocado & jalapeño salsa", format: "500 g", use: "Sealed pouch for a taco or sandwich station. The pack and how it performs once opened are under evaluation." },
      { brand: "Go Veggie Life", product: "Fresh produce", format: "By case or weight", use: "Specify the vegetable, unit and weekly usage. A 5 lb bag of whole carrots is one possible starting point." },
    ],
  },
};
