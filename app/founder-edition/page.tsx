import { PageShell } from '@/components/PageShell';
import { Hero } from '@/components/Hero';
import { FounderApplicationForm } from '@/components/FounderApplicationForm';
import { JsonLdSchema } from '@/components/JsonLdSchema';
import { getPageSeo } from '@/lib/api';
import { buildMetadata, fallbackPageSchema } from '@/lib/seo';
import { tone } from '@/lib/voice';

export const metadata = buildMetadata({
  title: 'Founder Edition — $9,999 · application only',
  description:
    'Founder Edition — $9,999. Signed hardcover set (636 books), lifetime Apex Pass, 90-min private call with Brian, embossed signature plate. 100 per year. Application only.',
  path: '/founder-edition',
});

export const revalidate = 3600;

// Master §1.6 — locked at $9,999, NOT $14,999. Limited to 100/year.
// Application form, NOT Stripe Checkout (operating rule #8).

const DELIVERABLES = [
  {
    title: 'Signed 636-book hardcover set',
    body: 'Every book Apex Raw Motivation will publish — 12 series × 53 books — hardcover, individually signed and shipped progressively as books release. Storage shelf included.',
  },
  {
    title: 'Lifetime Pass — every Apex store',
    body: 'Books Pass, plus every other Apex storefront pass we run, for life. No renewals. No upgrades.',
  },
  {
    title: '90-min private call with Brian',
    body: 'One scheduled 90-minute call inside the first 90 days. Your operation, your decisions. Brian reads the file beforehand.',
  },
  {
    title: 'Embossed signature plate in book #1',
    body: 'Your name on a custom plate, bound into the inside cover of The Discipline Blueprint — the founding book.',
  },
  {
    title: 'Numbered 1-100',
    body: 'Founder Editions are individually numbered. When the 100 are gone for the year, the cohort closes.',
  },
];

export default async function FounderEditionPage() {
  const seo = await getPageSeo('/founder-edition');

  return (
    <PageShell>
      <JsonLdSchema
        bundle={seo}
        fallback={fallbackPageSchema('/founder-edition', 'Founder Edition')}
      />

      <Hero
        eyebrow="Founder Edition · $9,999"
        title={
          <>
            <span className="metallic-text">100 per year.</span> Application only.
          </>
        }
        body={tone.founderHelper}
        primary={{ href: '#apply', label: 'Apply for Founder Edition' }}
        secondary={{ href: '/bundles', label: 'Or see the bundles' }}
      />

      <section className="container-x py-16">
        <div className="mb-10 max-w-2xl">
          <p className="eyebrow mb-3">What ships</p>
          <h2 className="font-display text-3xl text-ink md:text-4xl">
            Five deliverables. One number — 1 through 100.
          </h2>
        </div>
        <ol className="grid gap-4 md:grid-cols-2">
          {DELIVERABLES.map((d, i) => (
            <li key={i} className="flex gap-5 border border-line bg-bg-subtle p-6">
              <span className="font-display text-3xl text-accent">0{i + 1}</span>
              <div>
                <p className="font-display text-xl text-ink">{d.title}</p>
                <p className="mt-2 text-sm text-ink-dim">{d.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section id="apply" className="border-t border-line bg-bg-subtle">
        <div className="container-x py-16">
          <div className="mb-8 max-w-2xl">
            <p className="eyebrow mb-3">Apply</p>
            <h2 className="font-display text-3xl text-ink md:text-4xl">
              Why $9,999 makes sense for you.
            </h2>
            <p className="mt-4 text-ink-dim">
              The application goes to a review queue Brian reads personally. If you fit, you get
              a calendar invite within 7 days. If not, you get a direct no — no waitlist limbo.
            </p>
          </div>

          <FounderApplicationForm />
        </div>
      </section>

      <section className="container-x py-16">
        <div className="border border-line bg-bg-subtle p-6 md:p-8">
          <p className="eyebrow mb-3">FAQ</p>
          <div className="divide-y divide-line">
            <Faq
              q="Why isn't this just a buy button?"
              a="Because 100 of these go out per year, total. The form is the filter — it saves both of us a phone call when this is not a fit."
            />
            <Faq
              q="What if the 100 are gone this year?"
              a="The application closes for the year. We notify you when next year's cohort opens. We do not waitlist beyond that — wait is dishonest."
            />
            <Faq
              q="Do I get the audiobook versions too?"
              a="Yes. The lifetime Pass covers every audiobook for every Apex store, for life."
            />
            <Faq
              q="When does my number ship?"
              a="Book by book, as each title releases. The shelf and signature plate ship within 30 days of acceptance."
            />
          </div>
        </div>
      </section>
    </PageShell>
  );
}

function Faq({ q, a }: { q: string; a: string }) {
  return (
    <details className="group py-4 [&_summary::-webkit-details-marker]:hidden">
      <summary className="flex cursor-pointer items-center justify-between gap-4">
        <span className="font-display text-lg text-ink">{q}</span>
        <span className="text-accent transition-transform group-open:rotate-45" aria-hidden>
          +
        </span>
      </summary>
      <p className="mt-3 text-sm text-ink-dim">{a}</p>
    </details>
  );
}
