import Link from 'next/link';
import { PageShell } from '@/components/PageShell';
import { Hero } from '@/components/Hero';
import { JsonLdSchema } from '@/components/JsonLdSchema';
import { getPageSeo } from '@/lib/api';
import { buildMetadata, fallbackPageSchema } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Bundles — series + the 12-series everything bundle',
  description:
    'Series bundles at $79 ebook / $149 audio. 12-series complete ebook at $499. 12-series everything at $1,499.',
  path: '/bundles',
});

export const revalidate = 3600;

// Master §1.5 — locked prices. Never display off-spec.
const BUNDLES = [
  {
    name: 'Series — ebook',
    price: '$79',
    note: '53 books · one full series · ebook only',
    body: 'Pick any one of the 12 series. All 53 books in ebook format, delivered as a single download bundle.',
    sku: 'series-bundle-ebook',
  },
  {
    name: 'Series — audio',
    price: '$149',
    note: '53 books · one full series · audiobook library',
    body: 'All 53 audiobooks of a single series, narrated by Brian via supervised Polly Neural. Listen on the Books Pass player.',
    sku: 'series-bundle-audio',
  },
  {
    name: '12-series ebook',
    price: '$499',
    note: '636 books · all 12 series · ebook only',
    body: 'The complete library in ebook format. 636 books. One bundled download per series. Lifetime access in your library.',
    sku: 'twelve-series-ebook',
  },
  {
    name: '12-series everything',
    price: '$1,499',
    note: '636 books · ebook + audiobook · full library',
    body: 'Every book, every format. 636 ebooks + 636 audiobooks. The fastest path to running the whole 90-day program across all 12 fronts.',
    sku: 'twelve-series-everything',
  },
];

export default async function BundlesPage() {
  const seo = await getPageSeo('/bundles');

  return (
    <PageShell>
      <JsonLdSchema bundle={seo} fallback={fallbackPageSchema('/bundles', 'Bundles')} />

      <Hero
        eyebrow="Bundles"
        title={
          <>
            One series. <span className="metallic-text">Or all twelve.</span>
          </>
        }
        body="Series bundles at $79 ebook or $149 audio. The full library at $499 ebook. The whole arsenal — ebooks + audiobooks for all 636 books — at $1,499."
      />

      <section className="container-x py-16">
        <div className="grid gap-6 md:grid-cols-2">
          {BUNDLES.map((b) => (
            <div key={b.sku} className="flex flex-col border border-line bg-bg-subtle p-8">
              <p className="eyebrow">{b.note}</p>
              <p className="mt-3 font-display text-3xl text-ink">{b.name}</p>
              <p className="mt-2 font-display text-5xl text-accent">{b.price}</p>
              <p className="mt-4 flex-1 text-sm text-ink-dim">{b.body}</p>
              <form
                action={`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/checkout/start`}
                method="post"
                className="mt-6"
              >
                <input type="hidden" name="product" value={b.sku} />
                <input type="hidden" name="source" value="books-frontend-bundles" />
                <button type="submit" className="cta-primary w-full">
                  Buy {b.price}
                </button>
              </form>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-line bg-bg-subtle">
        <div className="container-x py-16">
          <div className="grid gap-4 md:grid-cols-2">
            <Link
              href="/founder-edition"
              className="flex flex-col gap-2 border border-accent/40 bg-bg p-8 hover:border-accent transition-colors"
            >
              <p className="eyebrow text-accent">$9,999 tier</p>
              <p className="font-display text-2xl text-ink">Founder Edition →</p>
              <p className="text-sm text-ink-dim">
                Signed 636-book hardcover set + lifetime Pass to every Apex store + 90-min call
                with Brian. Application only. 100 per year.
              </p>
            </Link>
            <Link
              href="/membership"
              className="flex flex-col gap-2 border border-line bg-bg p-8 hover:border-accent transition-colors"
            >
              <p className="eyebrow">Books Pass</p>
              <p className="font-display text-2xl text-ink">$99/yr — full audiobook library →</p>
              <p className="text-sm text-ink-dim">
                Want unlimited audio + 20% off hardcovers instead of a one-time bundle? The Pass
                is the better deal if you read continuously.
              </p>
            </Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
