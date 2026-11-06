import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RecipeCard } from "@/components/RecipeCard";
import { RecipeFilters } from "@/components/RecipeFilters";
import { OCCASIONS, TIME_BUCKETS, timeBucket, visibleRecipes } from "@/content/recipes";
import { getDictionary, isLocale, pick } from "@/lib/i18n";
import { loadCatalog } from "@/lib/shop";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = getDictionary(locale).recipes;
  return { title: t.title, description: t.intro };
}

export default async function RecipesPage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);
  const { products } = await loadCatalog();
  const recipes = visibleRecipes();
  const usedProducts = products.filter((p) => recipes.some((r) => r.product === p.slug));

  return (
    <>
      <div className="page-head">
        <h1>{t.recipes.title}</h1>
        <p className="lead">{t.recipes.intro}</p>
      </div>
      {recipes.length === 0 ? (
        <div className="panel pad empty">
          <p>{t.recipes.none}</p>
        </div>
      ) : (
        <RecipeFilters
          allLabel={t.recipes.all}
          emptyLabel={t.recipes.empty}
          resetLabel={t.recipes.reset}
          groups={[
            {
              key: "product",
              label: t.recipes.filterProduct,
              options: usedProducts.map((p) => ({ id: p.slug, label: pick(p.name, locale) })),
            },
            {
              key: "time",
              label: t.recipes.filterTime,
              options: TIME_BUCKETS.filter((b) => recipes.some((r) => timeBucket(r) === b.id)).map((b) => ({
                id: b.id,
                label: t.recipes.time[b.id],
              })),
            },
            {
              key: "occasion",
              label: t.recipes.filterOccasion,
              options: OCCASIONS.filter((o) => recipes.some((r) => r.occasions.includes(o))).map((o) => ({
                id: o,
                label: t.recipes.occasion[o],
              })),
            },
          ]}
        >
          {recipes.map((r) => (
            <div
              key={r.slug}
              className="rcard-cell"
              data-product={r.product}
              data-time={timeBucket(r)}
              data-occasions={r.occasions.join(" ")}
            >
              <RecipeCard recipe={r} product={products.find((p) => p.slug === r.product)} locale={locale} />
            </div>
          ))}
        </RecipeFilters>
      )}
    </>
  );
}
