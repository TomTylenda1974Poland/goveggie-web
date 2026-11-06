import type { ReactNode } from "react";
import Image from "next/image";
import type { Locale } from "@/lib/commerce/types";
import styles from "./ProductVisual.module.css";

type Props = {
  locale: Locale;
  slug: string;
  texture: { src: string; alt: string };
  initialIsPackaging: boolean;
  children: ReactNode;
};

export function ProductGallery({ locale, slug, texture, initialIsPackaging, children }: Props) {
  const es = locale === "es";
  const group = `product-views-${slug}`;
  return (
    <fieldset className={styles.gallery}>
      <legend className="sr-only">{es ? "Imágenes del producto" : "Product images"}</legend>
      <input className={styles.choice} id={`${group}-first`} name={group} type="radio" defaultChecked />
      <label className={styles.label} htmlFor={`${group}-first`}>
        {initialIsPackaging ? (es ? "Envase" : "Packaging") : (es ? "Producto" : "Product")}
      </label>
      <input className={styles.choice} id={`${group}-detail`} name={group} type="radio" />
      <label className={styles.label} htmlFor={`${group}-detail`}>{es ? "Textura" : "Texture"}</label>
      <div className={styles.primary}>{children}</div>
      <figure className={`visual visual--detail ${styles.texture}`}>
        <Image src={texture.src} alt={texture.alt} width={960} height={640}
          sizes="(max-width: 760px) 100vw, 640px" />
        <figcaption className={styles.note}>
          {es ? "Sugerencia de presentación · Ilustración" : "Serving suggestion · Illustration"}
        </figcaption>
      </figure>
    </fieldset>
  );
}
