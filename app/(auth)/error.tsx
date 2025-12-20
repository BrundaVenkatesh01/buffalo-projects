"use client";

import { ErrorState } from "@/components/status/ErrorState";

interface AuthErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function AuthError({ error, reset }: AuthErrorProps) {
  return (
    <ErrorState
      error={error}
      onRetry={reset}
      title="Sign-in service unavailable"
      description="Authentication hit a snag. Please refresh and try again."
    />
  );
}
