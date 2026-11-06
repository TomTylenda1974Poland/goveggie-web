# Approval checklist: facts only the owner or production team can confirm

Live status is also shown at `/es/admin` → "Hechos por confirmar". Update the file named in the right column when an item is confirmed.

| # | Fact | Why it blocks | Where to set it |
|---|---|---|---|
| 1 | **Launch range.** Three lists exist: the website (5 products), the DIGEMAPS preparation (pesto de albahaca, hummus original, pierogi, zapiekanka, caldo de pollo) and the packaging "Phase 1" (pico de gallo, pesto de albahaca, hummus original, hummus de pimiento rojo asado). Which products launch? | Product pages, recipes, QR codes and photos depend on it | `mock/fixtures.ts`, `brand-content.ts`, `recipes.ts` |
| 2 | **Brand relationship confirmed by the owner**: Palapa Verde is a brand of Go Veggie Life. Legal entity and ONAPI records are tracked separately. | Endorsement line on site and labels | `src/content/brand.ts` → `BRAND_RELATIONSHIP` |
| 3 | **Ingredient sourcing**: Go Veggie Life is the main ingredient supplier. For a claim about a particular ingredient or product, confirm its provenance. | "Elaborado con vegetales de Go Veggie Life" | same |
| 4 | **Manufacturer**: URBANCACAO, S.R.L. or a contract plant; plant address and sanitary permit | Label, "Nosotros" | `brand.ts` → `MANUFACTURER` |
| 5 | Per product: **ingredients, allergens, net content, storage and after-opening, shelf life, taste, texture, heat** | Product facts panel, FAQ, recipe allergen notes | `fixtures.ts` (or the goveggie.life API) |
| 6 | **Real product photos** (and packaging approval) | The existing illustrative packshots carry the approved brand endorsement. Real photos require real finished products and approved labels. | `public/media/productos/`, `kind: "product"` |
| 7 | **Kitchen-tested recipes** (cook, time, taste, photograph) | Recipes are hidden in production until tested or explicitly shown | `recipes.ts` → `status`, `media` |
| 8 | **Confirmed stockists** (name, address, map pin, products, date) | "Dónde comprar" | `src/content/stockists.ts` |
| 9 | **Public sales channel** (email and/or WhatsApp approved for publication) | Business and retailer requests | `brand.ts` → `CONTACT` |
| 10 | **Business terms**: formats, minimum order, delivery coverage, lead times | `/negocios` | `i18n.ts` → `business` (currently "Por confirmar") |
| 11 | **Production domain** (for QR printing, metadata, sitemap) | QR codes must not use `*.vercel.app` | Vercel env `SITE_URL` |
| 12 | **Analytics provider** and privacy/cookie notice | Events go nowhere until installed | Tag manager + `NEXT_PUBLIC_ANALYTICS_PROVIDER` |
| 13 | **Vercel Pro** (US$20/month): Hobby forbids commercial use | Before selling | Vercel billing (owner) |
| 14 | **Real payments / online orders**: provider, contract | Off by design | `ORDERS_ENABLED` (do not set without decision) |
| 15 | **Go-live**: merge to `main`, `SITE_INDEXABLE=true`. Done 2026-11-06: production runs the shop branch; `SHOW_DRAFT_RECIPES=true` on production (owner decision) | Publishing | Owner instruction only |
| 16 | **The `catalog` Vercel project** is linked to this repo; a push to `main` would replace catalog.goveggie.life | Before any merge to `main` | Vercel project settings (owner) |
| 17 | **Professional line for hotels and restaurants**: which formats (large kitchen/buffet container, extra-large buffet container, single portion, squeeze bottle), sizes, packaging supplier, label content, producer equipment (portion sealing), shelf life per format. The `/negocios#hoteles` section shows them as "Propuesto · por confirmar". Its Go Veggie Life button points to `hoteles-restaurantes.html`, so publish that GVL page before this section reaches production | Formats, label and claims on `/negocios` | `i18n.ts` → `business.horeca`; `brand.ts` → `GO_VEGGIE_LIFE_HORECA_URL` |

The manufacturer and registration holder are separate, unconfirmed fields. Enter them only from approved product documentation.
