'use client';

import dynamic from 'next/dynamic';

// Client-only mount for the Three.js shader background. SSR disabled because
// the shader needs a WebGL context. Also short-circuits on reduced-motion
// preference (we render a plain CSS fallback instead — no canvas, no GPU).
const Background = dynamic(
  () => import('./background').then((m) => m.Background),
  {
    ssr: false,
    loading: () => <CssFallback />,
  },
);

export function BackgroundLoader() {
  if (typeof window !== 'undefined') {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return <CssFallback />;
  }
  return <Background />;
}

// CSS-only fallback for reduced motion + initial load. Same two-tone palette
// the shader emits: pure black + a single deep-forest pool. No GPU required.
function CssFallback() {
  return (
    <div
      aria-hidden
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: -10,
        pointerEvents: 'none',
        backgroundColor: '#000',
        background:
          'radial-gradient(75% 65% at 30% 55%, rgba(31,60,35,0.85) 0%, transparent 70%), radial-gradient(60% 60% at 75% 30%, rgba(31,60,35,0.55) 0%, transparent 70%), #000',
      }}
    />
  );
}
