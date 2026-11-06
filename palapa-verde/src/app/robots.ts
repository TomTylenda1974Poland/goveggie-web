import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

/** Sin indexación hasta el lanzamiento (SITE_INDEXABLE=true). */
export default function robots(): MetadataRoute.Robots {
  if (process.env.SITE_INDEXABLE !== "true") return { rules: { userAgent: "*", disallow: "/" } };
  return { rules: { userAgent: "*", allow: "/", disallow: ["/es/admin", "/en/admin", "/api/"] }, sitemap: `${siteUrl()}/sitemap.xml` };
}
