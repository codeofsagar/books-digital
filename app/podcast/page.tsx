import Link from 'next/link';
import { PageShell } from '@/components/PageShell';
import { Hero } from '@/components/Hero';
import { AudioPlayer } from '@/components/AudioPlayer';
import { JsonLdSchema } from '@/components/JsonLdSchema';
import { getPageSeo, getPodcastFeed } from '@/lib/api';
import { buildMetadata, fallbackPageSchema } from '@/lib/seo';
import { formatDurationFromSeconds } from '@/lib/utils';
import { empty } from '@/lib/voice';

export const metadata = buildMetadata({
  title: 'Podcast — Apex Raw Motivation',
  description:
    '8-12 minute episodes. Brian walks through one book chapter at a time. Subscribe on Apple, Spotify, Amazon, YouTube Music, iHeart, Pandora, Stitcher, Pocket Casts, or Overcast.',
  path: '/podcast',
});

export const revalidate = 600;

const DIRECTORIES = [
  'Apple Podcasts',
  'Spotify',
  'Amazon Music',
  'YouTube Music',
  'iHeartRadio',
  'Pandora',
  'Stitcher',
  'Pocket Casts',
  'Overcast',
];

export default async function PodcastPage() {
  const [feed, seo] = await Promise.all([getPodcastFeed(50), getPageSeo('/podcast')]);
  const episodes = feed?.episodes ?? [];
  const featured = episodes[0];

  return (
    <PageShell>
      <JsonLdSchema bundle={seo} fallback={fallbackPageSchema('/podcast', 'Apex Raw Motivation Podcast')} />

      <Hero
        eyebrow="Podcast"
        title={
          <>
            8 to 12 minutes. <span className="metallic-text">One chapter at a time.</span>
          </>
        }
        body="Brian walks through one chapter per episode. No interviews. No sponsors. No filler — eight to twelve tight minutes you can run during a coffee."
      />

      {/* Subscribe rail */}
      <section className="border-y border-line bg-bg-subtle">
        <div className="container-x py-10">
          <p className="eyebrow mb-4">Subscribe on every directory</p>
          <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-9">
            {DIRECTORIES.map((d) => (
              <li
                key={d}
                className="border border-line bg-bg px-3 py-3 text-center text-[11px] uppercase tracking-widest text-ink-dim"
              >
                {d}
              </li>
            ))}
          </ul>
          <p className="mt-3 text-[11px] text-ink-mute">
            Direct links are unique per episode — open any episode to grab them.
          </p>
        </div>
      </section>

      {/* Featured episode */}
      {featured ? (
        <section className="container-x py-16">
          <p className="eyebrow mb-3">Latest episode</p>
          <h2 className="font-display text-3xl text-ink md:text-4xl">
            Ep {featured.episode_number}. {featured.title}
          </h2>
          <p className="mt-4 max-w-2xl text-ink-dim">{featured.summary}</p>

          <div className="mt-8">
            <AudioPlayer
              src={featured.audio_url}
              title={`Ep ${featured.episode_number} · ${featured.title}`}
              description={formatDurationFromSeconds(featured.duration_seconds)}
              variant="full"
            />
          </div>

          <Link
            href={`/podcast/${featured.slug}`}
            className="cta-secondary mt-6 inline-flex"
          >
            Open episode + transcript
          </Link>
        </section>
      ) : (
        <section className="container-x py-16">
          <p className="border border-line bg-bg-subtle p-8 text-sm text-ink-dim">
            {empty.podcastNone}
          </p>
        </section>
      )}

      {/* Full feed */}
      {episodes.length > 1 ? (
        <section className="border-t border-line">
          <div className="container-x py-16">
            <h2 className="mb-8 font-display text-2xl text-ink md:text-3xl">All episodes</h2>
            <ul className="divide-y divide-line border border-line bg-bg-subtle">
              {episodes.slice(1).map((e) => (
                <li key={e.slug}>
                  <Link
                    href={`/podcast/${e.slug}`}
                    className="flex flex-col gap-2 p-5 hover:bg-bg-raised transition-colors md:flex-row md:items-center md:justify-between"
                  >
                    <div className="min-w-0">
                      <p className="eyebrow text-ink-mute">
                        Ep {e.episode_number} · {formatDurationFromSeconds(e.duration_seconds)}
                      </p>
                      <p className="mt-1 truncate font-display text-lg text-ink">{e.title}</p>
                    </div>
                    <span className="shrink-0 text-xs uppercase tracking-widest text-accent">
                      Open →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}
    </PageShell>
  );
}
