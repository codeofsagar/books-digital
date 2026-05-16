# Apex Books Frontend — Build SOP

> **Paste this into the Claude Code session running in the new `apex-books-frontend` repo.**
> Source of truth for the books frontend build. Updated 2026-05-12 to align with the locked Master SOP.
> Sister doc to `docs/digital-frontend-build-sop.md` — same shape, books-flavored.
>
> **Master SOP (Brian-locked, supersedes every prior plan):** `docs/APEX_PUBLISHING_HOUSE_MASTER_SOP.md` in the backend repo. Read it first. Every decision in this build SOP traces back to that document — when there's any conflict, Master SOP wins.

## Architecture context (read first)

- **Backend repo:** `apex-flow-labs` (Next.js, not this repo). Owns Supabase + Polly + Stripe + Printful + Findaway. Exposes `/api/v1/*`, `/api/books/*`, `/api/shop/image/*`.
- **This repo:** the books frontend. Pure SSR Next.js — NO direct DB access, NO Supabase client, NO Stripe SDK. Everything fetches from the backend.
- **Hosted at:** `books.apexflowlabs.com` (Vercel project, cookie domain `.apexflowlabs.com` so Apex-ecosystem auth carries across subdomains).
- **Image proxy:** every cover URL = `https://www.apexflowlabs.com/api/shop/image/<r2-key>`. Don't fetch R2 directly.
- **Audio proxy:** every audiobook/podcast URL = `https://www.apexflowlabs.com/api/books/stream/<slug>?type=sample|audiobook|podcast`. Don't fetch R2 directly.
- **Source SOPs (read in this order):**
  1. `docs/APEX_PUBLISHING_HOUSE_MASTER_SOP.md` — Brian-locked Master SOP (2026-05-12), supersedes all prior briefs
  2. `docs/APEX_PUBLISHING_HOUSE_COMPLETE_BUILD.md` — the original 2,069-line technical spec, still useful for §2 visual choreography + §7 SEO templates
  3. `docs/ecosystem-sop/APEX_ECOSYSTEM_BIBLE_V2_ADDENDUM.md` — architecture lock

## Tech stack (locked)

```
Framework:      Next.js 16 App Router + React 19 + TypeScript strict
Styling:        Tailwind CSS + shadcn/ui (only primitives you need)
Animation:      Framer Motion (primary) + GSAP (ScrollTrigger only)
3D:             @react-three/fiber + @react-three/drei (homepage hero ONLY)
Smooth scroll:  Lenis (root layout wrapper)
State:          React Query for backend data; no Redux
Auth:           shared apex_session cookie (read-only on frontend)
Email capture:  POST to backend /api/v1/lead-magnets/free-chapter
Payments:       Stripe Checkout via backend /api/v1/checkout/start
Files/Audio:    Cloudflare R2 via backend image/audio proxy
Hosting:        Vercel (single project, this repo)
Analytics:      GA4 + Meta Pixel + Microsoft Clarity (load only after cookie consent)
Search:         backend Pinecone via /api/v1/concierge/search (optional, Phase 3)
```

## Locked decisions you must respect

These come straight from Master SOP §1 — do NOT propose alternatives:

| Decision | Value |
|---|---|
| **Per-store Insider Pass** | Books Pass is **standalone $99/yr**. NOT bundled with the Digital Pass at $99. Each store owns its own pass. (Master §1.4) |
| **Founder Edition** | **$9,999** (NOT $14,999). Limited to 100/year. Sold via application form, NOT Stripe Checkout. (Master §1.4, §1.6) |
| **Pricing** | Ebook $6.99 · Paperback $14.99 · Hardcover $24.99 · Audiobook $19.95 · Series-bundle ebook $79 · Series-bundle audio $149 · 12-series ebook $499 · 12-series everything $1,499 (Master §1.5) |
| **KDP / IngramSpark** | Manual upload first 50 books. Brian/Sagar do this in Stripe-success-page flow; NO Playwright robot. (Master §1.7) |
| **Audiobook distribution** | Findaway Voices non-exclusive (25% royalty). Frontend just shows availability — backend handles dispatch. (Master §1.9) |
| **Covers** | Designer-produced PSDs (Photoshop 3D type + glyph). NOT code-rendered. Frontend renders the cover JPG/PDFs from the image proxy — does NOT generate covers in-browser. (Master §1.10, §4) |
| **Manuscript length** | 35-40k words, 90 chapters/book (one per day of the 90-day program). Reflected in the audiobook + sample-chapter UI. (Master §1.11) |
| **Voice** | R-rated savage funny war-manual. Master SOP §5 has the locked prompt — the frontend must respect this tone in copy you author (placeholders, fallbacks, empty states). (Master §1.2, §5) |

## ✅ Already shipped on backend (don't rebuild)

- Publishing DB schema (11 tables)
- Admin dashboard at `/admin/publishing/*`
- Polly Neural narration + audiobook + podcast pipelines
- Stripe checkout + webhook + fulfillment
- Printful merch (used for hardcover wraps + Founder Edition unboxing pieces)
- Public audio/download endpoints `/api/books/stream/<slug>` + `/api/books/download/<slug>`
- Image proxy `/api/shop/image/<r2-key>` with R2 fallback
- Insider Pass infrastructure (charter pricing, library entitlements, redeem endpoint)

## 🟡 Backend endpoints to BUILD (request from apex-flow-labs Claude session)

The backend Claude session needs to ship these before this frontend can hit them:

| Endpoint | Returns | Status |
|---|---|---|
| `GET /api/v1/books/catalog?series=&wave=&filter=&limit=` | Faceted book list (cover, title, slug, formats, price_cents per format, audio status, wave 1-4, primary_keyword) | TODO backend |
| `GET /api/v1/books/<slug>` | Book detail w/ sample chapter (chapter 1, 35-40k word book = ~400-word sample), audiobook URL, all schemas, review excerpts, Spiker-case-study flag | TODO backend |
| `GET /api/v1/series` | All 12 series w/ counts, glyphs, hex colors, wave, sample title pattern | TODO backend |
| `GET /api/v1/series/<slug>` | One series + 53 book list ordered by book number | TODO backend |
| `GET /api/v1/podcast/feed?limit=` | Episode list w/ duration (8-12 min episodes), audio URL, transcript URL, related book slug | TODO backend |
| `GET /api/v1/podcast/<slug>` | Single episode + related book + transcript + 9 directory subscribe links | TODO backend |
| `GET /api/v1/seo/book/<slug>` | JSON-LD bundle: `Book` + `Person`(Brian) + `Organization`(Apex Book Publishing) + `isBasedOn`(Spiker Carpet and Tile Care) + `Review` + `FAQPage` + `AudiobookFormat` + `BreadcrumbList` — per Master §6.4 schema density | TODO backend |
| `GET /api/v1/seo/series/<slug>` | JSON-LD for series pillar page | TODO backend |
| `GET /api/v1/seo/article/<template>/<slug>` | JSON-LD + content for cluster / best-books / 90-day-program / comparison / reading-guide pages | TODO backend (Phase 3) |
| `POST /api/v1/lead-magnets/free-chapter` | `{email, bookSlug}` → enqueues delivery email, marks UTM, drops Klaviyo subscriber | TODO backend |
| `GET /api/v1/spiker/reviews?limit=` | Spiker-customer reviews authorized for books-site display | TODO backend |
| `POST /api/v1/founder-edition/apply` | Application form submission for the $9,999 tier (not a Stripe Checkout — review queue for Brian) | TODO backend |

Tell the backend Claude: "Same shape as the existing `/api/v1/digital/*` family. CORS locked to `*.apexflowlabs.com`. Cache at edge: catalog 5 min SWR 1 hr, detail 1 hr SWR 24 hr, SEO 1 hr SWR 24 hr, lead-magnet + founder-edition-apply no-store."

## 🎯 Phase 1A — Repo scaffolding (Day 1)

1. `pnpm create next-app@latest apex-books-frontend --typescript --tailwind --app --turbopack`
2. Install: `framer-motion`, `gsap`, `@react-three/fiber`, `@react-three/drei`, `three`, `@tanstack/react-query`, `lenis`, `lucide-react`, `clsx`, `tailwind-merge`
3. Wire shadcn/ui: `npx shadcn@latest init` → only add `button`, `card`, `dialog`, `input`, `tabs`, `tooltip`, `accordion`, `skeleton`, `badge`
4. Add Vercel project, point to `books.apexflowlabs.com`
5. Set env vars on Vercel:
   ```
   NEXT_PUBLIC_BACKEND_URL=https://www.apexflowlabs.com
   NEXT_PUBLIC_SITE_URL=https://books.apexflowlabs.com
   APEX_API_BEARER=<shared bearer from backend>
   NEXT_PUBLIC_GA4_ID=...
   NEXT_PUBLIC_META_PIXEL=...
   NEXT_PUBLIC_CLARITY_ID=...
   ```
6. Set up `lib/api.ts` with one helper:
   ```ts
   export async function backend<T>(path: string, init?: RequestInit): Promise<T> {
     const r = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}${path}`, {
       next: { revalidate: 300 },                      // 5 min default
       headers: { 'Authorization': `Bearer ${process.env.APEX_API_BEARER}` },
       ...init,
     });
     if (!r.ok) throw new Error(`backend ${path} ${r.status}`);
     return r.json() as Promise<T>;
   }
   ```

## 🎯 Phase 1B — 16 page templates, v1 (Days 2-7)

Build in this order so dependencies flow naturally:

### Day 2-3 — Catalog spine
- `app/books/page.tsx` — fetch `GET /api/v1/books/catalog?limit=100`, render grid with Series + Wave + Format + Voice-intensity filters. Default sort by wave (1→4) then by book number.
- `app/books/[slug]/page.tsx` — fetch `/api/v1/books/<slug>`, render hero (cover + title + author + 4-format price selector w/ locked prices from Master §1.5 + Buy button), sample chapter (chapter 1 excerpt), audiobook 30-sec preview player, review tiles, Spiker case-study callout (when `book.spiker_case_study_flag === true`), "next in series" link, "previous in series" link. Multi-schema JSON-LD per Master §6.4.
- `app/series/page.tsx` — fetch `/api/v1/series`, render 12 columns grouped into the 4 Waves (Master §2.1). Each column shows glyph SVG, hex color background gradient, book count, sample title, wave badge.
- `app/series/[slug]/page.tsx` — fetch `/api/v1/series/<slug>`, render header (glyph + name + intensity ⚔ rating + wave) + 53 book grid.

### Day 4 — Podcast
- `app/podcast/page.tsx` — fetch `/api/v1/podcast/feed?limit=50`, render the 9-directory subscribe tiles (Apple/Spotify/Amazon/YouTube Music/iHeartRadio/Pandora/Stitcher/Pocket Casts/Overcast — Master §7.6) + featured episode inline player.
- `app/podcast/[slug]/page.tsx` — fetch `/api/v1/podcast/<slug>`, embed inline player w/ chapter splits + transcript toggle + speed control + "Read the full book" CTA linking the related book.

### Day 5 — Authority + commerce surfaces
- `app/about-brian/page.tsx` — author bio, photo, 16-years-of-Spiker context, Brian-at-job-site photo, link to Spiker Carpet and Tile Care.
- `app/brian-spiker-real-world-proof/page.tsx` — Master §9 Spiker authority transfer. `Person` schema + `isBasedOn` schema on every page, but this page is the deep authority landing. Embedded Spiker reviews (from `/api/v1/spiker/reviews`), job-site photo carousel, 16-year operational timeline, link to spikercarpetandtilecare.com w/ reciprocal footer-mention copy.
- `app/membership/page.tsx` — **Books Insider Pass** landing at $99/yr (standalone — DO NOT cross-reference Digital Pass at this tier per Master §1.4). Benefits: full audiobook library streaming, 20% off all hardcovers, monthly bonus episode, early access to new releases. Charter counter via `/api/v1/insider-pass/charter-status` if applicable to books too.
- `app/bundles/page.tsx` — series bundles at $79 ebook / $149 audio, 12-series complete at $499 ebook / $1,499 everything, Founder Edition entry CTA → `/founder-edition`.
- `app/founder-edition/page.tsx` — **$9,999** tier landing per Master §1.6. NOT a Stripe Checkout button — an "Apply for Founder Edition" form posting to `/api/v1/founder-edition/apply`. List the 5 deliverables: signed hardcover set (636 books) · lifetime Pass to every Apex store · 90-min private call with Brian · embossed signature plate in book #1 · numbered 1-100.

### Day 6 — Funnel + support
- `app/free-chapter/[bookSlug]/page.tsx` — email-gate landing per book; POST to `/api/v1/lead-magnets/free-chapter` w/ Klaviyo flow attribution.
- `app/about/page.tsx`, `app/contact/page.tsx`, `app/press/page.tsx` — standard content pages.
- `app/page.tsx` — homepage v1 (functional). Hero copy goes into the visual treatment in Phase 2 (Day 8+).
- `app/brian-spiker-real-world-proof/page.tsx` already covers the Spiker bridge — homepage just links to it.

### Day 7 — SEO + sitemap + JSON-LD layer
- `app/llms.txt/route.ts` — proxy `/api/v1/seo/llms-txt` (1 hr revalidate).
- `app/robots.txt/route.ts` — emit Master §6.6 robots.txt:
  ```
  User-agent: GPTBot
  Allow: /

  User-agent: ClaudeBot
  Allow: /

  User-agent: PerplexityBot
  Allow: /

  User-agent: Google-Extended
  Allow: /

  User-agent: Bingbot
  Allow: /

  Sitemap: https://books.apexflowlabs.com/sitemap.xml
  ```
- `app/sitemap.xml/route.ts` — sitemap index.
- `app/sitemap-books-[page].xml/route.ts` — paginated book sitemap.
- `app/sitemap-series.xml/route.ts` — series URLs.
- `app/sitemap-podcast.xml/route.ts` — episode URLs.
- `components/JsonLdSchema.tsx` — shared component that fetches `/api/v1/seo/book/<slug>` (book pages) or `/api/v1/seo/series/<slug>` (series pages) or `/api/v1/seo/page/<path>` (everything else) and renders EACH returned schema object as its own `<script type="application/ld+json">` (multi-tag per Master §6.4).

### Done = Phase 1 ship gate
- All 16 routes return 200 + render real backend data
- `/llms.txt` reachable and cached
- `/robots.txt` includes all 5 AI-crawler allow lines + sitemap pointer (Master §6.6)
- Sitemap covers every book + series + episode URL
- Lighthouse 90+ on `/`, `/books`, `/books/[slug]`, `/series`, `/brian-spiker-real-world-proof`
- Mobile (iPhone 14 viewport) renders without horizontal scroll on every page
- All buy buttons land on Stripe Checkout via `POST /api/v1/checkout/start`
- Founder Edition CTA submits to `/api/v1/founder-edition/apply` (NOT Stripe)
- Multi-schema renders per Master §6.4 on every book detail page (Book + Person + Organization + isBasedOn + Review + FAQPage + AudiobookFormat + BreadcrumbList)

## 🎯 Phase 2 — Awwwards polish layer (Days 8-14, optional v1.5)

Now layer the original SOP §2.2 + §2.3 + §2.10 over the working v1 storefront. Don't start this until Phase 1 ships.

### §2.2 — 4-second hero choreography on `/`
- Apex monogram fade + FLIP-animate to nav corner
- 60-80pt metallic typed-in hero ("636 BOOKS. 12 SERIES. ONE WAR MANUAL LIBRARY.")
- 12 book covers fly in from off-screen right, settle in floating arc, rotate w/ mouse magnetism (R3F + drei `OrbitControls` clamped — books-only, no character animation)
- Subhead + CTA stagger ("[START WITH BOOK ONE]" → `/books/the-discipline-blueprint` · "[BROWSE THE SERIES]" → `/series`)
- Reduced-motion fallback: static composition same hierarchy

### §2.3 — 12-series multiverse reveal on `/series`
- 12 vertical columns grouped by Wave (4 waves of 3 series each per Master §2.1), stagger reveal on scroll
- Each column: 3D floating series stack (5-7 covers angled, R3F), series-color metallic name, intensity indicator (⚔ × 9), wave badge, CTA
- Hover: focus column glows, others dim 30% + recede on z-axis
- Mobile: horizontal scroll w/ snap-to-column

### §2.10 — The 12 award-winning details
1. Custom cursor (text-aware, magnetic to interactive elements)
2. Page transitions (sliding metallic overlay between routes)
3. Audio reactivity on podcast pages (waveform tracks playing audio)
4. Parallax depth on `/books` catalog (cards layer at 3 z-planes)
5. Magnetic CTAs (mouse pull-toward, settle on click)
6. Series-color theming per route (CSS var swap on layout mount, hex from Master §2 table)
7. FLIP morphs between catalog tile → detail page hero
8. Cover spread animation on hover (book opens 15° in 3D)
9. Live counter on `/about-brian` ("Brian has shipped <N> books" — pulls live count from `/api/v1/books/catalog?limit=1` total)
10. Cursor trail (subtle particle wake on hero)
11. Floating sound-toggle (mute/unmute hero audio)
12. Confetti burst on Stripe success (metallic foil particles, GSAP)

**Effort:** 5-7 dev days. Cuttable for budget.

## 🎯 Phase 3 — SEO cluster bombs (Weeks 4-8 per Master §10)

Per Master §6.1 the locked page architecture is 3,846 pages. Build 9 page-template routes:

- `app/guides/[topic]/page.tsx` — pillar pages (12 total, one per series)
- `app/guides/[topic]/[subtopic]/page.tsx` — cluster pages (300 total, 25 per series)
- `app/articles/[slug]/page.tsx` — supporting articles (1,200 total, 4 per cluster)
- `app/best-books-for/[problem]/page.tsx` — 200 listicle pages
- `app/90-day-programs/[problem]/page.tsx` — 100 programmatic funnels
- `app/self-help-books/[niche]/page.tsx` — 200 niche audience pages
- `app/r-rated-self-help/[topic]/page.tsx` — 100 R-rated angle pages (the Master §6.1 / Master Moat #12 differentiator)
- `app/topics/[topic]/page.tsx` — 200 topic deep-dives
- `app/reading-guides/[guide]/page.tsx` — 100 reading guides
- `app/comparison/[matchup]/page.tsx` — 50 comparison pages (e.g., `/comparison/apex-vs-goggins`, `/comparison/apex-vs-manson`, `/comparison/apex-vs-tate`)

Each uses `generateStaticParams` to enumerate slugs from backend, fetches content + JSON-LD from `/api/v1/seo/article/<template>/<slug>`. Multi-schema injection per Master §6.4.

Content generation pipeline runs on the BACKEND (Claude API + Master §2.2 cluster-lock keyword lists). Cost target: $300-600 for all 3,846 articles, per Master §11.3.

## 🔧 Operating rules (don't break)

1. **No direct DB access on this repo.** Everything via backend `/api/v1/*`. If you need a piece of data not in any endpoint, request the backend Claude to add it.
2. **No fake reviews / no fake numbers.** Only show authorized Spiker customer reviews from `/api/v1/spiker/reviews`. Only show real book counts. Never seed placeholder testimonials.
3. **Mobile-first.** Every page must render cleanly on iPhone 14 viewport before desktop polish.
4. **Multi-schema density per Master §6.4.** Every public route renders all schemas the backend returns — don't strip any. The schema stack is the AI-search moat (Master §6.6 + Moat #11).
5. **No homepage CTAs without funnel routing.** Cold ads route to `/free-chapter/[bookSlug]` or `/best-books-for/[problem]`, never to `/`.
6. **Voice consistency.** Any copy YOU author (placeholders, fallbacks, empty states) must match Master §5 voice — R-rated, savage, funny, war-manual, Brian. NOT therapist-speak, NOT guru-positivity, NOT coddling. Example empty state: *"No books here yet. We ship 12 a week. Check back in 7 days or read [book name] in the meantime."* — NOT *"Oops! Nothing here yet."*
7. **Books Insider Pass is standalone** at $99/yr. DO NOT cross-bundle with Digital Pass. (Master §1.4.) Each store owns its own pass.
8. **Founder Edition is $9,999 and application-only.** Never a direct Stripe Checkout CTA. (Master §1.6.)
9. **Pricing locked per Master §1.5.** Never display anything off — pull from backend, never hardcode. If a backend response is missing a format price, show "Coming soon" not a fallback number.
10. **Audio + cover URLs always proxy through backend.** Never hardcode R2 URLs.
11. **All Stripe purchase buttons go through `POST /api/v1/checkout/start`.** Never `loadStripe()` directly here — backend mints session and redirects.
12. **Reduced-motion respect.** Every animation has a static fallback wrapped in `useReducedMotion()` check.
13. **No Brian time after launch.** Every page reading Brian-supplied content (photo, bio, reviews) reads it from backend. Brian changes in admin → site reflects within revalidation window.
14. **Spiker authority transfer is non-negotiable per Master §9.** Person schema on every page. isBasedOn schema on every book page. `/brian-spiker-real-world-proof` is a shipping requirement, not optional.

## 🔧 Cross-domain auth

The backend's `/api/apex/account/login/verify` sets `apex_session` cookie. For it to be readable on `books.apexflowlabs.com`, that route must set `domain: '.apexflowlabs.com'`. **One-line backend change** — request the backend Claude to apply it if not done.

```ts
// app/(some page)/page.tsx
import { cookies } from 'next/headers';
const session = cookies().get('apex_session')?.value;
const pass = session ? await backend(`/api/v1/membership/access?store=books`, {
  headers: { Cookie: `apex_session=${session}` }
}) : null;
```

Pass the `?store=books` query so the backend returns the correct per-store pass status (Master §1.4 — each store has its own pass).

Gate Books-Insider-Pass-only content (audiobook streaming, library page, 20%-off-hardcover prompt) on `pass?.has_access`.

## Phase order

| Day | What |
|---|---|
| 1 | Repo scaffolding + env + backend client + Vercel project |
| 2-3 | `/books` + `/books/[slug]` + `/series` + `/series/[slug]` |
| 4 | `/podcast` + `/podcast/[slug]` |
| 5 | `/about-brian` + `/brian-spiker-real-world-proof` + `/membership` + `/bundles` + `/founder-edition` |
| 6 | `/free-chapter/[slug]` + `/about` + `/contact` + `/press` + homepage v1 |
| 7 | llms.txt + robots.txt + sitemap segmentation + JsonLdSchema component everywhere |
| **GATE: Phase 1 ship** | All 16 routes serving real data, Lighthouse 90+, mobile clean, multi-schema validates. Ping Sagar to deploy → books.apexflowlabs.com |
| 8-14 | Awwwards polish (§2.2 hero, §2.3 multiverse, §2.10 12 details) — optional v1.5 |
| 15-21 | SEO cluster Phase 3 (page templates) — separate work block |
| 22-56 | SEO content generation (3,846 articles via Claude API) — backend-driven per Master §10 weeks 5-8 |

## Done = Phase 1 ship checklist

- [ ] All 16 routes return 200 from real backend data
- [ ] Cover images load via `/api/shop/image/` proxy
- [ ] Audiobook sample player works on `/books/[slug]` (30-sec preview from chapter 1)
- [ ] Podcast player works on `/podcast/[slug]` w/ chapter splits + transcript toggle
- [ ] Stripe Checkout fires from book buy buttons → returns to `/thanks?session=...`
- [ ] Founder Edition application form submits to `/api/v1/founder-edition/apply` and shows confirmation
- [ ] Lighthouse 90+ on homepage + catalog + book detail (mobile + desktop)
- [ ] `/llms.txt` reachable, cached 1 hr
- [ ] `/robots.txt` allows GPTBot + ClaudeBot + PerplexityBot + Google-Extended + Bingbot per Master §6.6
- [ ] `/sitemap.xml` lists every book + series + episode URL
- [ ] Multi-schema JSON-LD renders per Master §6.4 on every public page (validate via Google Rich Results Test)
- [ ] `Person` schema with `sameAs` linking spikercarpetandtilecare.com on every page (Master §9.1)
- [ ] `isBasedOn` schema referencing Spiker Carpet and Tile Care operations on every book detail (Master §9.2)
- [ ] Reduced-motion respected
- [ ] No console errors / no broken images / no broken audio
- [ ] Pricing values match Master §1.5 — never display off-spec

## Communication protocol

When stuck, post a one-liner to the apex-flow-labs Claude session (the backend Claude):
- "books frontend needs `GET /api/v1/books/catalog?wave=1` to also return `primary_keyword` so we can render the long-tail target tooltip"
- "books frontend wants the audiobook sample to be exactly 30 sec from chapter 1 — does backend pre-trim or should frontend `?start=00:00&end=00:30`?"
- "Founder Edition application form needs `apply_status` returned so we show 'in review' vs 'accepted'"

Backend Claude answers + ships. You stay in this repo. No cross-repo confusion.
