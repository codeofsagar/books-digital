import Link from 'next/link';
import { PageShell } from '@/components/PageShell';

export default function NotFound() {
  return (
    <PageShell>
      <div className="container-x flex min-h-[60vh] flex-col items-start justify-center py-24">
        <p className="eyebrow mb-3">404</p>
        <h1 className="font-display text-5xl text-ink md:text-7xl">Wrong front.</h1>
        <p className="mt-6 max-w-xl text-ink-dim">
          The page you ran at does not exist. Either the link is stale or you typed it from
          memory. Either way — back to the library and pick a real fight.
        </p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Link href="/books" className="cta-primary">
            Browse all books
          </Link>
          <Link href="/series" className="cta-secondary">
            See the 12 series
          </Link>
        </div>
      </div>
    </PageShell>
  );
}
