'use client';

import { cn } from '@/lib/utils';
import React, { type ReactNode } from 'react';

// Direct port of `app/background/background.tsx` (Aceternity AuroraBackground
// composition) repainted with the user-supplied palette:
//   #001428 (navy/black)  ·  #4A5C44 (forest green)
//   #D9CC8C (khaki gold)  ·  #FFE1D0 (cream)
//
// The dominant two tones are black + forest green per the brief; the khaki
// and cream live inside the aurora streaks as highlights. Same dual-gradient
// + mix-blend-difference technique as the original component.

interface AuroraBackgroundProps extends React.HTMLProps<HTMLDivElement> {
  children?: ReactNode;
  showRadialGradient?: boolean;
  className?: string;
}

export function GoldenSweep({
  className,
  children,
  showRadialGradient = true,
  ...props
}: AuroraBackgroundProps = {}) {
  return (
    <div
      aria-hidden
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: -10,
        pointerEvents: 'none',
        overflow: 'hidden',
        backgroundColor: '#000',
      }}
      {...props}
    >
      <div
        className={cn('absolute inset-0 overflow-hidden')}
        style={
          {
            '--aurora':
              'repeating-linear-gradient(100deg,#4A5C44_10%,#D9CC8C_15%,#FFE1D0_20%,#4A5C44_25%,#001428_30%)',
            '--dark-gradient':
              'repeating-linear-gradient(100deg,#000_0%,#000_7%,transparent_10%,transparent_12%,#000_16%)',
            '--white-gradient':
              'repeating-linear-gradient(100deg,#fff_0%,#fff_7%,transparent_10%,transparent_12%,#fff_16%)',

            '--forest': '#4A5C44',
            '--khaki': '#D9CC8C',
            '--cream': '#FFE1D0',
            '--navy': '#001428',
            '--black': '#000',
            '--transparent': 'transparent',
          } as React.CSSProperties
        }
      >
        <div
          className={cn(
            // The aurora layer — re-uses the original Aceternity recipe but
            // with our palette baked into both the CSS var and the inline
            // fallback so it works without Tailwind JIT picking up the var.
            `after:animate-aurora pointer-events-none absolute -inset-[10px] [background-image:var(--dark-gradient),var(--aurora)] [background-size:300%,_200%] [background-position:50%_50%,50%_50%] opacity-55 blur-[10px] will-change-transform after:absolute after:inset-0 after:[background-image:var(--dark-gradient),var(--aurora)] after:[background-size:200%,_100%] after:[background-attachment:fixed] after:mix-blend-difference after:content-[""]`,
            showRadialGradient &&
              `[mask-image:radial-gradient(ellipse_at_100%_0%,black_10%,var(--transparent)_70%)]`,
            className,
          )}
        />
      </div>

      {/* Subtle forest-green vignette so the green reads as the second base
          color even where the aurora bands are dim */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(70% 60% at 50% 30%, rgba(74,92,68,0.18) 0%, transparent 70%), radial-gradient(60% 80% at 0% 100%, rgba(74,92,68,0.12) 0%, transparent 70%), radial-gradient(50% 60% at 100% 100%, rgba(217,204,140,0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {children}
    </div>
  );
}
