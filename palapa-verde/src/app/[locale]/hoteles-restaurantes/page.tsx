import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/site";
import { kitchenCopy } from "./content";
import { KitchenInquiry } from "./KitchenInquiry";
import styles from "./kitchen.module.css";

type Props = { params: Promise<{ locale: string }> };
const route = "/hoteles-restaurantes";
const heroImage = "/media/cocina-grabado.webp";

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

  return (
    <>
      <section className={styles.hero} aria-labelledby="kitchen-title">
        <div className={styles.heroCopy}>
          <h1 id="kitchen-title">{t.title}</h1>
          <p>{t.intro}</p>
          <div className={styles.actions}>
            <a className="btn" href="#consulta">{t.inquiry}</a>
            <a className={styles.jumpLink} href="#formatos">{t.explore}</a>
          </div>
        </div>
        <figure className={styles.heroArt}>
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

      <section className={styles.formats} id="formatos" aria-labelledby="kitchen-formats">
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

      <KitchenInquiry locale={locale} />
    </>
  );
}
