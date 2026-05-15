'use client';

import { useEffect, useRef, useState } from 'react';
import { Play, Pause, Volume2 } from 'lucide-react';
import { cn, formatDurationFromSeconds } from '@/lib/utils';

interface AudioPlayerProps {
  src: string;
  title: string;
  description?: string;
  variant?: 'sample' | 'full';
  className?: string;
}

export function AudioPlayer({ src, title, description, variant = 'sample', className }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    const onTime = () => setPosition(el.currentTime);
    const onMeta = () => setDuration(el.duration || 0);
    const onEnd = () => setPlaying(false);
    el.addEventListener('timeupdate', onTime);
    el.addEventListener('loadedmetadata', onMeta);
    el.addEventListener('ended', onEnd);
    return () => {
      el.removeEventListener('timeupdate', onTime);
      el.removeEventListener('loadedmetadata', onMeta);
      el.removeEventListener('ended', onEnd);
    };
  }, []);

  function toggle() {
    const el = audioRef.current;
    if (!el) return;
    if (playing) {
      el.pause();
      setPlaying(false);
    } else {
      void el.play();
      setPlaying(true);
    }
  }

  function seek(e: React.ChangeEvent<HTMLInputElement>) {
    const el = audioRef.current;
    if (!el) return;
    const next = (Number(e.target.value) / 100) * duration;
    el.currentTime = next;
    setPosition(next);
  }

  const progress = duration > 0 ? (position / duration) * 100 : 0;

  return (
    <div
      className={cn(
        'flex items-center gap-4 border border-line bg-bg-subtle p-4',
        variant === 'full' && 'bg-bg-raised',
        className,
      )}
      role="region"
      aria-label={title}
    >
      <audio ref={audioRef} src={src} preload="metadata" />

      <button
        type="button"
        onClick={toggle}
        className="flex h-12 w-12 shrink-0 items-center justify-center border border-accent text-accent transition-colors hover:bg-accent hover:text-bg"
        aria-label={playing ? 'Pause' : 'Play'}
      >
        {playing ? <Pause className="h-5 w-5" aria-hidden /> : <Play className="h-5 w-5" aria-hidden />}
      </button>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm text-ink">{title}</p>
        {description ? <p className="truncate text-xs text-ink-dim">{description}</p> : null}

        <div className="mt-2 flex items-center gap-3">
          <input
            type="range"
            min={0}
            max={100}
            step={0.1}
            value={progress}
            onChange={seek}
            aria-label="Seek"
            className="h-1 w-full appearance-none bg-line accent-accent"
          />
          <span className="font-mono text-[11px] text-ink-mute">
            {formatDurationFromSeconds(position)} / {formatDurationFromSeconds(duration)}
          </span>
        </div>
      </div>

      <Volume2 className="hidden h-4 w-4 shrink-0 text-ink-mute md:block" aria-hidden />
    </div>
  );
}
