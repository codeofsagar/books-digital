'use client';

import { useEffect, useRef } from 'react';

// Master §2.10 detail #12 — metallic foil burst on Stripe success. Pure
// canvas particles via GSAP-like tween loop. Honors reduced motion.
export function Confetti() {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    function resize() {
      if (!canvas) return;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx?.scale(dpr, dpr);
    }
    resize();
    window.addEventListener('resize', resize);

    const colors = ['#D9CC8C', '#FFE1D0', '#4A5C44', '#e7c46a', '#f5f5f5'];
    const N = 140;
    const particles = Array.from({ length: N }).map(() => spawn());

    function spawn() {
      const angle = (-Math.PI / 2) + (Math.random() - 0.5) * 0.8;
      const speed = 6 + Math.random() * 9;
      return {
        x: window.innerWidth / 2,
        y: window.innerHeight * 0.6,
        vx: Math.cos(angle) * speed + (Math.random() - 0.5) * 4,
        vy: Math.sin(angle) * speed,
        size: 4 + Math.random() * 6,
        rot: Math.random() * Math.PI * 2,
        vr: (Math.random() - 0.5) * 0.3,
        color: colors[Math.floor(Math.random() * colors.length)],
        life: 0,
        ttl: 110 + Math.random() * 60,
      };
    }

    let raf = 0;
    let done = false;
    function frame() {
      if (!ctx) return;
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      let alive = 0;
      for (const p of particles) {
        if (p.life > p.ttl) continue;
        alive += 1;
        p.vy += 0.22; // gravity
        p.vx *= 0.995;
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.vr;
        p.life += 1;
        const alpha = Math.max(0, 1 - p.life / p.ttl);
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.globalAlpha = alpha;
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        ctx.restore();
      }
      if (alive === 0) done = true;
      if (!done) raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      className="pointer-events-none fixed inset-0 z-[9500]"
      aria-hidden
    />
  );
}
