# Content guide: how to add products, recipes and stockists

All content is TypeScript in the repo. After any change, run `pnpm check` and open the preview.

## Product
1. **Commercial data**: `src/lib/commerce/mock/fixtures.ts` → `draft(id, slug, category, nombre ES, name EN)`.
   Facts stay `null` until confirmed in writing: price, net content, ingredients, allergens, shelf life, storage, taste, texture, heat.
   Once the goveggie.life API exists, these come from the API instead (see `docs/INTEGRATION.md`).
2. **Editorial data**: `src/lib/commerce/brand-content.ts`, keyed by slug:
   - `art`: key vegetables, taken from the name
   - `images`: `kind: "illustration"` until real photos exist, then `"product"`
   - `launch`: `concept` → `in_development` → `coming_soon` → `available`. Only `available` shows the price; when any product is `available` the prelaunch banner disappears.
   - `servingIdeas`: exactly three, ES and EN; culinary suggestions only, no claims
   - `qrId`: lowercase and hyphens; **permanent once printed**
3. Images: 1536×1024 JPG, about 300–450 KB, in `public/media/productos/{slug}.jpg`.
4. A new category also needs `ProductCategory` in `types.ts` and labels in `i18n.ts` (`category`).

## Recipe
Add an object to `RECIPES` in `src/content/recipes.ts`:
- `slug` (Spanish, hyphens), `status: "draft"`, `product` (the product slug), times, `servings`, `occasions`.
- `ingredients`: grams/ml for weighed items, `cup`/`tbsp`/`tsp`/`pinch` for kitchen measures, or `unit: null` with a singular/plural noun for counted items. Exactly one line has `product` (+ `alt` household measure).
- 3–5 `steps`, `substitutions`, `allergens` for the other ingredients. Never write "tested", calories or cost.
- When it has been cooked and photographed: set `media.photo` and `status: "tested"`.
- Tests check the structure: `pnpm test`.

## Stockist
Add to `STOCKISTS` in `src/content/stockists.ts`, **only with written confirmation** from the store:
- name, address, city
- `mapUrl`: open it and check the pin
- `products` (slugs) and `confirmedOn` (YYYY-MM-DD)

The list is not live stock. The page says so.

## Brand facts and contact
`src/content/brand.ts`:
- `BRAND_RELATIONSHIP`, after the owner confirms (see docs/strategy/02-brand-relationship.md)
- `MANUFACTURER`
- `CONTACT.salesEmail` / `whatsappNumber`: only owner-approved public channels. Setting one makes the contact buttons appear on `/negocios`.

## FAQ
`src/content/faq.ts`. Answers state only what's confirmed. Update them when a fact is confirmed.

## Copy (UI text)
`src/lib/i18n.ts`. ES and EN must have the same keys; a test checks this.
