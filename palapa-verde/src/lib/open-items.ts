import type { Localized } from "./commerce/types";

/**
 * Decisiones y datos que solo puede aportar el negocio. Se muestran en /admin.
 * Al resolver uno, bórralo de aquí y apunta la decisión en docs/DECISIONS.md.
 */
export const OPEN_BUSINESS_ITEMS: readonly { id: string; text: Localized }[] = [
  {
    id: "product-data",
    text: {
      es: "Ficha de cada producto: precio, contenido neto, ingredientes, alérgenos, vida útil y conservación (ver tabla).",
      en: "Each product sheet: price, net content, ingredients, allergens, shelf life and storage (see table).",
    },
  },
  {
    id: "photos",
    text: {
      es: "Fotos reales de los cinco productos (frasco o envase). Hoy se usan fotos de ingredientes de Go Veggie Life y dibujos.",
      en: "Real photos of the five products (jar or pack). Today Go Veggie Life ingredient photos and drawings are used.",
    },
  },
  {
    id: "sanitary",
    text: {
      es: "Registro sanitario y etiquetado: estado de cada producto por confirmar antes de vender.",
      en: "Sanitary registration and labelling: status of each product to be confirmed before selling.",
    },
  },
  {
    id: "api-spec",
    text: {
      es: "Especificación de la API de goveggie.life (productos, existencias, pedidos) y credenciales de prueba.",
      en: "goveggie.life API specification (products, stock, orders) and test credentials.",
    },
  },
  {
    id: "fulfilment",
    text: {
      es: "Cómo se entregan los pedidos: zonas, días, costo de envío, retiro en tienda, pedido mínimo.",
      en: "How orders are fulfilled: zones, days, delivery fee, pickup, minimum order.",
    },
  },
  {
    id: "payments",
    text: {
      es: "Pagos: proveedor (p. ej. Azul o CardNET), contrato y fecha de activación. Hoy no se cobra nada.",
      en: "Payments: provider (e.g. Azul or CardNET), contract and go-live date. Nothing is charged today.",
    },
  },
  {
    id: "company",
    text: {
      es: "Datos de la empresa para el pie y los avisos legales (razón social, RNC, contacto, WhatsApp).",
      en: "Company details for the footer and legal notices (legal name, RNC, contact, WhatsApp).",
    },
  },
  {
    id: "hosting",
    text: {
      es: "Plan de Vercel: el plan Hobby actual no permite uso comercial; la tienda necesita Pro antes de abrir.",
      en: "Vercel plan: the current Hobby plan does not allow commercial use; the shop needs Pro before opening.",
    },
  },
];
