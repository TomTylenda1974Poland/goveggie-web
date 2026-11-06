/**
 * URL pública absoluta del sitio (metadatos, sitemap). Prioridad: SITE_URL (dominio
 * aprobado) → dominio de producción de Vercel → URL del despliegue → localhost.
 * Una variable vacía cuenta como no definida.
 */
export function siteUrl(env: Record<string, string | undefined> = process.env): string {
  const explicit = env.SITE_URL?.trim();
  if (explicit) return explicit.replace(/\/+$/, "");
  const host =
    env.VERCEL_ENV === "production" ? env.VERCEL_PROJECT_PRODUCTION_URL?.trim() || env.VERCEL_URL?.trim() : env.VERCEL_URL?.trim();
  return host ? `https://${host}` : "http://localhost:3000";
}

/** Canonical y alternativas de idioma para una ruta sin prefijo (p. ej. "/recetas"). */
export function alternatesFor(locale: string, path: string) {
  return {
    canonical: `/${locale}${path}`,
    languages: { es: `/es${path}`, en: `/en${path}`, "x-default": `/es${path}` },
  };
}

type PageMetaInput = { locale: string; path: string; title?: string; description?: string; image?: string; noindex?: boolean };

/** Metadatos completos de una página: canonical, hreflang y Open Graph propios. */
export function pageMetadata({ locale, path, title, description, image, noindex }: PageMetaInput) {
  return {
    ...(title ? { title } : {}),
    ...(description ? { description } : {}),
    alternates: alternatesFor(locale, path),
    openGraph: {
      type: "website" as const,
      siteName: "Palapa Verde",
      locale: locale === "es" ? "es_DO" : "en_US",
      url: `/${locale}${path}`,
      ...(title ? { title } : {}),
      ...(description ? { description } : {}),
      images: [{ url: image ?? "/media/linea-botanica.webp", width: 1536, height: 1024 }],
    },
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
  };
}
