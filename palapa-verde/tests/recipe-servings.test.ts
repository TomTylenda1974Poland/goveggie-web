// @vitest-environment jsdom
/**
 * The servings control of a recipe as a visitor uses it. Changing the language replaces the page with
 * the other locale's page, so the control is unmounted and mounted again: open() does the same.
 */
import { act, createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { RecipeInteractive } from "../src/components/RecipeInteractive";
import { RECIPES, type Recipe } from "../src/content/recipes";
import type { Locale } from "../src/lib/commerce/types";
import { writeServings } from "../src/lib/recipe-servings";

// React runs effects and state updates inside act() only when this is set.
(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const labels = {
  es: {
    servings: "Porciones", lessServings: "Una porción menos", moreServings: "Una porción más", ingredients: "Ingredientes",
    productUsed: "Producto", print: "Imprimir", shareRecipe: "Compartir", shareList: "Enviar lista", listTitle: "Lista",
    shareNote: null, allergens: "Alérgenos",
  },
  en: {
    servings: "Servings", lessServings: "One serving fewer", moreServings: "One more serving", ingredients: "Ingredients",
    productUsed: "Product", print: "Print", shareRecipe: "Share", shareList: "Send list", listTitle: "List",
    shareNote: null, allergens: "Allergens",
  },
} as const;

const yuca = RECIPES[0]!;
const other = RECIPES.find(recipe => recipe.slug !== yuca.slug && recipe.servings !== yuca.servings + 2) ?? RECIPES[1]!;

let host: HTMLDivElement;
let root: Root | null = null;

function close() {
  if (root) act(() => root!.unmount());
  root = null;
}

function open(locale: Locale, recipe: Recipe = yuca) {
  close();
  root = createRoot(host);
  act(() => root!.render(createElement(RecipeInteractive, {
    locale, slug: recipe.slug, title: recipe.title[locale], baseServings: recipe.servings, publicRecipeUrl: null,
    ingredients: [...recipe.ingredients], labels: labels[locale],
  })));
}

const chosen = () => Number(host.querySelector("select")!.value);
const amounts = () => [...host.querySelectorAll(".ingredients .qty")].map(node => node.textContent).join(" | ");

function press(name: string) {
  const button = host.querySelector(`button[aria-label="${name}"]`)!;
  act(() => button.dispatchEvent(new MouseEvent("click", { bubbles: true })));
}

function pick(count: number) {
  const list = host.querySelector("select")!;
  // React hears the native change event and reads the value through the element's own setter.
  const setValue = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, "value")!.set!;
  act(() => {
    setValue.call(list, String(count));
    list.dispatchEvent(new Event("change", { bubbles: true }));
  });
}

beforeEach(() => {
  window.sessionStorage.clear();
  window.localStorage.clear();
  host = document.createElement("div");
  document.body.append(host);
});

afterEach(() => {
  close();
  host.remove();
});

describe("recipe servings across a language change", () => {
  it("keeps the number chosen with the plus button, and the amounts that go with it", () => {
    open("en");
    const untouched = amounts();
    open("es");
    press(labels.es.moreServings);
    press(labels.es.moreServings);

    open("en");

    expect(chosen()).toBe(yuca.servings + 2);
    expect(amounts()).not.toBe(untouched);
  });

  it("keeps the number chosen with the minus button", () => {
    open("es");
    press(labels.es.lessServings);

    open("en");

    expect(chosen()).toBe(yuca.servings - 1);
  });

  it("keeps the number picked from the list", () => {
    open("en");
    pick(9);

    open("es");

    expect(chosen()).toBe(9);
  });

  it("keeps each recipe's number apart", () => {
    open("es", yuca);
    press(labels.es.moreServings);
    press(labels.es.moreServings);

    open("es", other);
    expect(chosen()).toBe(other.servings);

    open("en", yuca);
    expect(chosen()).toBe(yuca.servings + 2);
  });

  it("starts from the recipe's own number while nothing was chosen", () => {
    open("es");
    open("en");

    expect(chosen()).toBe(yuca.servings);
  });

  it("starts from the recipe's own number when the kept one is outside the list", () => {
    writeServings(yuca.slug, 500);

    open("es");

    expect(chosen()).toBe(yuca.servings);
  });

  it("keeps the choice out of storage that outlives the tab", () => {
    open("es");
    press(labels.es.moreServings);

    expect(window.localStorage.length).toBe(0);
  });
});
