# goveggie.life integration layer

Status (2026-11-05): **waiting for the API specification.** The site runs on test data
(`COMMERCE_PROVIDER=mock`, the default).

## Design

```
pages / cart / admin / POST /api/orders
            │   (only this interface)
            ▼
   CommerceProvider  ── src/lib/commerce/provider.ts
     ├── MockCommerceProvider     mock/        test data, default
     └── GoVeggieLifeProvider     goveggie/    HTTP adapter, PROVISIONAL shapes
             ├── client.ts    base URL, Bearer auth, timeout, error → CommerceError
             ├── dto.ts       ⚠ assumed response shapes, rewrite from the spec
             └── mappers.ts   ⚠ DTO → domain, strict runtime checks
```

- The provider is chosen by `COMMERCE_PROVIDER` (`mock` | `goveggie`) in `src/lib/commerce/index.ts`.
- `tests/contract.test.ts` runs the same behavioural contract against both implementations.
  `tests/fake-goveggie.ts` is a fake server shaped like `dto.ts`. When the spec arrives, update the
  fake server to the real shapes first, then fix `dto.ts` and `mappers.ts` until the contract passes.
- Brand content (drawings, interim photos) lives in `brand-content.ts` and is merged in by `slug`.
  Product photos from the API take priority.
- If the API returns a shape we don't recognise, the adapter fails with `UPSTREAM_ERROR` instead of
  showing wrong data. Without `GOVEGGIE_API_URL` it fails with `NOT_CONFIGURED`.

## What the shop needs from the API (questions for the spec)

| Need | Assumed today (provisional) | Question |
|---|---|---|
| Product list for the Palapa Verde brand | `GET /v1/brands/palapa-verde/products` → `{ data: [...] }` | How are brands or catalogues separated? Is there pagination? |
| One product | `GET /v1/brands/palapa-verde/products/{slug}`, 404 if missing | Does the API use slugs or only ids/SKUs? |
| Price | `price_minor` integer (centavos) + `currency: "DOP"` | Is ITBIS included? Are there price lists per channel (retail vs B2B)? |
| Product sheet | `net_content`, `ingredients`, `allergens`, `shelf_life`, `storage` as `{es, en}` | Which system owns these fields: the API or this repo? |
| Stock | `GET /v1/inventory?brand=…&product_ids=a,b` → `available` units | Real-time or batch? Reserved stock? Per warehouse? |
| Orders | `POST /v1/orders` with `Idempotency-Key`; 409 = out of stock | Order statuses, delivery data, who confirms the total, webhooks back to the site? |
| Auth | `Authorization: Bearer <GOVEGGIE_API_KEY>` (server-side only) | Key type, rotation, test vs production environments? |
| Errors | 400/422 invalid, 409 stock, 5xx upstream | Error body format? |

## Switching to the real API

1. Put the spec in `docs/` and update `tests/fake-goveggie.ts` to match it.
2. Rewrite `goveggie/dto.ts` and `goveggie/mappers.ts`, and adjust the paths in `goveggie-provider.ts`.
3. `pnpm test` must pass, including the contract for both providers.
4. In Vercel (Preview environment first) set `COMMERCE_PROVIDER=goveggie`, `GOVEGGIE_API_URL` and `GOVEGGIE_API_KEY`.
5. Check `/es/admin`: the source should read "API de goveggie.life", and the missing fields should drop.
