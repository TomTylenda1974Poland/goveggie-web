# Palapa Verde: agent guide (Claude Code and Codex)

Palapa Verde is the kitchen brand in the **Go Veggie Life** family: chutney, pesto, hummus and salsa.
This folder holds its website and shop. It's a Next.js 16 app in the shared repo
`TomTylenda1974Poland/goveggie-web`, next to the static GoVeggie site at the repo root.
Reply to the owner in Polish. The site is Spanish first (`/es`) and English second (`/en`).

Read these before working:
- `docs/PROGRESS.md`: what's done, what's next, open questions. **Update it at the end of every session.**
- `docs/DECISIONS.md`: why things are the way they are.
- `docs/INTEGRATION.md`: the goveggie.life API integration layer, still waiting for a spec.

## Hard rules
1. **Never invent prices, ingredients, allergens, net content, shelf life or storage instructions.**
   These fields stay `null` until the business provides them. The shop then shows "Por confirmar",
   and `/admin` lists them as missing. `tests/rules.test.ts` enforces this for the test data.
2. **Real payments are off.** Don't add a payment provider, keys or a checkout that charges money
   without the owner's explicit decision. Orders are test orders (`test: true`).
3. Don't add paid services without asking the owner. That includes the Vercel Pro upgrade,
   databases and email providers.
4. Inherited from the repo root `CLAUDE.md`: never touch the `goveggie.life` domain or its DNS.
   Deploy only in the Vercel scope `donpollolococabarete-9718`. No place names, and don't use the word "organic".
5. Never commit secrets. Configuration goes in Vercel environment variables (see `.env.example`).
6. Pages talk only to `CommerceProvider` (`src/lib/commerce/provider.ts`), never to an HTTP API directly.

## Commands (run inside `palapa-verde/`)
```
pnpm install
pnpm dev          # http://localhost:3000/es
pnpm test         # vitest: contract, rules, cart, i18n
pnpm typecheck
pnpm build
pnpm check        # all three; run before every push
```

## Map
- `src/lib/commerce/`: integration layer. `types.ts` (domain), `provider.ts` (interface),
  `mock/` (test data, the default), `goveggie/` (provisional adapter: `dto.ts` + `mappers.ts`
  are the only files to rewrite when the spec arrives), `completeness.ts` (missing-data audit),
  `validation.ts` (order input), `brand-content.ts` (photos and drawings kept in this repo).
- `src/lib/i18n.ts`: every UI string, ES and EN. Keys must match (a test checks this).
- `src/lib/cart/`: pure cart logic (`cart.ts`) and the browser store (`store.ts`, localStorage).
- `src/app/[locale]/`: home, `productos`, `productos/[slug]`, `carrito`, `admin`. `src/app/api/orders`: POST.
- `src/components/engravings.tsx`: original botanical line drawings (first drafted by Codex).
- `public/media/`: optimised images. The `ingrediente-*.jpg` files are Go Veggie Life ingredient
  photos, labelled on the site as ingredient photos, not product photos.
- `legacy/`: the five versions of the original one-page prototype recovered from Vercel (read-only archive).

## Deployments
Vercel project **palapa-verde** (Hobby, scope `donpollolococabarete-9718`) is connected to this repo
with Root Directory `palapa-verde`. Every push to a non-`main` branch builds a **preview**.
`main` is production. Merging into `main` replaces the live one-pager, so do it only when the owner approves.
See `docs/PROGRESS.md` for the current preview URL.

## Working with Codex
Delegate narrow, file-scoped tasks with an explicit "create or modify only these files" rule. Pass the
prompt on stdin and redirect stdin from a file (`codex exec -s workspace-write -C palapa-verde - < prompt.txt`),
otherwise it waits for input. Review with `codex review --base main` from the repo root.
Logs go to `.codex-logs/` (gitignored).

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
