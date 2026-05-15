'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { ChromeText } from './ChromeText';

// Ported from apex-flow-labs `app/sections/Scale.tsx` — the climax section.
// All text now wears the metallic-text chrome gradient (same as the rest of
// the site) and lighter weights. No bold anywhere.

const LINES = [
  { value: '12',  label: 'series.' },
  { value: '53',  label: 'books per series.' },
  { value: '636', label: 'total titles.' },
  { value: '90',  label: 'chapters per book.' },
  { value: '01',  label: 'per day of the program.' },
  { value: '01',  label: 'library.' },
];

export function WholePitch() {
  const reduced = useReducedMotion();

  return (
    <section
      id="the-whole-pitch"
      className="relative z-10 overflow-hidden px-6 py-32 md:py-48"
    >
      {/* Theme glows */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-20 top-1/4 h-[420px] w-[420px] rounded-full opacity-25 blur-3xl"
        style={{ background: 'radial-gradient(circle, #4A5C44 0%, transparent 70%)' }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-20 bottom-1/4 h-[460px] w-[460px] rounded-full opacity-25 blur-3xl"
        style={{ background: 'radial-gradient(circle, #D9CC8C 0%, transparent 70%)' }}
      />

      <div className="relative z-10 mx-auto max-w-5xl text-center">
        <p className="metallic-text font-mono text-[11px] uppercase tracking-[0.4em] font-medium">
          §05 · The whole pitch
        </p>

        <ul className="mt-14 space-y-5">
          {LINES.map((line, i) => (
            <motion.li
              key={`${line.value}-${line.label}`}
              className="flex items-baseline justify-center gap-4"
              initial={reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={
                reduced
                  ? { duration: 0.001 }
                  : { duration: 0.8, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }
              }
            >
              <span
                className="metallic-text font-display font-light leading-none tracking-tight"
                style={{ fontSize: 'clamp(2rem, 4vw, 4rem)' }}
              >
                {line.value}
              </span>
              <span
                className="metallic-text font-display font-light italic leading-none tracking-tight"
                style={{ fontSize: 'clamp(1.4rem, 2.4vw, 2.4rem)' }}
              >
                {line.label}
              </span>
            </motion.li>
          ))}
        </ul>

        <motion.p
          className="metallic-text mt-10 font-display font-light italic"
          style={{ fontSize: 'clamp(1.1rem, 1.5vw, 1.5rem)' }}
          initial={reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={
            reduced
              ? { duration: 0.001 }
              : { duration: 0.9, delay: LINES.length * 0.07, ease: [0.22, 1, 0.36, 1] }
          }
        >
          One unified war-manual library.
        </motion.p>

        <div className="section-divider !my-20">
          <span />
        </div>

        <motion.p
          className="metallic-text font-display font-light leading-[1.2]"
          style={{ fontSize: 'clamp(1.4rem, 2.2vw, 2.2rem)' }}
          initial={reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          This is not a single book.
        </motion.p>

        <div className="mt-8">
          <ChromeText
            text="This is structured rebellion."
            mobileText={'This is structured\nrebellion.'}
            size={2.8}
            mobileSize={2.2}
            letterSpacing={0.07}
          />
        </div>
      </div>
    </section>
  );
}
