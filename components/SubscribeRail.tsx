import type { PodcastEpisodeDetail } from '@/lib/types';

// Master SOP §7.6 — 9-directory subscribe rail. Hidden directories that the
// backend doesn't return are just skipped.
const DIRECTORIES: Array<{
  key: keyof PodcastEpisodeDetail['subscribe_links'];
  label: string;
}> = [
  { key: 'apple', label: 'Apple Podcasts' },
  { key: 'spotify', label: 'Spotify' },
  { key: 'amazon', label: 'Amazon Music' },
  { key: 'youtube_music', label: 'YouTube Music' },
  { key: 'iheartradio', label: 'iHeartRadio' },
  { key: 'pandora', label: 'Pandora' },
  { key: 'stitcher', label: 'Stitcher' },
  { key: 'pocket_casts', label: 'Pocket Casts' },
  { key: 'overcast', label: 'Overcast' },
];

interface SubscribeRailProps {
  links: PodcastEpisodeDetail['subscribe_links'] | null;
}

export function SubscribeRail({ links }: SubscribeRailProps) {
  const live = links ?? {};
  const items = DIRECTORIES.filter((d) => live[d.key]);

  if (items.length === 0) {
    return (
      <div className="border border-line bg-bg-subtle p-6 text-sm text-ink-dim">
        Subscribe directories are syncing. Apple + Spotify land first.
      </div>
    );
  }

  return (
    <div>
      <p className="eyebrow mb-3">Subscribe</p>
      <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-9">
        {items.map((d) => (
          <li key={d.key}>
            <a
              href={live[d.key]!}
              target="_blank"
              rel="noopener noreferrer"
              className="block border border-line bg-bg px-3 py-3 text-center text-[11px] uppercase tracking-widest text-ink-dim transition-colors hover:border-accent hover:text-accent"
            >
              {d.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
