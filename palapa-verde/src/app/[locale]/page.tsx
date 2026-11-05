import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/ProductCard";
import { GO_VEGGIE_URL } from "@/components/SiteChrome";
import { PRODUCE_PHOTOS } from "@/lib/commerce/brand-content";
import type { ArtKey } from "@/lib/commerce/types";
import { getDictionary, isLocale } from "@/lib/i18n";
import { loadCatalog } from "@/lib/shop";

const STEPS = ["campo", "cocina", "frasco"] as const;

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);
  const { products, availability } = await loadCatalog();
  const produce = (Object.entries(PRODUCE_PHOTOS) as [ArtKey, string][]).slice(0, 3);

  return (
    <>
      <section className="panel hero" aria-labelledby="h-hero">
        <div className="hero-copy">
          <p className="lockup">{t.home.lockup}</p>
          <h1 id="h-hero">
            <span className="h1-line">{t.home.title}</span> <span className="h1-line verde">{t.home.titleAccent}</span>
          </h1>
          <ol className="flow" aria-label={t.home.stepsHeading}>
            {t.home.flow.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
          <p className="hero-intro">{t.home.intro}</p>
          <div className="hero-actions">
            <Link className="btn arrow" href={`/${locale}/productos`}>
              {t.home.cta}
            </Link>
            <a className="btn btn--ghost" href="#proceso">
              {t.home.ctaSecondary}
            </a>
          </div>
        </div>
        <figure className="hero-media">
          <Image
            src="/media/hero-linea.jpg"
            alt={
              locale === "es"
                ? "Los cinco productos Palapa Verde en frasco junto a sus vegetales"
                : "The five Palapa Verde products in jars next to their vegetables"
            }
            width={1536}
            height={1024}
            sizes="(max-width: 760px) 100vw, 62vw"
            priority
          />
          <figcaption className="visual-note">{t.home.imageNote}</figcaption>
          <span className="seal" aria-hidden="true">
            {t.home.badge}
          </span>
        </figure>
      </section>

      <section className="panel steps" id="proceso" aria-labelledby="h-proceso">
        <h2 id="h-proceso" className="sr-only">
          {t.home.stepsHeading}
        </h2>
        {STEPS.map((step, i) => (
          <div className="step" key={step}>
            <Image src={`/media/proceso-${step}.jpg`} alt="" width={512} height={512} sizes="120px" />
            <div>
              <h3>
                <span className="step-n">0{i + 1}</span> {t.home.steps[step].title}
              </h3>
              <p>{t.home.steps[step].text}</p>
            </div>
          </div>
        ))}
      </section>

      <section aria-labelledby="h-productos">
        <div className="section-head">
          <h2 id="h-productos">{t.home.productsHeading}</h2>
          <Link className="section-link arrow" href={`/${locale}/productos`}>
            {t.home.allProducts}
          </Link>
        </div>
        <div className="cards">
          {products.map((product, i) => (
            <ProductCard
              key={product.id}
              product={product}
              availability={availability(product.id)}
              locale={locale}
              priority={i < 2}
            />
          ))}
          <Link className="card card--line" href={`/${locale}/productos`}>
            <Image src="/media/proceso-frasco.jpg" alt="" width={512} height={512} sizes="200px" />
            <span className="card-cat">{t.home.lineKicker}</span>
            <span className="card-line-title">{t.home.lineTitle}</span>
            <span className="card-cta arrow">{t.home.allProducts}</span>
          </Link>
        </div>
      </section>

      <section className="panel origin" id="nosotros" aria-labelledby="h-nosotros">
        <div className="origin-copy">
          <p className="kicker">{t.home.kicker}</p>
          <h2 id="h-nosotros">{t.home.originHeading}</h2>
          <p>{t.home.originText}</p>
          <a className="btn arrow" href={GO_VEGGIE_URL}>
            {t.home.originCta}
          </a>
        </div>
        <div className="origin-media">
          <ul className="produce" aria-label={t.home.produceCaption}>
            {produce.map(([key, src]) => (
              <li key={key}>
                <Image src={src} alt="" width={384} height={300} sizes="(max-width: 760px) 30vw, 160px" />
                <span>{t.veg[key]}</span>
              </li>
            ))}
          </ul>
          <Image
            className="origin-stamp"
            src={locale === "es" ? "/media/stamp-es-v3.jpg" : "/media/stamp-en-v3.jpg"}
            alt={
              locale === "es" ? "Del campo a tu supermercado — Go Veggie Life" : "From the field to your supermarket — Go Veggie Life"
            }
            width={600}
            height={600}
            sizes="180px"
          />
        </div>
      </section>
    </>
  );
}
