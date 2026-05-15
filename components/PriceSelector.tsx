'use client';

import { useState, useTransition } from 'react';
import { Loader2 } from 'lucide-react';
import type { BookDetail, Format } from '@/lib/types';
import { cn, formatLabel, priceDisplay, sortFormats } from '@/lib/utils';
import { cta, tone } from '@/lib/voice';

interface PriceSelectorProps {
  book: BookDetail;
}

// Renders the 4-format selector + Buy button. Buy POSTs to backend
// /api/v1/checkout/start and follows the redirect to Stripe — we NEVER call
// loadStripe() on this repo (operating rule #11).
export function PriceSelector({ book }: PriceSelectorProps) {
  const formats = sortFormats(book.formats);
  const firstAvailable = formats.find((f) => f.available) ?? formats[0];
  const [selected, setSelected] = useState<Format | undefined>(firstAvailable?.format);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const current = formats.find((f) => f.format === selected);

  function handleBuy() {
    setError(null);
    if (!current || !current.available) return;
    startTransition(async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/checkout/start`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            book_slug: book.slug,
            format: current.format,
            source: 'books-frontend',
          }),
        });
        if (!res.ok) throw new Error(`checkout ${res.status}`);
        const { checkout_url } = (await res.json()) as { checkout_url: string };
        if (checkout_url) {
          window.location.href = checkout_url;
        } else {
          throw new Error('No checkout_url returned');
        }
      } catch (err) {
        setError('Checkout is briefly offline. Try again in a moment.');
        console.error(err);
      }
    });
  }

  if (!formats.length) {
    return (
      <div className="border border-line bg-bg-subtle p-5 text-sm text-ink-dim">
        Pricing loading. Refresh in a moment.
      </div>
    );
  }

  return (
    <div className="border border-line bg-bg-subtle p-5">
      <p className="eyebrow mb-3">Choose format</p>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {formats.map((f) => {
          const isActive = f.format === selected;
          return (
            <button
              key={f.format}
              type="button"
              onClick={() => setSelected(f.format)}
              disabled={!f.available}
              className={cn(
                'flex flex-col items-start gap-1 border px-3 py-2 text-left transition-colors',
                isActive
                  ? 'border-accent bg-bg text-ink'
                  : 'border-line bg-transparent text-ink-dim hover:border-ink',
                !f.available && 'opacity-50 cursor-not-allowed',
              )}
              aria-pressed={isActive}
            >
              <span className="text-[10px] uppercase tracking-widest">
                {formatLabel(f.format)}
              </span>
              <span className="font-display text-base text-ink">{priceDisplay(f)}</span>
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={handleBuy}
        disabled={isPending || !current?.available}
        className="cta-primary mt-5 w-full"
      >
        {isPending ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : null}
        {isPending ? 'Routing to checkout' : cta.buy}
      </button>

      {error ? (
        <p role="alert" className="mt-3 text-xs text-accent-hot">
          {error}
        </p>
      ) : (
        <p className="mt-3 text-xs text-ink-mute">{tone.buyHelper}</p>
      )}
    </div>
  );
}
