import type { InventoryLevel, Order, OrderRequest, Product } from "./types";

/**
 * Contrato único entre la web y cualquier fuente de datos de comercio.
 *
 * La web (páginas, carrito, admin, /api/orders) solo habla con esta interfaz.
 * Hoy la implementa `MockCommerceProvider` (datos de prueba). Cuando llegue la
 * especificación de la API de goveggie.life, `GoVeggieLifeProvider` la
 * implementará sin tocar las páginas. Ambos deben pasar tests/contract.test.ts.
 */
export interface CommerceProvider {
  readonly id: "mock" | "goveggie";
  /** `true` si los datos son de prueba y la web debe avisarlo. */
  readonly isTestData: boolean;

  listProducts(): Promise<Product[]>;
  getProduct(slug: string): Promise<Product | null>;
  /** Sin argumentos devuelve el inventario de todos los productos. */
  getInventory(productIds?: string[]): Promise<InventoryLevel[]>;
  /** Valida existencias y registra el pedido. No cobra: los pagos van aparte. */
  createOrder(request: OrderRequest): Promise<Order>;
}
