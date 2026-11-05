import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { AddToCart } from "@/components/AddToCart";
import { AvailabilityBadge } from "@/components/AvailabilityBadge";
import { ProductCard } from "@/components/ProductCard";
import { ProductName } from "@/components/ProductName";
import { ProductVisual } from "@/components/ProductVisual";
import { PRODUCE_PHOTOS } from "@/lib/commerce/brand-content";
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
  return product ? { title: pick(product.name, locale) } : {};
}

export default async function ProductPage({ params }: Props) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);
  const { products, inventory, availability } = await loadCatalog();
  const product = products.find((p) => p.slug === slug);
  if (!product) notFound();

  const rows: { label: string; value: ReactNode | null }[] = [
    { label: t.product.netContent, value: product.netContent },
    ...(
      [
        [t.product.ingredients, product.ingredients],
        [t.product.allergens, product.allergens],
        [t.product.shelfLife, product.shelfLife],
        [t.product.storage, product.storage],
      ] as [string, Localized | null][]
    ).map(([label, value]) => ({ label, value: value ? pick(value, locale) : null })),
  ];
  const hasPending = rows.some((r) => r.value === null);
  const related = products.filter((p) => p.id !== product.id).slice(0, 3);
  const produce = product.art.flatMap((key) => {
    const src = PRODUCE_PHOTOS[key];
    return src ? [{ key, src }] : [];
  });

  return (
    <>
      <nav className="crumbs" aria-label={locale === "es" ? "Migas de pan" : "Breadcrumb"}>
        <Link href={`/${locale}/productos`} className="back">
          ← {t.product.back}
        </Link>
      </nav>

      <article className="panel product">
        <div className="product-media">
          <ProductVisual product={product} locale={locale} size="detail" priority />
        </div>
        <div className="product-info">
          <p className="kicker">{t.category[product.category]}</p>
          <ProductName name={product.name} locale={locale} as="h1" size="page" />
          <p className="brand-line">{t.product.brandLine}</p>
          {product.art.length > 0 ? (
            <p className="veg-line veg-line--lg">
              <span className="veg-label">{t.product.keyVeg}</span>
              {product.art.map((key) => (
                <span key={key} className="veg-chip">
                  {t.veg[key]}
                </span>
              ))}
            </p>
          ) : null}
          {product.description ? <p className="lead">{pick(product.description, locale)}</p> : null}
          <div className="product-buy">
            <p className="price price--lg">
              {product.price ? formatMoney(product.price, locale) : <small>{t.product.pricePending}</small>}
            </p>
            <AvailabilityBadge availability={availability(product.id)} locale={locale} />
          </div>
          <AddToCart
            productId={product.id}
            stock={inventory.get(product.id)?.available}
            cartHref={`/${locale}/carrito`}
            labels={{
              quantity: t.product.quantity,
              addToCart: t.product.addToCart,
              added: t.product.added,
              unavailable: t.product.unavailable,
              cart: t.nav.cart,
              decrease: t.cart.decrease,
              increase: t.cart.increase,
            }}
          />
          <h2 className="h-sm">{t.product.details}</h2>
          <table className="spec-table">
            <tbody>
              {rows.map(({ label, value }) => (
                <tr key={label}>
                  <th scope="row">{label}</th>
                  <td>{value ?? <span className="pending">{t.product.pending}</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {hasPending ? <p className="note">{t.product.pendingNote}</p> : null}
        </div>
      </article>

      <section className="panel made-with" aria-label={t.product.madeWith}>
        <p className="made-with-text">{t.product.madeWith}</p>
        {produce.length > 0 ? (
          <ul className="produce produce--inline">
            {produce.map(({ key, src }) => (
              <li key={key}>
                <Image src={src} alt="" width={384} height={300} sizes="140px" />
                <span>{t.veg[key]}</span>
              </li>
            ))}
          </ul>
        ) : null}
      </section>

      {related.length > 0 ? (
        <section aria-labelledby="h-related">
          <div className="section-head">
            <h2 id="h-related">{t.product.related}</h2>
          </div>
          <div className="cards">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} availability={availability(p.id)} locale={locale} />
            ))}
          </div>
        </section>
      ) : null}
    </>
  );
}
