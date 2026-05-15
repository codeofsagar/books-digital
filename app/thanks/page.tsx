import Link from 'next/link';
import { PageShell } from '@/components/PageShell';
import { Confetti } from '@/components/Confetti';
import { buildMetadata } from '@/lib/seo';

export const metadata = {
  ...buildMetadata({
    title: 'Thanks — you ordered.',
    description: 'Your order is in. Files land in your inbox; backend handles fulfillment.',
    path: '/thanks',
  }),
  robots: { index: false, follow: false },
};

interface ThanksProps {
  searchParams: Promise<{ session?: string; product?: string }>;
}

export default async function ThanksPage({ searchParams }: ThanksProps) {
  const sp = await searchParams;
  return (
    <PageShell>
      <Confetti />
      <section className="container-x flex min-h-[60vh] flex-col items-start justify-center py-24">
        <p className="eyebrow mb-3">Order confirmed</p>
        <h1 className="font-display text-5xl text-ink md:text-7xl">
          <span className="metallic-text">Shipped.</span>
        </h1>
        <p className="mt-6 max-w-xl text-ink-dim">
          The backend is finalizing your fulfillment now. Receipt + downloads land in your inbox
          within 5 minutes. If you ordered audiobook or eBook, the files are streamed via the
          Books Pass library — sign in at apexflowlabs.com to access.
        </p>

        {sp.session ? (
          <p className="mt-4 text-xs text-ink-mute">Stripe session: {sp.session}</p>
        ) : null}

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Link href="/books" className="cta-primary">
            Back to the library
          </Link>
          <Link href="/contact" className="cta-secondary">
            Order question? Email support
          </Link>
        </div>
      </section>
    </PageShell>
  );
}
