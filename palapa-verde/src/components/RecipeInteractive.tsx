"use client";

import { useState } from "react";
import type { Ingredient } from "@/content/recipes";
import type { Locale } from "@/lib/commerce/types";
import { ingredientLine, ingredientText, whatsappShareUrl } from "@/lib/recipe-format";

type Labels = {
  servings: string;
  lessServings: string;
  moreServings: string;
  ingredients: string;
  productUsed: string;
  print: string;
  shareRecipe: string;
  shareList: string;
  listTitle: string;
  /** Aviso añadido a los mensajes compartidos (borrador, prelanzamiento). */
  shareNote: string | null;
};

type Props = {
  locale: Locale;
  slug: string;
  title: string;
  baseServings: number;
  ingredients: Ingredient[];
  labels: Labels;
};

const MIN = 1;
const MAX = 24;

/** Porciones ajustables, lista de ingredientes escalada, impresión y envío por WhatsApp. */
export function RecipeInteractive({ locale, slug, title, baseServings, ingredients, labels }: Props) {
  const [servings, setServings] = useState(baseServings);
  const factor = servings / baseServings;
  const productLine = ingredients.find((i) => i.product);

  const pageUrl = () => window.location.href.split(/[?#]/)[0] ?? "";

  function shareRecipe() {
    const note = labels.shareNote ? `\n(${labels.shareNote})` : "";
    window.open(whatsappShareUrl(`${title}${note}\n${pageUrl()}`), "_blank", "noopener");
  }
  function shareList() {
    const lines = ingredients.map((i) => `• ${ingredientText(i, factor, locale)}`);
    const note = labels.shareNote ? `(${labels.shareNote})\n` : "";
    const text = `${labels.listTitle}: ${title} (${servings} ${labels.servings.toLowerCase()})\n${note}${lines.join("\n")}\n${pageUrl()}`;
    window.open(whatsappShareUrl(text), "_blank", "noopener");
  }

  return (
    <section className="recipe-box" aria-label={labels.ingredients}>
      <div className="recipe-box-head">
        <h2 className="h-sm">{labels.ingredients}</h2>
        <div className="servings">
          <span id={`servings-${slug}`}>{labels.servings}</span>
          <div className="stepper" role="group" aria-labelledby={`servings-${slug}`}>
            <button
              type="button"
              aria-label={labels.lessServings}
              disabled={servings <= MIN}
              onClick={() => setServings((s) => Math.max(MIN, s - 1))}
              data-track="servings_change"
              data-track-recipe={slug}
              data-track-direction="down"
            >
              −
            </button>
            <output aria-live="polite">{servings}</output>
            <button
              type="button"
              aria-label={labels.moreServings}
              disabled={servings >= MAX}
              onClick={() => setServings((s) => Math.min(MAX, s + 1))}
              data-track="servings_change"
              data-track-recipe={slug}
              data-track-direction="up"
            >
              +
            </button>
          </div>
        </div>
      </div>

      {productLine ? (
        <p className="product-used">
          <span>{labels.productUsed}:</span> <strong>{ingredientText(productLine, factor, locale)}</strong>
        </p>
      ) : null}

      <ul className="ingredients">
        {ingredients.map((ing, i) => {
          const line = ingredientLine(ing, factor, locale);
          return (
            <li key={i} className={ing.product ? "is-product" : undefined}>
              {line.qty ? <span className="qty">{line.qty}</span> : null} <span>{line.text}</span>
            </li>
          );
        })}
      </ul>

      <div className="recipe-actions no-print">
        <button type="button" className="btn btn--ghost" onClick={() => window.print()} data-track="recipe_print_click" data-track-recipe={slug}>
          {labels.print}
        </button>
        <button type="button" className="btn btn--ghost" onClick={shareRecipe} data-track="whatsapp_share_click" data-track-recipe={slug} data-track-kind="recipe">
          {labels.shareRecipe}
        </button>
        <button type="button" className="btn btn--ghost" onClick={shareList} data-track="whatsapp_share_click" data-track-recipe={slug} data-track-kind="list">
          {labels.shareList}
        </button>
      </div>
    </section>
  );
}
