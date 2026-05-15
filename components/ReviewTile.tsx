import { Quote } from 'lucide-react';
import type { ReviewExcerpt } from '@/lib/types';

interface ReviewTileProps {
  review: ReviewExcerpt;
  showSource?: boolean;
}

const SOURCE_LABEL: Record<ReviewExcerpt['source'], string> = {
  spiker: 'Spiker Rug Werks customer',
  amazon: 'Amazon verified',
  goodreads: 'Goodreads',
  'verified-reader': 'Verified reader',
};

export function ReviewTile({ review, showSource = true }: ReviewTileProps) {
  return (
    <figure className="flex h-full flex-col border border-line bg-bg-subtle p-6">
      <Quote className="h-5 w-5 text-accent" aria-hidden />
      <blockquote className="mt-3 flex-1 text-sm leading-relaxed text-ink">
        {review.body}
      </blockquote>
      <figcaption className="mt-4 text-xs text-ink-mute">
        — {review.author}
        {showSource ? <> · {SOURCE_LABEL[review.source]}</> : null}
        {review.rating ? <> · {'★'.repeat(Math.round(review.rating))}</> : null}
      </figcaption>
    </figure>
  );
}
