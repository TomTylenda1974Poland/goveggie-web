export type CommerceErrorCode =
  | "NOT_CONFIGURED"
  | "INVALID_REQUEST"
  | "UNKNOWN_PRODUCT"
  | "OUT_OF_STOCK"
  | "UPSTREAM_ERROR"
  | "UPSTREAM_TIMEOUT";

export class CommerceError extends Error {
  readonly code: CommerceErrorCode;
  readonly details?: unknown;

  constructor(code: CommerceErrorCode, message: string, details?: unknown) {
    super(message);
    this.name = "CommerceError";
    this.code = code;
    this.details = details;
  }
}

export function isCommerceError(value: unknown): value is CommerceError {
  return value instanceof CommerceError;
}

/** Código HTTP que la API propia de la web devuelve para cada error. */
export function httpStatusFor(code: CommerceErrorCode): number {
  switch (code) {
    case "INVALID_REQUEST":
    case "UNKNOWN_PRODUCT":
      return 400;
    case "OUT_OF_STOCK":
      return 409;
    case "NOT_CONFIGURED":
      return 503;
    case "UPSTREAM_TIMEOUT":
      return 504;
    case "UPSTREAM_ERROR":
      return 502;
  }
}
