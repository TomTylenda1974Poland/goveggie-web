import Image from "next/image";
import type { RecipeMedia } from "@/content/recipes";
import type { Locale } from "@/lib/commerce/types";
import { pick } from "@/lib/i18n";
import styles from "./RecipeServingImage.module.css";

type Props = { media: RecipeMedia; locale: Locale; detail?: boolean };

export function RecipeServingImage({ media, locale, detail = false }: Props) {
  const art = media.photo ?? media.illustration;
  if (!art) return null;
  return (
    <figure className={detail ? styles.detail : styles.card}>
      <Image
        src={art.src}
        alt={pick(art.alt, locale)}
        width={art.width}
        height={art.height}
        sizes={detail ? "(max-width: 900px) 92vw, 480px" : "(max-width: 760px) 90vw, (max-width: 1020px) 45vw, 385px"}
      />
      {!media.photo && (
        <figcaption>{locale === "es" ? "Sugerencia de presentación · Ilustración" : "Serving suggestion · Illustration"}</figcaption>
      )}
    </figure>
  );
}
