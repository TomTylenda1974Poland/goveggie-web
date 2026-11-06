"use client";

import { Children, isValidElement, useEffect, useState, type ReactNode } from "react";

type Option = { id: string; label: string };
type Group = { key: "product" | "time" | "occasion"; label: string; options: Option[] };
type Props = { groups: Group[]; allLabel: string; emptyLabel: string; resetLabel: string; children: ReactNode };
type Selection = Record<Group["key"], string>;

const ALL: Selection = { product: "all", time: "all", occasion: "all" };

type CardProps = { "data-product"?: string; "data-time"?: string; "data-occasions"?: string };

function matches(props: CardProps, s: Selection): boolean {
  if (s.product !== "all" && props["data-product"] !== s.product) return false;
  if (s.time !== "all" && Number(props["data-time"]) > Number(s.time)) return false;
  if (s.occasion !== "all" && !(props["data-occasions"] ?? "").split(" ").includes(s.occasion)) return false;
  return true;
}

/**
 * Filtros por producto, tiempo y momento. Sin JavaScript se ven todas las recetas.
 * Acepta `?producto=slug` en la URL (enlace desde la ficha de producto).
 */
export function RecipeFilters({ groups, allLabel, emptyLabel, resetLabel, children }: Props) {
  const [sel, setSel] = useState<Selection>(ALL);

  useEffect(() => {
    const product = new URLSearchParams(window.location.search).get("producto");
    const known = groups.find((g) => g.key === "product")?.options.some((o) => o.id === product);
    if (product && known) setSel((s) => ({ ...s, product }));
  }, [groups]);

  const items = Children.toArray(children).filter(
    (child) => isValidElement<CardProps>(child) && matches(child.props, sel),
  );

  return (
    <>
      <div className="filters">
        {groups.map((g) => (
          <div className="chips" role="group" aria-label={g.label} key={g.key}>
            <span className="chips-label">{g.label}</span>
            {[{ id: "all", label: allLabel }, ...g.options].map((o) => (
              <button
                key={o.id}
                type="button"
                className="chip"
                aria-pressed={sel[g.key] === o.id}
                onClick={() => setSel((s) => ({ ...s, [g.key]: o.id }))}
              >
                {o.label}
              </button>
            ))}
          </div>
        ))}
      </div>
      <p className="sr-only" aria-live="polite">
        {items.length}
      </p>
      {items.length > 0 ? (
        <div className="rcards">{items}</div>
      ) : (
        <div className="panel pad empty">
          <p>{emptyLabel}</p>
          <button type="button" className="btn btn--ghost" onClick={() => setSel(ALL)}>
            {resetLabel}
          </button>
        </div>
      )}
    </>
  );
}
