import Link from "next/link";
import { ProductName } from "@/components/ProductName";
import { ProductVisual } from "@/components/ProductVisual";
import { StatusBadge } from "@/components/StatusBadge";
import type { Locale, Product } from "@/lib/commerce/types";
import { formatMoney } from "@/lib/format";
import { getDictionary, pick } from "@/lib/i18n";

type Props = { product: Product; locale: Locale; priority?: boolean; headingLevel?: "h2" | "h3" };

/** Tarjeta de catálogo: estado real de lanzamiento; precio solo si está a la venta. */
export function ProductCard({ product, locale, priority, headingLevel = "h3" }: Props) {
  const Heading = headingLevel;
  const t = getDictionary(locale);
  const href = `/${locale}/productos/${product.slug}`;
  const showPrice = product.launch === "available" && product.price !== null;
  return (
    <article className="card">
      <div className="card-media">
        <ProductVisual product={product} locale={locale} size="card" priority={priority} />
      </div>
      <header className="card-head">
        <p className="card-cat">{t.category[product.category]}</p>
        <Heading className="card-h">
          <Link href={href} className="card-title" aria-label={pick(product.name, locale)}>
            <ProductName name={product.name} locale={locale} />
          </Link>
        </Heading>
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
