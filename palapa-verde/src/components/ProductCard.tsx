import Link from "next/link";
import { ProductName } from "@/components/ProductName";
import { ProductVisual } from "@/components/ProductVisual";
import { StatusBadge } from "@/components/StatusBadge";
import type { Locale, Product } from "@/lib/commerce/types";
import { formatMoney } from "@/lib/format";
import { getDictionary, pick } from "@/lib/i18n";

type Props = { product: Product; locale: Locale; priority?: boolean };

/** Tarjeta de catálogo: estado real de lanzamiento; precio solo si está a la venta. */
export function ProductCard({ product, locale, priority }: Props) {
  const t = getDictionary(locale);
  const href = `/${locale}/productos/${product.slug}`;
  const showPrice = product.launch === "available" && product.price !== null;
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
      {product.servingIdeas[0] ? <p className="card-idea">{pick(product.servingIdeas[0], locale)}</p> : null}
      <footer className="card-foot">
        {showPrice && product.price ? <span className="price">{formatMoney(product.price, locale)}</span> : null}
        <StatusBadge status={product.launch} locale={locale} />
        <span className="card-cta arrow" aria-hidden="true">
          {t.product.view}
        </span>
      </footer>
    </article>
  );
}
