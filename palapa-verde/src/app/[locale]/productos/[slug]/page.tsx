import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/ProductCard";
import { ProductName } from "@/components/ProductName";
import { ProductVisual } from "@/components/ProductVisual";
import { QrWelcome } from "@/components/QrWelcome";
import { RecipeCard } from "@/components/RecipeCard";
import { StatusBadge } from "@/components/StatusBadge";
import { relationship } from "@/content/brand";
import { recipesForProduct } from "@/content/recipes";
import { getCommerce } from "@/lib/commerce";
import { LOCALES, type Localized } from "@/lib/commerce/types";
import { formatMoney } from "@/lib/format";
import { getDictionary, isLocale, pick } from "@/lib/i18n";
import { loadCatalog } from "@/lib/shop";

type Props = { params: Promise<{ locale: string; slug: string }> };

export const dynamicParams = false;

export async function generateStaticParams() {
  const products = await getCommerce().listProducts();
  return LOCALES.flatMap((locale) => products.map((p) => ({ locale, slug: p.slug })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const product = (await loadCatalog()).products.find((p) => p.slug === slug);
  if (!product) return {};
  const ideas = product.servingIdeas.map((i) => pick(i, locale)).join(" ");
  const image = product.images[0]?.src;
  return {
    title: pick(product.name, locale),
    description: ideas || undefined,
    openGraph: image ? { images: [image] } : undefined,
  };
}

/**
 * Ficha de producto y destino de los códigos QR del envase (/p/{qrId}):
 * producto exacto, tres ideas, recetas, información aprobada y dónde comprar.
 */
export default async function ProductPage({ params }: Props) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);
  const p = t.product;
  const { products } = await loadCatalog();
  const product = products.find((x) => x.slug === slug);
  if (!product) notFound();

  const recipes = recipesForProduct(product.slug);
  const related = products.filter((x) => x.id !== product.id).slice(0, 3);
  const showPrice = product.launch === "available" && product.price !== null;

  // Solo se muestran datos aprobados (no nulos). Si no hay ninguno, un aviso honesto.
  const facts: [string, string][] = (
    [
      [p.taste, product.taste],
      [p.texture, product.texture],
      [p.heat, product.heat],
      [p.ingredients, product.ingredients],
      [p.allergens, product.allergens],
      [p.storage, product.storage],
      [p.shelfLife, product.shelfLife],
    ] as [string, Localized | null][]
  ).flatMap(([label, v]) => (v ? [[label, pick(v, locale)] as [string, string]] : []));
  if (product.netContent) facts.unshift([p.netContent, product.netContent]);

  return (
    <>
      <nav className="crumbs" aria-label={locale === "es" ? "Migas de pan" : "Breadcrumb"}>
        <Link href={`/${locale}/productos`} className="back">
          ← {p.back}
        </Link>
      </nav>

      <QrWelcome text={p.qrWelcome} />

      <article className="panel product">
        <div className="product-media">
          <ProductVisual product={product} locale={locale} size="detail" priority />
        </div>
        <div className="product-info">
          <p className="kicker">{t.category[product.category]}</p>
          <ProductName name={product.name} locale={locale} as="h1" size="page" />
          {relationship.endorsement ? <p className="brand-line">{pick(relationship.endorsement, locale)}</p> : <hr className="rule" />}
          <div className="product-buy">
            {showPrice && product.price ? <p className="price price--lg">{formatMoney(product.price, locale)}</p> : null}
            <StatusBadge status={product.launch} locale={locale} />
          </div>
          {product.description ? <p className="lead">{pick(product.description, locale)}</p> : null}

          <h2 className="h-sm">{p.ideasHeading}</h2>
          <ol className="ideas">
            {product.servingIdeas.map((idea, i) => (
              <li key={i}>{pick(idea, locale)}</li>
            ))}
          </ol>

          <div className="cta-row">
            <Link
              className="btn arrow"
              href={`/${locale}/recetas?producto=${product.slug}`}
              data-track="product_recipe_click"
              data-track-product={product.slug}
            >
              {p.seeRecipes}
            </Link>
            <Link
              className="btn btn--ghost"
              href={`/${locale}/donde-comprar`}
              data-track="where_to_buy_click"
              data-track-from="product"
              data-track-product={product.slug}
            >
              {p.whereToBuy}
            </Link>
          </div>

          <h2 className="h-sm">{p.details}</h2>
          {facts.length > 0 ? (
            <table className="spec-table">
              <tbody>
                {facts.map(([label, value]) => (
                  <tr key={label}>
                    <th scope="row">{label}</th>
                    <td>{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : null}
          {facts.length < 8 ? <p className="note">{p.detailsPending}</p> : null}

          {product.art.length > 0 ? (
            <p className="veg-line veg-line--lg">
              <span className="veg-label">{p.keyVeg}</span>
              {product.art.map((key) => (
                <span key={key} className="veg-chip">
                  {t.veg[key]}
                </span>
              ))}
            </p>
          ) : null}
        </div>
      </article>

      <section aria-labelledby="h-recipes">
        <div className="section-head">
          <h2 id="h-recipes">{p.recipesHeading}</h2>
        </div>
        {recipes.length > 0 ? (
          <div className="rcards">
            {recipes.map((r) => (
              <RecipeCard key={r.slug} recipe={r} product={product} locale={locale} />
            ))}
          </div>
        ) : (
          <p className="note">{p.recipesEmpty}</p>
        )}
      </section>

      {related.length > 0 ? (
        <section aria-labelledby="h-related">
          <div className="section-head">
            <h2 id="h-related">{p.related}</h2>
          </div>
          <div className="cards">
            {related.map((x) => (
              <ProductCard key={x.id} product={x} locale={locale} />
            ))}
          </div>
        </section>
      ) : null}
    </>
  );
}
