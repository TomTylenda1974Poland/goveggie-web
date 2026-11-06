import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductThumb } from "@/components/ProductThumb";
import { RecipeServingImage } from "@/components/RecipeServingImage";
import artStyles from "@/components/RecipeServingImage.module.css";
import { RecipeCard } from "@/components/RecipeCard";
import { RecipeInteractive } from "@/components/RecipeInteractive";
import { StatusBadge } from "@/components/StatusBadge";
import { TrackView } from "@/components/TrackView";
import { PRODUCT_ALLERGENS, RECIPES, totalMinutes, visibleRecipes } from "@/content/recipes";
import { LOCALES } from "@/lib/commerce/types";
import { pageMetadata } from "@/lib/site";
import { getDictionary, isLocale, pick } from "@/lib/i18n";
import { ingredientText, isoDuration } from "@/lib/recipe-format";
import { loadCatalog } from "@/lib/shop";

type Props = { params: Promise<{ locale: string; slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  const recipes = visibleRecipes();
  return LOCALES.flatMap((locale) => recipes.map((r) => ({ locale, slug: r.slug })));
}

function findRecipe(slug: string) {
  return visibleRecipes().find((r) => r.slug === slug);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const recipe = findRecipe(slug);
  if (!isLocale(locale) || !recipe) return {};
  return pageMetadata({
    locale,
    path: `/recetas/${slug}`,
    title: pick(recipe.title, locale),
    description: pick(recipe.intro, locale),
    image: recipe.media.photo?.src ?? recipe.media.illustration?.src ?? `/media/productos/${recipe.product}.jpg`,
    noindex: recipe.status === "draft",
  });
}

export default async function RecipePage({ params }: Props) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const recipe = findRecipe(slug);
  if (!recipe) notFound();
  const t = getDictionary(locale);
  const r = t.recipes;
  const { products } = await loadCatalog();
  const product = products.find((p) => p.slug === recipe.product);
  const title = pick(recipe.title, locale);
  const related = [
    ...visibleRecipes().filter((x) => x.slug !== recipe.slug && x.product === recipe.product),
    ...visibleRecipes().filter((x) => x.slug !== recipe.slug && x.product !== recipe.product),
  ].slice(0, 3);

  // Datos estructurados solo para recetas probadas: nada de borradores ni valoraciones inventadas.
  const jsonLd =
    recipe.status === "tested"
      ? {
          "@context": "https://schema.org",
          "@type": "Recipe",
          name: title,
          description: pick(recipe.intro, locale),
          inLanguage: locale,
          recipeYield: `${recipe.servings}`,
          prepTime: isoDuration(recipe.prepMinutes),
          cookTime: isoDuration(recipe.cookMinutes),
          totalTime: isoDuration(totalMinutes(recipe)),
          recipeIngredient: recipe.ingredients.map((i) => ingredientText(i, 1, locale)),
          recipeInstructions: recipe.steps.map((s) => ({ "@type": "HowToStep", text: pick(s, locale) })),
          ...(recipe.media.photo ? { image: [recipe.media.photo.src] } : {}),
        }
      : null;

  return (
    <>
      <nav className="crumbs no-print" aria-label={locale === "es" ? "Migas de pan" : "Breadcrumb"}>
        <Link href={`/${locale}/recetas`} className="back">
          ← {r.back}
        </Link>
      </nav>

      <article className="recipe">
        <header className="panel recipe-head">
          <div className="recipe-head-copy">
            <p className="kicker">{recipe.occasions.map((o) => r.occasion[o]).join(" · ")}</p>
            <h1>{title}</h1>
            <p className="lead">{pick(recipe.intro, locale)}</p>
            <dl className="recipe-times">
              <div>
                <dt>{r.prep}</dt>
                <dd>
                  {recipe.prepMinutes} {t.common.minutes}
                </dd>
              </div>
              <div>
                <dt>{r.cook}</dt>
                <dd>
                  {recipe.cookMinutes} {t.common.minutes}
                </dd>
              </div>
              <div>
                <dt>{r.total}</dt>
                <dd>
                  {totalMinutes(recipe)} {t.common.minutes}
                </dd>
              </div>
            </dl>
            {recipe.status === "draft" ? <p className="notice">{r.draftNote}</p> : null}
          </div>
          <div className="recipe-head-media">
            <RecipeServingImage media={recipe.media} locale={locale} detail />
            {product ? (
              <Link href={`/${locale}/productos/${product.slug}`} className={artStyles.product} data-track="recipe_product_click" data-track-recipe={recipe.slug} data-track-product={product.slug}>
                <ProductThumb product={product} />
                <span className="recipe-product-name">
                  {r.productUsed}: <strong>{pick(product.name, locale)}</strong>
                </span>
                <StatusBadge status={product.launch} locale={locale} />
              </Link>
            ) : null}
          </div>
        </header>

        <div className="recipe-body">
          <RecipeInteractive
            locale={locale}
            slug={recipe.slug}
            title={title}
            baseServings={recipe.servings}
            publicRecipeUrl={recipe.status === "tested" && process.env.SITE_INDEXABLE === "true" && process.env.SITE_URL?.startsWith("https://") ? new URL(`/${locale}/recetas/${recipe.slug}`, process.env.SITE_URL).href : null}
            ingredients={[...recipe.ingredients]}
            labels={{
              servings: r.servings,
              lessServings: r.lessServings,
              moreServings: r.moreServings,
              ingredients: r.ingredients,
              productUsed: r.productUsed,
              print: r.print,
              shareRecipe: r.shareRecipe,
              shareList: r.shareList,
              listTitle: r.listTitle,
              allergens: r.allergens + ": " + pick(recipe.allergens, locale) + " " + pick(PRODUCT_ALLERGENS, locale),
              shareNote: recipe.status === "draft" ? r.shareNote : null,
            }}
          />

          <section className="recipe-steps" aria-labelledby="h-steps">
            <h2 id="h-steps" className="h-sm">
              {r.steps}
            </h2>
            <ol>
              {recipe.steps.map((s, i) => (
                <li key={i}>{pick(s, locale)}</li>
              ))}
            </ol>

            {recipe.substitutions.length > 0 ? (
              <>
                <h2 className="h-sm">{r.substitutions}</h2>
                <ul className="plain-list">
                  {recipe.substitutions.map((s, i) => (
                    <li key={i}>{pick(s, locale)}</li>
                  ))}
                </ul>
              </>
            ) : null}

            <h2 className="h-sm">{r.allergens}</h2>
            <p>{pick(recipe.allergens, locale)}</p>
            <p className="note">{pick(PRODUCT_ALLERGENS, locale)}</p>

            <div className="recipe-cta no-print">
              <Link className="btn arrow" href={`/${locale}/donde-comprar`} data-track="where_to_buy_click" data-track-from="recipe" data-track-recipe={recipe.slug}>
                {r.whereToBuy}
              </Link>
            </div>
          </section>
        </div>
      </article>

      {related.length > 0 ? (
        <section className="no-print" aria-labelledby="h-related">
          <div className="section-head">
            <h2 id="h-related">{r.related}</h2>
          </div>
          <div className="rcards">
            {related.map((x) => (
              <RecipeCard key={x.slug} recipe={x} product={products.find((p) => p.slug === x.product)} locale={locale} />
            ))}
          </div>
        </section>
      ) : null}

      <TrackView event="recipe_view" props={{ recipe: recipe.slug, product: recipe.product }} />
      {jsonLd ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} /> : null}
    </>
  );
}

// Garantiza que cada slug de receta sea único en tiempo de compilación.
const slugs = new Set(RECIPES.map((r) => r.slug));
if (slugs.size !== RECIPES.length) throw new Error("Slugs de recetas duplicados");
