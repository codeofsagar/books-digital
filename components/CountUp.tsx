'use client';

import { useEffect, useRef, useState } from 'react';
import { useInView, useReducedMotion } from 'framer-motion';

interface CountUpProps {
  to: number;
  from?: number;
  duration?: number;
  className?: string;
  format?: (n: number) => string;
}

// Master §2.10 detail #9 — live counter. Tweens from 0 to N once it enters
// the viewport. Honors reduced motion (renders the final number immediately).
export function CountUp({
  to,
  from = 0,
  duration = 1.6,
  className,
  format,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const reduced = useReducedMotion();
  const [value, setValue] = useState(reduced ? to : from);

  useEffect(() => {
    if (reduced) {
      setValue(to);
      return;
    }
    if (!inView) return;
    const start = performance.now();
    let raf = 0;
    const eased = (t: number) => 1 - Math.pow(1 - t, 3); // ease-out cubic

    function tick(now: number) {
      const elapsed = (now - start) / 1000;
      const t = Math.min(1, elapsed / duration);
      const n = Math.round(from + (to - from) * eased(t));
      setValue(n);
      if (t < 1) raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduced, from, to, duration]);

  return (
    <span ref={ref} className={className} aria-label={String(to)}>
      {format ? format(value) : value.toLocaleString()}
    </span>
  );
}
