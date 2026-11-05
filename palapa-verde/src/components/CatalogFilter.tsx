"use client";

import { Children, isValidElement, useState, type ReactNode } from "react";
import type { ProductCategory } from "@/lib/commerce/types";

type Props = {
  categories: { id: ProductCategory; label: string }[];
  allLabel: string;
  groupLabel: string;
  emptyLabel: string;
  /** Cada hijo debe llevar `data-category`. */
  children: ReactNode;
};

/** Filtro por categoría en el navegador; sin JavaScript se ven todos los productos. */
export function CatalogFilter({ categories, allLabel, groupLabel, emptyLabel, children }: Props) {
  const [active, setActive] = useState<ProductCategory | "all">("all");
  const items = Children.toArray(children).filter(
    (child) =>
      active === "all" ||
      (isValidElement<{ "data-category"?: string }>(child) && child.props["data-category"] === active),
  );
  const options: { id: ProductCategory | "all"; label: string }[] = [{ id: "all", label: allLabel }, ...categories];

  return (
    <>
      <div className="chips" role="group" aria-label={groupLabel}>
        {options.map((o) => (
          <button
            key={o.id}
            type="button"
            className="chip"
            aria-pressed={active === o.id}
            onClick={() => setActive(o.id)}
          >
            {o.label}
          </button>
        ))}
      </div>
      {items.length > 0 ? <div className="cards">{items}</div> : <p className="note">{emptyLabel}</p>}
    </>
  );
}
