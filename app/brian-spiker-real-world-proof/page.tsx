import Link from 'next/link';
import { PageShell } from '@/components/PageShell';
import { Hero } from '@/components/Hero';
import { ReviewTile } from '@/components/ReviewTile';
import { JsonLdSchema } from '@/components/JsonLdSchema';
import { getPageSeo, getSpikerReviews } from '@/lib/api';
import { buildMetadata, fallbackPageSchema } from '@/lib/seo';
import { empty } from '@/lib/voice';

export const metadata = buildMetadata({
  title: 'Brian Spiker — real-world proof · 16 years at Spiker Rug Werks',
  description:
    'The authority transfer page. 16 years operating Spiker Rug Werks. Real customer reviews. Real operational lessons. The foundation under every Apex book.',
  path: '/brian-spiker-real-world-proof',
});

export const revalidate = 3600;

const TIMELINE: Array<{ year: string; label: string; body: string }> = [
  {
    year: '2010',
    label: 'Spiker Rug Werks opens',
    body: 'Hand-cleaning area rugs. One van, one phone line, one tech. Pricing was guesswork. Margin was an accident.',
  },
  {
    year: '2013',
    label: 'First operational system',
    body: 'Routing + intake forms + a real damage-claim process. Customer complaints drop 70%. The books call this Wave I.',
  },
  {
    year: '2016',
    label: 'Crew of seven',
    body: 'Payroll quintuples. The lessons that get printed in Wave II — Pressure — come from this stretch. Most of it was wrong.',
  },
  {
    year: '2019',
    label: 'Second location, then a recall',
    body: 'Expansion before the systems were ready. A six-figure correction. Wave III — Edge — is the post-mortem.',
  },
  {
    year: '2022',
    label: 'Stable. Profitable. Boring.',
    body: 'The good kind of boring. The systems finally compound. Wave IV — Apex — is what shipping looks like when the company stops fighting itself.',
  },
  {
    year: '2025',
    label: 'First book ships',
    body: 'Fifteen years of field notes condense into the first 53-book series. Every chapter back-tested against real operations.',
  },
];

export default async function ProofPage() {
  const [reviewsData, seo] = await Promise.all([
    getSpikerReviews(9),
    getPageSeo('/brian-spiker-real-world-proof'),
  ]);

  const reviews = reviewsData?.reviews ?? [];

  return (
    <PageShell>
      <JsonLdSchema
        bundle={seo}
        fallback={fallbackPageSchema(
          '/brian-spiker-real-world-proof',
          'Brian Spiker — real-world proof',
        )}
      />

      <Hero
        eyebrow="Real-world proof"
        title={
          <>
            <span className="metallic-text">16 years</span> of operations.
            <br />
            Then we wrote the books.
          </>
        }
        body={
          <>
            Every chapter is back-tested against{' '}
            <a
              href="https://spikerrugworks.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-ink underline decoration-line underline-offset-4 hover:text-accent"
            >
              Spiker Rug Werks
            </a>{' '}
            — Brian&apos;s rug-cleaning company. Real payroll. Real customers. Real failures.
            Below: the timeline, the reviews, the operational lock that makes the books
            credible.
          </>
        }
        primary={{ href: '/books', label: 'See the library' }}
        secondary={{ href: 'https://spikerrugworks.com', label: 'Visit Spiker Rug Werks' }}
      />

      {/* Timeline */}
      <section className="container-x py-16">
        <p className="eyebrow mb-3">The timeline</p>
        <h2 className="font-display text-3xl text-ink md:text-4xl">
          Sixteen years. Six inflection points.
        </h2>
        <ol className="mt-10 space-y-6">
          {TIMELINE.map((t) => (
            <li
              key={t.year}
              className="grid gap-3 border border-line bg-bg-subtle p-5 md:grid-cols-[120px_1fr] md:gap-6 md:p-6"
            >
              <p className="font-display text-2xl text-accent md:text-3xl">{t.year}</p>
              <div>
                <p className="font-display text-xl text-ink">{t.label}</p>
                <p className="mt-2 text-ink-dim">{t.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Spiker reviews */}
      <section className="border-t border-line bg-bg-subtle">
        <div className="container-x py-16">
          <div className="mb-8 max-w-2xl">
            <p className="eyebrow mb-2">Spiker customer reviews</p>
            <h2 className="font-display text-3xl text-ink md:text-4xl">
              The customers who paid for the lessons.
            </h2>
            <p className="mt-4 text-ink-dim">
              Authorized reviews from real Spiker Rug Werks customers. No invented testimonials.
              Some of these people show up in the books — anonymized — as case studies.
            </p>
          </div>

          {reviews.length === 0 ? (
            <p className="border border-line bg-bg p-8 text-sm text-ink-dim">
              {empty.reviewsNone}
            </p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {reviews.map((r) => (
                <ReviewTile key={r.id} review={r} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Sister-site reciprocity */}
      <section className="container-x py-16">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="border border-line bg-bg-subtle p-8">
            <p className="eyebrow mb-3">Sister site</p>
            <h3 className="font-display text-2xl text-ink">spikerrugworks.com</h3>
            <p className="mt-3 text-ink-dim">
              The operation that funded the books. If you want to see what an actual back-tested
              business looks like — not a course pitch — this is it.
            </p>
            <a
              href="https://spikerrugworks.com"
              target="_blank"
              rel="noopener noreferrer"
              className="cta-secondary mt-6 inline-flex"
            >
              Visit Spiker Rug Werks
            </a>
          </div>

          <div className="border border-accent/40 bg-bg-subtle p-8">
            <p className="eyebrow mb-3 text-accent">Built into every page</p>
            <h3 className="font-display text-2xl text-ink">Schema-level authority</h3>
            <p className="mt-3 text-ink-dim">
              Every page on this site renders <code className="text-xs text-accent">Person</code>{' '}
              + <code className="text-xs text-accent">isBasedOn</code> JSON-LD pointing at
              spikerrugworks.com. The authority transfer is not a marketing claim — it is in the
              page source.
            </p>
            <Link href="/llms.txt" className="cta-secondary mt-6 inline-flex">
              See /llms.txt
            </Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
