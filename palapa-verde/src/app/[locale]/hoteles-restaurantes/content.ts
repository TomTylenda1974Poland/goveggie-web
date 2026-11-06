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
  produceHeading: string;
  produceText: string;
  produceCta: string;
};

/**
 * Copy for the hotels and restaurants page. Formats are proposals: no sizes, weights or prices
 * until the owner confirms them (see docs/APPROVAL_CHECKLIST.md, item 17). A test enforces this.
 */
export const kitchenCopy: Record<Locale, KitchenCopy> = {
  es: {
    title: "Hoteles y restaurantes",
    intro:
      "Vegetales frescos de Go Veggie Life y preparaciones de Palapa Verde para cocinas profesionales. Los formatos para cocina están en desarrollo; cuéntanos qué consume tu cocina y los preparamos contigo.",
    inquiry: "Preparar mi consulta",
    explore: "Ver formatos propuestos",
    imageAlt: "Hummus de zanahoria servido con cuchara en una mesa de trabajo junto a vegetales frescos.",
    imageCaption: "Propuesta de uso en cocina · Imagen ilustrativa",
    restaurant: {
      title: "Cocina a la carta",
      text: "Para un sándwich o un plato por encargo, conviene un formato que tu equipo use durante un turno. Pesa lo que sobra al terminar y ajustamos el tamaño.",
    },
    hotel: {
      title: "Bufé y banquetes",
      text: "Para un desayuno o un evento, calcula cuántas porciones necesitas por tanda. Compara un envase grande con varios pequeños para reponer el bufé.",
    },
    range: "Qué formato para cada producto",
    rangeIntro:
      "Propuestas para una prueba en cocina. El formato final, el contenido, la disponibilidad y la entrega se confirman al cotizar.",
    rows: [
      {
        brand: "Palapa Verde",
        product: "Hummus de zanahoria o de remolacha",
        format: "Envase grande o extra grande",
        use: "Envase apilable con tapa para la carta o para reponer el bufé por tandas.",
      },
      {
        brand: "Palapa Verde",
        product: "Pesto de cilantro con semillas de auyama o chutney de cilantro",
        format: "Envase de boca ancha · botella dosificadora",
        use: "Para servir con cuchara y medir la cantidad por plato, o para dosificar al emplatar.",
      },
      {
        brand: "Palapa Verde",
        product: "Salsa de aguacate y jalapeño",
        format: "Bolsa sellada · porción individual",
        use: "Para la estación de tacos o sándwiches. El envase y su desempeño al abrirlo están en evaluación.",
      },
      {
        brand: "Go Veggie Life",
        product: "Vegetales, frutas y hierbas frescas",
        format: "Por caja o por peso",
        use: "Indica el vegetal, la unidad y el consumo semanal; acordamos el formato con tu cocina.",
      },
    ],
    produceHeading: "¿Necesitas también frutas, vegetales y hierbas frescas?",
    produceText: "Go Veggie Life distribuye frutas, vegetales y hierbas frescas. Consulta sus formatos para cocinas profesionales.",
    produceCta: "Go Veggie Life para hoteles y restaurantes",
  },
  en: {
    title: "Hotels & restaurants",
    intro:
      "Fresh produce from Go Veggie Life and prepared foods from Palapa Verde for professional kitchens. Kitchen formats are in development; tell us what your kitchen uses and we will shape them with you.",
    inquiry: "Prepare my enquiry",
    explore: "See proposed formats",
    imageAlt: "Carrot hummus with a serving spoon on a kitchen worktop beside fresh vegetables.",
    imageCaption: "Kitchen serving suggestion · Illustrative image",
    restaurant: {
      title: "À la carte service",
      text: "For sandwiches or dishes made to order, choose a pack your team can use in one shift. Weigh what is left at the end of service and we will adjust the size.",
    },
    hotel: {
      title: "Buffets & banquets",
      text: "For breakfast or an event, estimate portions for each round of service. Compare one larger tub with several smaller packs for buffet refills.",
    },
    range: "Which format for each product",
    rangeIntro:
      "Proposals for a kitchen trial. Final format, contents, availability and delivery are confirmed when quoting.",
    rows: [
      {
        brand: "Palapa Verde",
        product: "Carrot or beet hummus",
        format: "Large or extra-large tub",
        use: "Stackable tub with a lid for à la carte service or buffet refills.",
      },
      {
        brand: "Palapa Verde",
        product: "Cilantro and pumpkin seed pesto or cilantro chutney",
        format: "Wide-mouth tub · squeeze bottle",
        use: "For spooning out a measured amount per dish, or dispensing when plating.",
      },
      {
        brand: "Palapa Verde",
        product: "Avocado & jalapeño salsa",
        format: "Sealed pouch · single portion",
        use: "For a taco or sandwich station. The pack and how it performs once opened are under evaluation.",
      },
      {
        brand: "Go Veggie Life",
        product: "Fresh fruit, vegetables and herbs",
        format: "By case or weight",
        use: "Tell us the vegetable, unit and weekly usage; we agree the format with your kitchen.",
      },
    ],
    produceHeading: "Do you also need fresh fruit, vegetables and herbs?",
    produceText: "Go Veggie Life distributes fresh fruit, vegetables and herbs. See its formats for professional kitchens.",
    produceCta: "Go Veggie Life for hotels and restaurants",
  },
};
