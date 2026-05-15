'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

// "Across the ecosystem" — eleven sister Apex Flow Labs storefronts plus
// Spiker Rug Werks (the operating company that funded the whole thing).
// Patterned on apex-flow-labs `components/home/TileGridShowcase.tsx`
// (the 9-system tile-cylinder) — flattened into a static grid with
// hover-tilt + tinted color washes for a cinematic-but-quiet feel.

type Company = {
  num: string;
  label: string;
  tagline: string;
  blurb: string;
  href: string;
  accent: string;
  accentSoft: string;
  external?: boolean;
  category?: string;
};

const COMPANIES: Company[] = [
  {
    num: '01',
    label: 'Apex Publishing',
    tagline: 'You are here.',
    blurb: '636 books across 12 series. The flagship of the ecosystem and the longest-lived asset.',
    href: '/',
    accent: '#D9CC8C',
    accentSoft: 'rgba(217,204,140,0.18)',
    category: 'Books',
  },
  {
    num: '02',
    label: 'Apex Academy',
    tagline: 'Learn it. Ship it.',
    blurb: 'Thousands of focused courses. Information into capability, with assignments operators actually run.',
    href: 'https://www.apexflowlabs.com/academy',
    accent: '#D9CC8C',
    accentSoft: 'rgba(217,204,140,0.16)',
    external: true,
    category: 'Courses',
  },
  {
    num: '03',
    label: 'Companion AI',
    tagline: 'Talk to the system.',
    blurb: 'Streaming AI assistant trained on every Apex book + course. Multi-persona, memory-aware.',
    href: 'https://www.apexflowlabs.com/companion-ai',
    accent: '#D9CC8C',
    accentSoft: 'rgba(217,204,140,0.14)',
    external: true,
    category: 'AI',
  },
  {
    num: '04',
    label: 'Warfare AI',
    tagline: 'Control your numbers.',
    blurb: 'Financial + business command system for operators. The boring kind of dashboard that actually changes behavior.',
    href: 'https://www.apexflowlabs.com/warfare-ai',
    accent: '#D9CC8C',
    accentSoft: 'rgba(217,204,140,0.12)',
    external: true,
    category: 'AI',
  },
  {
    num: '05',
    label: 'Digital Art',
    tagline: 'Print-ready, instant.',
    blurb: '300-DPI digital wall art, posters, sticker sheets, wallpapers. New drops weekly.',
    href: 'https://www.apexflowlabs.com/digital-art',
    accent: '#D9CC8C',
    accentSoft: 'rgba(217,204,140,0.16)',
    external: true,
    category: 'Shop',
  },
  {
    num: '06',
    label: 'Beauty',
    tagline: 'Six categories of authority.',
    blurb: 'Skincare cluster spine. Ninety pillar clusters, every product anchored in ingredient science.',
    href: 'https://www.apexflowlabs.com/beauty',
    accent: '#D9CC8C',
    accentSoft: 'rgba(217,204,140,0.14)',
    external: true,
    category: 'Shop',
  },
  {
    num: '07',
    label: 'Health',
    tagline: 'Engineered fuel.',
    blurb: 'Sleep, supplements, recovery — research-anchored. The protocol your operator-self actually needs.',
    href: 'https://www.apexflowlabs.com/health',
    accent: '#D9CC8C',
    accentSoft: 'rgba(217,204,140,0.14)',
    external: true,
    category: 'Shop',
  },
  {
    num: '08',
    label: 'Pets',
    tagline: '600+ families.',
    blurb: 'AI-rendered art for the dogs you love. Every breed × every style × every theme.',
    href: 'https://www.apexflowlabs.com/shop/art/dogs',
    accent: '#D9CC8C',
    accentSoft: 'rgba(217,204,140,0.14)',
    external: true,
    category: 'Shop',
  },
  {
    num: '09',
    label: 'Apex Gear',
    tagline: 'Never accidental.',
    blurb: 'Apparel, accessories, daily-carry. One design becomes fifty-six SKUs via the asset multiplier.',
    href: 'https://www.apexflowlabs.com/gear',
    accent: '#D9CC8C',
    accentSoft: 'rgba(217,204,140,0.16)',
    external: true,
    category: 'Apparel',
  },
  {
    num: '10',
    label: 'Tools',
    tagline: 'Routes to revenue.',
    blurb: 'Calculators, generators, planners. Free. Every tool sends a visitor into a product or guide.',
    href: 'https://www.apexflowlabs.com/tools',
    accent: '#D9CC8C',
    accentSoft: 'rgba(217,204,140,0.14)',
    external: true,
    category: 'Free',
  },
  {
    num: '11',
    label: 'Templates',
    tagline: 'The vault.',
    blurb: 'Notion templates, system blueprints, operator-grade downloads. Refreshed weekly inside the vault.',
    href: 'https://www.apexflowlabs.com/templates',
    accent: '#D9CC8C',
    accentSoft: 'rgba(217,204,140,0.16)',
    external: true,
    category: 'Digital',
  },
  {
    num: '12',
    label: 'Spiker Rug Werks',
    tagline: 'The original.',
    blurb: "Brian's rug-cleaning company since 2010. The 16 years of operations that back-test every Apex book.",
    href: 'https://spikerrugworks.com',
    accent: '#D9CC8C',
    accentSoft: 'rgba(217,204,140,0.18)',
    external: true,
    category: 'Operations',
  },
];

export function AcrossEcosystem() {
  const reduced = useReducedMotion();

  return (
    <section className="relative z-10 overflow-hidden px-6 py-32 md:py-40">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(50% 80% at 0% 0%, rgba(217,204,140,0.10) 0%, transparent 60%), radial-gradient(50% 80% at 100% 100%, rgba(217,204,140,0.06) 0%, transparent 60%)',
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl">
        <motion.div
          initial={reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="mb-16 flex flex-wrap items-end justify-between gap-6"
        >
          <div>
            <p className="text-[10px] uppercase tracking-[0.42em] text-accent">
              Across the ecosystem
            </p>
            <h2 className="mt-4 max-w-3xl font-display text-4xl text-ink md:text-6xl">
              Eleven more Apex Flow Labs companies.{' '}
              <span className="metallic-text">Plus Spiker.</span>
            </h2>
            <p className="mt-4 max-w-xl text-base text-ink-dim md:text-lg">
              Books is one of twelve doors into the same ecosystem. Each one is its own
              storefront — same operator, same voice, different battlefield. And underneath all
              of it: Brian's rug company, the operation that back-tests every page.
            </p>
          </div>
          <span className="rounded-full border border-line bg-bg/40 px-4 py-2 text-[10px] uppercase tracking-[0.28em] text-ink-dim backdrop-blur-md">
            12 / 12 · One operator
          </span>
        </motion.div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {COMPANIES.map((c, i) => (
            <motion.a
              key={c.num}
              href={c.href}
              target={c.external ? '_blank' : undefined}
              rel={c.external ? 'noopener noreferrer' : undefined}
              data-cursor-label={c.external ? 'Visit →' : 'You are here'}
              initial={reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{
                duration: 0.7,
                delay: reduced ? 0 : i * 0.04,
                ease: [0.22, 1, 0.36, 1],
              }}
              whileHover={reduced ? undefined : { y: -6 }}
              className="group relative flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-white/10 bg-black/40 p-6 backdrop-blur-md transition-colors duration-500 hover:border-white/30"
              style={{
                ['--accent' as string]: c.accent,
                ['--accent-soft' as string]: c.accentSoft,
              }}
            >
              {/* Color wash */}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-30 transition-opacity duration-700 group-hover:opacity-70"
                style={{
                  background: `radial-gradient(60% 70% at 30% 0%, var(--accent-soft) 0%, transparent 70%)`,
                }}
              />
              {/* Diagonal shimmer on hover */}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-1000 group-hover:translate-x-full"
              />

              <div className="relative z-10 flex items-start justify-between">
                <span
                  className="font-display text-5xl font-light leading-none"
                  style={{ color: c.accent, fontVariantNumeric: 'tabular-nums' }}
                >
                  {c.num}
                </span>
                {c.category ? (
                  <span
                    className="rounded-full border px-3 py-1 text-[10px] uppercase tracking-[0.24em]"
                    style={{
                      borderColor: c.accent,
                      color: c.accent,
                    }}
                  >
                    {c.category}
                  </span>
                ) : null}
              </div>

              <div className="relative z-10 mt-8">
                <h3 className="font-display text-2xl text-ink">{c.label}</h3>
                <p className="mt-2 italic text-ink-dim">{c.tagline}</p>
              </div>

              <p className="relative z-10 mt-5 flex-1 text-sm leading-relaxed text-ink-dim">
                {c.blurb}
              </p>

              <div className="relative z-10 mt-6 flex items-center gap-2 text-[11px] uppercase tracking-[0.28em] text-ink-dim transition-colors group-hover:text-accent">
                <span>{c.external ? 'Visit' : 'You are here'}</span>
                <ArrowUpRight
                  className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  aria-hidden
                />
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
