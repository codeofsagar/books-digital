import Image from 'next/image';
import badge from '../public/badge-collection1.png';

// Press / "as seen on" credibility strip. Sits right under the hero so it's
// the first trust signal new visitors hit before any scroll commitment.
export function TrustBar() {
  return (
    <section className="relative z-10 px-6 py-10 sm:py-14 lg:py-16">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            'radial-gradient(60% 100% at 50% 50%, rgba(217, 204, 140, 0.06) 0%, transparent 70%)',
        }}
      />

      <div className="relative mx-auto flex w-full max-w-5xl flex-col items-center gap-6 text-center">
        <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-accent/80">
          The work got noticed
        </p>

        <div
          className="relative w-full max-w-[420px]"
          style={{
            filter:
              'drop-shadow(0 18px 36px rgba(0, 0, 0, 0.55)) drop-shadow(0 0 32px rgba(217, 204, 140, 0.18))',
          }}
        >
          <Image
            src={badge}
            alt="As seen on CBS, NBC, ABC — over 250 news outlets"
            sizes="(min-width: 640px) 420px, 80vw"
            className="h-auto w-full"
            priority={false}
          />
        </div>

        <p
          className="max-w-xl font-display italic font-extralight leading-[1.5] text-ink-dim"
          style={{ fontSize: 'clamp(0.95rem, 1.2vw, 1.15rem)' }}
        >
          The carpet business kept getting picked up by local press. Eventually the books
          did too. We didn&apos;t pay for any of it.
        </p>
      </div>
    </section>
  );
}
