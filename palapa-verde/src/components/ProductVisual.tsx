import Image from "next/image";
import { isRemote } from "@/lib/format";
import { Engraving } from "@/components/engravings";
import type { Locale, Product } from "@/lib/commerce/types";
import { getDictionary, pick } from "@/lib/i18n";

type Props = {
  product: Pick<Product, "name" | "images" | "art">;
  locale: Locale;
  size: "card" | "detail" | "thumb";
  priority?: boolean;
  /** Oculta el rótulo «Imagen ilustrativa» (p. ej. cuando el contenedor ya lo muestra). */
  hideNote?: boolean;
};

const SIZES = {
  card: "(max-width: 760px) 100vw, (max-width: 1100px) 50vw, 420px",
  detail: "(max-width: 760px) 100vw, 640px",
  thumb: "96px",
};

/**
 * Foto real si existe; si no, la imagen ilustrativa rotulada como tal;
 * si tampoco hay, los dibujos botánicos del nombre del producto.
 */
export function ProductVisual({ product, locale, size, priority, hideNote }: Props) {
  const dict = getDictionary(locale);
  const t = dict.product;
  const image =
    product.images.find((i) => i.kind === "product") ??
    product.images.find((i) => i.kind === "illustration") ??
    product.images[0];
  const note =
    image?.kind === "product"
      ? null
      : image?.kind === "illustration"
        ? size === "detail"
          ? t.illustration
          : dict.common.imageNote
        : image
          ? t.ingredientPhoto
          : t.noPhoto;

  return (
    <figure className={`visual visual--${size}`}>
      {image ? (
        <Image
          src={image.src}
          alt={pick(image.alt, locale)}
          width={image.width}
          height={image.height}
          sizes={SIZES[size]}
          priority={priority}
          unoptimized={isRemote(image.src)}
        />
      ) : (
        <div className="visual-art" role="img" aria-label={`${pick(product.name, locale)} — ${t.noPhoto}`}>
          {product.art.map((key) => (
            <Engraving key={key} name={key} className="engraving" />
          ))}
        </div>
      )}
      {size !== "thumb" && note && !hideNote ? <figcaption className="visual-note">{note}</figcaption> : null}
    </figure>
  );
}
