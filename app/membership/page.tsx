import Link from 'next/link';
import { Check } from 'lucide-react';
import { PageShell } from '@/components/PageShell';
import { Hero } from '@/components/Hero';
import { JsonLdSchema } from '@/components/JsonLdSchema';
import { getPageSeo } from '@/lib/api';
import { buildMetadata, fallbackPageSchema } from '@/lib/seo';
import { tone } from '@/lib/voice';

export const metadata = buildMetadata({
  title: 'Books Insider Pass — $99 a year',
  description:
    'Books Insider Pass — standalone $99/yr. Full audiobook library, 20% off hardcovers, monthly bonus episode, early access. Per-store pass — not bundled with the Digital Pass.',
  path: '/membership',
});

export const revalidate = 3600;

const BENEFITS = [
  'Stream the full Apex audiobook library — every book Brian has narrated',
  '20% off all hardcovers, every order, no minimum',
  'One bonus podcast episode per month — Pass-only, never published publicly',
  'Early access to new releases — 7 days before the public launch',
  'Pass-only AMA threads with Brian, scheduled monthly',
  'Cancel any time. No prorated nonsense.',
];

// Per Master §1.4 — Books Pass is STANDALONE $99/yr. Never cross-bundle
// with the Digital Pass at this tier. Each store owns its own pass.

export default async function MembershipPage() {
  const seo = await getPageSeo('/membership');

  return (
    <PageShell>
      <JsonLdSchema
        bundle={seo}
        fallback={fallbackPageSchema('/membership', 'Books Insider Pass')}
      />

      <Hero
        eyebrow="Books Insider Pass"
        title={
          <>
            <span className="metallic-text">$99 a year.</span> The full library, audible.
          </>
        }
        body="Standalone Books Pass. One annual fee. Full audiobook streaming. Hardcover discount. Bonus episodes. No tier upgrades — this IS the tier."
        primary={{ href: '#join', label: 'Get the Pass — $99/yr' }}
        secondary={{ href: '/books', label: 'See the library first' }}
      />

      <section className="container-x py-16">
        <div className="grid gap-12 md:grid-cols-[2fr_3fr]">
          <div>
            <p className="eyebrow mb-3">What you get</p>
            <h2 className="font-display text-3xl text-ink md:text-4xl">
              Everything Brian narrates. Every hardcover, 20% off.
            </h2>
            <p className="mt-4 text-ink-dim">{tone.membershipHelper}</p>
          </div>
          <ul className="space-y-3">
            {BENEFITS.map((b, i) => (
              <li
                key={i}
                className="flex items-start gap-3 border border-line bg-bg-subtle p-4 text-sm text-ink"
              >
                <Check className="mt-0.5 h-5 w-5 shrink-0 text-accent" aria-hidden />
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="join" className="border-y border-line bg-bg-subtle">
        <div className="container-x py-16 text-center">
          <p className="eyebrow mb-3">Join the Pass</p>
          <h2 className="font-display text-4xl text-ink md:text-6xl">
            <span className="metallic-text">$99</span>
            <span className="text-ink-dim"> / year</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-ink-dim">
            One charge. No subscription roulette. Renew once a year if you still want it.
          </p>
          <form
            action={`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/checkout/start`}
            method="post"
            className="mx-auto mt-8 inline-flex flex-col items-center gap-3"
          >
            <input type="hidden" name="product" value="books-insider-pass" />
            <input type="hidden" name="source" value="books-frontend-membership" />
            <button type="submit" className="cta-primary px-10 py-4 text-base">
              Get the Pass — $99/yr
            </button>
            <p className="text-xs text-ink-mute">Routed to Stripe Checkout via backend.</p>
          </form>
        </div>
      </section>

      {/* Master §1.4 — DO NOT cross-reference Digital Pass */}
      <section className="container-x py-16">
        <div className="border border-line bg-bg-subtle p-6 md:p-8">
          <p className="eyebrow mb-3">Per-store Pass</p>
          <h3 className="font-display text-2xl text-ink">
            One Apex store. One Pass. No tier confusion.
          </h3>
          <p className="mt-3 max-w-2xl text-ink-dim">
            Apex Raw Motivation runs multiple storefronts. Each owns its own Pass. The Books Pass
            covers everything you read on this site. Other Apex passes do other things. There is
            no upgrade ladder — we just charge once for what you actually use.
          </p>
          <Link href="/founder-edition" className="cta-secondary mt-6 inline-flex">
            Want all of it? See Founder Edition
          </Link>
        </div>
      </section>
    </PageShell>
  );
}
