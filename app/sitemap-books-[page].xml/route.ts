import { env } from '@/lib/env';
import { getCatalog } from '@/lib/api';
import { urlsetXml } from '@/lib/xml';

export const revalidate = 3600;

const PAGE_SIZE = 200;

// Next 16's typed-route validator doesn't extract `[page]` as a route param
// when the segment ends in `.xml`, so we read the page index out of the URL
// instead of relying on the context arg. Runtime is identical.
export async function GET(request: Request) {
  const url = new URL(request.url);
  const match = url.pathname.match(/sitemap-books-(\d+)\.xml/);
  const page = Math.max(1, Number.parseInt(match?.[1] ?? '1', 10));

  const siteUrl = env.siteUrl.replace(/\/$/, '');

  const catalog = await getCatalog({ limit: PAGE_SIZE * page });
  const all = catalog?.books ?? [];
  const slice = all.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const today = new Date().toISOString().slice(0, 10);
  const entries = slice.map((b) => ({
    loc: `${siteUrl}/books/${b.slug}`,
    lastmod: today,
    changefreq: 'weekly',
    priority: 0.8,
  }));

  return new Response(urlsetXml(entries), {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
