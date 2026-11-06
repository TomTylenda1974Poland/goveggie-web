> This is the initial editorial register. Current quantities, substitutions, meal allergens and cooking steps are maintained in src/content/recipes.ts. All ten entries still need a kitchen test.

# 05: Initial recipe collection (10 bilingual drafts)

Source of truth: `src/content/recipes.ts`. Each recipe has ES/EN titles, an intro, prep and cook time, servings, exact quantities, 3–5 steps, the Palapa Verde amount, substitutions, recipe-level allergen notes and media placeholders.

**Status of every recipe: `draft — kitchen testing required`.** None has been cooked, timed, tasted or photographed.
On the site they carry the badge "Borrador · pendiente de prueba en cocina", and they're hidden in production unless `SHOW_DRAFT_RECIPES=true`.
They get no structured data until `status: "tested"`. There are no nutrition figures and no cost per serving.

| # | Slug | ES title | Product | Amount (base) | Serves | Time | Occasion | Other allergens |
|---|---|---|---|---|---|---|---|---|
| 1 | yuca-con-chutney-de-cilantro | Yuca con cebolla y chutney de cilantro | Chutney de Cilantro | 120 g (8 cdas.) | 4 | 35 min | almuerzo, picadera | — |
| 2 | sandwich-de-pollo-con-chutney-de-cilantro | Sándwich de pollo a la plancha con chutney de cilantro | Chutney de Cilantro | 60 g (4 cdas.) | 2 | 25 min | almuerzo | gluten (+ milk/egg in variants) |
| 3 | huevos-revueltos-con-pesto-de-cilantro | Tostadas de huevo revuelto con pesto de cilantro | Pesto | 30 g (2 cdas.) | 2 | 10 min | desayuno | egg, gluten, milk (butter) |
| 4 | pasta-con-pesto-auyama-y-berenjena | Pasta con pesto, auyama y berenjena asadas | Pesto | 120 g (8 cdas.) | 4 | 40 min | cena | gluten |
| 5 | picadera-de-vegetales-con-hummus-de-zanahoria | Picadera de vegetales y casabe con hummus de zanahoria | Hummus de Zanahoria | 250 g (1 taza) | 6 | 15 min | picadera | — (gluten if crackers) |
| 6 | wrap-de-vegetales-asados-con-hummus-de-zanahoria | Wrap de vegetales a la plancha con hummus de zanahoria | Hummus de Zanahoria | 120 g (8 cdas.) | 4 | 25 min | almuerzo | gluten, milk (optional cheese) |
| 7 | casabe-con-hummus-de-remolacha-y-aguacate | Casabe con hummus de remolacha y aguacate | Hummus de Remolacha | 90 g (6 cdas.) | 2 | 12 min | desayuno, picadera | — |
| 8 | bowl-de-arroz-con-vegetales-y-hummus-de-remolacha | Bowl de arroz, vegetales asados y hummus de remolacha | Hummus de Remolacha | 120 g (8 cdas.) | 4 | 40 min | almuerzo, cena | egg (optional) |
| 9 | tacos-de-pescado-con-salsa-de-aguacate-y-jalapeno | Tacos de pescado con repollo y salsa de aguacate y jalapeño | Salsa | 120 g (8 cdas.) | 4 | 25 min | cena | fish |
| 10 | tostones-con-salsa-de-aguacate-y-jalapeno | Tostones con salsa de aguacate y jalapeño | Salsa | 120 g (8 cdas.) | 4 | 25 min | picadera | — |

Every recipe page also says: "Revisa además los alérgenos del producto Palapa Verde en su etiqueta (aún por confirmar)."

Changes from the suggested concepts:
- The two taco ideas became one taco recipe plus **tostones**, to avoid repetition.
- Cilantro chutney goes with **yuca con cebolla** (Dominican classic) and a **pan de agua** sandwich.
- Beet hummus goes on **casabe** instead of generic toast.
- Recipes use Go Veggie Life-type vegetables (auyama, berenjena, ají cubanela, zanahoria, pepino, repollo) without claiming they come from Go Veggie Life.

No dietary filters: dietary status depends on the unconfirmed product formulas.

## Path to "tested"
1. Cook each recipe as written, with the real product. Time each step and adjust quantities and steps.
2. Taste. Confirm the product amount is right.
3. Photograph the real dish (vertical and horizontal) and record a 15–30 s clip if possible.
4. In `recipes.ts`: update the quantities and times, set `media.photo`, and switch `status` to `"tested"`.
   The badge disappears and JSON-LD `Recipe` appears automatically.
5. Re-check the allergens against the final product label.
