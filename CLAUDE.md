# GoVeggie / Palapa Verde - project context

Prototype websites built by Adam for James, owner of **Go Veggie Life** (fresh-produce
distributor for supermarkets, Dominican Republic), plus the sister kitchen brand
**Palapa Verde**. Static HTML, no build step, no backend. Reply to Adam in Polish.

## Hard rules - never break these
- **NEVER touch the `goveggie.life` domain or its DNS.** The old live system runs on it.
  The prototype lives only on `*.vercel.app` aliases.
- **Vercel: deploy ONLY within the personal scope `donpollolococabarete-9718` (Hobby plan).**
  Never deploy GoVeggie work to the "Reno" team or any other scope.
- No place names (towns/regions) on the sites. The word "organic" is deliberately not used.
- Contact data, logo, photos and prices are **placeholders** until James delivers real
  materials - the footers say so. Forms are stubbed (no backend).

## Structure
- `index.html`, `productos.html`, `supermercados.html`, `nosotros.html`, `contacto.html`,
  `assets/site.css` - the GoVeggie site (Vercel project **goveggie**,
  prod: `goveggie-donpollolococabarete-9718.vercel.app`, also `goveggie-hazel.vercel.app`).
- `palapa-verde/index.html` - the entire Palapa Verde one-pager (separate Vercel project
  **palapa-verde**, prod: `palapa-verde-donpollolococabarete-9718.vercel.app`).
  Deploy it as `index.html` at the ROOT of that project, not in a subfolder.
- `assets/*.jpg` - all imagery. Pages load images via jsDelivr:
  `https://cdn.jsdelivr.net/gh/TomTylenda1974Poland/goveggie-web@main/assets/<file>`
  **jsDelivr caches `@main` aggressively → any changed image MUST get a NEW filename**
  (that's why -v2/-v3 suffixes exist). Commit+push assets before deploying pages that use them.
- `design-src/mock.png` - the approved master mockup (810×1222), the always-clean source for
  crops: hero art (268,58,810,428) · hero photo (268,146,600,424) ·
  clean engraving branch (505,58,808,400) · stamp area (684,266,810,392).

## Deploying
Static deploys with no framework. From CLI: `vercel --prod` (GoVeggie from repo root with the
5 HTML files + assets/site.css; Palapa from a folder containing only its index.html), or via
API with `projectSettings: {framework: null}`. **Each deployment is a complete snapshot** -
always include all 6 GoVeggie files, otherwise missing pages 404.

## Page conventions
- ES/EN: every page has its own inline `i18n` dict + `#langBtn` toggle;
  localStorage keys `gv-lang` (GoVeggie) / `pv-lang` (Palapa), wrapped in try/catch.
- Language-dependent images use `<img id="stampImg" data-es="…" data-en="…">` and a swap
  inside `applyLang()` (stamp.jpg ↔ stamp-en.jpg).
- Design system: white paper / black ink, 2px frames + 1px hairlines, `.panel` sections,
  Archivo Black (display) + Inter (body), meta grey `#6E6E68`, alt bg `#F5F5F2`.
  Palapa adds `--verde:#1F5B1F` and Cormorant Garamond italic (`.botanical`).
- Barceló (a tomato variety) was REMOVED from the sites at Adam's request (Nov 3) - do not re-add it anywhere.

## Next phase (planned, not started)
Shop + operations app for GoVeggie. Supabase is available as backend candidate.

## Current owner visual rules - 2026-11-05
- Website copy in every language must use only the short ASCII hyphen (-), never en/em dashes. Check inline i18n dictionaries, titles, alt text and form subjects too.
- Approved supply-page hero: assets/supermercados-supply-v3.webp; process art: assets/finca-proceso-v3.webp, labels rendered as translatable HTML, original logo retained.
- Other new page artworks remain design proposals until chosen. Keep existing card proportions and white logo corrections.
- Current verified preview domain is web.goveggie.life, project goveggie. Do not modify the main goveggie.life domain, DNS or catalog project.
