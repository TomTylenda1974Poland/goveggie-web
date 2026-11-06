import { describe, expect, it } from "vitest";
import { addItem, cartTotals, itemCount, lineLimit, parseStoredCart, removeItem, setQuantity } from "../src/lib/cart/cart";
import { availabilityOf } from "../src/lib/commerce/availability";
import { auditProduct } from "../src/lib/commerce/completeness";
import { MOCK_PRODUCTS } from "../src/lib/commerce/mock/fixtures";
import { parseOrderRequest } from "../src/lib/commerce/validation";
import { fill, getDictionary } from "../src/lib/i18n";

describe("regla de negocio: no inventar datos", () => {
  it.each(MOCK_PRODUCTS.map((p) => [p.slug, p] as const))("%s no trae precio, composición ni vida útil", (_slug, p) => {
    expect(p.price).toBeNull();
    expect(p.netContent).toBeNull();
    expect(p.ingredients).toBeNull();
    expect(p.allergens).toBeNull();
    expect(p.shelfLife).toBeNull();
    expect(p.storage).toBeNull();
    expect(p.images.every((i) => i.kind !== "product")).toBe(true);
  });

  it("el panel marca como pendientes todos esos campos", () => {
    const audit = auditProduct(MOCK_PRODUCTS[0]!);
    expect(audit.complete).toBe(false);
    expect(audit.fields.filter((f) => f.state === "missing").map((f) => f.field)).toEqual([
      "price",
      "netContent",
      "ingredients",
      "allergens",
      "shelfLife",
      "storage",
      "description",
      "sku",
      "productPhoto",
    ]);
  });

  it("un producto con todos los datos en ES y EN tiene la ficha completa", () => {
    const text = { es: "x", en: "y" };
    const audit = auditProduct({
      ...MOCK_PRODUCTS[0]!,
      sku: "PV-001",
      price: { amountMinor: 1000, currency: "DOP" },
      netContent: "250 g",
      ingredients: text,
      allergens: text,
      shelfLife: text,
      storage: text,
      description: text,
      images: [{ src: "/a.jpg", alt: text, kind: "product", width: 1, height: 1 }],
    });
    expect(audit.complete).toBe(true);
  });
});

describe("disponibilidad", () => {
  const level = (available: number) => ({ productId: "x", available, updatedAt: "", source: "mock" as const });
  it("clasifica las existencias", () => {
    expect(availabilityOf(undefined)).toBe("unknown");
    expect(availabilityOf(level(0))).toBe("out_of_stock");
    expect(availabilityOf(level(5))).toBe("low_stock");
    expect(availabilityOf(level(6))).toBe("in_stock");
  });
});

describe("carrito", () => {
  it("suma, limita por existencias y quita", () => {
    let cart = addItem({ items: [] }, "a", 2);
    cart = addItem(cart, "a", 5, 4);
    expect(cart.items).toEqual([{ productId: "a", quantity: 4 }]);
    cart = addItem(cart, "b", 1);
    expect(itemCount(cart)).toBe(5);
    cart = setQuantity(cart, "a", 0);
    expect(cart.items).toEqual([{ productId: "b", quantity: 1 }]);
    expect(removeItem(cart, "b").items).toEqual([]);
  });

  it("no supera 20 unidades por línea", () => {
    expect(lineLimit(undefined)).toBe(20);
    expect(addItem({ items: [] }, "a", 50).items[0]?.quantity).toBe(20);
  });

  it("deja el total pendiente si falta algún precio", () => {
    const cart = { items: [{ productId: "a", quantity: 2 }, { productId: "b", quantity: 1 }] };
    const products = [
      { id: "a", price: { amountMinor: 15000, currency: "DOP" as const } },
      { id: "b", price: null },
    ];
    expect(cartTotals(cart, products)).toEqual({
      total: null,
      knownSubtotal: { amountMinor: 30000, currency: "DOP" },
      pricedLines: 1,
      unpricedLines: 1,
    });
    expect(cartTotals({ items: [cart.items[0]!] }, products).total).toEqual({ amountMinor: 30000, currency: "DOP" });
  });

  it("ignora datos guardados corruptos", () => {
    expect(parseStoredCart("no-json")).toEqual({ items: [] });
    expect(parseStoredCart('{"items":[{"productId":"a","quantity":"3"},{"productId":"b","quantity":2}]}')).toEqual({
      items: [{ productId: "b", quantity: 2 }],
    });
  });
});

describe("validación del pedido", () => {
  const valid = {
    lines: [
      { productId: "pv-001", quantity: 1 },
      { productId: "pv-001", quantity: 2 },
    ],
    customer: { name: "  Ana  ", phone: "+1 (809) 555-0100", email: "" },
    notes: "",
    locale: "en",
  };

  it("normaliza y fusiona líneas", () => {
    expect(parseOrderRequest(valid)).toEqual({
      lines: [{ productId: "pv-001", quantity: 3 }],
      customer: { name: "Ana", phone: "+1 (809) 555-0100" },
      locale: "en",
    });
  });

  it.each([
    ["sin líneas", { ...valid, lines: [] }, "lines"],
    ["cantidad decimal", { ...valid, lines: [{ productId: "pv-001", quantity: 1.5 }] }, "lines"],
    ["más de 20", { ...valid, lines: [{ productId: "pv-001", quantity: 21 }] }, "lines"],
    ["sin nombre", { ...valid, customer: { ...valid.customer, name: " " } }, "customer.name"],
    ["teléfono raro", { ...valid, customer: { ...valid.customer, phone: "abc" } }, "customer.phone"],
    ["correo raro", { ...valid, customer: { ...valid.customer, email: "a@" } }, "customer.email"],
  ])("rechaza %s", (_label, input, field) => {
    expect(() => parseOrderRequest(input)).toThrow();
    try {
      parseOrderRequest(input);
    } catch (e) {
      expect((e as { details?: { field?: string } }).details?.field).toBe(field);
    }
  });

  it("usa español si el idioma no es válido", () => {
    expect(parseOrderRequest({ ...valid, locale: "pl" }).locale).toBe("es");
  });
});

describe("traducciones", () => {
  const keys = (o: object, prefix = ""): string[] =>
    Object.entries(o).flatMap(([k, v]) => (typeof v === "object" && v !== null ? keys(v, `${prefix}${k}.`) : [`${prefix}${k}`]));

  it("español e inglés tienen las mismas claves y ningún texto vacío", () => {
    const es = getDictionary("es");
    const en = getDictionary("en");
    expect(keys(en)).toEqual(keys(es));
    const empty = (o: object): boolean =>
      Object.values(o).some((v) => (typeof v === "object" && v !== null ? empty(v) : v === ""));
    expect(empty(es) || empty(en)).toBe(false);
  });

  it("rellena variables", () => {
    expect(fill("Quedan {n} de {m}", { n: 2 })).toBe("Quedan 2 de {m}");
  });
});

describe("nombre como en la etiqueta", async () => {
  const { splitLabelName } = await import("../src/components/ProductName");
  it.each([
    ["Chutney de Cilantro", "CHUTNEY", "de CILANTRO"],
    ["Pesto de Cilantro con Semillas de Auyama", "PESTO", "de CILANTRO con SEMILLAS de AUYAMA"],
    ["Salsa de Aguacate y Jalapeño", "SALSA", "de AGUACATE y JALAPEÑO"],
    ["Guacamole", "GUACAMOLE", null],
  ])("%s", (name, main, sub) => {
    expect(splitLabelName(name)).toEqual({ main, sub });
  });
});


describe("formatos profesionales propuestos", () => {
  it.each(["es", "en"] as const)("%s no publica tamaños ni precios HoReCa", (locale) => {
    const business = getDictionary(locale).business;
    const text = JSON.stringify(business);
    expect(text).not.toMatch(/\d\s*(?:kg|ml|oz|g)\b/i);
    expect(text).not.toMatch(/\p{Sc}/u);
    expect(Object.keys(business.horeca.formats)).toHaveLength(4);
    expect(business.horeca.proposed).toBe(locale === "es" ? "Propuesto · por confirmar" : "Proposed · to be confirmed");
    expect(business.pending).toBe(locale === "es" ? "Por confirmar" : "To be confirmed");
  });
});
