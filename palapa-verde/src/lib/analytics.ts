/**
 * Capa de eventos independiente de las vistas de página de Vercel. Los eventos se envían a `window.dataLayer`
 * solo si existe (p. ej. cuando se instale Google Tag Manager u otra
 * herramienta aprobada). Sin proveedor no se envía nada a ningún sitio.
 *
 * Reglas: nunca datos personales en eventos o URLs. Solo identificadores de
 * contenido (slug de producto o receta, destino). Ver docs/strategy/08-qr-and-analytics.md.
 */
export const EVENTS = [
  "recipe_view",
  "product_recipe_click",
  "recipe_product_click",
  "where_to_buy_click",
  "retailer_outbound_click",
  "whatsapp_share_click",
  "recipe_print_click",
  "servings_change",
  "wholesale_contact_click",
  "email_draft_open",
  "qr_visit",
  "campaign_visit",
] as const;

export type AnalyticsEvent = (typeof EVENTS)[number];
export type EventProps = Record<string, string | number | boolean>;

type DataLayerWindow = Window & { dataLayer?: unknown[] };

/** Entorno para separar tráfico de previsualización y producción. */
export function siteEnv(): string {
  return process.env.NEXT_PUBLIC_VERCEL_ENV ?? "development";
}

export function track(event: AnalyticsEvent, props: EventProps = {}): void {
  if (typeof window === "undefined") return;
  const payload = { event, site_env: siteEnv(), ...props };
  const w = window as DataLayerWindow;
  if (Array.isArray(w.dataLayer)) w.dataLayer.push(payload);
  if (siteEnv() === "development") console.debug("[analytics]", payload);
}

/** Lee solo parámetros UTM (nunca otros datos de la URL). */
export function readUtm(search: string): Record<string, string> {
  const params = new URLSearchParams(search);
  const out: Record<string, string> = {};
  for (const key of ["utm_source", "utm_medium", "utm_campaign", "utm_content"]) {
    const v = params.get(key);
    if (v && /^[\w.-]{1,64}$/.test(v)) out[key] = v;
  }
  return out;
}
