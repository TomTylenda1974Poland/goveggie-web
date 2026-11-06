import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { partnerUrl, MANUFACTURER, relationship } from "@/content/brand";
import { pageMetadata } from "@/lib/site";
import { getDictionary, isLocale, pick } from "@/lib/i18n";

import styles from "./story.module.css";

type Props = { params: Promise<{ locale: string }> };
const allianceImage = "/media/horeca/alianza-v1.webp";
const processImage = "/media/horeca/proceso-v1.webp";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return pageMetadata({ locale, path: "/nosotros", title: getDictionary(locale).about.title, description: pick(relationship.statement, locale), image: allianceImage });
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const a = getDictionary(locale).about;

  return (
    <>
      <div className="page-head">
        <h1>{a.title}</h1>
      </div>

      <section className={`panel ${styles.story}`} aria-labelledby="h-rel">
        <div className={styles.copy}>
          <h2 id="h-rel" className="h-md">{a.relationshipHeading}</h2>
          <p>{pick(relationship.statement, locale)}</p>
          <a className="btn arrow" href={partnerUrl(locale)} rel="noopener">
            {a.visitGvl}
          </a>
        </div>
        <figure className={styles.art}>
          <Image src={allianceImage} alt={a.allianceAlt} width={1536} height={1024} sizes="(max-width: 760px) 100vw, (max-width: 1300px) 56vw, 710px" preload />
          <figcaption>{a.allianceCaption}</figcaption>
        </figure>
      </section>

      <section className={`panel ${styles.story}`} aria-labelledby="h-proc">
        <div className={styles.copy}>
          <h2 id="h-proc" className="h-md">{a.processHeading}</h2>
          <p>{a.processText}</p>
          <p>{a.packText}</p>
        </div>
        <figure className={styles.art}>
          <Image src={processImage} alt={a.processAlt} width={1536} height={1024} sizes="(max-width: 760px) 100vw, (max-width: 1300px) 56vw, 710px" />
          <figcaption>{a.imagesNote}</figcaption>
        </figure>
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
