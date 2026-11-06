# 01: Current-state audit and prioritized plan

Date: 2026-11-06 · Branch: `palapa-verde/shop` · Author: Claude Code (Codex reviews afterwards)

## 1. What exists

**Repository** `TomTylenda1974Poland/goveggie-web` (public):
- The root holds the static Go Veggie Life prototype. `palapa-verde/` holds the Palapa Verde Next.js 16 app.
- The app is TypeScript and uses the App Router. Every page is statically generated except `/api/orders`.
- Locales: `/es` (default) and `/en`, with strings in `src/lib/i18n.ts`.
- Content model: `src/lib/commerce/*`. `CommerceProvider` has two implementations: the mock (default) and a provisional goveggie.life adapter.
  Product facts the business hasn't supplied are `null`.
- Tests: 52 Vitest tests (contract, rules, cart, i18n).
- Deployment: Vercel project `palapa-verde`, Git-connected to the repo with Root Directory `palapa-verde` (Hobby plan, scope `donpollolococabarete-9718`).
  Production `palapa-verde.vercel.app` runs the 2026-11-06 owner-approved build of this branch. `main` still holds the old one-pager.

**Working vs mock** (before this round):

| Feature | State |
|---|---|
| Catalogue, product pages, category filter | Working, static |
| Stock badges ("Disponible", "Últimas unidades", "Agotado") | **Mock**: invented test quantities |
| Cart and "Enviar pedido de prueba" | **Mock**: validates, sends to no one. Looks like real ordering. |
| Prices | `null` and shown as "Precio por confirmar" |
| `/admin` missing-data panel | Working, read-only |
| goveggie.life API adapter | Provisional, no spec, not configured |
| Images | Product photos generated with ChatGPT from the owner's packaging reference ("Imagen ilustrativa"). Engravings generated. Three Go Veggie Life produce photos. |
| Analytics | None |
| Contact / wholesale channel | None. The Go Veggie Life site's contact page has placeholders only (`[correo comercial]`, `[teléfono / WhatsApp]`). |

**Go Veggie Life website** (https://web.goveggie.life/, checked 2026-11-06):
- A static prototype of the same repo's root site. Title "GoVeggie - Prototipo web".
- Nav: Inicio, Productos, Calidad, Nosotros, Para supermercados, Contacto, "Solicitar catálogo".
- The footer links to the Palapa Verde preview URL.
- The contact form and footer hold placeholders, so **no verified receiving channel exists** for retail or wholesale enquiries.

## 2. Brand facts and launch status

The owner confirmed that Palapa Verde is a Go Veggie Life brand and that Go Veggie Life is the main ingredient supplier. Specific formulation, ingredient provenance, the actual manufacturer and the registration holder still need SKU-specific records. Five website concepts are visible, and the business must select the launch range. Keep the different internal planning lists separate.

## 3. Unverified claims found on the site (fixed in this round)

| Claim / element | Where | Action |
|---|---|---|
| "Una marca de Go Veggie Life" (ownership) | brand line, product page, footer | Owner-confirmed brand endorsement, shown in both languages. |
| "elaborados con los vegetales y hierbas frescas de Go Veggie Life" (sourcing) | home hero | Removed. Sourcing goes behind the same setting (`supplied` mode). |
| "Menos desperdicio → Más valor" (environmental claim) | hero strip | Removed until there's evidence |
| "Vegetales frescos seleccionados por Go Veggie Life" | process strip | Neutral wording |
| Stock badges with invented numbers, "Últimas unidades" next to "Precio por confirmar" | cards, product page | Removed from public pages; kept in `/admin` and labelled test data |
| Cart that appears to take orders | `/carrito`, header | Removed. `/carrito` redirects to `/donde-comprar`. `/api/orders` is off unless `ORDERS_ENABLED=true`. |
| Footer placeholder `[datos de la empresa por confirmar]` | footer | Removed |
| Packshot labels say "Una marca de Go Veggie Life" | generated images | Kept (no repackaging without a separate task). Listed in 02-brand-relationship. |

## 4. Brand-site patterns checked (official sites, 2026-11-06)

Pages loaded: gothamgreens.com (home, `/our-products/`, `/journal/category/recipes/`, `/our-story/`, `/faq/`, `/find-us/`).
bitchinsauce.com (home, `/blogs/recipes`, `/pages/find-in-store`, `/pages/faqs-1`).
sirkensingtons.com (`/us/en/recipes.html`; `/recipes` is a 404). sabra.com (home only; `/recipes` is a 404 today).

- **Gotham Greens:** product filter tabs by category. Recipes live in the journal and name products in the ingredient list, without links.
  The story page has values, a timeline and leadership with photos. The FAQ covers storage, allergens and growing. "Find us" is a store locator.
- **Bitchin' Sauce:** recipe chips by product, occasion and diet. Recipe pages have print and share and end with a "find it in stores" call to action.
  The FAQ answers "is it just for dipping?" (spread, marinade, dressing) and offers a **store request** button plus a separate wholesale route.
- **Sir Kensington's:** a large recipe index with search and filter, and creator collaborations credited by handle.
- **Sabra:** the nav is Products · About · Where to Buy · FAQ. Recipes aren't in the current site.

Adapted, not copied, for Palapa Verde:
- Recipe index by product, time and occasion.
- Product ↔ recipe links in both directions.
- One "where to buy" route with an honest prelaunch state.
- A retailer request route, once a real channel exists.
- An FAQ grouped by use, ingredients, storage, buying and business.
- A compact story with real people only.

No claim is made that any pattern raises sales.

## 5. Prioritized plan

| # | Work | Why | Status |
|---|---|---|---|
| P0 | Remove misleading prototype elements (stock, cart, prices, placeholders, unverified claims) | Trust; nothing is on sale | Done this round |
| P0 | Honest prelaunch "Dónde comprar" + business route without fake channels | Customers need a real answer | Done; channel pending owner |
| P1 | Recipes section: index, filters, detail, servings scaling, print, WhatsApp share, product links | The core reason to visit and return | Done; 10 drafts |
| P1 | Product page: serving ideas, related recipes, status, prelaunch info panel, where-to-buy | Understand and use | Done |
| P1 | Stable QR routes `/p/{qr-id}` | Packaging must not break | Done |
| P1 | Our story, FAQ, business customers pages | Trust, B2B route | Done, using only verified content |
| P2 | Analytics event layer + UTM convention (no provider until chosen) | Measure journeys without PII | Done; provider is an owner decision |
| P2 | Social plan, 12 video briefs, filming checklist | Content without a big budget | Drafted (Codex), reviewed |
| P3 | Real photography of products, people and facility; kitchen-tested recipes | Replace concept media | Needs production |
| P3 | Launch range decision, product facts, stockists, contact channel, brand ownership | Unblocks publishing | Owner (see APPROVAL_CHECKLIST.md) |
