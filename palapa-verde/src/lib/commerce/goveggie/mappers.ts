/**
 * ⚠️ PROVISIONAL — traduce las respuestas SUPUESTAS de goveggie.life (dto.ts) al
 * modelo de la web. Comprueba los tipos en tiempo de ejecución: si la API real
 * no coincide, falla con UPSTREAM_ERROR en vez de mostrar datos equivocados.
 */
import { brandContentFor } from "../brand-content";
import { CommerceError } from "../errors";
import { orderTotal } from "../pricing";
import type {
  InventoryLevel,
  Localized,
  Money,
  Order,
  OrderRequest,
  Product,
  ProductCategory,
  ProductImage,
} from "../types";
import type { GvOrderRequestDto } from "./dto";

const CATEGORIES: readonly ProductCategory[] = ["chutney", "pesto", "hummus", "salsa"];

type Obj = Record<string, unknown>;
const isObj = (v: unknown): v is Obj => typeof v === "object" && v !== null && !Array.isArray(v);

function bad(what: string, details?: unknown): never {
  throw new CommerceError("UPSTREAM_ERROR", `Respuesta no válida de goveggie.life: ${what}`, details);
}

function str(o: Obj, key: string, ctx: string): string {
  const v = o[key];
  if (typeof v !== "string" || v.length === 0) bad(`${ctx}.${key}`);
  return v;
}

function optStr(o: Obj, key: string): string | null {
  const v = o[key];
  return typeof v === "string" && v.trim().length > 0 ? v : null;
}

/** El español es obligatorio; si falta el inglés se muestra el español (no se traduce solo). */
function localized(v: unknown): Localized | null {
  if (!isObj(v)) return null;
  const es = typeof v.es === "string" && v.es.trim() ? v.es : null;
  if (es === null) return null;
  const en = typeof v.en === "string" && v.en.trim() ? v.en : es;
  return { es, en };
}

function money(minor: unknown, currency: unknown, ctx: string): Money | null {
  if (minor === null || minor === undefined) return null;
  if (typeof minor !== "number" || !Number.isInteger(minor) || minor < 0) bad(`${ctx}.price_minor`);
  if (currency !== "DOP") bad(`${ctx}.currency (solo DOP)`, { currency });
  return { amountMinor: minor, currency: "DOP" };
}

export function mapProduct(dto: unknown): Product {
  if (!isObj(dto)) bad("producto");
  const slug = str(dto, "slug", "product");
  const ctx = `product[${slug}]`;
  const category = str(dto, "category", ctx) as ProductCategory;
  if (!CATEGORIES.includes(category)) bad(`${ctx}.category`, { category });
  const name = localized(dto.name);
  if (name === null) bad(`${ctx}.name.es`);

  const apiImages: ProductImage[] = Array.isArray(dto.images)
    ? dto.images.filter(isObj).flatMap((img) => {
        const url = optStr(img, "url");
        if (url === null) return [];
        return [
          {
            src: url,
            alt: localized(img.alt) ?? name,
            kind: "product" as const,
            width: typeof img.width === "number" ? img.width : 800,
            height: typeof img.height === "number" ? img.height : 800,
          },
        ];
      })
    : [];
  const brand = brandContentFor(slug);

  return {
    id: str(dto, "id", ctx),
    slug,
    sku: optStr(dto, "sku"),
    name,
    category,
    art: brand.art,
    description: localized(dto.description),
    price: money(dto.price_minor, dto.currency, ctx),
    netContent: optStr(dto, "net_content"),
    ingredients: localized(dto.ingredients),
    allergens: localized(dto.allergens),
    shelfLife: localized(dto.shelf_life),
    storage: localized(dto.storage),
    images: apiImages.length > 0 ? apiImages : brand.images,
    status: dto.status === "active" ? "active" : "draft",
  };
}

export function mapInventory(dto: unknown): InventoryLevel {
  if (!isObj(dto)) bad("inventario");
  const productId = str(dto, "product_id", "inventory");
  const available = dto.available;
  if (typeof available !== "number" || !Number.isInteger(available) || available < 0) {
    bad(`inventory[${productId}].available`);
  }
  return {
    productId,
    available,
    updatedAt: str(dto, "updated_at", `inventory[${productId}]`),
    source: "goveggie",
  };
}

export function toOrderRequestDto(request: OrderRequest): GvOrderRequestDto {
  return {
    brand: "palapa-verde",
    channel: "web",
    locale: request.locale,
    customer: { ...request.customer },
    ...(request.notes === undefined ? {} : { notes: request.notes }),
    lines: request.lines.map((l) => ({ product_id: l.productId, quantity: l.quantity })),
  };
}

export function mapOrder(dto: unknown): Order {
  if (!isObj(dto)) bad("pedido");
  const id = str(dto, "id", "order");
  if (!Array.isArray(dto.lines)) bad(`order[${id}].lines`);
  const lines = dto.lines.map((raw, i) => {
    if (!isObj(raw)) bad(`order[${id}].lines[${i}]`);
    const quantity = raw.quantity;
    if (typeof quantity !== "number" || !Number.isInteger(quantity) || quantity < 1) {
      bad(`order[${id}].lines[${i}].quantity`);
    }
    return {
      productId: str(raw, "product_id", `order[${id}].lines[${i}]`),
      quantity,
      unitPrice: money(raw.unit_price_minor, "DOP", `order[${id}].lines[${i}]`),
    };
  });
  return {
    id,
    status: "received",
    lines,
    total: orderTotal(lines),
    createdAt: str(dto, "created_at", `order[${id}]`),
    test: false,
  };
}
