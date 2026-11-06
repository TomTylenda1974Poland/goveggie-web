import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GO_VEGGIE_LIFE_HORECA_URL } from "@/content/brand";
import { pageMetadata } from "@/lib/site";
import { getDictionary, isLocale } from "@/lib/i18n";
import { BusinessInquiry } from "./BusinessInquiry";
import styles from "./business.module.css";

type Props = { params: Promise<{ locale: string }> };
const art = "/media/horeca/consulta-comercial-v1.webp";

const copy = {
  es: {
    heading: "Hablemos de tu negocio",
    intro: "¿Quieres ofrecer Palapa Verde en tu tienda, usar nuestras salsas en tu cocina o distribuirlas en tu zona?",
    cta: "Preparar mi consulta",
    alt: "Una compradora prueba hummus de remolacha de Palapa Verde durante una conversación comercial.",
    caption: "Muestra para una conversación comercial · Ilustración",
    availability: "Disponibilidad y condiciones comerciales",
  },
  en: {
    heading: "Let’s talk about your business",
    intro: "Would you like to stock Palapa Verde, serve our sauces in your kitchen or distribute them in your area?",
    cta: "Prepare my enquiry",
    alt: "A buyer tastes Palapa Verde beet hummus during a business conversation.",
    caption: "A sample for a trade enquiry · Illustration",
    availability: "Availability and trade terms",
  },
} as const;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return pageMetadata({ locale, path: "/negocios", title: getDictionary(locale).business.title, description: copy[locale].intro, image: art });
}

export default async function BusinessPage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);
  const business = t.business;
  const page = copy[locale];

  return (
    <>
      <section className={`panel ${styles.hero}`} aria-labelledby="business-heading">
        <div className={styles.heroCopy}>
          <h1 id="business-heading">{page.heading}</h1>
          <p>{page.intro}</p>
          <a className="btn arrow" href="#contacto">{page.cta}</a>
        </div>
        <figure className={styles.art}>
          <Image src={art} width={1200} height={800} alt={page.alt}
            sizes="(max-width: 760px) 92vw, (min-width: 1440px) 690px, 49vw" preload />
          <figcaption>{page.caption}</figcaption>
        </figure>
      </section>

      <BusinessInquiry locale={locale} />

      <div className={styles.links}>
        <section id="hoteles" aria-labelledby="h-hoteles">
          <h2 id="h-hoteles">{t.nav.hospitality}</h2>
          <p>{business.horeca.teaser}</p>
          <Link className="section-link arrow" href={`/${locale}/hoteles-restaurantes`}>{business.horeca.teaserCta}</Link>
        </section>
        <section aria-labelledby="h-produce">
          <h2 id="h-produce">{business.produceHeading}</h2>
          <p>{business.produceText}</p>
          <a className="section-link arrow" href={GO_VEGGIE_LIFE_HORECA_URL} rel="noopener">{business.produceCta}</a>
        </section>
      </div>

      <details className={styles.terms}>
        <summary>{page.availability}</summary>
        <p>{business.statusText}</p>
        <Link href={`/${locale}/preguntas#mayoristas`}>{t.nav.faq}</Link>
      </details>
    </>
  );
}
