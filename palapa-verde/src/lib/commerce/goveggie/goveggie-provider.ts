import { CommerceError } from "../errors";
import type { CommerceProvider } from "../provider";
import type { InventoryLevel, Order, OrderRequest, Product } from "../types";
import { GoVeggieHttpClient, type GoVeggieClientConfig } from "./client";
import { mapInventory, mapOrder, mapProduct, toOrderRequestDto } from "./mappers";

/**
 * ⚠️ PROVISIONAL — rutas supuestas hasta recibir la especificación:
 *   GET  /v1/brands/palapa-verde/products         → { data: Product[] }
 *   GET  /v1/brands/palapa-verde/products/{slug}  → Product | 404
 *   GET  /v1/inventory?brand=palapa-verde&product_ids=a,b → { data: Inventory[] }
 *   POST /v1/orders  (cabecera Idempotency-Key)   → Order
 */
const BRAND = "palapa-verde";

export type GoVeggieProviderConfig = Omit<GoVeggieClientConfig, "baseUrl"> & {
  baseUrl?: string;
  newIdempotencyKey?: () => string;
};

function listData(body: unknown, what: string): unknown[] {
  if (typeof body === "object" && body !== null && Array.isArray((body as { data?: unknown }).data)) {
    return (body as { data: unknown[] }).data;
  }
  throw new CommerceError("UPSTREAM_ERROR", `Respuesta no válida de goveggie.life: ${what}`);
}

export class GoVeggieLifeProvider implements CommerceProvider {
  readonly id = "goveggie" as const;
  readonly isTestData = false;

  private readonly client: GoVeggieHttpClient | null;
  private readonly newIdempotencyKey: () => string;

  constructor(config: GoVeggieProviderConfig) {
    this.client = config.baseUrl ? new GoVeggieHttpClient({ ...config, baseUrl: config.baseUrl }) : null;
    this.newIdempotencyKey = config.newIdempotencyKey ?? (() => crypto.randomUUID());
  }

  private api(): GoVeggieHttpClient {
    if (this.client === null) {
      throw new CommerceError(
        "NOT_CONFIGURED",
        "Falta GOVEGGIE_API_URL: la integración con goveggie.life no está configurada",
      );
    }
    return this.client;
  }

  async listProducts(): Promise<Product[]> {
    const { body } = await this.api().get(`/v1/brands/${BRAND}/products`);
    return listData(body, "lista de productos").map(mapProduct);
  }

  async getProduct(slug: string): Promise<Product | null> {
    const res = await this.api().get(`/v1/brands/${BRAND}/products/${encodeURIComponent(slug)}`, undefined, true);
    return res.status === 404 ? null : mapProduct(res.body);
  }

  async getInventory(productIds?: string[]): Promise<InventoryLevel[]> {
    const query: Record<string, string> = { brand: BRAND };
    if (productIds && productIds.length > 0) query.product_ids = productIds.join(",");
    const { body } = await this.api().get("/v1/inventory", query);
    return listData(body, "inventario").map(mapInventory);
  }

  async createOrder(request: OrderRequest): Promise<Order> {
    const { body } = await this.api().post("/v1/orders", toOrderRequestDto(request), {
      "idempotency-key": this.newIdempotencyKey(),
    });
    return mapOrder(body);
  }
}
