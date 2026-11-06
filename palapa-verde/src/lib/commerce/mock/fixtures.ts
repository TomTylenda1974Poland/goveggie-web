import { brandContentFor } from "../brand-content";
import type { InventoryLevel, Product, ProductCategory } from "../types";

/**
 * DATOS DE PRUEBA hasta que llegue la especificación de la API de goveggie.life.
 *
 * Productos: solo los nombres oficiales dados por el negocio, su traducción literal
 * al inglés y la categoría que se deduce del nombre. Todo lo demás es `null` a
 * propósito: precio, contenido neto, ingredientes, alérgenos, vida útil,
 * conservación, descripción y SKU los tiene que aportar el negocio.
 *
 * Inventario: cantidades inventadas SOLO para probar los estados de la tienda
 * (disponible, pocas unidades, agotado). La web lo avisa como datos de prueba.
 */

function draft(
  id: string,
  slug: string,
  category: ProductCategory,
  es: string,
  en: string,
): Product {
  return {
    id,
    slug,
    sku: null,
    name: { es, en },
    category,
    ...brandContentFor(slug),
    description: null,
    price: null,
    netContent: null,
    ingredients: null,
    allergens: null,
    shelfLife: null,
    storage: null,
    taste: null,
    texture: null,
    heat: null,
    status: "draft",
  };
}

export const MOCK_PRODUCTS: readonly Product[] = [
  draft("pv-001", "chutney-de-cilantro", "chutney", "Chutney de Cilantro", "Cilantro Chutney"),
  draft(
    "pv-002",
    "pesto-de-cilantro-con-semillas-de-auyama",
    "pesto",
    "Pesto de Cilantro con Semillas de Auyama",
    "Cilantro Pesto with Pumpkin Seeds",
  ),
  draft("pv-003", "hummus-de-zanahoria", "hummus", "Hummus de Zanahoria", "Carrot Hummus"),
  draft("pv-004", "hummus-de-remolacha", "hummus", "Hummus de Remolacha", "Beet Hummus"),
  draft(
    "pv-005",
    "salsa-de-aguacate-y-jalapeno",
    "salsa",
    "Salsa de Aguacate y Jalapeño",
    "Avocado & Jalapeño Salsa",
  ),
];

const MOCK_UPDATED_AT = "2026-11-05T12:00:00.000Z";

/** Cantidades de prueba elegidas para cubrir todos los estados de disponibilidad. */
export const MOCK_INVENTORY: readonly InventoryLevel[] = [
  { productId: "pv-001", available: 24, updatedAt: MOCK_UPDATED_AT, source: "mock" },
  { productId: "pv-002", available: 3, updatedAt: MOCK_UPDATED_AT, source: "mock" },
  { productId: "pv-003", available: 18, updatedAt: MOCK_UPDATED_AT, source: "mock" },
  { productId: "pv-004", available: 0, updatedAt: MOCK_UPDATED_AT, source: "mock" },
  { productId: "pv-005", available: 9, updatedAt: MOCK_UPDATED_AT, source: "mock" },
];
