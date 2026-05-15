import Link from 'next/link';
import type { BookSummary } from '@/lib/types';
import { Cover } from './Cover';
import { intensityGlyphs, priceDisplay, sortFormats, waveLabel } from '@/lib/utils';

interface BookCardProps {
  book: BookSummary;
  priority?: boolean;
}

export function BookCard({ book, priority }: BookCardProps) {
  const formats = sortFormats(book.formats);
  const ebook = formats.find((f) => f.format === 'ebook');

  return (
    <Link
      href={`/books/${book.slug}`}
      className="group block"
      data-cursor-label="Open"
      style={
        book.series_color
          ? ({ '--series-color': book.series_color } as React.CSSProperties)
          : undefined
      }
    >
      <div className="relative">
        <Cover
          r2Key={book.cover_r2_key}
          alt={book.cover_alt ?? `${book.title} — book cover`}
          priority={priority}
          tilt
          className="border border-[rgba(217,204,140,0.18)] transition-all duration-500 group-hover:border-series group-hover:shadow-[0_30px_60px_-20px_rgba(217,204,140,0.4)]"
        />
        <span
          aria-hidden
          className="pointer-events-none absolute -inset-4 -z-10 rounded-2xl opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background: `radial-gradient(50% 60% at 50% 50%, ${
              book.series_color ?? '#D9CC8C'
            }44 0%, transparent 70%)`,
          }}
        />
        <span
          aria-hidden
          className="pointer-events-none absolute left-3 top-3 z-10 rounded-full border border-[rgba(217,204,140,0.35)] bg-black/60 px-2.5 py-1 backdrop-blur-sm"
        >
          <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-accent/80">
            {waveLabel(book.wave)}
          </span>
        </span>
      </div>

      <div className="mt-5 space-y-1.5">
        <div className="flex items-center gap-2">
          <span aria-hidden className="h-px w-6 bg-series/50" />
          <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-accent/70">
            {book.series_name}
          </p>
        </div>
        <h3 className="font-display text-[1.25rem] leading-[1.15] text-ink transition-colors duration-300 group-hover:text-series">
          {book.title}
        </h3>
        <div className="flex items-center justify-between pt-2 text-xs">
          <span aria-label="Voice intensity" title="Voice intensity" className="text-accent/70 tracking-widest">
            {intensityGlyphs(book.voice_intensity)}
          </span>
          <span className="font-mono text-cream font-medium">{priceDisplay(ebook)}</span>
        </div>
      </div>
    </Link>
  );
}
