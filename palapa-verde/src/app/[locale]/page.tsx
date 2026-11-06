import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/ProductCard";
import { RecipeCard } from "@/components/RecipeCard";
import { GO_VEGGIE_LIFE_URL, relationship } from "@/content/brand";
import { visibleRecipes } from "@/content/recipes";
import { PRODUCE_PHOTOS } from "@/lib/commerce/brand-content";
import type { ArtKey } from "@/lib/commerce/types";
import { getDictionary, isLocale, pick } from "@/lib/i18n";
import { pageMetadata } from "@/lib/site";
import type { Metadata } from "next";
import { loadCatalog } from "@/lib/shop";

const STEPS = ["campo", "cocina", "frasco"] as const;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = getDictionary(locale).meta;
  return pageMetadata({ locale, path: "", title: t.title, description: t.description });
}

/** Una receta por producto para la portada, en orden de catálogo. */
function featuredRecipes(products: { slug: string }[]) {
  const all = visibleRecipes();
  return products.flatMap((p) => all.find((r) => r.product === p.slug) ?? []).slice(0, 3);
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);
  const h = t.home;
  const { products } = await loadCatalog();
  const recipes = featuredRecipes(products);
  const produce = Object.entries(PRODUCE_PHOTOS) as [ArtKey, string][];

  return (
    <>
      <section className="panel hero" aria-labelledby="h-hero">
        <div className="hero-copy">
          <p className="lockup">{h.lockup}</p>
          <h1 id="h-hero">
            <span className="h1-line">{h.title}</span> <span className="h1-line verde">{h.titleAccent}</span>
          </h1>
          <p className="hero-intro">{h.intro}</p>
          <p className="hero-status">
            <span className="badge badge--concept">{t.launch.concept}</span>
          </p>
          <div className="hero-actions">
            <Link className="btn arrow" href={`/${locale}/productos`}>
              {h.cta}
            </Link>
            <Link className="btn btn--ghost" href={`/${locale}/recetas`}>
              {h.ctaSecondary}
            </Link>
          </div>
        </div>
        <figure className="hero-media">
          <Image
            src="/media/hero-linea.jpg"
            alt={
              locale === "es"
                ? "Los cinco productos Palapa Verde en su envase propuesto, junto a sus vegetales"
                : "The five Palapa Verde products in their proposed packaging, next to their vegetables"
            }
            width={1536}
            height={1024}
            sizes="(max-width: 900px) 100vw, 62vw"
            priority
            fetchPriority="high"
          />
          <figcaption className="visual-note">{t.common.imageNote}</figcaption>
        </figure>
      </section>

      <section className="panel steps" aria-labelledby="h-proceso">
        <h2 id="h-proceso" className="sr-only">
          {h.stepsHeading}
        </h2>
        {STEPS.map((step, i) => (
          <div className="step" key={step}>
            <Image src={`/media/proceso-${step}.jpg`} alt="" width={512} height={512} sizes="120px" />
            <div>
              <h3>
                <span className="step-n">0{i + 1}</span> {h.steps[step].title}
              </h3>
              <p>{h.steps[step].text}</p>
            </div>
          </div>
        ))}
      </section>

      <section aria-labelledby="h-productos">
        <div className="section-head">
          <h2 id="h-productos">{h.productsHeading}</h2>
          <Link className="section-link arrow" href={`/${locale}/productos`}>
            {h.allProducts}
          </Link>
        </div>
        <div className="cards">
          {products.map((product, i) => (
            <ProductCard key={product.id} product={product} locale={locale} priority={i < 2} />
          ))}
          <Link className="card card--line" href={`/${locale}/negocios`}>
            <Image src="/media/proceso-frasco.jpg" alt="" width={512} height={512} sizes="200px" />
            <span className="card-cat">{h.businessHeading}</span>
            <span className="card-line-title">{h.businessText}</span>
            <span className="card-cta arrow">{h.businessCta}</span>
          </Link>
        </div>
      </section>

      {recipes.length > 0 ? (
        <section aria-labelledby="h-recetas">
          <div className="section-head">
            <h2 id="h-recetas">{h.recipesHeading}</h2>
            <Link className="section-link arrow" href={`/${locale}/recetas`}>
              {h.allRecipes}
            </Link>
          </div>
          <p className="lead section-lead">{h.recipesIntro}</p>
          <div className="rcards">
            {recipes.map((r) => (
              <RecipeCard key={r.slug} recipe={r} product={products.find((p) => p.slug === r.product)} locale={locale} />
            ))}
          </div>
        </section>
      ) : null}

      <section className="panel origin" id="nosotros" aria-labelledby="h-nosotros">
        <div className="origin-copy">
          <h2 id="h-nosotros">{h.originHeading}</h2>
          <p>{pick(relationship.statement, locale)}</p>
          <div className="cta-row">
            <Link className="btn arrow" href={`/${locale}/nosotros`}>
              {t.nav.about}
            </Link>
            <a className="btn btn--ghost" href={GO_VEGGIE_LIFE_URL} rel="noopener">
              {h.originCta}
            </a>
          </div>
        </div>
        <div className="origin-media">
          <ul className="produce" aria-label={h.produceCaption}>
            {produce.map(([key, src]) => (
              <li key={key}>
                <Image src={src} alt="" width={384} height={300} sizes="(max-width: 760px) 30vw, 160px" />
                <span>{t.veg[key]}</span>
              </li>
            ))}
          </ul>
          <div className="people-note">
            <h3 className="h-sm">{h.peopleHeading}</h3>
            <p>{h.peopleText}</p>
          </div>
        </div>
      </section>

      <section className="duo" aria-label={`${h.buyHeading} · ${h.businessHeading}`}>
        <div className="panel pad">
          <h2 className="h-md">{h.buyHeading}</h2>
          <p>{h.buyText}</p>
          <Link className="btn arrow" href={`/${locale}/donde-comprar`} data-track="where_to_buy_click" data-track-from="home">
            {h.buyCta}
          </Link>
        </div>
        <div className="panel pad">
          <h2 className="h-md">{h.businessHeading}</h2>
          <p>{h.businessText}</p>
          <div className="cta-row">
            <Link className="btn arrow" href={`/${locale}/hoteles-restaurantes`}>{t.nav.hospitality}</Link>
            <Link className="btn btn--ghost" href={`/${locale}/negocios`} data-track="wholesale_contact_click" data-track-from="home">
              {h.businessCta}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
