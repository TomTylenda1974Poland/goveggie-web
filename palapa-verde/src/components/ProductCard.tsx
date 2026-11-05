import Link from "next/link";
import { AvailabilityBadge } from "@/components/AvailabilityBadge";
import { ProductName } from "@/components/ProductName";
import { ProductVisual } from "@/components/ProductVisual";
import type { Availability, Locale, Product } from "@/lib/commerce/types";
import { formatMoney } from "@/lib/format";
import { getDictionary, pick } from "@/lib/i18n";

type Props = { product: Product; availability: Availability; locale: Locale; priority?: boolean };

export function ProductCard({ product, availability, locale, priority }: Props) {
  const t = getDictionary(locale);
  const href = `/${locale}/productos/${product.slug}`;
  return (
    <article className="card">
      <div className="card-media">
        <ProductVisual product={product} locale={locale} size="card" priority={priority} hideNote />
      </div>
      <header className="card-head">
        <p className="card-cat">{t.category[product.category]}</p>
        <h3>
          <Link href={href} className="card-title" aria-label={pick(product.name, locale)}>
            <ProductName name={product.name} locale={locale} />
          </Link>
        </h3>
      </header>
      {product.art.length > 0 ? (
        <p className="veg-line">
          <span className="sr-only">{t.product.keyVeg}: </span>
          {product.art.map((key) => (
            <span key={key} className="veg-chip">
              {t.veg[key]}
            </span>
          ))}
        </p>
      ) : null}
      <footer className="card-foot">
        <span className="price">
          {product.price ? formatMoney(product.price, locale) : <small>{t.product.pricePending}</small>}
        </span>
        <AvailabilityBadge availability={availability} locale={locale} />
        <span className="card-cta arrow" aria-hidden="true">
          {t.product.view}
        </span>
      </footer>
    </article>
  );
}
