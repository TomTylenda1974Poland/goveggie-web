import { GoVeggieLifeProvider } from "./goveggie/goveggie-provider";
import { MockCommerceProvider } from "./mock/mock-provider";
import type { CommerceProvider } from "./provider";

/** Variables leídas: COMMERCE_PROVIDER, GOVEGGIE_API_URL, GOVEGGIE_API_KEY. */
export type CommerceEnv = { readonly [key: string]: string | undefined };

/** Elige la fuente de datos según `COMMERCE_PROVIDER` (por defecto: datos de prueba). */
export function createCommerceProvider(env: CommerceEnv = process.env): CommerceProvider {
  const which = (env.COMMERCE_PROVIDER ?? "mock").trim() || "mock";
  switch (which) {
    case "mock":
      return new MockCommerceProvider();
    case "goveggie":
      return new GoVeggieLifeProvider({
        baseUrl: env.GOVEGGIE_API_URL?.trim() || undefined,
        apiKey: env.GOVEGGIE_API_KEY?.trim() || undefined,
      });
    default:
      throw new Error(`COMMERCE_PROVIDER desconocido: "${which}" (usa "mock" o "goveggie")`);
  }
}

let cached: CommerceProvider | undefined;

/** Proveedor único por proceso de servidor. Solo usar en código de servidor. */
export function getCommerce(): CommerceProvider {
  cached ??= createCommerceProvider();
  return cached;
}

export type { CommerceProvider } from "./provider";
export * from "./types";
