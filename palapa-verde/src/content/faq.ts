import type { Localized } from "@/lib/commerce/types";
import { relationship } from "./brand";

/**
 * Preguntas frecuentes. Cada respuesta dice solo lo que está confirmado; lo
 * pendiente se dice como pendiente. Al confirmar un dato, actualizar la respuesta.
 * `href` añade un enlace de acción (ruta sin idioma, p. ej. "/recetas").
 */
export type FaqItem = { id: string; group: "use" | "product" | "buy"; q: Localized; a: Localized; href?: string; cta?: Localized };

const t = (es: string, en: string): Localized => ({ es, en });

export const FAQ: readonly FaqItem[] = [
  {
    id: "que-es",
    group: "product",
    q: t("¿Qué es Palapa Verde?", "What is Palapa Verde?"),
    a: t(
      `${relationship.statement.es} Estamos desarrollando chutney, pesto, hummus y salsa con vegetales protagonistas.`,
      `${relationship.statement.en} We are developing chutney, pesto, hummus and salsa starring vegetables.`,
    ),
    href: "/nosotros",
    cta: t("Más sobre nosotros", "More about us"),
  },
  {
    id: "como-usar",
    group: "use",
    q: t("¿Cómo se usan los productos?", "How do I use the products?"),
    a: t(
      "Como salsa para mojar, untados en sándwiches, wraps y casabe, sobre huevos, arroz, pasta o vegetales, o en tacos. Cada producto tiene tres ideas rápidas en su página y recetas paso a paso.",
      "As a dip, spread in sandwiches, wraps and on cassava bread, over eggs, rice, pasta or vegetables, or in tacos. Each product has three quick ideas on its page plus step-by-step recipes.",
    ),
    href: "/recetas",
    cta: t("Ver recetas", "See recipes"),
  },
  {
    id: "picante",
    group: "product",
    q: t("¿Pican? ¿Qué sabor tienen?", "Are they spicy? What do they taste like?"),
    a: t(
      "Sabor, textura y nivel de picante se confirmarán con la receta final de cada producto. Los indicaremos en la etiqueta y en la página de cada producto.",
      "Taste, texture and heat level will be confirmed with each product's final recipe. We will show them on the label and on each product page.",
    ),
  },
  {
    id: "ingredientes",
    group: "product",
    q: t("¿Qué ingredientes y alérgenos tienen?", "What ingredients and allergens do they contain?"),
    a: t(
      "Publicaremos la lista completa de ingredientes y los alérgenos de cada producto, igual que en su etiqueta, antes de ponerlo a la venta. Hasta entonces no hacemos afirmaciones sobre ingredientes o dietas.",
      "We will publish each product's full ingredient list and allergens, exactly as on its label, before it goes on sale. Until then we make no claims about ingredients or diets.",
    ),
  },
  {
    id: "conservacion",
    group: "product",
    q: t("¿Cómo se conservan y cuánto duran abiertos?", "How should they be stored and how long do they keep once opened?"),
    a: t(
      "Las instrucciones de conservación y el tiempo de consumo después de abrir se definirán con las pruebas del producto y aparecerán en la etiqueta y aquí.",
      "Storage instructions and how long to keep each product after opening will be set by product testing and shown on the label and here.",
    ),
  },
  {
    id: "donde",
    group: "buy",
    q: t("¿Dónde puedo comprarlos?", "Where can I buy them?"),
    a: t(
      "Todavía no están a la venta. En «Dónde comprar» publicaremos solo las tiendas confirmadas.",
      "They are not on sale yet. “Where to buy” will list confirmed stores only.",
    ),
    href: "/donde-comprar",
    cta: t("Dónde comprar", "Where to buy"),
  },
  {
    id: "mayoristas",
    group: "buy",
    q: t("¿Venden a negocios o al por mayor?", "Do you sell to businesses or wholesale?"),
    a: t(
      "Todavía no. Queremos trabajar con supermercados, hoteles, restaurantes y distribuidores; formatos, pedidos mínimos y entregas se publicarán cuando estén confirmados.",
      "Not yet. We want to work with supermarkets, hotels, restaurants and distributors; formats, minimum orders and delivery will be published once confirmed.",
    ),
    href: "/negocios",
    cta: t("Información para negocios", "Information for businesses"),
  },
];
