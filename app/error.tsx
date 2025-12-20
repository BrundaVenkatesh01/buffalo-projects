"use client";

import { useEffect } from "react";

import { ErrorState } from "@/components/status/ErrorState";
import { logger } from "@/utils/logger";

interface RootErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * Root Error Boundary for App Router
 *
 * Catches errors in the application and displays a user-friendly error page.
 * Automatically logs errors for debugging and monitoring.
 *
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/error
 */
export default function RootError({ error, reset }: RootErrorProps) {
  useEffect(() => {
    // Log error details for debugging and monitoring
    logger.error("Application error caught by error boundary:", {
      message: error.message,
      digest: error.digest,
      stack: error.stack,
      timestamp: new Date().toISOString(),
    });

    // Optional: Send to error tracking service (Sentry, PostHog, etc.)
    // This can be added when you set up error tracking
    // if (typeof window !== 'undefined' && window.Sentry) {
    //   window.Sentry.captureException(error, {
    //     tags: { boundary: 'root', digest: error.digest }
    //   });
    // }
  }, [error]);

  return (
    <ErrorState
      error={error}
      onRetry={() => {
        // Log retry attempt
        logger.info("User retrying after error", {
          errorMessage: error.message,
          digest: error.digest,
        });
        reset();
      }}
      title="We hit a snag"
      description="Buffalo Projects ran into an issue while loading. Let's try that again."
    />
  );
}
