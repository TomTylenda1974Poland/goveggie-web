import type { Localized } from "@/lib/commerce/types";

/**
 * Puntos de venta CONFIRMADOS (acuerdo con la tienda + producto en góndola).
 * Vacío = la web muestra el estado de prelanzamiento. Nunca añadir una tienda
 * sin confirmación escrita. Ver docs/CONTENT_GUIDE.md.
 */
export type Stockist = {
  id: string;
  name: string;
  /** Dirección visible para clientes. */
  address: string;
  city: string;
  /** Enlace de Google Maps verificado (abrirlo y comprobar el pin). */
  mapUrl: string | null;
  /** Slugs de productos que la tienda lleva (lista, no inventario en tiempo real). */
  products: string[];
  note?: Localized;
  /** Fecha de la última confirmación (AAAA-MM-DD). */
  confirmedOn: string;
};

export const STOCKISTS: readonly Stockist[] = [];
