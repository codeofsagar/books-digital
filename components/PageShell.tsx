import { Nav } from './Nav';
import { Footer } from './Footer';
import { AuthorityFooter } from './AuthorityFooter';
import { cn } from '@/lib/utils';

interface PageShellProps {
  children: React.ReactNode;
  className?: string;
  // When provided, sets the --series-color CSS var so accent buttons and
  // hover states tint to the active series (Master §2.10 detail #6).
  seriesColor?: string;
}

// Transparent shell — the global AuroraBackground lives at z-index -10 and
// must bleed through every section. PageShell deliberately omits any solid
// bg so the aurora is visible everywhere.
export function PageShell({ children, className, seriesColor }: PageShellProps) {
  return (
    <div
      className={cn('flex min-h-screen flex-col', className)}
      style={seriesColor ? ({ '--series-color': seriesColor } as React.CSSProperties) : undefined}
    >
      <Nav />
      <main className="flex-1">{children}</main>
      <AuthorityFooter />
      <Footer />
    </div>
  );
}
