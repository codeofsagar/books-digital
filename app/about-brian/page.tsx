import Link from 'next/link';
import { PageShell } from '@/components/PageShell';
import { Hero } from '@/components/Hero';
import { JsonLdSchema } from '@/components/JsonLdSchema';
import { CountUp } from '@/components/CountUp';
import { Reveal } from '@/components/Reveal';
import { getCatalog, getPageSeo } from '@/lib/api';
import { buildMetadata, fallbackPageSchema } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'About Brian Spiker',
  description:
    'Brian Spiker — founder of Apex Raw Motivation. 16 years operating Spiker Rug Werks before writing a word.',
  path: '/about-brian',
});

export const revalidate = 3600;

export default async function AboutBrianPage() {
  const [catalog, seo] = await Promise.all([
    getCatalog({ limit: 1 }),
    getPageSeo('/about-brian'),
  ]);

  // Live counter — Master §2.10 detail #9
  const totalBooks = catalog?.total ?? 0;

  return (
    <PageShell>
      <JsonLdSchema
        bundle={seo}
        fallback={fallbackPageSchema('/about-brian', 'About Brian Spiker')}
      />

      <Hero
        eyebrow="Brian Spiker"
        title={
          <>
            16 years of payroll. <span className="metallic-text">Then the books.</span>
          </>
        }
        body={
          <>
            Founder of <Link href="/" className="text-ink underline decoration-line underline-offset-4 hover:text-accent">Apex Raw Motivation</Link>. Owner-operator of{' '}
            <a
              href="https://spikerrugworks.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-ink underline decoration-line underline-offset-4 hover:text-accent"
            >
              Spiker Rug Werks
            </a>{' '}
            since 2010. Wrote zero books until the operational lessons compounded into something
            worth printing.
          </>
        }
        primary={{ href: '/brian-spiker-real-world-proof', label: 'See the 16-year proof' }}
        secondary={{ href: '/books', label: 'Read the library' }}
      />

      <section className="container-x py-16">
        <Reveal className="grid gap-12 md:grid-cols-3">
          <StatBlock label="Years operating" sub="Spiker Rug Werks · 2010-now">
            <CountUp to={16} className="font-display text-6xl text-accent md:text-7xl" />
          </StatBlock>
          <StatBlock label="Books shipped" sub="Live count from /api/v1/books/catalog">
            {totalBooks > 0 ? (
              <CountUp to={totalBooks} className="font-display text-6xl text-accent md:text-7xl" />
            ) : (
              <span className="font-display text-6xl text-ink-mute md:text-7xl">—</span>
            )}
          </StatBlock>
          <StatBlock label="Books planned" sub="12 series × 53 books">
            <CountUp to={636} className="font-display text-6xl text-accent md:text-7xl" />
          </StatBlock>
        </Reveal>
      </section>

      <section className="border-t border-line bg-bg-subtle">
        <div className="container-x grid gap-12 py-16 md:grid-cols-[2fr_3fr]">
          <div>
            <p className="eyebrow mb-3">The bio</p>
            <h2 className="font-display text-3xl text-ink md:text-4xl">
              The credentials are the company.
            </h2>
          </div>
          <div className="space-y-5 text-ink-dim">
            <p>
              I run a rug operation. Real payroll. Real customers. Real damaged inventory and
              real Mondays. The 12 series of Apex Raw Motivation map directly to the failures I
              accumulated — and the systems that finally stopped repeating them.
            </p>
            <p>
              Every book is back-tested against the company. If a chapter doesn&apos;t survive
              contact with a real shipping dock, it doesn&apos;t go in. That is the whole
              promise — operator-grade. Not therapist-speak.
            </p>
            <p>
              You will not find me posting motivation reels at 6:00 AM. You will find me at the
              warehouse. The book is where the lesson lives.
            </p>
          </div>
        </div>
      </section>

      <section className="container-x py-16">
        <div className="grid gap-4 md:grid-cols-2">
          <Link
            href="/brian-spiker-real-world-proof"
            className="flex flex-col gap-2 border border-line bg-bg-subtle p-8 hover:border-accent transition-colors"
          >
            <p className="eyebrow">Authority transfer</p>
            <p className="font-display text-2xl text-ink">The 16-year timeline →</p>
            <p className="text-sm text-ink-dim">
              Spiker reviews, the job-site carousel, the operational lock that makes the books
              credible.
            </p>
          </Link>
          <Link
            href="/contact"
            className="flex flex-col gap-2 border border-line bg-bg-subtle p-8 hover:border-accent transition-colors"
          >
            <p className="eyebrow">Press / inbound</p>
            <p className="font-display text-2xl text-ink">Reach out →</p>
            <p className="text-sm text-ink-dim">
              Interviews + speaking + bulk orders. Email goes to a real person, not an
              auto-responder.
            </p>
          </Link>
        </div>
      </section>
    </PageShell>
  );
}

function StatBlock({
  label,
  sub,
  children,
}: {
  label: string;
  sub?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="eyebrow">{label}</p>
      <p className="mt-2">{children}</p>
      {sub ? <p className="mt-2 text-xs text-ink-mute">{sub}</p> : null}
    </div>
  );
}
