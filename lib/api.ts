import { env } from './env';
import type {
  BookDetail,
  CatalogResponse,
  JsonLdBundle,
  MembershipAccess,
  PodcastEpisodeDetail,
  PodcastFeedResponse,
  ReviewExcerpt,
  SeriesDetail,
  SeriesSummary,
} from './types';

interface BackendOptions extends RequestInit {
  revalidate?: number | false;
  tags?: string[];
  cookie?: string;
}

// Single backend helper. Default cache: 5 min ISR with backend bearer auth.
// Per Master SOP, no direct DB access from frontend — only /api/v1/*.
export async function backend<T>(path: string, opts: BackendOptions = {}): Promise<T> {
  const { revalidate = 300, tags, cookie, headers, ...rest } = opts;

  const url = `${env.backendUrl}${path}`;

  const composedHeaders: Record<string, string> = {
    Accept: 'application/json',
    ...(env.apiBearer ? { Authorization: `Bearer ${env.apiBearer}` } : {}),
    ...(cookie ? { Cookie: cookie } : {}),
    ...((headers as Record<string, string>) ?? {}),
  };

  const next: { revalidate?: number | false; tags?: string[] } = {};
  if (revalidate !== undefined) next.revalidate = revalidate;
  if (tags) next.tags = tags;

  const res = await fetch(url, {
    ...rest,
    headers: composedHeaders,
    next,
  });

  if (!res.ok) {
    throw new BackendError(`backend ${path} ${res.status}`, res.status, path);
  }

  return res.json() as Promise<T>;
}

export class BackendError extends Error {
  constructor(message: string, public status: number, public path: string) {
    super(message);
    this.name = 'BackendError';
  }
}

// Safe variant — never throws, returns null on failure. Use on non-critical
// surfaces (Spiker reviews on book page, etc.) so a backend hiccup doesn't
// 500 the whole page.
export async function backendSafe<T>(path: string, opts: BackendOptions = {}): Promise<T | null> {
  try {
    return await backend<T>(path, opts);
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') {
      // Compact dev log — most failures here are "backend endpoint not yet
      // built" (per the Phase 1 TODO list in guideline.md), so a one-liner
      // is more useful than a stack trace.
      if (err instanceof BackendError) {
        console.warn(`[backendSafe] ${path} → ${err.status}`);
      } else if (err instanceof Error) {
        console.warn(`[backendSafe] ${path} → ${err.message}`);
      } else {
        console.warn(`[backendSafe] ${path} → unknown error`);
      }
    }
    return null;
  }
}

// ---- Typed endpoint wrappers --------------------------------------------

export interface CatalogQuery {
  series?: string;
  wave?: 1 | 2 | 3 | 4;
  filter?: string;
  limit?: number;
}

export function getCatalog(q: CatalogQuery = {}) {
  const qs = new URLSearchParams();
  if (q.series) qs.set('series', q.series);
  if (q.wave) qs.set('wave', String(q.wave));
  if (q.filter) qs.set('filter', q.filter);
  qs.set('limit', String(q.limit ?? 100));
  return backendSafe<CatalogResponse>(`/api/v1/books/catalog?${qs.toString()}`, {
    revalidate: 300,
    tags: ['catalog'],
  });
}

export function getBook(slug: string) {
  return backendSafe<BookDetail>(`/api/v1/books/${slug}`, {
    revalidate: 3600,
    tags: ['book', `book:${slug}`],
  });
}

export function getSeriesList() {
  return backendSafe<{ series: SeriesSummary[] }>(`/api/v1/series`, {
    revalidate: 3600,
    tags: ['series'],
  });
}

export function getSeries(slug: string) {
  return backendSafe<SeriesDetail>(`/api/v1/series/${slug}`, {
    revalidate: 3600,
    tags: ['series', `series:${slug}`],
  });
}

export function getPodcastFeed(limit = 50) {
  return backendSafe<PodcastFeedResponse>(`/api/v1/podcast/feed?limit=${limit}`, {
    revalidate: 600,
    tags: ['podcast'],
  });
}

export function getPodcastEpisode(slug: string) {
  return backendSafe<PodcastEpisodeDetail>(`/api/v1/podcast/${slug}`, {
    revalidate: 3600,
    tags: ['podcast', `podcast:${slug}`],
  });
}

export function getBookSeo(slug: string) {
  return backendSafe<JsonLdBundle>(`/api/v1/seo/book/${slug}`, { revalidate: 3600 });
}

export function getSeriesSeo(slug: string) {
  return backendSafe<JsonLdBundle>(`/api/v1/seo/series/${slug}`, { revalidate: 3600 });
}

export function getPageSeo(path: string) {
  return backendSafe<JsonLdBundle>(
    `/api/v1/seo/page${path.startsWith('/') ? path : `/${path}`}`,
    { revalidate: 3600 },
  );
}

export function getSpikerReviews(limit = 6) {
  return backendSafe<{ reviews: ReviewExcerpt[] }>(`/api/v1/spiker/reviews?limit=${limit}`, {
    revalidate: 3600,
    tags: ['spiker-reviews'],
  });
}

export function getMembershipAccess(cookie: string | undefined) {
  if (!cookie) return Promise.resolve(null);
  return backendSafe<MembershipAccess>(`/api/v1/membership/access?store=books`, {
    cookie: `apex_session=${cookie}`,
    revalidate: 0,
  });
}
