import type { Metadata } from "next";
import Image from "next/image";
import { PROCESS_ART } from "@/content/process-art";
import { notFound } from "next/navigation";
import { GO_VEGGIE_LIFE_URL, MANUFACTURER, relationship } from "@/content/brand";
import { PRODUCE_PHOTOS } from "@/lib/commerce/brand-content";
import type { ArtKey } from "@/lib/commerce/types";
import { pageMetadata } from "@/lib/site";
import { getDictionary, isLocale, pick } from "@/lib/i18n";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return pageMetadata({ locale, path: "/nosotros", title: getDictionary(locale).about.title, description: pick(relationship.statement, locale) });
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);
  const a = t.about;
  const produce = Object.entries(PRODUCE_PHOTOS) as [ArtKey, string][];

  return (
    <>
      <div className="page-head">
        <h1>{a.title}</h1>
      </div>

      <section className="panel origin" aria-labelledby="h-rel">
        <div className="origin-copy">
          <h2 id="h-rel">{a.relationshipHeading}</h2>
          <p>{pick(relationship.statement, locale)}</p>
          <a className="btn arrow" href={GO_VEGGIE_LIFE_URL} rel="noopener">
            {a.visitGvl}
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
        </div>
      </section>

      <section className="panel steps-story" aria-labelledby="h-proc">
        <div className="story-copy">
          <h2 id="h-proc" className="h-md">
            {a.processHeading}
          </h2>
          <p>{a.processText}</p>
          <p className="note">{a.imagesNote}</p>
        </div>
        <div className="story-art" aria-hidden="true">
          {(["campo", "cocina", "frasco"] as const).map((s) => (
            <Image key={s} src={PROCESS_ART[s]} alt="" width={512} height={512} sizes="140px" />
          ))}
        </div>
      </section>

      <section className="panel pad" aria-labelledby="h-team">
        <h2 id="h-team" className="h-md">
          {a.peopleHeading}
        </h2>
        <p>{a.peopleText}</p>
      </section>

      {MANUFACTURER ? (
        <section className="panel pad" aria-labelledby="h-made">
          <h2 id="h-made" className="h-md">
            {a.manufacturerHeading}
          </h2>
          <p>
            {MANUFACTURER.name} · {MANUFACTURER.address}
          </p>
        </section>
      ) : null}
    </>
  );
}
