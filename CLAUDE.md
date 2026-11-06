# GoVeggie / Palapa Verde — project context

Prototype websites built by Adam for James, owner of **Go Veggie Life** (fresh-produce
distributor for supermarkets, Dominican Republic), plus the sister kitchen brand
**Palapa Verde**. Static HTML, no build step, no backend. Reply to Adam in Polish.

## Hard rules — never break these
- **NEVER touch the `goveggie.life` domain or its DNS.** The old live system runs on it.
  The prototype lives only on `*.vercel.app` aliases.
- **Vercel: deploy ONLY within the personal scope `donpollolococabarete-9718` (Hobby plan).**
  Never deploy GoVeggie work to the "Reno" team or any other scope.
- No place names (towns/regions) on the sites. The word "organic" is deliberately not used.
- Contact data, logo, photos and prices are **placeholders** until James delivers real
  materials — the footers say so. Forms are stubbed (no backend).

## Structure
- `index.html`, `productos.html`, `supermercados.html`, `nosotros.html`, `contacto.html`,
  `assets/site.css` — the GoVeggie site (Vercel project **goveggie**,
  prod: `goveggie-donpollolococabarete-9718.vercel.app`, also `goveggie-hazel.vercel.app`).
- `palapa-verde/` — the Palapa Verde website + shop: a **Next.js app** (since 2026-11-05, branch
  `palapa-verde/shop`). Read `palapa-verde/AGENTS.md` before touching it; it has its own rules
  (never invent prices/ingredients/allergens/shelf life; no real payments). The original one-pager is
  archived in `palapa-verde/legacy/`. Vercel project **palapa-verde** is Git-connected to this repo with
  Root Directory `palapa-verde`: pushes to other branches create previews. Since 2026-11-06 production runs
  the shop built from branch `palapa-verde/shop` (owner-approved); `main` still has the old one-pager, so do NOT
  push `palapa-verde/` changes to `main` or run `vercel --prod` for palapa-verde without the owner.
- `assets/*.jpg` — all imagery. Pages load images via jsDelivr:
  `https://cdn.jsdelivr.net/gh/TomTylenda1974Poland/goveggie-web@main/assets/<file>`
  **jsDelivr caches `@main` aggressively → any changed image MUST get a NEW filename**
  (that's why -v2/-v3 suffixes exist). Commit+push assets before deploying pages that use them.
- `design-src/mock.png` — the approved master mockup (810×1222), the always-clean source for
  crops: hero art (268,58,810,428) · hero photo (268,146,600,424) ·
  clean engraving branch (505,58,808,400) · stamp area (684,266,810,392).

## Deploying
Static deploys with no framework. From CLI: `vercel --prod` (GoVeggie from repo root with the
5 HTML files + assets/site.css), or via API with `projectSettings: {framework: null}`.
Palapa Verde is NOT deployed this way any more — it deploys through its Git connection (see above). **Each deployment is a complete snapshot** —
always include all 6 GoVeggie files, otherwise missing pages 404.

## Page conventions
- ES/EN: every page has its own inline `i18n` dict + `#langBtn` toggle;
  localStorage keys `gv-lang` (GoVeggie) / `pv-lang` (Palapa), wrapped in try/catch.
- Language-dependent images use `<img id="stampImg" data-es="…" data-en="…">` and a swap
  inside `applyLang()` (stamp.jpg ↔ stamp-en.jpg).
- Design system: white paper / black ink, 2px frames + 1px hairlines, `.panel` sections,
  Archivo Black (display) + Inter (body), meta grey `#6E6E68`, alt bg `#F5F5F2`.
  Palapa adds `--verde:#1F5B1F` and Cormorant Garamond italic (`.botanical`).
- Barceló (a tomato variety) was REMOVED from the sites at Adam's request (Nov 3) — do not re-add it anywhere.

## Next phase (planned, not started)
Shop + operations app for GoVeggie. Supabase is available as backend candidate.
