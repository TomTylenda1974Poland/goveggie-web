import "server-only";
import { cache } from "react";
import { availabilityOf, indexInventory } from "./commerce/availability";
import { getCommerce } from "./commerce";
import type { Availability, InventoryLevel, Product } from "./commerce/types";

export type CatalogData = {
  products: Product[];
  inventory: Map<string, InventoryLevel>;
  availability: (productId: string) => Availability;
  providerId: "mock" | "goveggie";
  isTestData: boolean;
};

/** Productos + existencias en una sola carga por petición. */
export const loadCatalog = cache(async (): Promise<CatalogData> => {
  const commerce = getCommerce();
  const [products, levels] = await Promise.all([commerce.listProducts(), commerce.getInventory()]);
  const inventory = indexInventory(levels);
  return {
    products,
    inventory,
    availability: (id) => availabilityOf(inventory.get(id)),
    providerId: commerce.id,
    isTestData: commerce.isTestData,
  };
});
