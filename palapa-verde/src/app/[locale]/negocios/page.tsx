import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageStartLink } from "@/components/PageStartLink";
import { notFound } from "next/navigation";
import { CONTACT, GO_VEGGIE_LIFE_HORECA_URL, partnerUrl, SALES_EMAIL_READY } from "@/content/brand";
import { loadCatalog } from "@/lib/shop";
import { pageMetadata } from "@/lib/site";
import { getDictionary, isLocale, pick } from "@/lib/i18n";
import { EmailInquiry } from "@/components/EmailInquiry";
import styles from "./business.module.css";

type Props = { params: Promise<{ locale: string }>; searchParams: Promise<{ producto?: string | string[] }> };
const art = "/media/horeca/consulta-comercial-v1.webp";

const copy = {
  es: {
    heading: "Escríbenos",
    intro: "¿Buscas un catálogo o muestras para tu negocio?",
    alt: "Una compradora prueba hummus de remolacha de Palapa Verde durante una conversación comercial.",
    caption: "Muestra para una conversación comercial · Ilustración",
    availability: "Disponibilidad y condiciones comerciales",
  },
  en: {
    heading: "Get in touch",
    intro: "Looking for a catalogue or samples for your business?",
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

export default async function BusinessPage({ params, searchParams }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);
  const business = t.business;
  const page = copy[locale];
  const slug = (await searchParams).producto;
  const product = typeof slug === "string" ? (await loadCatalog()).products.find(item => item.slug === slug) : undefined;
  const name = product && pick(product.name, locale);

  return (
    <>
      <section id="contacto" className={`panel ${styles.hero}`} aria-labelledby="business-heading">
        <div className={styles.heroCopy}>
          <h1 id="business-heading">{page.heading}</h1>
          <p>{page.intro}</p>
          {CONTACT.salesEmail && <EmailInquiry key={product?.slug ?? "general"} locale={locale} email={CONTACT.salesEmail}
            ready={SALES_EMAIL_READY} context={name} source="business" />}
        </div>
        <figure className={styles.art}>
          <Image src={art} width={1200} height={800} alt={page.alt}
            sizes="(max-width: 760px) 92vw, (min-width: 1440px) 690px, 49vw" preload />
          <figcaption>{page.caption}</figcaption>
        </figure>
      </section>

      <div className={styles.links}>
        <section id="hoteles" aria-labelledby="h-hoteles">
          <h2 id="h-hoteles">{t.nav.hospitality}</h2>
          <p>{business.horeca.teaser}</p>
          <PageStartLink className="section-link arrow" href={`/${locale}/hoteles-restaurantes`}>{business.horeca.teaserCta}</PageStartLink>
        </section>
        <section aria-labelledby="h-produce">
          <h2 id="h-produce">{business.produceHeading}</h2>
          <p>{business.produceText}</p>
          <a className="section-link arrow" href={partnerUrl(locale, GO_VEGGIE_LIFE_HORECA_URL)} rel="noopener">{business.produceCta}</a>
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
