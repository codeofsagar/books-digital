export function xmlEscape(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export function urlsetXml(entries: Array<{ loc: string; lastmod?: string; changefreq?: string; priority?: number }>) {
  const items = entries
    .map((e) => {
      const lastmod = e.lastmod ? `<lastmod>${xmlEscape(e.lastmod)}</lastmod>` : '';
      const changefreq = e.changefreq ? `<changefreq>${xmlEscape(e.changefreq)}</changefreq>` : '';
      const priority = e.priority !== undefined ? `<priority>${e.priority.toFixed(1)}</priority>` : '';
      return `<url><loc>${xmlEscape(e.loc)}</loc>${lastmod}${changefreq}${priority}</url>`;
    })
    .join('');
  return `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${items}</urlset>`;
}

export function sitemapIndexXml(entries: Array<{ loc: string; lastmod?: string }>) {
  const items = entries
    .map((e) => {
      const lastmod = e.lastmod ? `<lastmod>${xmlEscape(e.lastmod)}</lastmod>` : '';
      return `<sitemap><loc>${xmlEscape(e.loc)}</loc>${lastmod}</sitemap>`;
    })
    .join('');
  return `<?xml version="1.0" encoding="UTF-8"?><sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${items}</sitemapindex>`;
}
