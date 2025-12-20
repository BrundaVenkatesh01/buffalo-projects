"use client";

import { useEffect } from "react";

import { Button, Alert, AlertDescription } from "@/components/unified";
import { AlertCircle, RefreshCw, ArrowLeft } from "@/icons";

/**
 * Editor Error Boundary
 * Catches and displays errors in project editor with retry option
 */
export default function EditProjectError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to console for debugging
    console.error("Editor error:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-4">
      <div className="max-w-lg space-y-6 text-center">
        <Alert
          variant="destructive"
          className="border-red-500/30 bg-red-500/10 text-left"
        >
          <AlertCircle className="h-5 w-5" />
          <AlertDescription className="ml-2">
            <h3 className="mb-2 font-semibold">Failed to load editor</h3>
            <p className="text-sm text-red-400">
              {error.message ||
                "We couldn't load your project. The project might not exist or you may not have permission to access it."}
            </p>
            {error.digest && (
              <p className="mt-2 text-xs text-red-400/60">
                Error ID: {error.digest}
              </p>
            )}
          </AlertDescription>
        </Alert>

        <div className="flex justify-center gap-3">
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
    </div>
  );
}
