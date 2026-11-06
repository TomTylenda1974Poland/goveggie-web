import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { CONTACT, GO_VEGGIE_LIFE_HORECA_URL } from "@/content/brand";
import { getDictionary, isLocale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/site";
import { kitchenCopy, type PackKey } from "./content";
import { EmailInquiry } from "@/components/EmailInquiry";
import { enquiryEmailHref } from "@/lib/enquiry-email";
import { ProfessionalLabel } from "./ProfessionalLabel";
import styles from "./kitchen.module.css";

type Props = { params: Promise<{ locale: string }> };
const route = "/hoteles-restaurantes";
const imagePath = (name: string) => `/media/horeca/${name}-v1.webp`;
const heroImage = imagePath("pase");
const packImages: { key: PackKey; image: string }[] = [
  { key: "kitchen", image: "envase-grande" },
  { key: "buffet", image: "envase-extra" },
  { key: "portion", image: "porcion" },
  { key: "bottle", image: "dosificador" },
];

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
  const email = CONTACT.salesEmail;

  return (
    <>
      <section id="consulta" className={styles.hero} aria-labelledby="kitchen-title">
        <div className={styles.heroCopy}>
          <h1 id="kitchen-title">{t.title}</h1>
          <p>{t.intro}</p>
          {email && <EmailInquiry locale={locale} email={email} subject={t.contact.subject} example={t.contact.example} />}
          <a className={styles.jumpLink} href="#linea-profesional">{t.explore}</a>
        </div>
        <figure className={styles.heroArt}>
          <Image src={heroImage} alt={t.imageAlt} width={1536} height={1024}
            sizes="(max-width: 760px) 92vw, (min-width: 1500px) 720px, 50vw" preload />
          <figcaption>{t.imageCaption}</figcaption>
        </figure>
      </section>

      <nav className={styles.contents} aria-label={t.navigation.label}>
        <a href="#servicio">{t.navigation.service}</a>
        <a href="#linea-profesional">{t.navigation.packs}</a>
        <a href="#formatos-productos">{t.navigation.products}</a>
        <a href="#etiqueta-profesional">{t.navigation.labelGuide}</a>
      </nav>

      <div className={styles.services} id="servicio">
        {t.services.map((service) => (
          <section key={service.image} className={styles.service}>
            <Image src={imagePath(service.image)} alt={service.alt} width={768} height={512}
              sizes="(max-width: 680px) 90vw, (max-width: 1020px) 39vw, 300px" />
            <div>
              <h2>{service.title}</h2>
              <p>{service.text}</p>
            </div>
          </section>
        ))}
      </div>

      <section id="linea-profesional" className={styles.line} aria-labelledby="h-linea">
        <div className={styles.lineHead}>
          <div className={styles.lineCopy}>
            <p className="kicker">{pro.kicker}</p>
            <h2 id="h-linea">{pro.heading}</h2>
            <p>{pro.intro}</p>
          </div>
          <figure className={styles.lineArt}>
            <Image src={imagePath("linea")} alt={t.lineAlt} width={1536} height={1024}
              sizes="(max-width: 760px) 92vw, (min-width: 1500px) 750px, 52vw" />
            <figcaption>{pro.caption}</figcaption>
          </figure>
        </div>
        <h3 className={styles.packHeading}>{t.packHeading}</h3>
        <ul className={styles.packList}>
          {packImages.map(({ key, image }) => {
            const pack = t.packs[key];
            return (
              <li key={key} className={styles.pack}>
                <Image src={imagePath(image)} alt={pack.alt} width={768} height={512}
                  sizes="(max-width: 760px) 37vw, (max-width: 1020px) 42vw, 25vw" />
                <div>
                  <h4>{pack.title}</h4>
                  <p>{pack.use}</p>
                  {email && (
                    <a className={styles.ask} href={enquiryEmailHref(email, t.contact.subject + " · " + pack.title, t.contact.trial)}>
                      {t.contact.about}<span className="sr-only"> · {pack.title}</span>
                    </a>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      <section id="formatos-productos" className={styles.formats} aria-labelledby="kitchen-formats">
        <header className={styles.formatHeading}>
          <h2 id="kitchen-formats">{t.range}</h2>
          <p>{t.rangeIntro}</p>
        </header>
        <ul className={styles.rows}>
          {t.rows.map((item) => (
            <li key={item.image} className={styles.formatRow}>
              <Image src={imagePath(item.image)} alt={item.alt} width={768} height={512}
                sizes="(max-width: 760px) 40vw, (min-width: 1500px) 200px, 16vw" />
              <div>
                <span className={styles.brand} translate="no">{item.brand}</span>
                <h3>{item.product}</h3>
              </div>
              <strong className={styles.size}>{item.format}</strong>
              <div className={styles.rowUse}>
                <p>{item.use}</p>
                {email && item.brand === "Palapa Verde" && (
                  <a className={styles.ask} href={enquiryEmailHref(email, t.contact.subject + " · " + item.product, t.contact.trial + "\n\n" + item.format)}>
                    {t.contact.about}<span className="sr-only"> · {item.product}</span>
                  </a>
                )}
              </div>
            </li>
          ))}
        </ul>
      </section>

      <div id="etiqueta-profesional" className={styles.labelAnchor}>
        <ProfessionalLabel locale={locale} />
      </div>

      <section className="panel pad split-cta" aria-labelledby="h-produce">
        <div>
          <h2 id="h-produce" className="h-md">{t.produceHeading}</h2>
          <p>{t.produceText}</p>
        </div>
        <a className="btn btn--ghost arrow" href={GO_VEGGIE_LIFE_HORECA_URL} rel="noopener">
          {t.produceCta}
        </a>
      </section>

      {email && <a className={styles.backContact} href="#consulta">{t.contact.write} <span aria-hidden="true">↑</span></a>}
    </>
  );
}
