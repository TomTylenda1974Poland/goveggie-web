"use client";

import { useEffect, useState } from "react";
import type { Ingredient } from "@/content/recipes";
import type { Locale } from "@/lib/commerce/types";
import { track } from "@/lib/analytics";
import { ingredientLine, ingredientText, whatsappShareUrl } from "@/lib/recipe-format";
import { readServings, writeServings } from "@/lib/recipe-servings";

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
  shareNote: string | null;
  allergens: string;
};

type Props = {
  locale: Locale;
  slug: string;
  title: string;
  baseServings: number;
  publicRecipeUrl: string | null;
  ingredients: Ingredient[];
  labels: Labels;
};

const MIN = 1;
const MAX = 24;
const PORTION_CHOICES = Array.from({ length: MAX - MIN + 1 }, (_, i) => MIN + i);

/** Porciones ajustables, lista de ingredientes escalada, impresión y envío por WhatsApp. */
export function RecipeInteractive({ locale, slug, title, baseServings, publicRecipeUrl, ingredients, labels }: Props) {
  const [servings, setServings] = useState(baseServings);
  const factor = servings / baseServings;
  const productLine = ingredients.find((i) => i.product);

  // Un cambio de idioma vuelve a montar este control: recupera lo que la persona eligió en esta pestaña.
  useEffect(() => {
    const kept = readServings(slug, MIN, MAX);
    if (kept !== null) setServings(kept);
  }, [slug]);

  function choose(count: number) {
    setServings(count);
    writeServings(slug, count);
  }

  function shareRecipe() {
    if (publicRecipeUrl) window.open(whatsappShareUrl([title, labels.shareNote, publicRecipeUrl].filter(Boolean).join("\n")), "_blank", "noopener");
  }
  function shareList() {
    const lines = ingredients.map((i) => `• ${ingredientText(i, factor, locale)}`);
    const text = [labels.shareNote, `${labels.listTitle}: ${title} (${servings} ${labels.servings.toLowerCase()})`, ...lines, labels.allergens, publicRecipeUrl].filter(Boolean).join("\n");
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
              onClick={() => choose(Math.max(MIN, servings - 1))}
              data-track="servings_change"
              data-track-recipe={slug}
              data-track-direction="down"
            >
              −
            </button>
            <select
              value={servings}
              aria-labelledby={`servings-${slug}`}
              onChange={event => {
                const count = Number(event.target.value);
                choose(count);
                track("servings_change", { recipe: slug, direction: count > servings ? "up" : "down" });
              }}
            >
              {PORTION_CHOICES.map(count => <option key={count} value={count}>{count}</option>)}
            </select>
            <output className="sr-only" aria-live="polite">{servings}</output>
            <button
              type="button"
              aria-label={labels.moreServings}
              disabled={servings >= MAX}
              onClick={() => choose(Math.min(MAX, servings + 1))}
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
        {publicRecipeUrl && <button type="button" className="btn btn--ghost" onClick={shareRecipe} data-track="whatsapp_share_click" data-track-recipe={slug} data-track-kind="recipe">
          {labels.shareRecipe}
        </button>}
        <button type="button" className="btn btn--ghost" onClick={shareList} data-track="whatsapp_share_click" data-track-recipe={slug} data-track-kind="list">
          {labels.shareList}
        </button>
      </div>
    </section>
  );
}
