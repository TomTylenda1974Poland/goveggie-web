import Link from "next/link";
import { ProductThumb } from "@/components/ProductThumb";
import { totalMinutes, timeBucket, type Recipe } from "@/content/recipes";
import type { Locale, Product } from "@/lib/commerce/types";
import { getDictionary, pick } from "@/lib/i18n";

type Props = { recipe: Recipe; product: Product | undefined; locale: Locale; headingLevel?: "h2" | "h3" };

export function RecipeCard({ recipe, product, locale, headingLevel = "h3" }: Props) {
  const Heading = headingLevel;
  const t = getDictionary(locale);
  const href = `/${locale}/recetas/${recipe.slug}`;
  return (
    <article
      className="rcard"
      data-product={recipe.product}
      data-time={timeBucket(recipe)}
      data-occasions={recipe.occasions.join(" ")}
    >
      <div className="rcard-meta">
        <span>{recipe.occasions.map((o) => t.recipes.occasion[o]).join(" · ")}</span>
        <span>
          {totalMinutes(recipe)} {t.common.minutes}
        </span>
      </div>
      <Heading className="rcard-h">
        <Link href={href} className="rcard-title">
          {pick(recipe.title, locale)}
        </Link>
      </Heading>
      <p className="rcard-intro">{pick(recipe.intro, locale)}</p>
      <div className="rcard-foot">
        {product ? (
          <span className="rcard-product">
            <ProductThumb product={product} />
            <span>{pick(product.name, locale)}</span>
          </span>
        ) : null}
        {recipe.status === "draft" ? <span className="badge badge--draft">{t.recipes.draftBadge}</span> : null}
      </div>
    </article>
  );
}
