import type { Localized } from "@/lib/commerce/types";

/**
 * Hechos de marca que SOLO el propietario puede confirmar. Cambiarlos aquí cambia
 * toda la web. Ver docs/strategy/02-brand-relationship.md y docs/APPROVAL_CHECKLIST.md.
 *
 * - "unconfirmed": redacción neutral («vinculada a Go Veggie Life»). Valor por defecto.
 * - "owned":       Palapa Verde es una marca de Go Veggie Life (confirmado por escrito + ONAPI).
 * - "supplied":    los productos se elaboran con vegetales de Go Veggie Life (confirmado).
 */
export type BrandRelationship = "unconfirmed" | "owned" | "supplied";

export const BRAND_RELATIONSHIP: BrandRelationship = "unconfirmed";

export const GO_VEGGIE_LIFE_URL = "https://web.goveggie.life/";

/** Fabricante real (nombre y dirección del registro sanitario). `null` = no se muestra. */
export const MANUFACTURER: { name: string; address: string } | null = null;

/**
 * Canales públicos de contacto. Solo se muestran si tienen un valor verificado y
 * aprobado por el propietario. Sin canal, la web no muestra formularios falsos.
 */
export const CONTACT: { salesEmail: string | null; whatsappNumber: string | null } = {
  salesEmail: null,
  whatsappNumber: null,
};

type RelationshipCopy = {
  /** Línea corta bajo la marca (solo si está confirmada). */
  endorsement: Localized | null;
  /** Explicación de la relación para «Nosotros», la portada y las FAQ. */
  statement: Localized;
};

export const RELATIONSHIP_COPY: Record<BrandRelationship, RelationshipCopy> = {
  unconfirmed: {
    endorsement: null,
    statement: {
      es: "Palapa Verde es una marca de alimentos preparados vinculada a Go Veggie Life, proveedor de frutas y vegetales frescos para supermercados de República Dominicana.",
      en: "Palapa Verde is a prepared-food brand associated with Go Veggie Life, a supplier of fresh fruit and vegetables to supermarkets in the Dominican Republic.",
    },
  },
  owned: {
    endorsement: { es: "Una marca de Go Veggie Life", en: "A brand of Go Veggie Life" },
    statement: {
      es: "Palapa Verde es la marca de alimentos preparados de Go Veggie Life, proveedor de frutas y vegetales frescos para supermercados de República Dominicana.",
      en: "Palapa Verde is the prepared-food brand of Go Veggie Life, a supplier of fresh fruit and vegetables to supermarkets in the Dominican Republic.",
    },
  },
  supplied: {
    endorsement: { es: "Elaborado con vegetales de Go Veggie Life", en: "Made with Go Veggie Life vegetables" },
    statement: {
      es: "Palapa Verde elabora sus productos con vegetales de Go Veggie Life, proveedor de frutas y vegetales frescos para supermercados de República Dominicana.",
      en: "Palapa Verde makes its products with vegetables from Go Veggie Life, a supplier of fresh fruit and vegetables to supermarkets in the Dominican Republic.",
    },
  },
};

export const relationship = RELATIONSHIP_COPY[BRAND_RELATIONSHIP];
