import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { GO_VEGGIE_LIFE_HORECA_URL } from "@/content/brand";
import { getDictionary, isLocale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/site";
import { kitchenCopy } from "./content";
import { KitchenInquiry } from "./KitchenInquiry";
import styles from "./kitchen.module.css";

type Props = { params: Promise<{ locale: string }> };
const route = "/hoteles-restaurantes";
const heroImage = "/media/cocina-profesional.jpg";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const { title, intro } = kitchenCopy[locale];
  return pageMetadata({ locale, path: route, title, description: intro, image: heroImage });
}

export default async function ProfessionalKitchenPage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = kitchenCopy[locale];
  const pro = getDictionary(locale).business.horeca;

  return (
    <>
      <section className={styles.hero} aria-labelledby="kitchen-title">
        <div className={styles.heroCopy}>
          <h1 id="kitchen-title">{t.title}</h1>
          <p>{t.intro}</p>
          <div className={styles.actions}>
            <a className="btn" href="#consulta">{t.inquiry}</a>
            <a className={styles.jumpLink} href="#linea-profesional">{t.explore}</a>
          </div>
        </div>
        <figure className={styles.heroPhoto}>
          <Image src={heroImage} alt={t.imageAlt} width={1536} height={1024} sizes="(max-width: 760px) 100vw, 50vw" preload />
          <figcaption>{t.imageCaption}</figcaption>
        </figure>
      </section>

      <div className={styles.services}>
        {[t.restaurant, t.hotel].map((service) => (
          <section key={service.title}>
            <h2>{service.title}</h2>
            <p>{service.text}</p>
          </section>
        ))}
      </div>

      <section id="linea-profesional" className="panel pad horeca" aria-labelledby="h-linea">
        <div className="horeca-head">
          <div>
            <p className="kicker">{pro.kicker}</p>
            <h2 id="h-linea" className="h-md">{pro.heading}</h2>
            <p className="lead">{pro.intro}</p>
          </div>
          <figure className="horeca-visual">
            <Image
              src="/media/horeca/linea-profesional.jpg"
              alt={pro.imageAlt}
              width={1536}
              height={1024}
              sizes="(max-width: 900px) 100vw, 720px"
            />
            <figcaption className="visual-note">{pro.caption}</figcaption>
          </figure>
        </div>
        <ul className="horeca-formats duo">
          {Object.entries(pro.formats).map(([key, format]) => (
            <li key={key} className="panel pad">
              <span className="badge badge--concept">{pro.proposed}</span>
              <h3 className="h-sm">{format.title}</h3>
              <p>{format.text}</p>
            </li>
          ))}
        </ul>
        <div className="horeca-label">
          <h3 className="h-sm">{pro.labelHeading}</h3>
          <p>{pro.labelIntro}</p>
          <ul>
            {Object.entries(pro.labelFeatures).map(([key, feature]) => (
              <li key={key}>{feature}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className={styles.formats} aria-labelledby="kitchen-formats">
        <header className={styles.formatHeading}>
          <h2 id="kitchen-formats">{t.range}</h2>
          <p>{t.rangeIntro}</p>
        </header>
        <ul className={styles.rows}>
          {t.rows.map((item) => (
            <li key={item.product} className={styles.formatRow}>
              <div>
                <span className={styles.brand}>{item.brand}</span>
                <h3>{item.product}</h3>
              </div>
              <span className={styles.size}>{item.format}</span>
              <p>{item.use}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="panel pad split-cta" aria-labelledby="h-produce">
        <div>
          <h2 id="h-produce" className="h-md">
            {t.produceHeading}
          </h2>
          <p>{t.produceText}</p>
        </div>
        <a className="btn btn--ghost arrow" href={GO_VEGGIE_LIFE_HORECA_URL} rel="noopener">
          {t.produceCta}
        </a>
      </section>

      <KitchenInquiry locale={locale} />
    </>
  );
}
