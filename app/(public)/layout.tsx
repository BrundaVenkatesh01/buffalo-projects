import type { ReactNode } from "react";

import { BackgroundComposer } from "@/components/layout/backgrounds/BackgroundComposer";
import { Navigation } from "@/components/navigation/Navigation";

/**
 * Public Layout - Marketing and public-facing pages
 *
 * Provides unified dark theme treatment for all public pages:
 * - Landing page (/) - has its own gradient system, overrides background
 * - About, Support, CoC pages
 * - Public project pages (/p/[slug])
 *
 * Uses:
 * - Navigation: Unified dark-theme navigation
 * - BackgroundComposer: Subtle gradient background (pages can override)
 */
export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen bg-black text-white">
      {/* Default background - subtle for content pages, landing overrides */}
      <BackgroundComposer intensity="subtle" />

      {/* Unified dark-theme navigation */}
      <Navigation />

      {/* Main content - offset by nav height (64px) */}
      <main id="main-content" className="relative z-10 pt-16">
        {children}
      </main>
    </div>
  );
}
