import type { Locale } from "@/lib/commerce/types";

type ServingScene = { image: string; alt: string; title: string; text: string };
type ProductFormat = { image: string; alt: string; brand: string; product: string; format: string; use: string };
export type PackKey = "kitchen" | "buffet" | "portion" | "bottle";
type KitchenCopy = {
  title: string;
  intro: string;
  inquiry: string;
  explore: string;
  packHeading: string;
  imageAlt: string;
  imageCaption: string;
  navigation: { label: string; service: string; packs: string; products: string; labelGuide: string };
  services: ServingScene[];
  lineAlt: string;
  packs: Record<PackKey, { alt: string; title: string; use: string }>;
  range: string;
  rangeIntro: string;
  rows: ProductFormat[];
  produceHeading: string;
  produceText: string;
  produceCta: string;
};

/** Proposed kitchen formats only, pending confirmation of commercial and production data. */
export const kitchenCopy: Record<Locale, KitchenCopy> = {
  es: {
    title: "Hoteles y restaurantes",
    intro: "Preparaciones de Palapa Verde y vegetales frescos de Go Veggie Life para tu cocina. Dinos qué sirves y exploramos juntos los formatos que estamos desarrollando.",
    inquiry: "Preparar mi consulta",
    explore: "Ver formatos propuestos",
    packHeading: "Envases propuestos · por confirmar",
    imageAlt: "Un plato de auyama asada con pesto de cilantro y semillas de auyama sale de cocina hacia el comedor.",
    imageCaption: "Auyama asada con pesto de cilantro · Sugerencia de servicio",
    navigation: { label: "Secciones para cocinas profesionales", service: "Tipos de servicio", packs: "Envases", products: "Productos y formatos", labelGuide: "Etiqueta" },
    services: [
      { image: "carta", alt: "Un cocinero unta salsa de aguacate y jalapeño en un sándwich abierto.",
        title: "Cocina a la carta", text: "Para un sándwich preparado al momento, elige un envase que puedas usar en un turno. Pesa lo que queda después del servicio para ajustar el tamaño." },
      { image: "bufe", alt: "Una bandeja de vasitos de hummus de remolacha repone una estación de banquete.",
        title: "Bufé y banquetes", text: "Calcula las porciones que necesitas por tanda. Compara un envase grande con varios pequeños para reponer el bufé a medida que llegan los invitados." },
    ],
    lineAlt: "Envases de cocina, bandeja Gastronorm y porciones individuales con hummus, pesto, chutney y salsa.",
    packs: {
      kitchen: { title: "Envase grande", use: "Para cocinas, bares y bufés. Pasa el contenido a una bandeja Gastronorm para el servicio.", alt: "Hummus de zanahoria en un envase grande junto a una bandeja de servicio." },
      buffet: { title: "Envase extra grande", use: "Para reponer las bandejas por tandas en un bufé de desayuno de gran volumen.", alt: "Un envase alto de hummus de remolacha junto a dos bandejas de bufé." },
      portion: { title: "Porción individual", use: "Una porción con tapa despegable para desayunos, servicio a la habitación, bares de playa o pedidos para llevar.", alt: "Una porción de hummus con la tapa parcialmente despegada en una bandeja de servicio a la habitación." },
      bottle: { title: "Botella dosificadora", use: "Para dosificar pesto o chutney al emplatar y controlar la cantidad en cada plato.", alt: "Una botella dosificadora aplica chutney de cilantro a un plato." },
    },
    range: "Qué formato para cada producto",
    rangeIntro: "Propuestas para probar en cocina. Al cotizar confirmamos el formato final, el contenido, la disponibilidad y la entrega.",
    rows: [
      { image: "hummus", alt: "Envases apilables con hummus de zanahoria y de remolacha.", brand: "Palapa Verde",
        product: "Hummus de zanahoria o de remolacha", format: "Envase grande o extra grande", use: "Con tapa para la carta o para reponer el bufé por tandas." },
      { image: "pesto", alt: "Un envase de pesto con cuchara y una botella dosificadora de chutney.", brand: "Palapa Verde",
        product: "Pesto de cilantro con semillas de auyama o chutney de cilantro", format: "Envase de boca ancha · botella dosificadora", use: "Sirve con cuchara o dosifica al emplatar." },
      { image: "salsa", alt: "Salsa verde en bolsa sellada y en vasito individual con tapa.", brand: "Palapa Verde",
        product: "Salsa de aguacate y jalapeño", format: "Bolsa sellada · porción individual", use: "Para tacos o sándwiches. Estamos evaluando cómo funciona el envase una vez abierto." },
      { image: "frescos", alt: "Frutas, vegetales y hierbas frescas en una caja de Go Veggie Life.", brand: "Go Veggie Life",
        product: "Frutas, vegetales y hierbas frescas", format: "Por caja o por peso", use: "Dinos qué usas, en qué unidad y cuánto necesitas por semana." },
    ],
    produceHeading: "¿Necesitas también frutas, vegetales y hierbas frescas?",
    produceText: "Go Veggie Life distribuye frutas, vegetales y hierbas frescas. Consulta sus formatos para cocinas profesionales.",
    produceCta: "Go Veggie Life para hoteles y restaurantes",
  },
  en: {
    title: "Hotels & restaurants",
    intro: "Prepared foods from Palapa Verde and fresh produce from Go Veggie Life for your kitchen. Tell us what you serve and we’ll help you explore the formats we’re developing.",
    inquiry: "Prepare my enquiry",
    explore: "See proposed formats",
    packHeading: "Proposed packs · to be confirmed",
    imageAlt: "A plate of roasted squash with cilantro and pumpkin seed pesto leaves the kitchen for the dining room.",
    imageCaption: "Roasted squash with cilantro pesto · Serving suggestion",
    navigation: { label: "Professional kitchen sections", service: "Types of service", packs: "Pack formats", products: "Products & formats", labelGuide: "Label guide" },
    services: [
      { image: "carta", alt: "A cook spreads avocado and jalapeño salsa on an open sandwich.",
        title: "À la carte service", text: "For a sandwich made to order, choose a pack your team can use in one shift. Weigh what’s left after service to fine-tune the pack size." },
      { image: "bufe", alt: "A server replenishes a banquet station with small cups of beet hummus.",
        title: "Buffets & banquets", text: "Estimate how many portions you need per round. Compare one large tub with several smaller packs for topping up the buffet as guests arrive." },
    ],
    lineAlt: "Kitchen tubs, a stainless buffet pan and individual cups of hummus, pesto, chutney and salsa.",
    packs: {
      kitchen: { title: "Large kitchen tub", use: "For kitchens, bars and buffets. Transfer the contents to a standard Gastronorm pan for service.", alt: "A large tub of carrot hummus beside a stainless serving pan." },
      buffet: { title: "Extra-large buffet tub", use: "Refill pans in batches during a busy breakfast buffet.", alt: "A tall tub of beet hummus beside two shallow buffet pans." },
      portion: { title: "Single portion", use: "A peel-off lid for breakfast, room service, beach bars or grab-and-go orders.", alt: "A small hummus cup with the lid partly peeled back on a room-service tray." },
      bottle: { title: "Squeeze bottle", use: "Portion pesto or chutney as you plate each dish.", alt: "A squeeze bottle dispensing cilantro chutney onto a plate." },
    },
    range: "Which format for each product",
    rangeIntro: "Proposals for a kitchen trial. We’ll confirm the final format, contents, availability and delivery when we quote.",
    rows: [
      { image: "hummus", alt: "Stackable tubs of orange carrot and red beet hummus.", brand: "Palapa Verde",
        product: "Carrot or beet hummus", format: "Large or extra-large tub", use: "A lidded tub for à la carte service or buffet refills." },
      { image: "pesto", alt: "A wide-mouth pesto tub with a spoon next to a chutney squeeze bottle.", brand: "Palapa Verde",
        product: "Cilantro and pumpkin seed pesto or cilantro chutney", format: "Wide-mouth tub · squeeze bottle", use: "Spoon out a portion or dispense as you plate." },
      { image: "salsa", alt: "Green salsa in a sealed pouch and an individual peel-off cup.", brand: "Palapa Verde",
        product: "Avocado & jalapeño salsa", format: "Sealed pouch · single portion", use: "For tacos or sandwiches. We’re testing how the pack works once opened." },
      { image: "frescos", alt: "Fresh fruit, vegetables and herbs in a Go Veggie Life produce crate.", brand: "Go Veggie Life",
        product: "Fresh fruit, vegetables and herbs", format: "By case or weight", use: "Tell us what you use, how you measure it and how much you need each week." },
    ],
    produceHeading: "Do you also need fresh fruit, vegetables and herbs?",
    produceText: "Go Veggie Life distributes fresh fruit, vegetables and herbs. See its formats for professional kitchens.",
    produceCta: "Go Veggie Life for hotels and restaurants",
  },
};
