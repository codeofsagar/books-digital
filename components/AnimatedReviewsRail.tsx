'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

// Operator-grade dummy reviews — replaced by real review feed when backend
// ships data. Voice is intentionally R-rated, no therapist-speak.
const REVIEWS = [
  {
    quote: 'Brian doesn’t write self-help. He writes orders.',
    name: 'M. Alvarez',
    role: 'GM · Logistics',
    rating: 5,
  },
  {
    quote:
      'Sixteen years of payroll. You can taste it on every page. Not one chapter feels rented.',
    name: 'D. Kohler',
    role: 'Owner-operator',
    rating: 5,
  },
  {
    quote: 'I read chapter one. Burned my excuses. Day one of 90.',
    name: 'J. Reed',
    role: 'Founder · DTC',
    rating: 5,
  },
  {
    quote: 'First book that didn’t apologize for being hard. About time.',
    name: 'S. Patel',
    role: 'Founder · Apparel',
    rating: 5,
  },
  {
    quote: 'Operator-grade. Period. The library is the war manual we needed.',
    name: 'R. Vance',
    role: 'Field manager',
    rating: 5,
  },
  {
    quote:
      'Not therapist-speak. Not guru garbage. Just the work — written by a man who shipped payroll.',
    name: 'T. Mitchell',
    role: 'Plant supervisor',
    rating: 5,
  },
  {
    quote: 'Bought the pass. Cancelled my coach. No regrets.',
    name: 'A. Yusuf',
    role: 'CEO · Trades',
    rating: 5,
  },
  {
    quote: 'Best $99 I’ve spent on my mind in a decade.',
    name: 'L. Cho',
    role: 'Pro athlete',
    rating: 5,
  },
];

export function AnimatedReviewsRail() {
  const trackRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced || !trackRef.current) return;

    const track = trackRef.current;
    // Track contains 2 copies of the list; animate Y by -50% for a seamless loop.
    const tween = gsap.to(track, {
      yPercent: -50,
      duration: 38,
      ease: 'none',
      repeat: -1,
    });

    // Pause on hover for readability
    const pause = () => tween.pause();
    const resume = () => tween.play();
    track.addEventListener('pointerenter', pause);
    track.addEventListener('pointerleave', resume);

    return () => {
      tween.kill();
      track.removeEventListener('pointerenter', pause);
      track.removeEventListener('pointerleave', resume);
    };
  }, []);

  return (
    <div
      className="reviews-rail relative h-[520px] overflow-hidden"
      style={{
        maskImage:
          'linear-gradient(180deg, transparent 0%, #000 12%, #000 88%, transparent 100%)',
        WebkitMaskImage:
          'linear-gradient(180deg, transparent 0%, #000 12%, #000 88%, transparent 100%)',
      }}
    >
      <div ref={trackRef} className="flex flex-col gap-4 will-change-transform">
        {[...REVIEWS, ...REVIEWS].map((r, i) => (
          <ReviewCard key={i} {...r} delay={i * 0.05} />
        ))}
      </div>
    </div>
  );
}

function ReviewCard({
  quote,
  name,
  role,
  rating,
}: {
  quote: string;
  name: string;
  role: string;
  rating: number;
  delay?: number;
}) {
  return (
    <div
      className="group relative rounded-[1.5rem] border border-[rgba(217,204,140,0.18)] p-6 backdrop-blur-md transition-colors duration-300 hover:border-[rgba(217,204,140,0.5)]"
      style={{
        background:
          'linear-gradient(180deg, rgba(74, 92, 68, 0.18) 0%, rgba(0, 20, 40, 0.5) 100%)',
        boxShadow:
          'inset 0 1px 0 rgba(217, 204, 140, 0.12), 0 30px 60px -30px rgba(0, 0, 0, 0.6)',
      }}
    >
      <div className="flex items-center gap-1.5">
        {Array.from({ length: rating }).map((_, i) => (
          <span
            key={i}
            aria-hidden
            className="h-1.5 w-1.5 rotate-45 bg-[#D9CC8C]"
            style={{ boxShadow: '0 0 8px rgba(217, 204, 140, 0.6)' }}
          />
        ))}
      </div>
      <p
        className="mt-4 font-display italic font-light leading-[1.4] text-cream"
        style={{ fontSize: 'clamp(1rem, 1.15vw, 1.18rem)' }}
      >
        “{quote}”
      </p>
      <div className="mt-5 flex items-center gap-3">
        <span aria-hidden className="h-px w-6 bg-[rgba(217,204,140,0.5)]" />
        <span className="font-mono text-[10px] uppercase tracking-[0.35em] text-accent/80">
          {name} · {role}
        </span>
      </div>
    </div>
  );
}
