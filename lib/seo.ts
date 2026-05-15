import type { Metadata } from 'next';
import { env } from './env';
import type { BookDetail, SeriesDetail } from './types';
import { imageProxy } from './utils';

const SITE_NAME = 'Apex Raw Motivation';
const DEFAULT_DESCRIPTION =
  '636 books. 12 series. One war-manual library. Built on 16 years of operations at Spiker Rug Werks.';

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

const BRIAN_PERSON = {
  '@type': 'Person',
  '@id': `${env.siteUrl}/about-brian#brian`,
  name: 'Brian Spiker',
  url: `${env.siteUrl}/about-brian`,
  jobTitle: 'Founder, Apex Raw Motivation',
  worksFor: { '@type': 'Organization', name: SITE_NAME },
  sameAs: ['https://spikerrugworks.com'],
};

const APEX_ORG = {
  '@type': 'Organization',
  '@id': `${env.siteUrl}#org`,
  name: SITE_NAME,
  url: env.siteUrl,
  logo: `${env.siteUrl}/logo.png`,
  founder: BRIAN_PERSON,
};

const SPIKER_BASED_ON = {
  '@type': 'CreativeWork',
  '@id': 'https://spikerrugworks.com#operations',
  name: 'Spiker Rug Werks — 16 years of operational lessons',
  url: 'https://spikerrugworks.com',
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
