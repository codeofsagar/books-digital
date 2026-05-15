# Apex Books Frontend

Pure SSR Next.js 16 storefront for **books.apexflowlabs.com**. Hosts the public library, catalog, podcast, membership, bundles, Founder Edition, and the authority-transfer surface. **No direct DB access** — everything routes through the `apex-flow-labs` backend at `https://www.apexflowlabs.com/api/v1/*` (plus `/api/shop/image/*` for cover proxy and `/api/books/stream/*` for audio).

Built against the locked Master SOP. Voice, pricing, and architectural rules are all enforced — see `guideline.md` for the spec this repo implements.

## Stack

- **Framework** — Next.js 16 (App Router) + React 19 + TypeScript strict + Turbopack
- **Styling** — Tailwind CSS (custom token layer in `tailwind.config.ts`)
- **State** — React Query (`@tanstack/react-query`) for client-side fetches; SSR `fetch` with ISR for everything else
- **Animation** — Framer Motion + GSAP slot (Phase 2)
- **Auth** — `apex_session` cookie on `.apexflowlabs.com` (read-only here)
- **Payments** — All buy buttons POST to `/api/v1/checkout/start` on the backend, which mints a Stripe Checkout session and returns a redirect URL. **No `loadStripe()` in this repo.**

## Getting started

```bash
pnpm install
cp .env.example .env.local        # fill in NEXT_PUBLIC_BACKEND_URL + APEX_API_BEARER
pnpm dev                          # http://localhost:3000
```

To build for production:

```bash
pnpm build
pnpm start
```

Vercel project should point at `books.apexflowlabs.com` and run `pnpm build`.

## Required env

| Var | Purpose |
|---|---|
| `NEXT_PUBLIC_BACKEND_URL` | Apex backend base (default `https://www.apexflowlabs.com`) |
| `NEXT_PUBLIC_SITE_URL` | This site's canonical URL (`https://books.apexflowlabs.com`) |
| `APEX_API_BEARER` | Shared server-only bearer for `/api/v1/*` |
| `NEXT_PUBLIC_GA4_ID` / `NEXT_PUBLIC_META_PIXEL` / `NEXT_PUBLIC_CLARITY_ID` | Analytics (load only after cookie consent) |

## Routes (Phase 1 — 16 pages)

| Path | Purpose | Backend |
|---|---|---|
| `/` | Homepage v1 — featured catalog, series grid, authority block | `/api/v1/books/catalog`, `/api/v1/series`, `/api/v1/spiker/reviews` |
| `/books` | Full catalog with series / wave / format / voice-intensity filters | `/api/v1/books/catalog?limit=200` |
| `/books/[slug]` | Book detail — hero, audio preview, sample chapter, reviews, FAQ, multi-schema JSON-LD | `/api/v1/books/<slug>`, `/api/v1/seo/book/<slug>` |
| `/series` | 12 series grouped into 4 waves | `/api/v1/series` |
| `/series/[slug]` | Series detail — header + book grid | `/api/v1/series/<slug>`, `/api/v1/seo/series/<slug>` |
| `/podcast` | Episode feed + 9-directory subscribe rail + featured player | `/api/v1/podcast/feed` |
| `/podcast/[slug]` | Single episode + transcript + chapters + related book | `/api/v1/podcast/<slug>` |
| `/about-brian` | Founder bio + live shipped-book counter | `/api/v1/books/catalog?limit=1` for `.total` |
| `/brian-spiker-real-world-proof` | Authority-transfer page — timeline + Spiker reviews | `/api/v1/spiker/reviews` |
| `/membership` | Books Insider Pass at $99/yr (standalone) | `/api/v1/checkout/start` |
| `/bundles` | Series + 12-series bundles | `/api/v1/checkout/start` |
| `/founder-edition` | $9,999 application form | `/api/v1/founder-edition/apply` |
| `/free-chapter/[bookSlug]` | Email-gated lead magnet | `/api/v1/lead-magnets/free-chapter` |
| `/about`, `/contact`, `/press`, `/thanks` | Standard content + post-checkout |
| `/robots.txt`, `/llms.txt`, `/sitemap*.xml` | SEO surface (Master §6.6) |

## Locked decisions

These come straight from Master SOP §1 — **do not change them without checking with Brian/Sagar**:

- **Books Insider Pass — $99/yr, standalone**, NOT bundled with the Digital Pass. Per-store.
- **Founder Edition — $9,999** (not $14,999). 100/year. **Application form, not Stripe Checkout.**
- **Pricing** — eBook $6.99 · Paperback $14.99 · Hardcover $24.99 · Audiobook $19.95 · Series ebook bundle $79 · Series audio bundle $149 · 12-series ebook $499 · 12-series everything $1,499.
- **Covers** — designer-produced PSDs, rendered via `/api/shop/image/<r2-key>`. Never code-generated.
- **Audio** — Polly Neural, supervised. Distributed via Findaway Voices non-exclusive.
- **Voice** — Master §5 — R-rated, savage, war-manual. See `lib/voice.ts` for the author-side voice library.

## Operating rules (encoded in code, do not loosen)

1. No direct DB. Everything via backend `/api/v1/*`.
2. No fake reviews. Only `/api/v1/spiker/reviews` shows on the books site.
3. Mobile-first. Every page renders cleanly at iPhone 14 viewport.
4. Multi-schema JSON-LD per Master §6.4 — `<components/JsonLdSchema.tsx>` renders every schema object as its own `<script>` tag. **Never combine into one blob.**
5. Cold ads route to `/free-chapter/[bookSlug]`, never to `/`.
6. Voice consistency in author-side copy — see `lib/voice.ts`.
7. Books Pass is standalone — never cross-bundle with Digital Pass.
8. Founder Edition is application-only — never a Stripe Checkout button.
9. Pricing pulled from backend; fallback display is `"Coming soon"`, never a guessed number.
10. Cover + audio URLs always proxy through backend — never hardcode R2.
11. Buy buttons POST to `/api/v1/checkout/start` and follow redirect — no `loadStripe()`.
12. Reduced-motion respected globally — see `app/globals.css`.

## Schema-density (Master §6.4)

Every public route renders multi-schema JSON-LD via `<JsonLdSchema bundle={…} fallback={…} />`:

- Backend `/api/v1/seo/book/<slug>` (or `/seo/series/<slug>` / `/seo/page/<path>`) returns an **array** of schema objects.
- Each object renders as its own `<script type="application/ld+json">` — never merged.
- `lib/seo.ts` ships local fallbacks (`Book`, `Person`, `Organization`, `isBasedOn` Spiker, `Review`, `FAQPage`, `Audiobook`, `BreadcrumbList`) so pages still ship structured data even if the backend SEO endpoint is briefly cold.
- `Person` schema points `sameAs` at `https://spikercarpetandtilecare.com` on every page (Master §9.1).
- `isBasedOn` schema references Spiker Carpet and Tile Care operations on every book detail (Master §9.2).

## Phase roadmap

| Phase | What |
|---|---|
| 1A | Repo scaffolding ✅ |
| 1B | 16 page templates ✅ |
| 1 ship gate | All 16 routes return 200, Lighthouse 90+, mobile clean, multi-schema validates |
| 2 | Awwwards polish (§2.2 hero, §2.3 multiverse, §2.10 12 details) |
| 3 | SEO cluster bombs — 9 page-template routes, 3,846 articles (Master §6.1) |

See `guideline.md` for the full SOP.

## Backend dependencies

Phase 1 ship needs these backend endpoints up (currently in TODO state — coordinate with the `apex-flow-labs` Claude session):

- `GET /api/v1/books/catalog`
- `GET /api/v1/books/<slug>`
- `GET /api/v1/series`, `GET /api/v1/series/<slug>`
- `GET /api/v1/podcast/feed`, `GET /api/v1/podcast/<slug>`
- `GET /api/v1/seo/book/<slug>`, `/seo/series/<slug>`, `/seo/page/<path>`, `/seo/llms-txt`
- `POST /api/v1/lead-magnets/free-chapter`
- `GET /api/v1/spiker/reviews`
- `POST /api/v1/founder-edition/apply`
- `POST /api/v1/checkout/start`
- `GET /api/v1/membership/access?store=books` (for Books-Pass gating)
