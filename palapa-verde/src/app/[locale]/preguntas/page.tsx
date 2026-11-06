import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FAQ } from "@/content/faq";
import { getDictionary, isLocale, pick } from "@/lib/i18n";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = getDictionary(locale).faq;
  return { title: t.title, description: t.intro };
}

export default async function FaqPage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale).faq;

  return (
    <>
      <div className="page-head">
        <h1>{t.title}</h1>
        <p className="lead">{t.intro}</p>
      </div>
      <div className="panel faq">
        {FAQ.map((item) => (
          <details key={item.id} id={item.id} className="faq-item">
            <summary>{pick(item.q, locale)}</summary>
            <div className="faq-answer">
              <p>{pick(item.a, locale)}</p>
              {item.href && item.cta ? (
                <Link className="arrow" href={`/${locale}${item.href}`}>
                  {pick(item.cta, locale)}
                </Link>
              ) : null}
            </div>
          </details>
        ))}
      </div>
    </>
  );
}
