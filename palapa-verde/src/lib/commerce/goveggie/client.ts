import { CommerceError } from "../errors";

export type GoVeggieClientConfig = {
  baseUrl: string;
  apiKey?: string;
  timeoutMs?: number;
  /** Segundos de caché de Next.js para las lecturas. */
  revalidateSeconds?: number;
  fetch?: typeof fetch;
};

type NextRequestInit = RequestInit & { next?: { revalidate?: number | false } };

export type GvResponse = { status: number; body: unknown };

/**
 * Cliente HTTP mínimo para goveggie.life: URL base, autenticación Bearer,
 * tiempo límite y traducción de errores a `CommerceError`. Sin lógica de negocio.
 */
export class GoVeggieHttpClient {
  private readonly baseUrl: string;
  private readonly apiKey?: string;
  private readonly timeoutMs: number;
  private readonly revalidateSeconds: number;
  private readonly fetchImpl: typeof fetch;

  constructor(config: GoVeggieClientConfig) {
    this.baseUrl = config.baseUrl.replace(/\/+$/, "");
    this.apiKey = config.apiKey;
    this.timeoutMs = config.timeoutMs ?? 8000;
    this.revalidateSeconds = config.revalidateSeconds ?? 300;
    this.fetchImpl = config.fetch ?? fetch;
  }

  get(path: string, query?: Record<string, string>, allow404 = false): Promise<GvResponse> {
    const qs = query ? `?${new URLSearchParams(query).toString()}` : "";
    return this.request(`${path}${qs}`, { method: "GET", next: { revalidate: this.revalidateSeconds } }, allow404);
  }

  post(path: string, body: unknown, headers: Record<string, string> = {}): Promise<GvResponse> {
    return this.request(path, {
      method: "POST",
      cache: "no-store",
      headers: { "content-type": "application/json", ...headers },
      body: JSON.stringify(body),
    });
  }

  private async request(path: string, init: NextRequestInit, allow404 = false): Promise<GvResponse> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeoutMs);
    const headers = new Headers(init.headers);
    headers.set("accept", "application/json");
    if (this.apiKey) headers.set("authorization", `Bearer ${this.apiKey}`);

    // El límite de tiempo cubre la conexión Y la lectura completa del cuerpo.
    let res: Response;
    let text: string;
    try {
      res = await this.fetchImpl(`${this.baseUrl}${path}`, { ...init, headers, signal: controller.signal });
      if (res.status === 404 && allow404) return { status: 404, body: null };
      text = await res.text();
    } catch (error) {
      if (controller.signal.aborted) {
        throw new CommerceError("UPSTREAM_TIMEOUT", "goveggie.life no respondió a tiempo", { path });
      }
      throw new CommerceError("UPSTREAM_ERROR", "No se pudo conectar con goveggie.life", {
        path,
        cause: error instanceof Error ? error.message : String(error),
      });
    } finally {
      clearTimeout(timer);
    }

    let body: unknown = null;
    if (text.length > 0) {
      try {
        body = JSON.parse(text);
      } catch {
        throw new CommerceError("UPSTREAM_ERROR", "goveggie.life devolvió una respuesta que no es JSON", {
          path,
          status: res.status,
        });
      }
    }

    if (!res.ok) {
      const code =
        res.status === 409 ? "OUT_OF_STOCK" : res.status === 400 || res.status === 422 ? "INVALID_REQUEST" : "UPSTREAM_ERROR";
      throw new CommerceError(code, `goveggie.life respondió ${res.status}`, { path, status: res.status, body });
    }
    return { status: res.status, body };
  }
}
