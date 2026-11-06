import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CONTACT, GO_VEGGIE_LIFE_URL } from "@/content/brand";
import { getDictionary, isLocale } from "@/lib/i18n";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = getDictionary(locale).business;
  return { title: t.title, description: t.intro };
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
            <h2 className="h-sm">{b.audiences[k].title}</h2>
            <p>{b.audiences[k].text}</p>
          </div>
        ))}
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
        <a className="btn btn--ghost arrow" href={GO_VEGGIE_LIFE_URL} rel="noopener">
          Go Veggie Life
        </a>
      </section>

      <p className="note">
        <Link href={`/${locale}/preguntas#mayoristas`}>{t.nav.faq}</Link>
      </p>
    </>
  );
}
