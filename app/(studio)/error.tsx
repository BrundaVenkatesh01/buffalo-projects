"use client";

import { ErrorState } from "@/components/status/ErrorState";

interface StudioErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function StudioError({ error, reset }: StudioErrorProps) {
  return (
    <ErrorState
      error={error}
      onRetry={reset}
      title="Workspace failed to load"
      description="We couldn't load your studio workspace. Refresh to continue building."
    />
  );
}
