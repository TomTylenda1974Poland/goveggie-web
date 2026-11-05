import type { Localized, Product } from "./types";

/** Campos que el negocio debe completar antes de vender cada producto. */
export const AUDITED_FIELDS = [
  "price",
  "netContent",
  "ingredients",
  "allergens",
  "shelfLife",
  "storage",
  "description",
  "sku",
  "productPhoto",
] as const;

export type AuditedField = (typeof AUDITED_FIELDS)[number];

/** `missing`: no hay dato. `partial`: solo en español. `ok`: completo. */
export type FieldState = "missing" | "partial" | "ok";

export type FieldAudit = { field: AuditedField; state: FieldState };

export type ProductAudit = {
  product: Product;
  fields: FieldAudit[];
  missing: number;
  /** Se puede vender cuando no falta ningún campo obligatorio. */
  readyToSell: boolean;
};

function localizedState(value: Localized | null): FieldState {
  if (value === null || value.es.trim() === "") return "missing";
  if (value.en.trim() === "" || value.en === value.es) return "partial";
  return "ok";
}

export function auditProduct(product: Product): ProductAudit {
  const states: Record<AuditedField, FieldState> = {
    price: product.price === null ? "missing" : "ok",
    netContent: product.netContent === null ? "missing" : "ok",
    ingredients: localizedState(product.ingredients),
    allergens: localizedState(product.allergens),
    shelfLife: localizedState(product.shelfLife),
    storage: localizedState(product.storage),
    description: localizedState(product.description),
    sku: product.sku === null ? "missing" : "ok",
    productPhoto: product.images.some((i) => i.kind === "product") ? "ok" : "missing",
  };
  const fields = AUDITED_FIELDS.map((field) => ({ field, state: states[field] }));
  const missing = fields.filter((f) => f.state === "missing").length;
  return { product, fields, missing, readyToSell: missing === 0 };
}

export function auditCatalog(products: readonly Product[]): ProductAudit[] {
  return products.map(auditProduct);
}
