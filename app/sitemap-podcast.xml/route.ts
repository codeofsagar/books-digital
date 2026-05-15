import { env } from '@/lib/env';
import { getPodcastFeed } from '@/lib/api';
import { urlsetXml } from '@/lib/xml';

export const revalidate = 3600;

export async function GET() {
  const siteUrl = env.siteUrl.replace(/\/$/, '');
  const feed = await getPodcastFeed(500);
  const list = feed?.episodes ?? [];
  const today = new Date().toISOString().slice(0, 10);

  const entries: Array<{ loc: string; lastmod: string; changefreq: string; priority: number }> = [
    { loc: `${siteUrl}/podcast`, lastmod: today, changefreq: 'daily', priority: 0.8 },
    ...list.map((ep) => ({
      loc: `${siteUrl}/podcast/${ep.slug}`,
      lastmod: ep.published_at?.slice(0, 10) ?? today,
      changefreq: 'monthly',
      priority: 0.6,
    })),
  ];

  return new Response(urlsetXml(entries), {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
