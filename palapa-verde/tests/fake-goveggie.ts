import { MOCK_INVENTORY, MOCK_PRODUCTS } from "../src/lib/commerce/mock/fixtures";
import type { GvInventoryDto, GvProductDto } from "../src/lib/commerce/goveggie/dto";

/** Servidor falso de goveggie.life con la forma PROVISIONAL de dto.ts, para tests. */
export const FAKE_BASE = "https://api.goveggie.test";

export function productDtos(): GvProductDto[] {
  return MOCK_PRODUCTS.map((p) => ({
    id: p.id,
    slug: p.slug,
    sku: p.sku,
    brand: "palapa-verde",
    category: p.category,
    name: { ...p.name },
    price_minor: null,
    currency: null,
    status: "draft",
  }));
}

export function inventoryDtos(): GvInventoryDto[] {
  return MOCK_INVENTORY.map((i) => ({ product_id: i.productId, available: i.available, updated_at: i.updatedAt }));
}

export type Recorded = { url: string; method: string; headers: Headers; body?: unknown };

export function fakeGoVeggieFetch(recorded: Recorded[] = []): typeof fetch {
  const json = (status: number, body: unknown) =>
    new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });

  return (async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = new URL(String(input));
    const method = init?.method ?? "GET";
    const body = typeof init?.body === "string" ? JSON.parse(init.body) : undefined;
    recorded.push({ url: url.toString(), method, headers: new Headers(init?.headers), body });

    const products = productDtos();
    if (method === "GET" && url.pathname === "/v1/brands/palapa-verde/products") {
      return json(200, { data: products });
    }
    const one = url.pathname.match(/^\/v1\/brands\/palapa-verde\/products\/([^/]+)$/);
    if (method === "GET" && one) {
      const found = products.find((p) => p.slug === decodeURIComponent(one[1] ?? ""));
      return found ? json(200, found) : json(404, { error: "not_found" });
    }
    if (method === "GET" && url.pathname === "/v1/inventory") {
      const ids = url.searchParams.get("product_ids")?.split(",");
      return json(200, { data: inventoryDtos().filter((i) => !ids || ids.includes(i.product_id)) });
    }
    if (method === "POST" && url.pathname === "/v1/orders") {
      const lines = (body as { lines: { product_id: string; quantity: number }[] }).lines;
      for (const line of lines) {
        const stock = inventoryDtos().find((i) => i.product_id === line.product_id);
        if (!stock) return json(400, { error: "unknown_product" });
        if (line.quantity > stock.available) return json(409, { error: "out_of_stock" });
      }
      return json(201, {
        id: "GV-0001",
        status: "received",
        created_at: "2026-11-05T12:00:00.000Z",
        lines: lines.map((l) => ({ ...l, unit_price_minor: null })),
      });
    }
    return json(404, { error: "no_route" });
  }) as typeof fetch;
}
