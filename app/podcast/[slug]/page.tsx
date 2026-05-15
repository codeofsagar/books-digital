import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BookOpen } from 'lucide-react';
import { PageShell } from '@/components/PageShell';
import { AudioPlayer } from '@/components/AudioPlayer';
import { SubscribeRail } from '@/components/SubscribeRail';
import { JsonLdSchema } from '@/components/JsonLdSchema';
import { getPageSeo, getPodcastEpisode } from '@/lib/api';
import { buildMetadata, fallbackPageSchema } from '@/lib/seo';
import { formatDurationFromSeconds } from '@/lib/utils';

interface PodcastRouteProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PodcastRouteProps) {
  const { slug } = await params;
  const ep = await getPodcastEpisode(slug);
  if (!ep) return buildMetadata({ title: 'Episode', path: `/podcast/${slug}` });
  return buildMetadata({
    title: `Ep ${ep.episode_number} · ${ep.title}`,
    description: ep.summary.slice(0, 180),
    path: `/podcast/${ep.slug}`,
    type: 'article',
  });
}

export const revalidate = 3600;

export default async function PodcastEpisodePage({ params }: PodcastRouteProps) {
  const { slug } = await params;
  const [ep, seo] = await Promise.all([
    getPodcastEpisode(slug),
    getPageSeo(`/podcast/${slug}`),
  ]);

  if (!ep) notFound();

  return (
    <PageShell>
      <JsonLdSchema bundle={seo} fallback={fallbackPageSchema(`/podcast/${slug}`, ep.title)} />

      <nav aria-label="Breadcrumb" className="container-x pt-8">
        <ol className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-widest text-ink-mute">
          <li>
            <Link href="/podcast" className="hover:text-ink">
              Podcast
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li className="text-ink">Ep {ep.episode_number}</li>
        </ol>
      </nav>

      <section className="container-x py-10 md:py-16">
        <p className="eyebrow mb-4">
          Episode {ep.episode_number} · {formatDurationFromSeconds(ep.duration_seconds)}
        </p>
        <h1 className="font-display text-4xl leading-[1.05] text-ink md:text-5xl">
          {ep.title}
        </h1>
        <p className="mt-6 max-w-2xl text-ink-dim md:text-lg">{ep.summary}</p>

        <div className="mt-8">
          <AudioPlayer
            src={ep.audio_url}
            title={`Ep ${ep.episode_number} · ${ep.title}`}
            description={formatDurationFromSeconds(ep.duration_seconds)}
            variant="full"
          />
        </div>
      </section>

      {/* Chapters */}
      {ep.chapters && ep.chapters.length > 0 ? (
        <section className="border-t border-line bg-bg-subtle">
          <div className="container-x py-12">
            <p className="eyebrow mb-4">Chapter splits</p>
            <ol className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {ep.chapters.map((c, i) => (
                <li
                  key={i}
                  className="flex items-center justify-between border border-line bg-bg px-4 py-3"
                >
                  <span className="text-sm text-ink">{c.title}</span>
                  <span className="font-mono text-xs text-ink-mute">
                    {formatDurationFromSeconds(c.start_seconds)}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </section>
      ) : null}

      {/* Related book */}
      {ep.related_book ? (
        <section className="border-t border-line">
          <div className="container-x py-12">
            <Link
              href={`/books/${ep.related_book.slug}`}
              className="flex items-center gap-4 border border-line bg-bg-subtle p-5 transition-colors hover:border-accent"
            >
              <BookOpen className="h-6 w-6 text-accent" aria-hidden />
              <div className="flex-1">
                <p className="eyebrow">Read the full book</p>
                <p className="font-display text-xl text-ink">{ep.related_book.title}</p>
                <p className="text-sm text-ink-dim">{ep.related_book.series_name}</p>
              </div>
              <span className="text-xs uppercase tracking-widest text-accent">Open →</span>
            </Link>
          </div>
        </section>
      ) : null}

      {/* Transcript */}
      {ep.transcript ? (
        <section className="border-t border-line bg-bg-subtle">
          <div className="container-x py-12">
            <details className="group [&_summary::-webkit-details-marker]:hidden" open>
              <summary className="flex cursor-pointer items-center justify-between gap-4">
                <span className="font-display text-2xl text-ink">Transcript</span>
                <span className="text-accent transition-transform group-open:rotate-45" aria-hidden>
                  +
                </span>
              </summary>
              <div className="prose prose-invert mt-6 max-w-none text-base leading-relaxed text-ink-dim">
                {ep.transcript.split(/\n\n+/).map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </details>
          </div>
        </section>
      ) : null}

      {/* Subscribe */}
      <section className="border-t border-line">
        <div className="container-x py-12">
          <SubscribeRail links={ep.subscribe_links} />
        </div>
      </section>
    </PageShell>
  );
}
