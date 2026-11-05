/**
 * ⚠️ PROVISIONAL — forma SUPUESTA de la API de goveggie.life.
 *
 * Todavía no hay especificación. Estos tipos existen para que el adaptador, sus
 * tests y el resto de la web estén listos; cuando llegue la especificación se
 * reescriben este archivo y `mappers.ts`, y nada más. Ver docs/INTEGRATION.md.
 */

export type GvLocalizedDto = { es?: string | null; en?: string | null };

export type GvProductDto = {
  id: string;
  slug: string;
  sku?: string | null;
  brand: string;
  category: string;
  name: GvLocalizedDto;
  description?: GvLocalizedDto | null;
  /** Precio en centavos. */
  price_minor?: number | null;
  currency?: string | null;
  net_content?: string | null;
  ingredients?: GvLocalizedDto | null;
  allergens?: GvLocalizedDto | null;
  shelf_life?: GvLocalizedDto | null;
  storage?: GvLocalizedDto | null;
  images?: { url: string; alt?: GvLocalizedDto | null; width?: number; height?: number }[];
  status?: string;
};

export type GvInventoryDto = { product_id: string; available: number; updated_at: string };

export type GvOrderRequestDto = {
  brand: "palapa-verde";
  channel: "web";
  locale: string;
  customer: { name: string; phone: string; email?: string };
  notes?: string;
  lines: { product_id: string; quantity: number }[];
};

export type GvOrderDto = {
  id: string;
  status: string;
  created_at: string;
  lines: { product_id: string; quantity: number; unit_price_minor?: number | null }[];
};

export type GvListResponse<T> = { data: T[] };
