'use client';

import { motion, useReducedMotion, type Variants } from 'framer-motion';
import type { ReactNode } from 'react';

interface RevealProps {
  children: ReactNode;
  delay?: number;
  y?: number;
  amount?: number; // viewport intersect ratio
  once?: boolean;
  className?: string;
  as?: 'div' | 'section' | 'span' | 'li' | 'article';
}

const variants = (y: number): Variants => ({
  hidden: { opacity: 0, y },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
});

// Scroll-reveal wrapper. Drop-in around any content block to get a
// silky fade-up on viewport entry. Disabled when reduced-motion is set.
export function Reveal({
  children,
  delay = 0,
  y = 24,
  amount = 0.2,
  once = true,
  className,
  as = 'div',
}: RevealProps) {
  const reduced = useReducedMotion();
  const MotionTag = motion[as];

  if (reduced) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount }}
      transition={{ delay }}
      variants={variants(y)}
    >
      {children}
    </MotionTag>
  );
}

// Staggered child wrapper — use for grids where each child should reveal
// in sequence after the parent enters the viewport.
export function RevealStagger({
  children,
  stagger = 0.07,
  amount = 0.15,
  className,
}: {
  children: ReactNode;
  stagger?: number;
  amount?: number;
  className?: string;
}) {
  const reduced = useReducedMotion();
  if (reduced) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: stagger } },
      }}
    >
      {children}
    </motion.div>
  );
}

export function RevealItem({
  children,
  y = 24,
  className,
}: {
  children: ReactNode;
  y?: number;
  className?: string;
}) {
  const reduced = useReducedMotion();
  if (reduced) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y },
        show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
      }}
    >
      {children}
    </motion.div>
  );
}
