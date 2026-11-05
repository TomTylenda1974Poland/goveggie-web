import { describe, expect, it } from "vitest";
import { createCommerceProvider } from "../src/lib/commerce";
import { GoVeggieLifeProvider } from "../src/lib/commerce/goveggie/goveggie-provider";
import { mapProduct } from "../src/lib/commerce/goveggie/mappers";
import { MockCommerceProvider } from "../src/lib/commerce/mock/mock-provider";
import { FAKE_BASE, fakeGoVeggieFetch, productDtos, type Recorded } from "./fake-goveggie";

describe("selección de proveedor", () => {
  it("usa datos de prueba por defecto", () => {
    expect(createCommerceProvider({})).toBeInstanceOf(MockCommerceProvider);
    expect(createCommerceProvider({ COMMERCE_PROVIDER: "" })).toBeInstanceOf(MockCommerceProvider);
  });
  it("usa goveggie.life cuando se pide", () => {
    expect(createCommerceProvider({ COMMERCE_PROVIDER: "goveggie" })).toBeInstanceOf(GoVeggieLifeProvider);
  });
  it("falla con un valor desconocido", () => {
    expect(() => createCommerceProvider({ COMMERCE_PROVIDER: "shopify" })).toThrow(/desconocido/);
  });
});

describe("GoVeggieLifeProvider", () => {
  it("sin URL falla con NOT_CONFIGURED en vez de inventar datos", async () => {
    await expect(new GoVeggieLifeProvider({}).listProducts()).rejects.toMatchObject({ code: "NOT_CONFIGURED" });
  });

  it("envía la clave como Bearer y una Idempotency-Key en los pedidos", async () => {
    const calls: Recorded[] = [];
    const provider = new GoVeggieLifeProvider({
      baseUrl: `${FAKE_BASE}/`,
      apiKey: "clave-de-prueba",
      fetch: fakeGoVeggieFetch(calls),
      newIdempotencyKey: () => "idem-1",
    });
    await provider.createOrder({
      lines: [{ productId: "pv-003", quantity: 1 }],
      customer: { name: "Prueba", phone: "8095550100" },
      notes: "sin cebolla",
      locale: "en",
    });
    const call = calls[0]!;
    expect(call.url).toBe(`${FAKE_BASE}/v1/orders`);
    expect(call.headers.get("authorization")).toBe("Bearer clave-de-prueba");
    expect(call.headers.get("idempotency-key")).toBe("idem-1");
    expect(call.body).toEqual({
      brand: "palapa-verde",
      channel: "web",
      locale: "en",
      customer: { name: "Prueba", phone: "8095550100" },
      notes: "sin cebolla",
      lines: [{ product_id: "pv-003", quantity: 1 }],
    });
  });

  it("convierte la espera agotada en UPSTREAM_TIMEOUT", async () => {
    const hanging = ((_: unknown, init?: RequestInit) =>
      new Promise((_resolve, reject) => {
        init?.signal?.addEventListener("abort", () => reject(new DOMException("aborted", "AbortError")));
      })) as typeof fetch;
    const provider = new GoVeggieLifeProvider({ baseUrl: FAKE_BASE, fetch: hanging, timeoutMs: 10 });
    await expect(provider.listProducts()).rejects.toMatchObject({ code: "UPSTREAM_TIMEOUT" });
  });

  it("el límite de tiempo también cubre la lectura del cuerpo", async () => {
    const stalled = ((_: unknown, init?: RequestInit) => {
      const stream = new ReadableStream({
        start(controller) {
          init?.signal?.addEventListener("abort", () => controller.error(new DOMException("aborted", "AbortError")));
        },
      });
      return Promise.resolve(new Response(stream, { status: 200 }));
    }) as typeof fetch;
    const provider = new GoVeggieLifeProvider({ baseUrl: FAKE_BASE, fetch: stalled, timeoutMs: 10 });
    await expect(provider.listProducts()).rejects.toMatchObject({ code: "UPSTREAM_TIMEOUT" });
  });

  it("rechaza respuestas que no son JSON", async () => {
    const html = (async () => new Response("<html>", { status: 200 })) as typeof fetch;
    const provider = new GoVeggieLifeProvider({ baseUrl: FAKE_BASE, fetch: html });
    await expect(provider.listProducts()).rejects.toMatchObject({ code: "UPSTREAM_ERROR" });
  });

  it("toma imágenes y protagonistas del contenido de marca cuando la API no trae fotos", async () => {
    const provider = new GoVeggieLifeProvider({ baseUrl: FAKE_BASE, fetch: fakeGoVeggieFetch() });
    const product = await provider.getProduct("hummus-de-zanahoria");
    expect(product?.art).toEqual(["zanahoria"]);
    expect(product?.images[0]?.kind).toBe("illustration");
  });
});

describe("mapProduct (forma provisional)", () => {
  const base = productDtos()[0]!;

  it("acepta precios en centavos DOP", () => {
    expect(mapProduct({ ...base, price_minor: 25000, currency: "DOP" }).price).toEqual({
      amountMinor: 25000,
      currency: "DOP",
    });
  });

  it("rechaza otra moneda o precios no enteros", () => {
    expect(() => mapProduct({ ...base, price_minor: 100, currency: "USD" })).toThrow(/DOP/);
    expect(() => mapProduct({ ...base, price_minor: 10.5, currency: "DOP" })).toThrow(/price_minor/);
  });

  it("rechaza categorías desconocidas y nombres sin español", () => {
    expect(() => mapProduct({ ...base, category: "sopa" })).toThrow(/category/);
    expect(() => mapProduct({ ...base, name: { en: "Only English" } })).toThrow(/name/);
  });

  it("si falta el inglés muestra el español, nunca una traducción inventada", () => {
    const p = mapProduct({ ...base, ingredients: { es: "Cilantro, …" } });
    expect(p.ingredients).toEqual({ es: "Cilantro, …", en: "Cilantro, …" });
  });

  it("prefiere las fotos de producto de la API", () => {
    const p = mapProduct({ ...base, images: [{ url: "https://cdn.test/frasco.jpg", width: 800, height: 600 }] });
    expect(p.images).toHaveLength(1);
    expect(p.images[0]).toMatchObject({ src: "https://cdn.test/frasco.jpg", kind: "product" });
  });
});
