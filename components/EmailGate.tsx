'use client';

import { useState, useTransition } from 'react';
import { Loader2, Mail } from 'lucide-react';
import { tone } from '@/lib/voice';

interface EmailGateProps {
  bookSlug: string;
  bookTitle: string;
  utmSource?: string;
}

// Posts to backend /api/v1/lead-magnets/free-chapter. Backend handles Klaviyo
// subscription + sends chapter 1 PDF. Never store the email here.
export function EmailGate({ bookSlug, bookTitle, utmSource }: EmailGateProps) {
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError('Real email or nothing.');
      return;
    }
    setError(null);
    startTransition(async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/lead-magnets/free-chapter`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, bookSlug, utmSource: utmSource ?? 'organic' }),
          },
        );
        if (!res.ok) throw new Error(`free-chapter ${res.status}`);
        setDone(true);
      } catch (err) {
        setError('Email service is briefly down. Try again in 60 seconds.');
        console.error(err);
      }
    });
  }

  if (done) {
    return (
      <div className="border border-accent bg-bg-subtle p-6 text-sm">
        <p className="font-display text-2xl text-accent">Sent.</p>
        <p className="mt-2 text-ink-dim">
          Check inbox + promo tab. Chapter one of <span className="text-ink">{bookTitle}</span>{' '}
          arrives in under 90 seconds.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="border border-line bg-bg-subtle p-6">
      <p className="eyebrow mb-3">Free chapter — {bookTitle}</p>
      <label htmlFor="email" className="sr-only">
        Email
      </label>
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Mail
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-mute"
            aria-hidden
          />
          <input
            id="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@yourdomain.com"
            className="w-full border border-line bg-bg px-9 py-3 text-sm text-ink placeholder:text-ink-mute focus:border-accent focus:outline-none"
          />
        </div>
        <button type="submit" disabled={isPending} className="cta-primary">
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : null}
          {isPending ? 'Sending' : 'Send chapter one'}
        </button>
      </div>

      {error ? (
        <p role="alert" className="mt-3 text-xs text-accent-hot">
          {error}
        </p>
      ) : (
        <p className="mt-3 text-xs text-ink-mute">{tone.freeChapterHelper}</p>
      )}
    </form>
  );
}
