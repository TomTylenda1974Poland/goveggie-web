import type { Availability, InventoryLevel } from "./types";

/** Por debajo de este número la web muestra «Últimas unidades». */
export const LOW_STOCK_THRESHOLD = 5;

export function availabilityOf(level: InventoryLevel | undefined): Availability {
  if (level === undefined) return "unknown";
  if (level.available <= 0) return "out_of_stock";
  if (level.available <= LOW_STOCK_THRESHOLD) return "low_stock";
  return "in_stock";
}

export function indexInventory(levels: readonly InventoryLevel[]): Map<string, InventoryLevel> {
  return new Map(levels.map((l) => [l.productId, l]));
}
