# 03: Website structure and customer journeys

## Sitemap (same paths for `/es` and `/en`)

| Route | Purpose | Status |
|---|---|---|
| `/{locale}` | What Palapa Verde makes, products, quick recipes, the Go Veggie Life relationship, people (honest placeholder), where to buy and business routes | Done |
| `/{locale}/productos` | Catalogue with category filter (chutney · pesto · hummus · salsa) and launch status | Done |
| `/{locale}/productos/{slug}` | Product + three serving ideas + recipes + approved facts only + where to buy. **QR destination.** | Done |
| `/{locale}/recetas` | Recipe index: filter by product, time (≤15 / ≤30 / >30 min) and occasion | Done (10 drafts) |
| `/{locale}/recetas/{slug}` | Recipe: servings scaling, print, WhatsApp share (recipe or shopping list), product link, where to buy | Done |
| `/{locale}/donde-comprar` | Confirmed stockists only (with map links); otherwise an honest prelaunch state plus the business route | Done, prelaunch |
| `/{locale}/nosotros` | Relationship (confirmed wording only), the process explained without invented facts, team placeholder; manufacturer block hidden until confirmed | Done |
| `/{locale}/preguntas` | FAQ: use, taste and heat, ingredients and allergens, storage, buying, wholesale | Done |
| `/{locale}/negocios` | Supermarkets, HORECA, distributors; formats, MOQ, delivery and lead time marked "por confirmar"; contact appears only when a real channel exists | Done |
| `/{locale}/admin` | Internal: missing data, approval checklist, QR ids, test stock | Done (noindex) |
| `/p/{qrId}` | Packaging QR, 307 to the product page with UTM | Done |
| `/{locale}/carrito` | Retired, 307 to `/donde-comprar` | Done |

Navigation: Productos · Recetas · Dónde comprar · Nosotros · Negocios · ES/EN. Footer: Recetas, Preguntas frecuentes, Negocios, Go Veggie Life.

## Journeys

1. **Social video → recipe → product → where to buy**
   - Video link: `/es/recetas/{slug}?utm_source=instagram&utm_medium=social&utm_campaign=…`.
   - The recipe page shows "Producto Palapa Verde: {name}" (a link to the product) and a "Dónde comprar el producto" button.
   - The product page has "Ver recetas" (pre-filtered) and "Dónde comprar".
2. **Packaging QR → exact product → serving ideas → buy again**
   - `/p/hummus-zanahoria` redirects to `/es/productos/hummus-de-zanahoria?utm_source=qr…`, which shows the welcome note.
   - Then the three ideas, the recipes for that product, the approved storage and allergen info (when it exists), and "Dónde comprar".
3. **Product discovery**: home or catalogue → filter → product → idea or recipe.
4. **Business customer**: home "Para negocios" tile and duo block, where-to-buy request block, FAQ → `/negocios`. Fresh produce goes to Go Veggie Life.
5. **Return visits**: new recipes, several uses per product, seasonal ideas, new-stockist updates. No accounts, newsletter or loyalty system until there's a consented channel.

## Honest states while nothing is on sale
- A slim banner on every page: "Palapa Verde está en desarrollo: los productos aún no están a la venta."
- Products show "En desarrollo · aún no a la venta". Prices appear only when `launch === "available"`.
- There's no cart and no order form. `/api/orders` returns 503 unless `ORDERS_ENABLED=true`.
- Facts appear only once approved. Otherwise: "se publicarán aquí, igual que en la etiqueta, antes de ponerlo a la venta".
- Recipes show "Borrador · pendiente de prueba en cocina" and are hidden in production unless `SHOW_DRAFT_RECIPES=true`.
