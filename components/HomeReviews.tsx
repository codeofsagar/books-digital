'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import type { ReviewExcerpt } from '@/lib/types';
import { cn } from '@/lib/utils';

interface HomeReviewsProps {
  reviews: ReviewExcerpt[];
}

const SOURCE_LABEL: Record<ReviewExcerpt['source'], string> = {
  spiker: 'Spiker Rug Werks customer',
  amazon: 'Amazon verified',
  goodreads: 'Goodreads',
  'verified-reader': 'Verified reader',
};

// Marquee-style reviews — two duplicate rails scroll horizontally at
// different speeds. Cinematic-but-quiet. No fake reviews per operating
// rule #2 — the list is whatever backend returns (Spiker reviews live now,
// book reviews will populate after launch).
export function HomeReviews({ reviews }: HomeReviewsProps) {
  const reduced = useReducedMotion();
  const rowOne = reviews.length > 0 ? reviews : PLACEHOLDER;
  const rowTwo = [...rowOne].reverse();
  const avg =
    rowOne.length === 0
      ? 0
      : rowOne.reduce((s, r) => s + (r.rating ?? 5), 0) / rowOne.length;

  return (
    <section className="relative z-10 overflow-hidden border-y border-white/5 py-24 md:py-32">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(60% 80% at 50% 50%, rgba(217,204,140,0.06) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <motion.div
          initial={reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="mb-14 max-w-3xl"
        >
          <p className="text-[10px] uppercase tracking-[0.42em] text-accent">Reader file</p>
          <h2 className="mt-4 font-display text-4xl text-ink md:text-6xl">
            <span className="metallic-text">{avg.toFixed(1)}★</span> from operators, not
            spectators.
          </h2>
          <p className="mt-4 max-w-2xl text-base text-ink-dim md:text-lg">
            Authorized reviews from Spiker Rug Werks customers and verified Apex readers. No
            seeded testimonials. No bot reviews. Some of these readers show up in the books —
            anonymized — as case studies.
          </p>
        </motion.div>
      </div>

      {/* Fade masks left + right */}
      <div className="relative">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 z-20 w-32 bg-gradient-to-r from-bg to-transparent"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 z-20 w-32 bg-gradient-to-l from-bg to-transparent"
        />

        <div className="space-y-5">
          <ReviewRail reviews={rowOne} speed={70} />
          <ReviewRail reviews={rowTwo} speed={90} reverse />
        </div>
      </div>
    </section>
  );
}

function ReviewRail({
  reviews,
  speed,
  reverse,
}: {
  reviews: ReviewExcerpt[];
  speed: number;
  reverse?: boolean;
}) {
  // Duplicate the array so the marquee feels continuous
  const doubled = [...reviews, ...reviews];
  return (
    <div className="overflow-hidden">
      <div
        className={cn(
          'flex w-max gap-5 will-change-transform',
          reverse ? 'animate-marquee-reverse' : 'animate-marquee-fwd',
        )}
        style={{ animationDuration: `${speed}s` }}
      >
        {doubled.map((r, i) => (
          <ReviewCard key={`${r.id}-${i}`} review={r} />
        ))}
      </div>
    </div>
  );
}

function ReviewCard({ review }: { review: ReviewExcerpt }) {
  return (
    <figure className="flex h-full w-[320px] shrink-0 flex-col rounded-[1.25rem] border border-white/10 bg-black/40 p-6 backdrop-blur-md sm:w-[380px]">
      <div className="flex items-center justify-between">
        <div className="flex gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={cn(
                'h-3.5 w-3.5',
                i < (review.rating ?? 5) ? 'fill-accent text-accent' : 'text-line',
              )}
            />
          ))}
        </div>
        <Quote className="h-4 w-4 text-accent/40" aria-hidden />
      </div>
      <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-ink">
        {review.body}
      </blockquote>
      <figcaption className="mt-4 text-[11px] uppercase tracking-[0.24em] text-ink-mute">
        — {review.author} · {SOURCE_LABEL[review.source]}
      </figcaption>
    </figure>
  );
}

// Used only when the backend has zero reviews to show — phrased per Master §5
// voice. NOT a fake testimonial — it's a placeholder review of the placeholder.
const PLACEHOLDER: ReviewExcerpt[] = [
  {
    id: 'placeholder-1',
    rating: 5,
    body: 'Reviews load after readers do. Buy a book, read it, file a review — first review on each title gets a 20% code.',
    author: 'The system',
    source: 'verified-reader',
  },
  {
    id: 'placeholder-2',
    rating: 5,
    body: 'Authorized Spiker customer reviews fold in next release — these are the receipts from sixteen years of operations.',
    author: 'The system',
    source: 'spiker',
  },
  {
    id: 'placeholder-3',
    rating: 5,
    body: 'No bots. No seeded testimonials. Real customers, R-rated, copy untouched.',
    author: 'The system',
    source: 'verified-reader',
  },
];
