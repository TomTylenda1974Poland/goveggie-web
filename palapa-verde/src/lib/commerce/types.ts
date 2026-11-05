/**
 * Modelo de dominio de la tienda Palapa Verde.
 *
 * Regla de negocio: los datos comerciales y regulatorios (precio, contenido neto,
 * ingredientes, alérgenos, vida útil, conservación) solo llegan del negocio o de la
 * API de goveggie.life. Mientras no existan valen `null`; nunca se inventan.
 * La pantalla /admin enumera cada `null` como dato pendiente.
 */

export const LOCALES = ["es", "en"] as const;
export type Locale = (typeof LOCALES)[number];

/** Texto en los dos idiomas del sitio. `es` es el texto oficial. */
export type Localized = Record<Locale, string>;

/** Importe en la unidad menor (centavos) para evitar errores de coma flotante. */
export type Money = { amountMinor: number; currency: "DOP" };

export type ProductCategory = "chutney" | "pesto" | "hummus" | "salsa";

/** Vegetales protagonistas, tomados del NOMBRE del producto (no es la lista de ingredientes). */
export type ArtKey = "cilantro" | "auyama" | "zanahoria" | "remolacha" | "aguacate" | "jalapeno";

export type ProductImage = {
  src: string;
  alt: Localized;
  /**
   * `product`: foto real del producto (pendiente).
   * `illustration`: imagen ilustrativa generada (envase y receta aproximados);
   *   la web la rotula como «Imagen ilustrativa» hasta tener la foto real.
   * `ingredient`: foto de un vegetal de Go Veggie Life.
   */
  kind: "product" | "illustration" | "ingredient";
  width: number;
  height: number;
};

export type Product = {
  /** Identificador estable en la fuente de datos (mock o API). */
  id: string;
  slug: string;
  sku: string | null;
  name: Localized;
  category: ProductCategory;
  art: ArtKey[];
  description: Localized | null;
  price: Money | null;
  /** Contenido neto tal como aparece en la etiqueta, p. ej. "250 g". */
  netContent: string | null;
  ingredients: Localized | null;
  allergens: Localized | null;
  shelfLife: Localized | null;
  storage: Localized | null;
  images: ProductImage[];
  status: "draft" | "active";
};

export type InventoryLevel = {
  productId: string;
  /** Unidades disponibles para la venta. */
  available: number;
  updatedAt: string;
  source: "mock" | "goveggie";
};

export type Availability = "in_stock" | "low_stock" | "out_of_stock" | "unknown";

export type OrderLine = { productId: string; quantity: number };

export type OrderCustomer = { name: string; phone: string; email?: string };

export type OrderRequest = {
  lines: OrderLine[];
  customer: OrderCustomer;
  notes?: string;
  locale: Locale;
};

export type OrderLineResult = OrderLine & { unitPrice: Money | null };

export type Order = {
  id: string;
  status: "received";
  lines: OrderLineResult[];
  /** `null` cuando falta el precio de al menos una línea. */
  total: Money | null;
  createdAt: string;
  /** `true` si el pedido no llegó a ningún sistema real. */
  test: boolean;
};
