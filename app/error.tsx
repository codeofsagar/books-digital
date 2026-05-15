'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error('[apex-books] route error', error);
  }, [error]);

  return (
    <div className="container-x flex min-h-screen flex-col items-start justify-center py-24">
      <p className="text-xs uppercase tracking-widest text-ink-mute">Something broke</p>
      <h1 className="mt-3 font-display text-4xl text-ink md:text-6xl">
        The page hit a wall.
      </h1>
      <p className="mt-6 max-w-xl text-ink-dim">
        Refresh once. If it persists, the backend is the problem — books and prices live there,
        not here. Try again in 60 seconds.
      </p>
      <div className="mt-10 flex gap-3">
        <button type="button" onClick={reset} className="cta-primary">
          Try again
        </button>
        <Link href="/" className="cta-secondary">
          Home
        </Link>
      </div>
    </div>
  );
}
