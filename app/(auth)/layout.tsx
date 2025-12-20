import type { ReactNode } from "react";

import ErrorBoundary from "@/components/ErrorBoundary";

/**
 * Auth Layout - Authentication routes (signin, signup, join)
 * Wraps auth features with error boundary to ensure users can still access auth flows
 */
export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <div className="text-center max-w-md">
            <h1 className="text-2xl font-bold mb-4">Authentication Error</h1>
            <p className="text-muted-foreground mb-6">
              Something went wrong with authentication. Please try again.
            </p>
            <a
              href="/"
              className="inline-block px-6 py-3 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg transition-colors"
            >
              Return Home
            </a>
          </div>
        </div>
      }
    >
      {children}
    </ErrorBoundary>
  );
}
