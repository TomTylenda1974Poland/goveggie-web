import type { MetadataRoute } from "next";

/** Sin indexación hasta el lanzamiento (SITE_INDEXABLE=true). */
export default function robots(): MetadataRoute.Robots {
  if (process.env.SITE_INDEXABLE !== "true") return { rules: { userAgent: "*", disallow: "/" } };
  const base = process.env.SITE_URL;
  return { rules: { userAgent: "*", allow: "/", disallow: ["/es/admin", "/en/admin", "/api/"] }, ...(base ? { sitemap: `${base}/sitemap.xml` } : {}) };
}
