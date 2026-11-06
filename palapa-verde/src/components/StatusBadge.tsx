import type { LaunchStatus, Locale } from "@/lib/commerce/types";
import { getDictionary } from "@/lib/i18n";

/** Estado de lanzamiento real del producto (no existencias). */
export function StatusBadge({ status, locale }: { status: LaunchStatus; locale: Locale }) {
  return <span className={`badge badge--${status}`}>{getDictionary(locale).launch[status]}</span>;
}
