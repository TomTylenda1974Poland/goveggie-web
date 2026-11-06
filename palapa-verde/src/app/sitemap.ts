import type { MetadataRoute } from "next";
import { visibleRecipes } from "@/content/recipes";
import { BRAND_CONTENT } from "@/lib/commerce/brand-content";
import { LOCALES } from "@/lib/commerce/types";
import { siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  const pages = ["", "/productos", "/recetas", "/donde-comprar", "/nosotros", "/preguntas", "/negocios"];
  const products = Object.keys(BRAND_CONTENT).map((slug) => `/productos/${slug}`);
  const recipes = visibleRecipes()
    .filter((r) => r.status === "tested")
    .map((r) => `/recetas/${r.slug}`);
  return LOCALES.flatMap((locale) => [...pages, ...products, ...recipes].map((path) => ({ url: `${base}/${locale}${path}` })));
}
