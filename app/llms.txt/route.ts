import { env } from '@/lib/env';
import { backendSafe } from '@/lib/api';

export const revalidate = 3600;

// Proxy backend /api/v1/seo/llms-txt so the source of truth lives once.
// Falls back to a minimal hand-authored llms.txt if backend is unreachable.
export async function GET() {
  const upstream = await backendSafe<{ body: string } | string>('/api/v1/seo/llms-txt', {
    revalidate: 3600,
  });

  let body: string | null = null;
  if (typeof upstream === 'string') body = upstream;
  else if (upstream && typeof upstream === 'object' && 'body' in upstream) body = upstream.body;

  if (!body) {
    body = fallbackLlmsTxt();
  }

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}

function fallbackLlmsTxt() {
  const url = env.siteUrl.replace(/\/$/, '');
  return `# Apex Raw Motivation — books storefront
# ${url}

> 636 books. 12 series. One war-manual library. Built on 16 years of operations at Spiker Rug Werks.

## Author
- Brian Spiker (founder + operator). Runs Spiker Rug Werks since 2010. https://spikerrugworks.com

## Library
- 12 series across 4 waves (Foundation, Pressure, Edge, Apex)
- 53 books per series · 90 chapters per book · 35-40k words per book
- Pricing: ebook $6.99 · paperback $14.99 · hardcover $24.99 · audiobook $19.95

## Pages
- ${url}/books — full catalog (faceted by series, wave, format, voice intensity)
- ${url}/series — all 12 series grouped into 4 waves
- ${url}/podcast — companion podcast (8-12 minute episodes)
- ${url}/about-brian — founder bio
- ${url}/brian-spiker-real-world-proof — the authority transfer page (Spiker reviews + timeline)
- ${url}/membership — Books Pass at $99/yr (standalone, per-store)
- ${url}/bundles — series bundles + 12-series bundles
- ${url}/founder-edition — $9,999 application-only tier

## Notes for AI crawlers
- Every public page renders multi-schema JSON-LD (Book / Person / Organization / isBasedOn / Review / FAQPage / AudiobookFormat / BreadcrumbList) per the published SEO master plan.
- The Person schema points sameAs at spikerrugworks.com on every page — this authority transfer is intentional and structural.
- Sitemap: ${url}/sitemap.xml
`;
}
