# 08: Packaging QR and analytics specification

## QR URL scheme

Printed URL (permanent): `https://{PRODUCTION_DOMAIN}/p/{qrId}`

| Product | qrId | Current destination (307, may change) |
|---|---|---|
| Chutney de Cilantro | `chutney-cilantro` | `/es/productos/chutney-de-cilantro?utm_source=qr&utm_medium=packaging&utm_campaign=chutney-cilantro` |
| Pesto de Cilantro con Semillas de Auyama | `pesto-cilantro-auyama` | `/es/productos/pesto-de-cilantro-con-semillas-de-auyama?…&utm_campaign=pesto-cilantro-auyama` |
| Hummus de Zanahoria | `hummus-zanahoria` | `/es/productos/hummus-de-zanahoria?…&utm_campaign=hummus-zanahoria` |
| Hummus de Remolacha | `hummus-remolacha` | `/es/productos/hummus-de-remolacha?…&utm_campaign=hummus-remolacha` |
| Salsa de Aguacate y Jalapeño | `salsa-aguacate-jalapeno` | `/es/productos/salsa-de-aguacate-y-jalapeno?…&utm_campaign=salsa-aguacate-jalapeno` |

Rules:
- `qrId` lives in `src/lib/commerce/brand-content.ts`. **Never change or reuse a qrId once printed.** If a product is renamed, keep its qrId and only change the destination slug.
- The redirect is **temporary (307)** on purpose, so the destination can move without browsers caching an old target. The printed path itself never changes.
- An unknown `/p/{anything}` goes to the catalogue (with `utm_campaign=unknown`). A printed code never ends on a 404.
- A product is discontinued: keep the qrId and point it to a "producto descontinuado" page or the nearest product (to build when needed).
- Codes for a new formulation or pack size: keep the same qrId if it's the same product page; create a new qrId only for a genuinely new product.
- The landing page shows the exact product, a welcome note, three serving ideas, recipes, approved storage and allergen info, and where to buy.
- **Print only with the approved production domain.** The current `*.vercel.app` URLs must not be printed.
  Test each code with two phones before going to press. Use error correction level M or higher and a quiet zone of at least 4 modules.

## Analytics

Existing setup: none. The site has a provider-neutral event layer (`src/lib/analytics.ts`).
Events go to `window.dataLayer` only if a tag manager or analytics tool has been installed. Without one, nothing is sent.
Choosing and installing a provider is an owner decision, and it may need a cookie and privacy notice.

| Event | When | Properties (no personal data) |
|---|---|---|
| `recipe_view` | Recipe page loaded | `recipe`, `product` |
| `product_recipe_click` | "Ver recetas" on a product page | `product` |
| `recipe_product_click` | Product card on a recipe page | `recipe`, `product` |
| `where_to_buy_click` | Any "Dónde comprar" call to action | `from` (home/product/recipe), `product`/`recipe` |
| `retailer_outbound_click` | Map link of a confirmed stockist | `stockist` |
| `whatsapp_share_click` | User taps share | `recipe`, `kind` (recipe/list) |
| `recipe_print_click` | Print button | `recipe` |
| `servings_change` | Servings +/- | `recipe`, `direction` |
| `wholesale_contact_click` | Business call to action or contact link | `from` or `channel` |
| `qr_visit` | Landing with `utm_source=qr` | `path`, UTM fields |
| `campaign_visit` | Landing with any other `utm_source` | `path`, UTM fields |

Every event carries `site_env` (`production` / `preview` / `development`, from `NEXT_PUBLIC_VERCEL_ENV`). That keeps preview traffic separable.
The best practice is to install the provider only on the production deployment.

Add tracking to a link: `data-track="where_to_buy_click" data-track-from="home"`. A listener in the layout picks it up.

Not tracked: names, phones, emails or free text. URLs carry only UTM parameters (`readUtm` accepts only `[\w.-]{1,64}`).

## UTM convention

| Parameter | Values |
|---|---|
| `utm_source` | `instagram`, `facebook`, `tiktok`, `whatsapp`, `qr` |
| `utm_medium` | `social` (posts and videos), `packaging` (QR), `share` (manual shares by the team) |
| `utm_campaign` | `YYYY-MM_{theme}` for social (e.g. `2026-12_recetas`); the qrId for packaging |
| `utm_content` | Brief or post id (e.g. `v03`, `pin1`) |

Example: `https://{DOMAIN}/es/recetas/tostones-con-salsa-de-aguacate-y-jalapeno?utm_source=instagram&utm_medium=social&utm_campaign=2026-12_recetas&utm_content=v07`
