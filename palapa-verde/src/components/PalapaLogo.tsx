import { BRAND_RELATIONSHIP, relationship } from "@/content/brand";
import { pick } from "@/lib/i18n";
import type { Locale } from "@/lib/commerce/types";
import styles from "./PalapaLogo.module.css";

/** Both language versions share the same roof and outlined brand lettering. */
export function PalapaLogo({ locale, inverse = false }: { locale: Locale; inverse?: boolean }) {
  const owned = BRAND_RELATIONSHIP === "owned";
  // The parent link supplies the accessible name, including the endorsement.
  return (
    <span className={styles.lockup}>
      <img
        src={owned ? `/brand/palapa-verde-${locale}.svg` : "/brand/palapa-verde.svg"}
        width={1012}
        height={owned ? 342 : 238}
        alt=""
        className={inverse ? `${styles.mark} ${styles.inverse}` : styles.mark}
      />
      {!owned && relationship.endorsement && <span className={styles.caption}>{pick(relationship.endorsement, locale)}</span>}
    </span>
  );
}
