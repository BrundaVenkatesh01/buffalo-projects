"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui-next";
import { AlertTriangle, RotateCcw } from "@/icons";
import { logger } from "@/utils/logger";

interface ErrorStateProps {
  error?: Error & { digest?: string };
  onRetry?: () => void;
  title?: string;
  description?: string;
}

export function ErrorState({
  error,
  onRetry,
  title = "Something went wrong",
  description = "We couldn't load this experience. Please try again in a moment.",
}: ErrorStateProps) {
  useEffect(() => {
    if (error) {
      logger.error("Route error boundary captured error", error);
    }
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-4 text-center text-muted-foreground">
      <div className="flex h-12 w-12 items-center justify-center rounded-full border border-red-500/30 bg-red-500/10 text-red-400">
        <AlertTriangle className="h-5 w-5" aria-hidden />
      </div>
      <div className="space-y-2">
        <h2 className="text-lg font-semibold text-foreground">{title}</h2>
        <p className="max-w-md text-sm text-muted-foreground">{description}</p>
        {error?.digest ? (
          <p className="text-xs text-muted-foreground/70">
            Error reference: {error.digest}
          </p>
        ) : null}
      </div>
      {onRetry ? (
        <Button
          onClick={() => {
            onRetry();
          }}
          className="rounded-full px-4 text-xs uppercase tracking-[0.24em]"
        >
          <RotateCcw className="mr-2 h-4 w-4" aria-hidden />
          Try again
        </Button>
      ) : null}
    </div>
  );
}
