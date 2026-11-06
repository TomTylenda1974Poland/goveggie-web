import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { CONTACT, GO_VEGGIE_LIFE_HORECA_URL } from "@/content/brand";
import { pageMetadata } from "@/lib/site";
import { getDictionary, isLocale } from "@/lib/i18n";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = getDictionary(locale).business;
  return pageMetadata({ locale, path: "/negocios", title: t.title, description: t.intro });
}

export default async function BusinessPage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);
  const b = t.business;
  const subject = encodeURIComponent(locale === "es" ? "Consulta comercial Palapa Verde" : "Palapa Verde business enquiry");
  const hasChannel = CONTACT.salesEmail !== null || CONTACT.whatsappNumber !== null;

  return (
    <>
      <div className="page-head">
        <h1>{b.title}</h1>
        <p className="lead">{b.intro}</p>
      </div>

      <section className="audiences" aria-label={b.title}>
        {(Object.keys(b.audiences) as (keyof typeof b.audiences)[]).map((k) => (
          <div key={k} className="panel pad audience">
            <h2 className="h-sm">
              {k === "horeca" ? (
                <a href="#hoteles">
                  {b.audiences[k].title}
                </a>
              ) : b.audiences[k].title}
            </h2>
            <p>{b.audiences[k].text}</p>
          </div>
        ))}
      </section>

      <section id="hoteles" className="panel pad horeca" aria-labelledby="h-hoteles">
        <div className="horeca-head">
          <div>
            <p className="kicker">{b.horeca.kicker}</p>
            <h2 id="h-hoteles" className="h-md">{b.horeca.heading}</h2>
            <p className="lead">{b.horeca.intro}</p>
          </div>
          <figure className="horeca-visual">
            <Image
              src="/media/horeca/linea-profesional.jpg"
              alt={b.horeca.imageAlt}
              width={1536}
              height={1024}
              sizes="(max-width: 900px) 100vw, 720px"
            />
            <figcaption className="visual-note">{b.horeca.caption}</figcaption>
          </figure>
        </div>
        <ul className="horeca-formats duo">
          {Object.entries(b.horeca.formats).map(([key, format]) => (
            <li key={key} className="panel pad">
              <span className="badge badge--concept">{b.horeca.proposed}</span>
              <h3 className="h-sm">{format.title}</h3>
              <p>{format.text}</p>
            </li>
          ))}
        </ul>
        <div className="horeca-label">
          <h3 className="h-sm">{b.horeca.labelHeading}</h3>
          <p>{b.horeca.labelIntro}</p>
          <ul>
            {Object.entries(b.horeca.labelFeatures).map(([key, feature]) => <li key={key}>{feature}</li>)}
          </ul>
        </div>
      </section>

      <section className="panel pad" aria-labelledby="h-status">
        <h2 id="h-status" className="h-md">
          {b.statusHeading}
        </h2>
        <p>{b.statusText}</p>
        <table className="spec-table">
          <tbody>
            {(Object.keys(b.facts) as (keyof typeof b.facts)[]).map((k) => (
              <tr key={k}>
                <th scope="row">{b.facts[k]}</th>
                <td className="muted">{b.pending}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="panel pad split-cta" aria-labelledby="h-contact">
        <div>
          <h2 id="h-contact" className="h-md">
            {b.contactHeading}
          </h2>
          {hasChannel ? null : <p>{b.contactPending}</p>}
        </div>
        {hasChannel ? (
          <div className="cta-row">
            {CONTACT.salesEmail ? (
              <a className="btn" href={`mailto:${CONTACT.salesEmail}?subject=${subject}`} data-track="wholesale_contact_click" data-track-channel="email">
                {b.contactEmail}
              </a>
            ) : null}
            {CONTACT.whatsappNumber ? (
              <a
                className="btn btn--ghost"
                href={`https://wa.me/${CONTACT.whatsappNumber.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener"
                data-track="wholesale_contact_click"
                data-track-channel="whatsapp"
              >
                {b.contactWhatsapp}
              </a>
            ) : null}
          </div>
        ) : null}
      </section>

      <section className="panel pad split-cta" aria-labelledby="h-produce">
        <div>
          <h2 id="h-produce" className="h-md">
            {b.produceHeading}
          </h2>
          <p>{b.produceText}</p>
        </div>
        <a className="btn btn--ghost arrow" href={GO_VEGGIE_LIFE_HORECA_URL} rel="noopener">
          {b.produceCta}
        </a>
      </section>

      <p className="note">
        <Link href={`/${locale}/preguntas#mayoristas`}>{t.nav.faq}</Link>
      </p>
    </>
  );
}
