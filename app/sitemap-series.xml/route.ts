import { env } from '@/lib/env';
import { getSeriesList } from '@/lib/api';
import { urlsetXml } from '@/lib/xml';

export const revalidate = 3600;

export async function GET() {
  const siteUrl = env.siteUrl.replace(/\/$/, '');
  const data = await getSeriesList();
  const list = data?.series ?? [];
  const today = new Date().toISOString().slice(0, 10);

  const entries: Array<{ loc: string; lastmod: string; changefreq: string; priority: number }> = [
    { loc: `${siteUrl}/series`, lastmod: today, changefreq: 'weekly', priority: 0.9 },
    ...list.map((s) => ({
      loc: `${siteUrl}/series/${s.slug}`,
      lastmod: today,
      changefreq: 'weekly',
      priority: 0.8,
    })),
  ];

  return new Response(urlsetXml(entries), {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
