import type { ReactNode } from "react";

import ErrorBoundary from "@/components/ErrorBoundary";

/**
 * Studio Layout - Authenticated workspace routes
 * Wraps all studio features with error boundary for graceful error handling
 */
export default function StudioLayout({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <div className="text-center max-w-md">
            <h1 className="text-2xl font-bold mb-4">Studio Error</h1>
            <p className="text-muted-foreground mb-6">
              Something went wrong in the studio. Your work is safe. Please
              refresh to continue.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg transition-colors"
            >
              Refresh Studio
            </button>
          </div>
        </div>
      }
    >
      {children}
    </ErrorBoundary>
  );
}
