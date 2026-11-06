import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CatalogFilter } from "@/components/CatalogFilter";
import { ProductCard } from "@/components/ProductCard";
import type { ProductCategory } from "@/lib/commerce/types";
import { pageMetadata } from "@/lib/site";
import { getDictionary, isLocale } from "@/lib/i18n";
import { loadCatalog } from "@/lib/shop";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = getDictionary(locale).catalog;
  return pageMetadata({ locale, path: "/productos", title: t.title, description: t.intro });
}

export default async function CatalogPage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);
  const { products } = await loadCatalog();
  const categories = [...new Set(products.map((p) => p.category))].map((id: ProductCategory) => ({
    id,
    label: t.category[id],
  }));

  return (
    <>
      <div className="page-head">
        <h1>{t.catalog.title}</h1>
        <p className="lead">{t.catalog.intro}</p>
      </div>
      <CatalogFilter categories={categories} allLabel={t.catalog.all} groupLabel={t.catalog.filterLabel} emptyLabel={t.catalog.empty}>
        {products.map((product, i) => (
          <div key={product.id} data-category={product.category} className="card-cell">
            <ProductCard product={product} locale={locale} priority={i < 3} headingLevel="h2" />
          </div>
        ))}
      </CatalogFilter>
    </>
  );
}
