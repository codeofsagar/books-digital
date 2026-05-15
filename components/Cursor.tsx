'use client';

import { useEffect, useRef, useState } from 'react';

// Custom cursor — minimal. A tiny white dot at the pointer, a thin lagging
// ring, and a small offset "Click" pill that appears diagonally away from
// the cursor on hover. Crucially: the cursor never grows into a giant disc
// that hides the element's text — the pill is offset so the underlying
// label stays readable. mix-blend-mode: difference keeps the dot visible
// against any backdrop. Hidden on touch + reduced-motion.

const PILL_OFFSET = { x: 22, y: 22 };

export function Cursor() {
  const dotRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);
  const pillRef = useRef<HTMLDivElement | null>(null);
  const [enabled, setEnabled] = useState(false);
  const [label, setLabel] = useState<string | null>(null);
  const [pillVisible, setPillVisible] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isTouch || reduced) return;
    setEnabled(true);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const dot = dotRef.current;
    const ring = ringRef.current;
    const pill = pillRef.current;
    if (!dot || !ring || !pill) return;
    const dotEl = dot;
    const ringEl = ring;
    const pillEl = pill;

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let rx = mx;
    let ry = my;
    let px = mx + PILL_OFFSET.x;
    let py = my + PILL_OFFSET.y;
    let raf = 0;

    function onMove(e: PointerEvent) {
      mx = e.clientX;
      my = e.clientY;
      dotEl.style.transform = `translate3d(${mx}px, ${my}px, 0) translate(-50%, -50%)`;
    }
    function loop() {
      rx += (mx - rx) * 0.2;
      ry += (my - ry) * 0.2;
      ringEl.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%)`;
      // pill lags further behind, offset diagonally
      px += (mx + PILL_OFFSET.x - px) * 0.18;
      py += (my + PILL_OFFSET.y - py) * 0.18;
      pillEl.style.transform = `translate3d(${px}px, ${py}px, 0)`;
      raf = requestAnimationFrame(loop);
    }
    function onOver(e: MouseEvent) {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const hover = target.closest<HTMLElement>(
        'a, button, [role="button"], input, select, textarea, [data-magnetic]',
      );
      if (hover) {
        const customLabel = hover.getAttribute('data-cursor-label');
        const fallback = labelFor(hover);
        setLabel(customLabel || fallback);
        setPillVisible(true);
        ringEl.classList.add('cursor-ring-hover');
      } else {
        setLabel(null);
        setPillVisible(false);
        ringEl.classList.remove('cursor-ring-hover');
      }
    }
    function onDown() {
      ringEl.classList.add('cursor-down');
    }
    function onUp() {
      ringEl.classList.remove('cursor-down');
    }

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('mouseover', onOver);
    window.addEventListener('pointerdown', onDown);
    window.addEventListener('pointerup', onUp);
    raf = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('mouseover', onOver);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
      cancelAnimationFrame(raf);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      {/* Cursor layers sit ABOVE the modal (z-10000). Order back-to-front:
          ring (10101) → pill (10102) → dot (10103). */}
      <div
        ref={ringRef}
        className="cursor-ring pointer-events-none fixed left-0 top-0 z-[10101] flex h-8 w-8 items-center justify-center rounded-full border border-white/40 will-change-transform transition-[width,height,border-color,opacity] duration-300 ease-out"
        aria-hidden
      />
      <div
        ref={pillRef}
        className={`pointer-events-none fixed left-0 top-0 z-[10102] inline-flex items-center justify-center whitespace-nowrap rounded-full bg-white px-4 py-1.5 text-[11px] font-semibold uppercase leading-none tracking-[0.12em] text-black shadow-lg will-change-transform transition-opacity duration-200 ${
          pillVisible && label ? 'opacity-100' : 'opacity-0'
        }`}
        aria-hidden
      >
        {label ?? 'Click'}
      </div>
      <div
        ref={dotRef}
        className="pointer-events-none fixed left-0 top-0 z-[10103] h-1.5 w-1.5 rounded-full bg-white mix-blend-difference will-change-transform"
        aria-hidden
      />
    </>
  );
}

// Quick heuristic for a per-element label when `data-cursor-label` isn't set
function labelFor(el: HTMLElement): string {
  const tag = el.tagName.toLowerCase();
  if (tag === 'a') return 'Open';
  if (tag === 'button') {
    const t = el.textContent?.trim() ?? '';
    if (/buy|order|checkout/i.test(t)) return 'Buy';
    if (/apply/i.test(t)) return 'Apply';
    if (/send|subscribe|submit/i.test(t)) return 'Send';
    return 'Click';
  }
  if (tag === 'input' || tag === 'textarea') return 'Type';
  return 'Click';
}
