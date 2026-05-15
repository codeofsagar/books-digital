import type { Metadata } from 'next';
import { env } from './env';
import type { BookDetail, SeriesDetail } from './types';
import { imageProxy } from './utils';

const SITE_NAME = 'Apex Raw Motivation';
const DEFAULT_DESCRIPTION =
  '636 books. 12 series. One war-manual library. Written by Brian Spiker — founder of Spiker Carpet and Tile Care, operating since 2013 (13 years).';

// Canonical Spiker reference — used in every Person sameAs + isBasedOn pull.
const SPIKER_URL = 'https://spikercarpetandtilecare.com';
const APEX_LABS_URL = 'https://apexflowlabs.com';

export function buildMetadata(input: {
  title: string;
  description?: string;
  path: string;
  image?: string;
  type?: 'website' | 'article' | 'book';
}): Metadata {
  const url = `${env.siteUrl.replace(/\/$/, '')}${input.path}`;
  const description = input.description ?? DEFAULT_DESCRIPTION;
  const image = input.image ?? `${env.siteUrl.replace(/\/$/, '')}/og-default.jpg`;

  return {
    title: input.title,
    description,
    metadataBase: new URL(env.siteUrl || 'https://books.apexflowlabs.com'),
    alternates: { canonical: url },
    openGraph: {
      title: input.title,
      description,
      url,
      siteName: SITE_NAME,
      type: input.type === 'book' ? 'book' : input.type ?? 'website',
      images: [{ url: image, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: input.title,
      description,
      images: [image],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
    },
  };
}

// Fallback JSON-LD generators — used when backend /api/v1/seo/* is unavailable
// so pages still ship structured data per Master §6.4. Backend response, when
// present, replaces these entirely.

// Entity unification: every Person reference points at the same @id, and the
// sameAs array glues Brian-the-author to Brian-the-13-year-business-operator
// across every domain so crawlers + LLMs treat them as one entity.
const BRIAN_PERSON = {
  '@type': 'Person',
  '@id': `${APEX_LABS_URL}/about-brian#person`,
  name: 'Brian Spiker',
  url: `${env.siteUrl}/about-brian`,
  jobTitle: 'Founder & Author',
  description:
    'Founder of Spiker Carpet and Tile Care (operating since 2013, 13 years). Author of Apex Raw Motivation (636 books, 12 series). Founder of Apex Flow Labs.',
  worksFor: [
    {
      '@type': 'Organization',
      name: 'Spiker Carpet and Tile Care',
      url: SPIKER_URL,
      foundingDate: '2013',
    },
    { '@type': 'Organization', name: 'Apex Flow Labs', url: APEX_LABS_URL },
    { '@type': 'Organization', name: SITE_NAME, url: env.siteUrl },
  ],
  sameAs: [
    SPIKER_URL,
    APEX_LABS_URL,
    env.siteUrl,
    'https://www.google.com/maps/place/Spiker+Carpet+and+Tile+Care',
    'https://www.youtube.com/@apexrawmotivation',
  ],
};

const APEX_ORG = {
  '@type': 'Organization',
  '@id': `${env.siteUrl}#org`,
  name: SITE_NAME,
  url: env.siteUrl,
  logo: `${env.siteUrl}/logo.png`,
  founder: BRIAN_PERSON,
  parentOrganization: {
    '@type': 'Organization',
    name: 'Apex Flow Labs',
    url: APEX_LABS_URL,
  },
};

// LocalBusiness schema for Spiker — services list is the canonical authorized
// set. Never invent services beyond these.
export const SPIKER_BUSINESS = {
  '@type': 'LocalBusiness',
  '@id': `${SPIKER_URL}#business`,
  name: 'Spiker Carpet and Tile Care',
  url: SPIKER_URL,
  foundingDate: '2013',
  description:
    'Carpet cleaning and protection, upholstery cleaning and protection, tile and grout cleaning and sealing, pet odor removal with enzyme treatment for urine and microbiological oil treatment for wet-dog smells.',
  founder: { '@id': `${APEX_LABS_URL}/about-brian#person` },
  serviceType: [
    'Carpet cleaning',
    'Carpet protection',
    'Upholstery cleaning',
    'Upholstery protection',
    'Tile and grout cleaning',
    'Tile and grout sealing',
    'Pet odor removal',
    'Urine enzyme treatment',
    'Microbiological oil treatment',
  ],
};

// isBasedOn provenance — every book/series/article/page derives authority from
// Brian's 13 years of running Spiker Carpet and Tile Care.
const SPIKER_BASED_ON = {
  '@type': 'CreativeWork',
  '@id': `${SPIKER_URL}#operations`,
  name: '13 years running Spiker Carpet and Tile Care',
  url: SPIKER_URL,
};

export function fallbackBookSchema(book: BookDetail): unknown[] {
  const url = `${env.siteUrl}/books/${book.slug}`;
  const image = imageProxy(book.cover_r2_key);
  const reviews = (book.reviews ?? []).slice(0, 3).map((r) => ({
    '@type': 'Review',
    reviewBody: r.body,
    author: { '@type': 'Person', name: r.author },
    ...(r.rating
      ? { reviewRating: { '@type': 'Rating', ratingValue: r.rating, bestRating: 5 } }
      : {}),
  }));

  const audiobookFormat =
    book.audiobook?.full_url || book.audiobook?.sample_url
      ? [
          {
            '@context': 'https://schema.org',
            '@type': 'Audiobook',
            name: book.title,
            url,
            duration: book.audiobook.duration_seconds
              ? `PT${Math.round(book.audiobook.duration_seconds / 60)}M`
              : undefined,
            author: BRIAN_PERSON,
          },
        ]
      : [];

  const faq =
    book.faq && book.faq.length
      ? [
          {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: book.faq.map((f) => ({
              '@type': 'Question',
              name: f.q,
              acceptedAnswer: { '@type': 'Answer', text: f.a },
            })),
          },
        ]
      : [];

  return [
    {
      '@context': 'https://schema.org',
      '@type': 'Book',
      name: book.title,
      url,
      image,
      author: BRIAN_PERSON,
      publisher: APEX_ORG,
      bookFormat: 'https://schema.org/EBook',
      isBasedOn: SPIKER_BASED_ON,
      ...(reviews.length ? { review: reviews } : {}),
    },
    { '@context': 'https://schema.org', ...BRIAN_PERSON },
    { '@context': 'https://schema.org', ...APEX_ORG },
    ...audiobookFormat,
    ...faq,
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Books',
          item: `${env.siteUrl}/books`,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: book.series_name,
          item: `${env.siteUrl}/series/${book.series_slug}`,
        },
        { '@type': 'ListItem', position: 3, name: book.title, item: url },
      ],
    },
  ];
}

export function fallbackSeriesSchema(series: SeriesDetail): unknown[] {
  const url = `${env.siteUrl}/series/${series.slug}`;
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: `${series.name} — Apex Raw Motivation`,
      url,
      isBasedOn: SPIKER_BASED_ON,
      mainEntity: {
        '@type': 'ItemList',
        numberOfItems: series.books?.length ?? series.book_count,
        itemListElement: (series.books ?? []).slice(0, 25).map((b, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          url: `${env.siteUrl}/books/${b.slug}`,
          name: b.title,
        })),
      },
    },
    { '@context': 'https://schema.org', ...BRIAN_PERSON },
    { '@context': 'https://schema.org', ...APEX_ORG },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Series', item: `${env.siteUrl}/series` },
        { '@type': 'ListItem', position: 2, name: series.name, item: url },
      ],
    },
  ];
}

export function fallbackPageSchema(path: string, title: string): unknown[] {
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: title,
      url: `${env.siteUrl}${path}`,
      isPartOf: APEX_ORG,
    },
    { '@context': 'https://schema.org', ...BRIAN_PERSON },
    { '@context': 'https://schema.org', ...APEX_ORG },
  ];
}
