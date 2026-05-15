'use client';

import { usePathname } from 'next/navigation';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';

// Master §2.10 detail #2 — sliding metallic overlay between routes. The
// overlay swipes in then immediately swipes out as the new page mounts.
export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const reduced = useReducedMotion();
  const [overlayKey, setOverlayKey] = useState(pathname);

  useEffect(() => {
    setOverlayKey(pathname);
  }, [pathname]);

  if (reduced) return <>{children}</>;

  return (
    <>
      <AnimatePresence mode="wait">
        <motion.div
          key={`overlay-${overlayKey}`}
          initial={{ y: '-100%' }}
          animate={{ y: '-100%' }}
          exit={{ y: '0%' }}
          transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
          className="pointer-events-none fixed inset-0 z-[9000]"
          aria-hidden
        >
          <div className="metallic-curtain h-full w-full" />
        </motion.div>
      </AnimatePresence>

      <motion.div
        key={pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2, ease: 'linear' }}
      >
        {children}
      </motion.div>
    </>
  );
}
