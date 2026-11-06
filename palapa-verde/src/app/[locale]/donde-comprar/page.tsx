import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { STOCKISTS } from "@/content/stockists";
import { getDictionary, isLocale, pick } from "@/lib/i18n";
import { loadCatalog } from "@/lib/shop";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = getDictionary(locale).where;
  return { title: t.title, description: t.intro };
}

export default async function WhereToBuyPage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);
  const w = t.where;
  const { products } = await loadCatalog();

  return (
    <>
      <div className="page-head">
        <h1>{w.title}</h1>
        <p className="lead">{w.intro}</p>
      </div>

      {STOCKISTS.length === 0 ? (
        <section className="panel prelaunch">
          <div className="prelaunch-copy">
            <h2 className="h-md">{w.none}</h2>
            <p>{w.noneText}</p>
            <Link className="btn btn--ghost arrow" href={`/${locale}/productos`}>
              {t.home.cta}
            </Link>
          </div>
          <Image className="prelaunch-art" src="/media/proceso-frasco.jpg" alt="" width={512} height={512} sizes="200px" />
        </section>
      ) : (
        <section aria-label={w.title}>
          <p className="note">{w.listNote}</p>
          <ul className="stockists">
            {STOCKISTS.map((s) => (
              <li key={s.id} className="panel pad stockist">
                <h2 className="h-sm">{s.name}</h2>
                <p>
                  {s.address}, {s.city}
                </p>
                <p className="note">
                  {w.productsAt}:{" "}
                  {s.products
                    .map((slug) => products.find((p) => p.slug === slug))
                    .filter((p) => p !== undefined)
                    .map((p) => pick(p.name, locale))
                    .join(" · ")}
                </p>
                {s.note ? <p className="note">{pick(s.note, locale)}</p> : null}
                <p className="note">
                  {w.confirmed} {s.confirmedOn}
                </p>
                {s.mapUrl ? (
                  <a className="btn btn--ghost" href={s.mapUrl} target="_blank" rel="noopener" data-track="retailer_outbound_click" data-track-stockist={s.id}>
                    {w.map}
                  </a>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="panel pad split-cta">
        <div>
          <h2 className="h-md">{w.requestHeading}</h2>
          <p>{w.requestText}</p>
        </div>
        <Link className="btn arrow" href={`/${locale}/negocios`} data-track="wholesale_contact_click" data-track-from="where_to_buy">
          {w.requestCta}
        </Link>
      </section>
    </>
  );
}
