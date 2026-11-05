import { describe, expect, it } from "vitest";
import { CommerceError } from "../src/lib/commerce/errors";
import { GoVeggieLifeProvider } from "../src/lib/commerce/goveggie/goveggie-provider";
import { MockCommerceProvider } from "../src/lib/commerce/mock/mock-provider";
import type { CommerceProvider } from "../src/lib/commerce/provider";
import type { OrderRequest } from "../src/lib/commerce/types";
import { FAKE_BASE, fakeGoVeggieFetch } from "./fake-goveggie";

/**
 * Contrato que TODA implementación de CommerceProvider debe cumplir.
 * Cuando llegue la especificación real, el servidor falso se ajusta a ella y
 * estos mismos tests garantizan que la web sigue funcionando igual.
 */
const order = (lines: OrderRequest["lines"]): OrderRequest => ({
  lines,
  customer: { name: "Prueba", phone: "+1 809 555 0100" },
  locale: "es",
});

const implementations: [string, () => CommerceProvider][] = [
  ["mock", () => new MockCommerceProvider()],
  ["goveggie (servidor falso)", () => new GoVeggieLifeProvider({ baseUrl: FAKE_BASE, fetch: fakeGoVeggieFetch() })],
];

describe.each(implementations)("contrato CommerceProvider: %s", (_name, make) => {
  it("lista los cinco productos de inicio con id y slug únicos", async () => {
    const products = await make().listProducts();
    expect(products.map((p) => p.name.es)).toEqual([
      "Chutney de Cilantro",
      "Pesto de Cilantro con Semillas de Auyama",
      "Hummus de Zanahoria",
      "Hummus de Remolacha",
      "Salsa de Aguacate y Jalapeño",
    ]);
    expect(new Set(products.map((p) => p.id)).size).toBe(5);
    expect(new Set(products.map((p) => p.slug)).size).toBe(5);
  });

  it("devuelve un producto por slug y null si no existe", async () => {
    const provider = make();
    const product = await provider.getProduct("hummus-de-remolacha");
    expect(product?.name.en).toBe("Beet Hummus");
    expect(await provider.getProduct("no-existe")).toBeNull();
  });

  it("devuelve existencias de todos o de los productos pedidos", async () => {
    const provider = make();
    expect(await provider.getInventory()).toHaveLength(5);
    const some = await provider.getInventory(["pv-001", "pv-004"]);
    expect(some.map((l) => l.productId).sort()).toEqual(["pv-001", "pv-004"]);
    expect(some.find((l) => l.productId === "pv-004")?.available).toBe(0);
  });

  it("acepta un pedido válido y deja el total pendiente si faltan precios", async () => {
    const result = await make().createOrder(order([{ productId: "pv-001", quantity: 2 }]));
    expect(result.status).toBe("received");
    expect(result.lines).toEqual([{ productId: "pv-001", quantity: 2, unitPrice: null }]);
    expect(result.total).toBeNull();
    expect(result.id.length).toBeGreaterThan(0);
  });

  it("rechaza pedidos sin existencias suficientes", async () => {
    await expect(make().createOrder(order([{ productId: "pv-004", quantity: 1 }]))).rejects.toMatchObject({
      code: "OUT_OF_STOCK",
    });
  });

  it("rechaza productos desconocidos con un error 4xx", async () => {
    const error = await make()
      .createOrder(order([{ productId: "pv-999", quantity: 1 }]))
      .catch((e: unknown) => e);
    expect(error).toBeInstanceOf(CommerceError);
    expect(["UNKNOWN_PRODUCT", "INVALID_REQUEST"]).toContain((error as CommerceError).code);
  });
});
