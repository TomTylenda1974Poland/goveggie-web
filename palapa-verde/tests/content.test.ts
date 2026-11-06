import { describe, expect, it } from "vitest";
import { BRAND_RELATIONSHIP, CONTACT, MANUFACTURER, RELATIONSHIP_COPY } from "../src/content/brand";
import { FAQ } from "../src/content/faq";
import { RECIPES, showDraftRecipes, timeBucket, visibleRecipes } from "../src/content/recipes";
import { STOCKISTS } from "../src/content/stockists";
import { BRAND_CONTENT } from "../src/lib/commerce/brand-content";
import { MOCK_PRODUCTS } from "../src/lib/commerce/mock/fixtures";
import { formatQty, ingredientText, roundQty, whatsappShareUrl } from "../src/lib/recipe-format";

const productSlugs = new Set(MOCK_PRODUCTS.map((p) => p.slug));

describe("recetas", () => {
  it("hay diez, dos por producto, todas en borrador", () => {
    expect(RECIPES).toHaveLength(10);
    for (const slug of productSlugs) expect(RECIPES.filter((r) => r.product === slug)).toHaveLength(2);
    expect(RECIPES.every((r) => r.status === "draft")).toBe(true);
    expect(new Set(RECIPES.map((r) => r.slug)).size).toBe(10);
  });

  it.each(RECIPES.map((r) => [r.slug, r] as const))("%s está completa en los dos idiomas", (_slug, r) => {
    for (const text of [r.title, r.intro, r.allergens, ...r.steps, ...r.substitutions]) {
      expect(text.es.trim()).not.toBe("");
      expect(text.en.trim()).not.toBe("");
    }
    expect(r.steps.length).toBeGreaterThanOrEqual(3);
    expect(r.steps.length).toBeLessThanOrEqual(5);
    expect(r.servings).toBeGreaterThan(0);
    expect(r.occasions.length).toBeGreaterThan(0);
    // La línea del producto Palapa Verde existe, tiene cantidad y apunta al producto de la receta.
    const productLines = r.ingredients.filter((i) => i.product);
    expect(productLines).toHaveLength(1);
    expect(productLines[0]?.product).toBe(r.product);
    expect(productLines[0]?.qty).toBeGreaterThan(0);
    // Sin fotos ni vídeos inventados.
    expect(r.media.photo).toBeNull();
    expect(r.media.video).toBeNull();
  });

  it("no se describen como probadas", () => {
    const text = JSON.stringify(RECIPES).toLowerCase();
    for (const banned of ["probada", "probado", "tested", "favorit", "kcal", "calorías", "calories", "costo por porción"]) {
      expect(text).not.toContain(banned);
    }
  });

  it("los borradores se ocultan en producción salvo que se pida", () => {
    expect(showDraftRecipes({ VERCEL_ENV: "preview" })).toBe(true);
    expect(showDraftRecipes({})).toBe(true);
    expect(showDraftRecipes({ VERCEL_ENV: "production" })).toBe(false);
    expect(showDraftRecipes({ VERCEL_ENV: "production", SHOW_DRAFT_RECIPES: "true" })).toBe(true);
    expect(visibleRecipes({ VERCEL_ENV: "production" })).toHaveLength(0);
  });

  it("clasifica por tiempo total", () => {
    expect(timeBucket({ prepMinutes: 5, cookMinutes: 5 })).toBe("15");
    expect(timeBucket({ prepMinutes: 10, cookMinutes: 15 })).toBe("30");
    expect(timeBucket({ prepMinutes: 15, cookMinutes: 25 })).toBe("60");
  });
});

describe("escalado de cantidades", () => {
  const recipe = RECIPES.find((r) => r.slug === "sandwich-de-pollo-con-chutney-de-cilantro")!;
  const line = (i: number, factor: number, locale: "es" | "en" = "es") => ingredientText(recipe.ingredients[i]!, factor, locale);

  it("redondea por unidad", () => {
    expect(roundQty(123, "g")).toBe(125);
    expect(roundQty(12.4, "g")).toBe(12);
    expect(roundQty(0.6, "tbsp")).toBe(0.5);
    expect(formatQty(1.5, "cup")).toBe("1½");
    expect(formatQty(0.25, "tsp")).toBe("¼");
  });

  it("escala gramos, medidas y unidades con singular y plural", () => {
    expect(line(0, 1)).toBe("300 g de pechuga de pollo sin hueso");
    expect(line(0, 2)).toBe("600 g de pechuga de pollo sin hueso");
    expect(line(4, 0.5)).toBe("1 pan de agua");
    expect(line(4, 1)).toBe("2 panes de agua");
    expect(line(4, 1, "en")).toBe("2 Dominican bread rolls");
    expect(line(8, 1)).toBe("60 g (4 cdas.) de Chutney de Cilantro Palapa Verde");
    expect(line(8, 2, "en")).toBe("120 g (8 tbsp) Palapa Verde Cilantro Chutney");
  });

  it("marca opcionales y «al gusto»", () => {
    const casabe = RECIPES.find((r) => r.slug === "casabe-con-hummus-de-remolacha-y-aguacate")!;
    const cilantro = casabe.ingredients.find((i) => i.qty === null)!;
    expect(ingredientText(cilantro, 1, "es")).toBe("Hojas de cilantro, al gusto (opcional)");
  });

  it("el enlace de WhatsApp solo lleva el texto compartido", () => {
    expect(whatsappShareUrl("Receta\nhttps://x.test/es/recetas/a")).toBe(
      "https://wa.me/?text=Receta%0Ahttps%3A%2F%2Fx.test%2Fes%2Frecetas%2Fa",
    );
  });
});

describe("hechos de marca y prelanzamiento", () => {
  it("la relación de marca queda sin confirmar por defecto y sin aval", () => {
    expect(BRAND_RELATIONSHIP).toBe("unconfirmed");
    expect(RELATIONSHIP_COPY.unconfirmed.endorsement).toBeNull();
    expect(RELATIONSHIP_COPY.unconfirmed.statement.es).not.toMatch(/una marca de go veggie life|elaborado con vegetales de/i);
  });

  it("no hay fabricante, tiendas ni canal de contacto inventados", () => {
    expect(MANUFACTURER).toBeNull();
    expect(STOCKISTS).toHaveLength(0);
    expect(CONTACT).toEqual({ salesEmail: null, whatsappNumber: null });
  });

  it("ningún producto figura a la venta y cada uno tiene tres ideas y QR único", () => {
    const contents = Object.values(BRAND_CONTENT);
    expect(contents.every((c) => c.launch !== "available")).toBe(true);
    expect(contents.every((c) => c.servingIdeas.length === 3)).toBe(true);
    const qr = contents.map((c) => c.qrId);
    expect(qr.every((q) => q && /^[a-z0-9-]+$/.test(q))).toBe(true);
    expect(new Set(qr).size).toBe(qr.length);
  });

  it("las FAQ con enlace apuntan a rutas existentes", () => {
    const routes = new Set(["/recetas", "/donde-comprar", "/nosotros", "/negocios", "/productos", "/preguntas"]);
    for (const item of FAQ) if (item.href) expect(routes.has(item.href)).toBe(true);
  });
});
