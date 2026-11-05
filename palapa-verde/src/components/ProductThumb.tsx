import Image from "next/image";
import { isRemote } from "@/lib/format";
import { Engraving } from "@/components/engravings";
import type { Product } from "@/lib/commerce/types";

/** Miniatura decorativa para listas (carrito, admin). Válida en cliente y servidor. */
export function ProductThumb({ product }: { product: Pick<Product, "images" | "art"> }) {
  const image = product.images.find((i) => i.kind === "product") ?? product.images[0];
  const art = product.art[0];
  return (
    <span className="thumb" aria-hidden="true">
      {image ? (
        <Image src={image.src} alt="" width={image.width} height={image.height} sizes="84px" unoptimized={isRemote(image.src)} />
      ) : art ? (
        <Engraving name={art} className="engraving" />
      ) : null}
    </span>
  );
}
