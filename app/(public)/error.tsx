"use client";

import { ErrorState } from "@/components/status/ErrorState";

interface PublicErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function PublicError({ error, reset }: PublicErrorProps) {
  return (
    <ErrorState
      error={error}
      onRetry={reset}
      title="Public page failed to load"
      description="We couldn't fetch this public project experience right now. Please refresh or try again later."
    />
  );
}
