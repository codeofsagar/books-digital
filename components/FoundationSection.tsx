'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChromeText } from './ChromeText';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const POINTS = [
  'Replace therapist-speak with operator-speak.',
  'Compress fifteen years of payroll lessons into 90-day programs.',
  'Bury guru positivity for good.',
  'Make discipline a reading rhythm, not an inspirational quote.',
  'Refuse to coddle.',
];

// Off-screen origins for the massive fly-in entrance. 
const ORIGINS: Record<string, { x: number; y: number; rot: number }> = {
  tl: { x: -100, y: -100, rot: -70 },
  t: { x: 0, y: -120, rot: 45 },
  tr: { x: 100, y: -100, rot: 75 },
  r: { x: 120, y: 0, rot: 50 },
  br: { x: 100, y: 100, rot: -65 },
  b: { x: 0, y: 120, rot: 35 },
  bl: { x: -100, y: 100, rot: 55 },
  l: { x: -120, y: 0, rot: -60 },
};

// HUGE sizes (44–56vh). To tilt a book, set `rot` to any angle in degrees —
// e.g. `rot: -12` leans left, `rot: 18` leans right, `rot: 0` is upright.
const DECK = [
  // Batch 0
  { src: '/b1.png', x: 12, y: 40, size: 130, rot: 95, from: 'tl', batch: 0, title: 'The Mind Reset Blueprint', titlePos: 'below' as const },
  { src: '/b2.png', x: 80, y: 58, size: 120, rot: 0, from: 'tr', batch: 0, title: 'The Elite Blueprint', titlePos: 'above' as const },


  // Batch 1
  { src: '/b5.png', x: 22, y: 42, size: 66, rot: 0, from: 't', batch: 1, title: 'The Unstoppable Blueprint', titlePos: 'below' as const },
  { src: '/b6.png', x: 86, y: 58, size: 90, rot: 340, from: 'r', batch: 1, title: 'The Authority Blueprint', titlePos: 'above' as const },


  // Batch 2
  { src: '/b3.png', x: 38, y: 22, size: 44, rot: 0, from: 't', batch: 2, title: 'The Edge Blueprint', titlePos: 'below' as const },
  { src: '/b4.png', x: 80, y: 52, size: 76, rot: 0, from: 'r', batch: 2, title: 'The Apex Blueprint', titlePos: 'above' as const },
  { src: '/b5.png', x: 10, y: 52, size: 90, rot: 0, from: 'l', batch: 2, title: 'The Operator Blueprint', titlePos: 'below' as const },
  
];

export function FoundationSection() {
  const root = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reduced) return;

      // Initial State: push cards off-screen at huge scale, kept upright.
      gsap.set('.foundation-card', {
        xPercent: -50,
        yPercent: -50,
        x: (i, el) => `${ORIGINS[el.dataset.from as string].x}vw`,
        y: (i, el) => `${ORIGINS[el.dataset.from as string].y}vh`,
        rotation: 0,
        scale: 2,
        opacity: 0,
      });

      gsap.set('.text-phase', { opacity: 0, y: 60 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: '+=400%',
          scrub: 1,
          pin: true,
          anticipatePin: 1,
        },
      });

      const totalPhases = 3;

      for (let i = 0; i < totalPhases; i++) {
        const phaseLabel = `phase${i}`;
        tl.add(phaseLabel);

        // A. If there is a PREVIOUS batch, fly it BACK OUT the same edge it
        // came from — mirror of the entrance. No zoom-out, no shrink.
        if (i > 0) {
          tl.to(`.batch-${i - 1}`, {
            x: (_, el) => `${ORIGINS[(el as HTMLElement).dataset.from as string].x}vw`,
            y: (_, el) => `${ORIGINS[(el as HTMLElement).dataset.from as string].y}vh`,
            rotation: (_, el) => ORIGINS[(el as HTMLElement).dataset.from as string].rot,
            scale: 2,
            opacity: 0,
            duration: 1.5,
            stagger: 0.08,
            ease: 'power3.in',
          }, phaseLabel);

          // Fade OUT the previous text lines
          tl.to(`.text-phase-${i - 1}`, {
            y: -60,
            opacity: 0,
            duration: 1,
            ease: 'power2.inOut'
          }, phaseLabel);
        }

        // B. Fly the CURRENT batch of images IN from the edges
        tl.to(`.batch-${i}`, {
          x: '0vw',
          y: '0vh',
          rotation: (index, target) => parseFloat(target.dataset.rot || '0'),
          scale: 1, // Lands at standard size (which is now huge via CSS)
          opacity: 1,
          duration: 1.5,
          stagger: 0.1,
          ease: 'power3.out',
        }, phaseLabel);

        // C. Fade IN the current text lines
        tl.to(`.text-phase-${i}`, {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: 'power3.out'
        }, phaseLabel + "+=0.2");

        // Pause buffer between scrolls
        tl.to({}, { duration: 1 });
      }

      // Ambient float on the inner wrapper — y-drift only, no rotation.
      gsap.utils.toArray<HTMLElement>('.foundation-card-inner').forEach((inner, i) => {
        gsap.to(inner, {
          y: i % 2 === 0 ? -12 : 12,
          repeat: -1,
          yoyo: true,
          duration: 4 + (i % 4),
          ease: 'sine.inOut',
        });
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className="relative h-screen w-full overflow-hidden text-white ">
      {/* Aurora backgrounds */}
     

      {/* The scattered book deck — upright, with title sticker on a random side */}
      {DECK.map((c, i) => (
        <div
          key={i}
          data-from={c.from}
          data-rot={c.rot}
          className={`foundation-card batch-${c.batch} pointer-events-none absolute z-10 will-change-transform`}
          style={{
            left: `${c.x}%`,
            top: `${c.y}%`,
            height: `${c.size}vh`,
            aspectRatio: '2 / 3',
            filter:
              'drop-shadow(0 28px 52px rgba(0, 0, 0, 0.8)) drop-shadow(0 0 36px rgba(217, 204, 140, 0.2))',
          }}
        >
          <div className="foundation-card-inner relative h-full w-full will-change-transform">
            <Image
              src={c.src}
              alt={c.title}
              fill
              sizes={`${c.size}vh`}
              className="object-contain"
              draggable={false}
              priority={i < 4}
            />

          </div>
        </div>
      ))}

      {/* Dim overlay to keep centre text readable */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[15]"

      />

      {/* Centered Text Overlay Area */}
      <div className="relative z-20 mx-auto flex h-full max-w-3xl flex-col items-center justify-center px-6 text-center">

        {/* PHASE 0 */}
        <div className="text-phase text-phase-0 absolute flex flex-col items-center justify-center w-full">
          <p className="metallic-text font-mono text-[16px] uppercase tracking-[0.4em] font-medium">
            The Foundation · §02
          </p>
          <div className="mt-4">
            <ChromeText text="One library. One operator." mobileText={'One library.\nOne operator.'} size={3.4} mobileSize={2.4} />
          </div>
          <ul className="mt-8 space-y-5 w-full max-w-2xl text-center">
            <li className="flex flex-col items-center gap-2">
              <span className="metallic-text font-mono text-[10px] uppercase tracking-[0.4em] shrink-0">01</span>
              <span className="metallic-text font-display font-light leading-[1.25] tracking-tight" style={{ fontSize: 'clamp(1.3rem, 2vw, 2.3rem)' }}>{POINTS[0]}</span>
            </li>
            <li className="flex flex-col items-center gap-2">
              <span className="metallic-text font-mono text-[10px] uppercase tracking-[0.4em] shrink-0">02</span>
              <span className="metallic-text font-display font-light leading-[1.25] tracking-tight" style={{ fontSize: 'clamp(1.5rem, 2vw, 2.3rem)' }}>{POINTS[1]}</span>
            </li>
          </ul>
        </div>

        {/* PHASE 1 */}
        <div className="text-phase text-phase-1 absolute flex flex-col items-center justify-center w-full">
          <ul className="space-y-5 w-full max-w-2xl text-center">
            <li className="flex flex-col items-center gap-2">
              <span className="metallic-text font-mono text-[10px] uppercase tracking-[0.4em] shrink-0">03</span>
              <span className="metallic-text font-display font-light leading-[1.25] tracking-tight" style={{ fontSize: 'clamp(1.3rem, 2vw, 2.8rem)' }}>{POINTS[2]}</span>
            </li>
            <li className="flex flex-col items-center gap-2">
              <span className="metallic-text font-mono text-[10px] uppercase tracking-[0.4em] shrink-0">04</span>
              <span className="metallic-text font-display font-light leading-[1.25] tracking-tight" style={{ fontSize: 'clamp(1.3rem, 2vw, 2.8rem)' }}>{POINTS[3]}</span>
            </li>
          </ul>
        </div>

        {/* PHASE 2 */}
        <div className="text-phase text-phase-2 absolute flex flex-col items-center justify-center w-full">
          <ul className="mb-6 w-full max-w-2xl text-center">
            <li className="flex flex-col items-center gap-2">
              <span className="metallic-text font-mono text-[10px] uppercase tracking-[0.4em] shrink-0">05</span>
              <span className="metallic-text font-display font-light leading-[1.2] tracking-tight" style={{ fontSize: 'clamp(1.8rem, 2.6vw, 2.8rem)' }}>{POINTS[4]}</span>
            </li>
          </ul>
          <p className="metallic-text mt-3 font-display font-light leading-[1.2]" style={{ fontSize: 'clamp(1.2rem, 1.8vw, 2.8rem)' }}>
            Clarity compounds. Reps compound. Reading compounds.
          </p>
          <div className="mt-6">
            <ChromeText text="Output becomes inevitable." mobileText={'Output becomes\ninevitable.'} size={2.4} mobileSize={1.8} as="p" />
          </div>
          <Link href="/books" className="cta-3d mt-8" data-cursor-label="Open">
            <span>See how it works</span>
          </Link>
        </div>

      </div>

      <style jsx>{`
        .foundation-bg {
          background:
            radial-gradient(60% 50% at 20% 30%, rgba(74, 92, 68, 0.45) 0%, transparent 65%),
            radial-gradient(50% 40% at 80% 70%, rgba(0, 20, 40, 0.7) 0%, transparent 65%),
            radial-gradient(40% 35% at 50% 90%, rgba(217, 204, 140, 0.12) 0%, transparent 65%),
            linear-gradient(180deg, #050505 0%, #0a0a0a 100%);
          background-size: 200% 200%, 200% 200%, 200% 200%, 100% 100%;
          animation: foundation-aurora 22s ease-in-out infinite alternate;
        }
        .foundation-bg-2 {
          background:
            radial-gradient(30% 25% at 70% 20%, rgba(217, 204, 140, 0.18) 0%, transparent 70%),
            radial-gradient(30% 25% at 30% 80%, rgba(255, 225, 208, 0.12) 0%, transparent 70%);
          background-size: 250% 250%, 250% 250%;
          animation: foundation-aurora-2 30s ease-in-out infinite alternate;
        }
        @keyframes foundation-aurora {
          0%   { background-position: 0% 0%, 100% 100%, 50% 50%, 0 0; }
          50%  { background-position: 50% 30%, 60% 70%, 30% 70%, 0 0; }
          100% { background-position: 100% 100%, 0% 0%, 70% 30%, 0 0; }
        }
        @keyframes foundation-aurora-2 {
          0%   { background-position: 0% 100%, 100% 0%; }
          100% { background-position: 100% 0%, 0% 100%; }
        }
      `}</style>
    </section>
  );
}