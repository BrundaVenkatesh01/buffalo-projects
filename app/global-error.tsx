"use client";

import { useEffect } from "react";

import { ErrorState } from "@/components/status/ErrorState";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * Global Error Boundary for App Router
 *
 * Catches errors that occur in the root layout or aren't caught by other error boundaries.
 * Must include full HTML structure as it replaces the entire page.
 *
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/error#global-errorjs
 */
export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    // Log critical global errors
    console.error("CRITICAL: Global error boundary triggered:", {
      message: error.message,
      digest: error.digest,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      userAgent:
        typeof navigator !== "undefined" ? navigator.userAgent : "unknown",
    });

    // Send to error tracking service with high priority
    // if (typeof window !== 'undefined' && window.Sentry) {
    //   window.Sentry.captureException(error, {
    //     level: 'fatal',
    //     tags: { boundary: 'global', digest: error.digest }
    //   });
    // }
  }, [error]);

  return (
    <html lang="en" className="bg-background">
      <body>
        <ErrorState
          error={error}
          onRetry={() => {
            console.warn("User retrying after global error", {
              errorMessage: error.message,
              digest: error.digest,
            });
            reset();
          }}
          title="Something went wrong"
          description="Buffalo Projects ran into an unexpected issue. Let's try that again."
        />
      </body>
    </html>
  );
}
