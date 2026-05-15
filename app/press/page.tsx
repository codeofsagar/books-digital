import Link from 'next/link';
import { PageShell } from '@/components/PageShell';
import { Hero } from '@/components/Hero';
import { JsonLdSchema } from '@/components/JsonLdSchema';
import { getPageSeo } from '@/lib/api';
import { buildMetadata, fallbackPageSchema } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Press — Apex Raw Motivation',
  description:
    'Press kit for Apex Raw Motivation. Boilerplate, bio, high-res assets, and the answer to "is the rug-cleaning thing real?" — yes.',
  path: '/press',
});

export const revalidate = 3600;

const FACTS = [
  ['Founder', 'Brian Spiker'],
  ['Sister company', 'Spiker Rug Werks (since 2010 · spikerrugworks.com)'],
  ['Library size', '636 books · 12 series · 53 books per series'],
  ['Cadence', 'One chapter per day · 90 chapters per book'],
  ['Pricing', 'Ebook $6.99 · Paperback $14.99 · Hardcover $24.99 · Audiobook $19.95'],
  ['Books Pass', '$99 / year — standalone, per-store'],
  ['Founder Edition', '$9,999 — application only · 100 per year'],
  ['Audiobook narration', 'Polly Neural · supervised by Brian'],
  ['Audiobook distribution', 'Findaway Voices non-exclusive (25% royalty)'],
];

export default async function PressPage() {
  const seo = await getPageSeo('/press');

  return (
    <PageShell>
      <JsonLdSchema bundle={seo} fallback={fallbackPageSchema('/press', 'Press kit')} />

      <Hero
        eyebrow="Press kit"
        title={
          <>
            <span className="metallic-text">Press kit.</span> Real facts, not adjectives.
          </>
        }
        body="Everything you need to file a story or book Brian for an interview. Reach press@apexflowlabs.com for high-res assets, embargoed announcements, and direct interview booking."
      />

      <section className="container-x py-16">
        <div className="grid gap-12 md:grid-cols-[2fr_3fr]">
          <div>
            <p className="eyebrow mb-3">One-liner</p>
            <h2 className="font-display text-3xl text-ink md:text-4xl">
              Operator-grade self-help, back-tested against a 16-year rug-cleaning company.
            </h2>
            <p className="mt-4 text-ink-dim">
              That is the whole story in one sentence. The rest is supporting evidence.
            </p>
          </div>

          <div>
            <p className="eyebrow mb-3">Fact sheet</p>
            <dl className="border border-line bg-bg-subtle">
              {FACTS.map(([k, v], i) => (
                <div
                  key={i}
                  className="grid grid-cols-[140px_1fr] gap-4 border-b border-line p-4 last:border-b-0 md:grid-cols-[180px_1fr]"
                >
                  <dt className="text-xs uppercase tracking-widest text-ink-mute">{k}</dt>
                  <dd className="text-sm text-ink">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <section className="border-t border-line bg-bg-subtle">
        <div className="container-x py-16">
          <p className="eyebrow mb-3">Boilerplate (use this in articles)</p>
          <div className="border border-line bg-bg p-6 text-sm text-ink leading-relaxed md:p-8">
            <p>
              Apex Raw Motivation is the books storefront of Brian Spiker, owner-operator of
              Spiker Rug Werks since 2010. Across 12 series and 636 books, Apex publishes
              R-rated, war-manual self-help that is back-tested against a real operating
              company — not adapted from a content marketing playbook. The library publishes on
              a 90-chapter-per-book / one-chapter-per-day cadence, with supervised AI
              narration for the audiobook editions distributed non-exclusively via Findaway
              Voices.
            </p>
          </div>
        </div>
      </section>

      <section className="container-x py-16">
        <div className="grid gap-4 md:grid-cols-3">
          <Link
            href="/about-brian"
            className="border border-line bg-bg-subtle p-6 hover:border-accent transition-colors"
          >
            <p className="eyebrow">About Brian</p>
            <p className="mt-2 font-display text-xl text-ink">Background + bio →</p>
          </Link>
          <Link
            href="/brian-spiker-real-world-proof"
            className="border border-line bg-bg-subtle p-6 hover:border-accent transition-colors"
          >
            <p className="eyebrow">The proof page</p>
            <p className="mt-2 font-display text-xl text-ink">16-year timeline + Spiker reviews →</p>
          </Link>
          <a
            href="mailto:press@apexflowlabs.com"
            className="border border-line bg-bg-subtle p-6 hover:border-accent transition-colors"
          >
            <p className="eyebrow">Press contact</p>
            <p className="mt-2 font-display text-xl text-ink">press@apexflowlabs.com →</p>
          </a>
        </div>
      </section>
    </PageShell>
  );
}
