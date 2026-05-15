import { env } from '@/lib/env';

export const revalidate = 86400;

// Master SOP §6.6 — explicit allow for major AI crawlers + Bing + sitemap pointer.
// AI search is treated as a first-class index, not an afterthought.
export function GET() {
  const siteUrl = env.siteUrl.replace(/\/$/, '');
  const body = `User-agent: GPTBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: Bingbot
Allow: /

User-agent: *
Allow: /
Disallow: /thanks
Disallow: /api/

Sitemap: ${siteUrl}/sitemap.xml
`;

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
    },
  });
}
