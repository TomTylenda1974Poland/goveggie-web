# 02: Brand relationship recommendation

## Recommendation

Palapa Verde stays the **dominant consumer brand**. Go Veggie Life appears as a smaller endorsement or as an explanation, never as a co-equal logo.

Ownership, ingredient sourcing, distribution and manufacturing are **four separate facts**. Each needs its own confirmation:

| Fact | Public wording if confirmed | Status | Evidence needed |
|---|---|---|---|
| Brand ownership | ES "Una marca de Go Veggie Life" · EN "A brand of Go Veggie Life" | Unconfirmed | Owner statement + ONAPI filing/certificate for Palapa Verde, or written confirmation of who owns the mark |
| Ingredient sourcing | ES "Elaborado con vegetales de Go Veggie Life" · EN "Made with Go Veggie Life vegetables" | Unconfirmed | Written confirmation of which ingredients per product come from Go Veggie Life. Don't say "all" unless it's true. |
| Distribution | ES "Distribuido por Go Veggie Life" · EN "Distributed by Go Veggie Life" | Unconfirmed | Confirmed distribution arrangement |
| Manufacturing | Label: name + address of the actual manufacturer (e.g. URBANCACAO, S.R.L. **only if** it manufactures, or the contract plant) | Unconfirmed | Plant sanitary permit and manufacturing contract (DIGEMAPS dossier slots 04–05) |

**Until confirmed, the site uses neutral wording** that reflects only what the owner has stated:
"Palapa Verde es una marca de alimentos preparados vinculada a Go Veggie Life" / "Palapa Verde is a prepared-food brand associated with Go Veggie Life".

The wording is switched in one place: `src/content/brand.ts` → `BRAND_RELATIONSHIP` (`"unconfirmed" | "owned" | "supplied"`).
`owned` shows the endorsement line under the logo and in the story. `supplied` shows the sourcing line instead.
Manufacturer information lives in a separate field (`MANUFACTURER`) and is not shown while it's `null`.

## Where the two sites link
- Palapa Verde: the "Nosotros" relationship section, the home relationship block, the footer, and the business page (for fresh produce).
- Go Veggie Life (separate task, root site): its footer already links to Palapa Verde. Recommended: a short "Palapa Verde" block on "Nosotros" or "Para supermercados" that uses the same confirmed wording.

## Packaging label hierarchy (recommendation for the packaging task, not applied)
1. Botanical engraving of the key vegetable (top of the arched label)
2. **PALAPA VERDE** wordmark, the largest brand element
3. Endorsement line, smaller and directly under the wordmark: only the confirmed wording above.
   About 35–45% of the wordmark's cap height, never below the legal minimum legible size at print scale.
   Use the official Go Veggie Life wordmark only if that is the approved lockup; otherwise set the text in the label serif.
4. Rule
5. Product name, as two lines: "HUMMUS / de ZANAHORIA"
6. Short descriptor (approved only)
7. Bottom band: net content · storage instruction (approved only)
8. Back label: ingredients, allergens ("Contiene: …"), manufacturer name and address, lot/date, sanitary registration once issued, under NORDOM 53 review

## Existing images to update once the relationship is confirmed

| File | Current label text | Action if relationship ≠ "owned" |
|---|---|---|
| `public/media/hero-linea.jpg` | "Una marca de Go Veggie Life" on 5 labels | Regenerate in a packaging task |
| `public/media/productos/*.jpg` (5 files) | same | same |
| `design-src/referencia-envases.jpg` (local only) | "Una marca de Go Veggie Life" + weights + "Mantener refrigerado" + other products | Owner concept; not website material |

These images are labelled "Imagen ilustrativa" on the site. They must be replaced with real product photography before launch.
