import type { Availability, Locale } from "@/lib/commerce/types";
import { getDictionary } from "@/lib/i18n";

export function AvailabilityBadge({ availability, locale }: { availability: Availability; locale: Locale }) {
  return (
    <span className={`badge badge--${availability}`}>{getDictionary(locale).availability[availability]}</span>
  );
}
