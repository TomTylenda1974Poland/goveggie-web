import { CommerceError } from "./errors";
import { LOCALES, type Locale, type OrderLine, type OrderRequest } from "./types";

export const MAX_QUANTITY_PER_LINE = 20;
export const MAX_LINES = 20;

const isRecord = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null && !Array.isArray(v);

function text(value: unknown, field: string, max: number, required: boolean): string | undefined {
  if (value === undefined || value === null || value === "") {
    if (required) throw new CommerceError("INVALID_REQUEST", `Falta ${field}`, { field });
    return undefined;
  }
  if (typeof value !== "string") {
    throw new CommerceError("INVALID_REQUEST", `${field} debe ser texto`, { field });
  }
  const trimmed = value.trim();
  if (required && trimmed.length === 0) {
    throw new CommerceError("INVALID_REQUEST", `Falta ${field}`, { field });
  }
  if (trimmed.length > max) {
    throw new CommerceError("INVALID_REQUEST", `${field} es demasiado largo`, { field, max });
  }
  return trimmed.length > 0 ? trimmed : undefined;
}

/**
 * Valida y normaliza un pedido que llega del navegador. Fusiona líneas repetidas
 * del mismo producto. Lanza `CommerceError("INVALID_REQUEST")` con `details.field`.
 */
export function parseOrderRequest(input: unknown): OrderRequest {
  if (!isRecord(input)) throw new CommerceError("INVALID_REQUEST", "Pedido vacío");

  if (!Array.isArray(input.lines) || input.lines.length === 0) {
    throw new CommerceError("INVALID_REQUEST", "El pedido no tiene productos", { field: "lines" });
  }
  if (input.lines.length > MAX_LINES) {
    throw new CommerceError("INVALID_REQUEST", "Demasiadas líneas", { field: "lines" });
  }

  const merged = new Map<string, number>();
  for (const raw of input.lines) {
    if (!isRecord(raw) || typeof raw.productId !== "string" || raw.productId.length === 0) {
      throw new CommerceError("INVALID_REQUEST", "Producto no válido", { field: "lines" });
    }
    const q = raw.quantity;
    if (typeof q !== "number" || !Number.isInteger(q) || q < 1) {
      throw new CommerceError("INVALID_REQUEST", "Cantidad no válida", { field: "lines" });
    }
    merged.set(raw.productId, (merged.get(raw.productId) ?? 0) + q);
  }
  const lines: OrderLine[] = [...merged].map(([productId, quantity]) => ({ productId, quantity }));
  for (const line of lines) {
    if (line.quantity > MAX_QUANTITY_PER_LINE) {
      throw new CommerceError("INVALID_REQUEST", "Cantidad demasiado alta", {
        field: "lines",
        productId: line.productId,
        max: MAX_QUANTITY_PER_LINE,
      });
    }
  }

  if (!isRecord(input.customer)) {
    throw new CommerceError("INVALID_REQUEST", "Faltan los datos de contacto", { field: "customer" });
  }
  const name = text(input.customer.name, "customer.name", 120, true)!;
  const phone = text(input.customer.phone, "customer.phone", 40, true)!;
  if (!/^[+\d][\d\s().-]{6,}$/.test(phone)) {
    throw new CommerceError("INVALID_REQUEST", "Teléfono no válido", { field: "customer.phone" });
  }
  const email = text(input.customer.email, "customer.email", 200, false);
  if (email !== undefined && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new CommerceError("INVALID_REQUEST", "Correo no válido", { field: "customer.email" });
  }
  const notes = text(input.notes, "notes", 1000, false);

  const locale: Locale = LOCALES.includes(input.locale as Locale) ? (input.locale as Locale) : "es";

  return {
    lines,
    customer: email === undefined ? { name, phone } : { name, phone, email },
    ...(notes === undefined ? {} : { notes }),
    locale,
  };
}
