"use client";

import { useEffect } from "react";

import { Button, Alert, AlertDescription } from "@/components/unified";
import { AlertCircle, RefreshCw, ArrowLeft } from "@/icons";

/**
 * Discover Error Boundary
 * Catches and displays errors in gallery with retry option
 */
export default function DiscoverError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to console for debugging
    console.error("Discover page error:", error);
  }, [error]);

  return (
    <div className="container mx-auto flex min-h-[60vh] flex-col items-center justify-center px-4">
      <Alert
        variant="destructive"
        className="mb-6 max-w-lg border-red-500/30 bg-red-500/10"
      >
        <AlertCircle className="h-5 w-5" />
        <AlertDescription className="ml-2">
          <h3 className="mb-2 font-semibold">Failed to load projects</h3>
          <p className="text-sm text-red-400">
            {error.message ||
              "We couldn't load the project gallery. Please try again."}
          </p>
          {error.digest && (
            <p className="mt-2 text-xs text-red-400/60">
              Error ID: {error.digest}
            </p>
          )}
        </AlertDescription>
      </Alert>

      <div className="flex gap-3">
        <Button onClick={reset} variant="secondary" className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Try Again
        </Button>
        <Button
          variant="ghost"
          onClick={() => (window.location.href = "/dashboard")}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Button>
      </div>
    </div>
  );
}
