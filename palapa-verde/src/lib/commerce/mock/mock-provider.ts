import { CommerceError } from "../errors";
import { orderTotal } from "../pricing";
import type { CommerceProvider } from "../provider";
import type { InventoryLevel, Order, OrderRequest, Product } from "../types";
import { MOCK_INVENTORY, MOCK_PRODUCTS } from "./fixtures";

type MockOptions = {
  products?: readonly Product[];
  inventory?: readonly InventoryLevel[];
  now?: () => Date;
  newId?: () => string;
};

const clone = <T>(value: T): T => structuredClone(value);

/**
 * Implementación con datos de prueba. No guarda nada: cada pedido se valida contra
 * el inventario de prueba y se devuelve con `test: true`. Nadie lo recibe.
 */
export class MockCommerceProvider implements CommerceProvider {
  readonly id = "mock" as const;
  readonly isTestData = true;

  private readonly products: readonly Product[];
  private readonly inventory: readonly InventoryLevel[];
  private readonly now: () => Date;
  private readonly newId: () => string;

  constructor(options: MockOptions = {}) {
    this.products = options.products ?? MOCK_PRODUCTS;
    this.inventory = options.inventory ?? MOCK_INVENTORY;
    this.now = options.now ?? (() => new Date());
    this.newId =
      options.newId ?? (() => `PRUEBA-${Date.now().toString(36).toUpperCase()}`);
  }

  async listProducts(): Promise<Product[]> {
    return clone([...this.products]);
  }

  async getProduct(slug: string): Promise<Product | null> {
    const found = this.products.find((p) => p.slug === slug);
    return found ? clone(found) : null;
  }

  async getInventory(productIds?: string[]): Promise<InventoryLevel[]> {
    const wanted = productIds ? new Set(productIds) : null;
    return clone(this.inventory.filter((i) => wanted === null || wanted.has(i.productId)));
  }

  async createOrder(request: OrderRequest): Promise<Order> {
    const lines = request.lines.map((line) => {
      const product = this.products.find((p) => p.id === line.productId);
      if (!product) {
        throw new CommerceError("UNKNOWN_PRODUCT", "Producto desconocido", {
          productId: line.productId,
        });
      }
      const stock = this.inventory.find((i) => i.productId === line.productId)?.available ?? 0;
      if (line.quantity > stock) {
        throw new CommerceError("OUT_OF_STOCK", "No hay existencias suficientes", {
          productId: line.productId,
          available: stock,
        });
      }
      return { ...line, unitPrice: product.price };
    });

    return {
      id: this.newId(),
      status: "received",
      lines,
      total: orderTotal(lines),
      createdAt: this.now().toISOString(),
      test: true,
    };
  }
}
