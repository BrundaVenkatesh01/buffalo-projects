"use client";

import type { ReactNode } from "react";

import ErrorBoundary from "@/components/ErrorBoundary";
import { BackgroundComposer } from "@/components/layout/backgrounds/BackgroundComposer";
import { Navigation } from "@/components/navigation/Navigation";

/**
 * App Layout - Authenticated routes with unified dark theme
 *
 * Provides:
 * - Navigation: Unified dark-theme navigation
 * - BackgroundComposer: Medium intensity gradient background
 * - Error boundary for graceful error handling
 * - Main content wrapper with proper accessibility
 *
 * Routes covered:
 * - /dashboard (main hub)
 * - /dashboard/discover (community gallery)
 * - /dashboard/activity, /dashboard/settings
 * - /edit/[code] (project editor - has own internal layout)
 */
export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary
      fallback={
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
          <div className="text-center max-w-md">
            <h1 className="text-2xl font-bold text-white mb-4">
              Something went wrong
            </h1>
            <p className="text-neutral-400 mb-6">
              An error occurred. Your work is safe. Please refresh to continue.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-white text-black hover:bg-neutral-200 rounded-lg transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      }
    >
      <div className="relative min-h-screen bg-black text-white">
        {/* Medium intensity background for dashboard pages */}
        <BackgroundComposer intensity="medium" />

        {/* Unified dark-theme navigation */}
        <Navigation />

        {/* Main content - offset by nav height (64px) */}
        <main
          id="main-content"
          className="relative z-10 pt-16 min-h-[calc(100vh-4rem)]"
        >
          {children}
        </main>
      </div>
    </ErrorBoundary>
  );
}
