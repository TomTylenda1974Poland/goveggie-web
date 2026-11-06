# 09: Verification report and Codex handoff

Date: 2026-11-06 · Branch `palapa-verde/shop`.
Commits: `c0e625c` (docs), `bc02cee` (site), `bc01df0` (Codex review fixes) and this docs commit.
**Pushed 2026-11-06 with the owner's approval.** Preview: https://palapa-verde-git-palapa-verde-shop-donpollolococabarete-9718.vercel.app/es
(deployment `3vrj4nUsavMFsr888zY7PsPzaam7`, READY). Checked on the preview: all 13 page routes 200, unknown page 404, the QR and cart
redirects, `/api/orders` 503, draft recipes visible (preview environment), no removed claims in the HTML.
Production (`palapa-verde.vercel.app`) was not touched.

## Implemented behaviour
- **Honest prelaunch:**
  - A banner on every page, plus the status "En desarrollo · aún no a la venta".
  - No prices, stock badges, cart or order form. `/carrito` redirects to `/donde-comprar`, and `/api/orders` returns 503 unless `ORDERS_ENABLED=true`.
- **Brand facts in one place** (`src/content/brand.ts`):
  - The relationship uses neutral wording until confirmed; the manufacturer is hidden while `null`.
  - Contact buttons appear only when a real channel is set.
- **Products:**
  - Category filter, three serving ideas, recipes for that product, an approved-facts-only panel and where to buy.
  - Every illustration is captioned.
- **Recipes:**
  - 10 bilingual drafts with filters by product, time and occasion. Servings scale from 1 to 24 with unit-aware rounding.
  - Print view, WhatsApp share (recipe link or shopping list, with a draft note), product link and where to buy.
  - Drafts are hidden in production unless `SHOW_DRAFT_RECIPES=true`. JSON-LD appears only for tested recipes.
- **Trust pages:** Dónde comprar (prelaunch + business route), Nosotros, Preguntas frecuentes, Negocios.
- **QR:** `/p/{qrId}` redirects (307) to the exact product with UTM. Unknown codes go to the catalogue.
- **Analytics:** provider-neutral `track()` with 11 events, a `data-track` listener, UTM handling and `site_env`. Nothing is sent without a provider.
- **SEO:** per-page canonical, hreflang and Open Graph; robots and sitemap (noindex until `SITE_INDEXABLE=true`).

## Routes and important files
- Routes: see `03-structure-and-journeys.md`.
- Content: `src/content/{brand,recipes,faq,stockists}.ts`, `src/lib/commerce/brand-content.ts`, `src/lib/i18n.ts`
- Components: `RecipeCard`, `RecipeFilters`, `RecipeInteractive`, `StatusBadge`, `QrWelcome`, `AnalyticsListener`, `TrackView`, `ProductCard`, `SiteChrome`
- Logic: `src/lib/recipe-format.ts`, `src/lib/analytics.ts`, `src/lib/site.ts`
- Config: `next.config.ts` (QR and cart redirects), `.env.example` (new flags)
- Removed: `CartView`, `CartLink`, `AddToCart`, `AvailabilityBadge`, `/carrito` page

## Checks performed

| Check | Result |
|---|---|
| `pnpm typecheck` | pass |
| `pnpm test` | **75 passed**: contract (mock + fake goveggie), rules (no invented data), recipe structure, scaling, visibility, brand defaults, QR ids, FAQ links, site URL |
| `pnpm build` | pass: 51 static pages + `/api/orders`, robots, sitemap |
| HTTP checks (local production build) | all 13 page routes 200 · unknown page 404 · `/p/hummus-zanahoria` 307 to the product with UTM · unknown QR to the catalogue · `/es/carrito` and `/en/carrito` 307 to where to buy · `/api/orders` 503 |
| Removed claims (grep on rendered HTML) | no "Últimas unidades", "Disponible", "carrito", "Precio por confirmar", "Una marca de Go Veggie Life" (text), "refrigerados", "a base de vegetales", placeholders |
| Interactions (browser) | servings 2→4 rescales every line, including the product (60→120 g) · print triggers `window.print` · both WhatsApp messages build the right text with a draft note · product → recipes pre-filters by `?producto=` · time "Más de 30 min" shows only 35–40-min recipes · empty state + reset · language switch keeps filters · QR landing shows the welcome, 3 ideas and 2 recipes |
| Analytics events (browser) | `recipe_print_click`, `whatsapp_share_click` ×2, `servings_change` pushed to `dataLayer` with `site_env`; no personal data |
| Layout | desktop 1440 and mobile 375: no horizontal overflow; hero headline ≤ 4 lines; mobile nav wraps to 2 rows (all 5 links visible); 44 px tap targets on chips, steppers, recipe actions, small links |
| Metadata | `/en/productos/hummus-de-remolacha`: canonical, es/en/x-default alternates, og:title/url/image specific to the page |

Not covered:
- Real-device testing, screen-reader testing and Lighthouse scores.
- Codex couldn't open a browser from its sandbox, so its site review was a code and content audit.

Screenshots were taken during verification in the in-app browser. They're not committed.

## Codex review: what was done
1. `codex review --base origin/palapa-verde/shop` found one P2 (sitemap with an empty `SITE_URL`). **Fixed** with a shared `siteUrl()` and a test.
2. Codex site review (brand, UX, accuracy, a11y) returned 22 items. **21 fixed**:
   - Unverified storage, process and offer wording; illustration captions; draft note in shares.
   - Servings in the header; ⅛-step scaling; "aprox." household measures; exclusive time filter.
   - Mobile nav; tap targets; language switch keeps query; per-page canonical, hreflang and OG; shared site URL.
   - Draft policy documented; admin "Ficha completa"; heading levels; `lang="es"`; recipe titles in Archivo Black; FAQ "Todavía no"; "visualizaciones del envase".
   - **Not fixed (owner decision):** #1, the generated packshots carry "Una marca de Go Veggie Life" on the label.
     The brief forbids regenerating packaging without a separate packaging task, and the owner approved the look.
     The images are captioned and listed in `02-brand-relationship.md` and `APPROVAL_CHECKLIST.md` #6.

## Missing content and unresolved decisions
See `docs/APPROVAL_CHECKLIST.md` (16 items). The most important:
- the launch range (three different lists)
- brand ownership and sourcing
- the manufacturer and plant permit
- product facts, real photos and kitchen-tested recipes
- stockists and a public sales channel
- the production domain
- the analytics provider
- Vercel Pro
- the `catalog` project before any merge to `main`

## Specific areas for Codex to review next (once the preview is pushed)
1. In a real browser on the preview: home, a product, the recipe index, a recipe on mobile (375 px) and desktop. Check filters, scaling, print and WhatsApp.
2. Spanish naturalness for Dominican readers in recipe steps and FAQ answers. English fluency.
3. Whether the "Del vegetal al frasco" strip and the home copy still imply any unverified process.
4. The social plan (`06-social-first-month.md`) against the site routes and the real-vs-AI rules.
5. Accessibility with a screen reader: filters (`aria-pressed`), servings `output`, FAQ `details`.

## Follow-up 2026-11-06 (owner: "Co możesz zrobić samemu, rób samemu")
- **Codex edits integrated.** Codex (ChatGPT app) left uncommitted edits in this working tree: owner-confirmed `owned` relationship, SVG logo, safer recipe drafts.
  They were verified (typecheck, 76 tests, build, visual check of the logo) and committed as `b8cd41c`, attributed to Codex.
- **Lighthouse (mobile, local production build):** home performance 87–89, product 90–92; accessibility 100; best practices 100; CLS 0.
  On the Vercel preview, home performance is ~55 because preview deployments load the Vercel Toolbar (`vercel.live/feedback.js`). Production doesn't.
  SEO 69 only because of the intentional `noindex` (`is-crawlable`).
- **Small performance changes:**
  - Removed unused font weights (Playfair 700, Cormorant 600).
  - No `mix-blend-mode` on white backgrounds.
  - `fetchPriority="high"` on the LCP images. The simulated score didn't move (within noise), but this is the documented best practice.
- **`pnpm smoke <url>`:** a dependency-free deployed-site check (18 pages, 8 redirects, orders API off, banned-text scan, noindex).
- **Not done (needs the owner):** guarding the `catalog` Vercel project against `main` pushes was blocked by the session's permission policy (shared resource).
  Suggested setting: Vercel → catalog → Settings → Git → Ignored Build Step:
  `if [ -n "$VERCEL_GIT_COMMIT_REF" ]; then exit 0; fi; exit 1`
  This skips only Git-triggered builds. CLI deploys keep working.

## 2026-11-06: Palapa Verde block on the Go Veggie Life site (owner-approved)
- `nosotros.html` (About page) on branch `codex/goveggie-botanical-contact`, commit `238cef9` (fast-forward, one file):
  - variant B logo served from palapa-verde.vercel.app (ES/EN swap);
  - current range and honest status replace "Hierbas frescas del norte" and the soups / own-shop copy;
  - links go to https://palapa-verde.vercel.app.
- Published to web.goveggie.life as production deployment `dpl_GCPFtkP9DRcvB7KGaLJUnCBmqY1m`. The goveggie project's production branch is not the Codex branch, so it was redeployed to production manually, as before.
- Rollback: Vercel → goveggie → Deployments → "Promote" on `dpl_85u2HRr8zP5LsYRKFsw4rChukQkr`.
- goveggie Ignored Build Step (set by the owner): `git diff --quiet HEAD^ HEAD -- . ':(exclude)palapa-verde'`. Palapa-only pushes are skipped.

## 2026-11-06: hotels and restaurants zone on both sites (owner: "Tak, publikuj obie")
- **Go Veggie Life** (`codex/goveggie-botanical-contact` fast-forwarded to `bafd545`, from branch `goveggie/horeca`):
  - new `hoteles-restaurantes.html` (ES/EN): kitchen formats with status tags ("A consultar" / "En estudio"), how we work,
    Palapa Verde professional-line block, a hotel/restaurant variant of the mailto enquiry form (`assets/contact.js`);
  - desktop nav groups Supermercados and Hoteles y restaurantes under "Negocios ▾" (`assets/nav.js`); mobile shows both links;
  - three illustrative images generated with ChatGPT (`assets/horeca-*-v1.jpg`).
  - Production deployment `dpl_6fX1UfvVb3Qn7QRKLjqUXYPEpdzq` (manual redeploy). Rollback: Promote `dpl_GCPFtkP9DRcvB7KGaLJUnCBmqY1m`.
- **Palapa Verde** (`palapa-verde/shop` fast-forwarded to `544bb5a`, from branch `palapa-verde/horeca`):
  - `/hoteles-restaurantes` merges Codex's page (kitchen photo, à la carte vs buffet, per-product table, enquiry builder)
    with the proposed professional line (formats "Propuesto · por confirmar", ChatGPT image, label features, link to the GVL page);
  - trial sizes removed until confirmed; `tests/rules.test.ts` fails if sizes or prices appear; `/negocios` links to the page;
  - Codex review (`codex review --base` the previous shop): no findings. 80 tests, typecheck, build, `pnpm smoke` on production pass.
  - Production deployment `dpl_83rG4qMtHvmcXyPpxaaFm3TuMkfP` (manual redeploy; `SHOW_DRAFT_RECIPES=true` still applies). Rollback: Promote `dpl_A3ahJ93hT2rpWEj252EKyWaUA8Vt`.
- The two pages link to each other, so roll back both together. Formats, sizes and conditions stay owner decisions (`APPROVAL_CHECKLIST.md` item 17).
- **Follow-up fix (owner: "Tak, wdróż poprawkę"):** on 360 px phones the long "Go Veggie Life para hoteles y restaurantes" button widened
  `/hoteles-restaurantes` and `/negocios` to 448 px. Buttons now wrap below 600 px (commit `c5be8a2`). Production deployment
  `dpl_5e8XLG9753oNNWxxCyz1BxtHdaH5`; both pages measure 360 px at 360 px, `pnpm smoke` passes. Rollback for this fix only:
  Promote `dpl_83rG4qMtHvmcXyPpxaaFm3TuMkfP`.
- Known, older: the home page overflows by 7 px at 360 px because of the "Ver todos" section link (already in `dpl_A3ahJ93hT2rpWEj252EKyWaUA8Vt`).
