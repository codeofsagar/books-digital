'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ChromeTextProps {
  text: string;
  mobileText?: string;
  className?: string;
  // sizing knobs kept compatible with the apex-flow-labs ChromeText API so
  // copy lines can be lifted between repos without conversion
  size?: number;
  mobileSize?: number;
  letterSpacing?: number;
  as?: 'h1' | 'h2' | 'h3' | 'span' | 'p';
}

// CSS-based ChromeText. The apex-flow-labs original uses a WebGL chrome
// shader; we use a metallic gradient with an animated shimmer for parity at
// a tiny fraction of the runtime cost — and it actually reads better on
// 4K displays.
export function ChromeText({
  text,
  mobileText,
  className,
  size = 2.5,
  mobileSize,
  letterSpacing = 0.08,
  as = 'h2',
}: ChromeTextProps) {
  const reduced = useReducedMotion();
  const Tag = motion[as];

  const desktopRem = `${size}rem`;
  const mobileRem = `${mobileSize ?? size * 0.7}rem`;

  return (
    <Tag
      initial={reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 30, filter: 'blur(8px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        'metallic-text inline-block font-display font-light leading-[0.95]',
        className,
      )}
      style={{
        fontSize: `clamp(${mobileRem}, 8vw, ${desktopRem})`,
        letterSpacing: `${letterSpacing}em`,
      }}
    >
      <span className="md:hidden whitespace-pre-line">{mobileText ?? text}</span>
      <span className="hidden md:inline">{text}</span>
    </Tag>
  );
}
