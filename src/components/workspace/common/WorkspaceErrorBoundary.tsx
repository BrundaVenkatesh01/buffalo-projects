"use client";

import { Component, type ReactNode } from "react";
import type React from "react";
import { toast } from "sonner";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui-next";
import { AlertTriangle, Home, RefreshCcw, Save } from "@/icons";
import { logger } from "@/utils/logger";

interface WorkspaceErrorBoundaryProps {
  children: ReactNode;
  workspaceId?: string;
  onSaveAttempt?: () => Promise<void>;
  onReset?: () => void;
}

interface WorkspaceErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: string | null;
  errorType: "render" | "data" | "network" | "unknown";
  attemptedRecovery: boolean;
}

/**
 * Error Boundary specifically for Workspace components
 *
 * Catches errors in:
 * - BusinessModelCanvas rendering
 * - Document management
 * - Version history
 * - Journal entries
 * - Pivot timeline
 *
 * Provides recovery options:
 * - Retry rendering
 * - Save current state
 * - Return to workspace list
 * - Clear error and continue
 */
export class WorkspaceErrorBoundary extends Component<
  WorkspaceErrorBoundaryProps,
  WorkspaceErrorBoundaryState
> {
  constructor(props: WorkspaceErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorType: "unknown",
      attemptedRecovery: false,
    };
  }

  static getDerivedStateFromError(
    error: Error,
  ): Partial<WorkspaceErrorBoundaryState> {
    // Classify error type for better recovery strategy
    const errorType = WorkspaceErrorBoundary.classifyError(error);

    return {
      hasError: true,
      error,
      errorType,
    };
  }

  /**
   * Classify error to provide appropriate recovery actions
   */
  private static classifyError(
    error: Error,
  ): WorkspaceErrorBoundaryState["errorType"] {
    const message = error.message.toLowerCase();
    const stack = error.stack?.toLowerCase() || "";

    // Network errors (Firebase, API calls)
    if (
      message.includes("network") ||
      message.includes("fetch") ||
      message.includes("firebase") ||
      message.includes("quota") ||
      stack.includes("firestore")
    ) {
      return "network";
    }

    // Data validation errors
    if (
      message.includes("undefined") ||
      message.includes("null") ||
      message.includes("cannot read") ||
      message.includes("is not a function") ||
      message.includes("is not defined")
    ) {
      return "data";
    }

    // Rendering errors
    if (
      message.includes("render") ||
      message.includes("hook") ||
      stack.includes("react")
    ) {
      return "render";
    }

    return "unknown";
  }

  override componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    const { workspaceId } = this.props;
    const { errorType } = this.state;

    // Log to console in development
    console.error("WorkspaceErrorBoundary caught error:", error, errorInfo);

    // Log to monitoring service (Sentry, LogRocket, etc.)
    logger.error("Workspace component error", {
      error,
      errorInfo: errorInfo.componentStack,
      workspaceId,
      errorType,
      timestamp: new Date().toISOString(),
    });

    this.setState({
      errorInfo: errorInfo.componentStack || null,
    });

    // Attempt automatic recovery for certain error types
    if (!this.state.attemptedRecovery && errorType === "data") {
      // For data errors, try to clear and reload
      this.attemptAutomaticRecovery();
    }
  }

  /**
   * Attempt automatic recovery for recoverable errors
   */
  private attemptAutomaticRecovery = () => {
    const { onReset } = this.props;

    this.setState({ attemptedRecovery: true }, () => {
      // Wait a brief moment before attempting recovery
      setTimeout(() => {
        if (onReset) {
          onReset();
        }
        this.handleRetry();
      }, 100);
    });
  };

  /**
   * Handle retry action - reset error state and re-render
   */
  private handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      attemptedRecovery: false,
    });
  };

  /**
   * Handle save attempt - try to save workspace data before navigating away
   */
  private handleSaveAttempt = async () => {
    const { onSaveAttempt } = this.props;

    if (!onSaveAttempt) {
      return;
    }

    try {
      await onSaveAttempt();
      // If save succeeds, show success message and navigate
      window.location.href = "/workspace";
    } catch (saveError) {
      console.error("Failed to save workspace:", saveError);
      // Show non-blocking error and navigate to safety
      toast.error("Failed to save changes. Navigating back to Workspace.");
      window.location.href = "/workspace";
    }
  };

  /**
   * Handle navigation to safe location (workspace list)
   */
  private handleNavigateToSafety = () => {
    window.location.href = "/workspace";
  };

  override render() {
    const { hasError, error, errorInfo, errorType, attemptedRecovery } =
      this.state;
    const { children, workspaceId, onSaveAttempt } = this.props;

    if (!hasError) {
      return children;
    }

    // Error fallback UI
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-6 px-4 py-12">
        <div className="w-full max-w-2xl space-y-6">
          {/* Error Icon and Title */}
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-red-500/30 bg-red-500/10">
              <AlertTriangle
                className="h-8 w-8 text-red-500"
                aria-hidden="true"
              />
            </div>

            <div className="space-y-2">
              <h1 className="font-display text-3xl font-bold text-foreground">
                Workspace Error
              </h1>
              <p className="text-base text-muted-foreground">
                {errorType === "network" &&
                  "We're having trouble connecting to the server. Your changes may not be saved."}
                {errorType === "data" &&
                  "There's an issue with your workspace data. We'll try to recover it."}
                {errorType === "render" &&
                  "Something went wrong while displaying your workspace."}
                {errorType === "unknown" &&
                  "An unexpected error occurred in your workspace."}
              </p>
            </div>
          </div>

          {/* Error Details (Development Only) */}
          {process.env.NODE_ENV === "development" && error && (
            <Alert variant="destructive" className="text-left">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle className="font-mono text-sm">
                {error.name}: {error.message}
              </AlertTitle>
              {errorInfo && (
                <AlertDescription className="mt-2 max-h-40 overflow-auto font-mono text-xs">
                  <details>
                    <summary className="cursor-pointer hover:underline">
                      Stack trace
                    </summary>
                    <pre className="mt-2 whitespace-pre-wrap">{errorInfo}</pre>
                  </details>
                </AlertDescription>
              )}
            </Alert>
          )}

          {/* Workspace Info */}
          {workspaceId && (
            <Alert>
              <AlertDescription className="text-sm">
                <strong>Workspace:</strong> {workspaceId}
                <br />
                {attemptedRecovery && (
                  <span className="text-yellow-600">
                    Automatic recovery attempted. Please try again or save your
                    work.
                  </span>
                )}
              </AlertDescription>
            </Alert>
          )}

          {/* Recovery Actions */}
          <div className="flex flex-col gap-3">
            {/* Primary action: Retry */}
            <Button
              onClick={this.handleRetry}
              size="lg"
              className="flex w-full items-center gap-2"
            >
              <RefreshCcw className="h-4 w-4 shrink-0" />
              <span className="whitespace-nowrap">Try Again</span>
            </Button>

            {/* Secondary actions */}
            <div className="grid gap-3 sm:grid-cols-2">
              {/* Save and exit (if save handler provided) */}
              {onSaveAttempt && (
                <Button
                  onClick={() => {
                    void this.handleSaveAttempt();
                  }}
                  variant="outline"
                  size="lg"
                  className="flex items-center gap-2"
                >
                  <Save className="h-4 w-4 shrink-0" />
                  <span className="whitespace-nowrap">Save &amp; Exit</span>
                </Button>
              )}

              {/* Navigate to safety */}
              <Button
                onClick={this.handleNavigateToSafety}
                variant="outline"
                size="lg"
                className="flex items-center gap-2"
              >
                <Home className="h-4 w-4 shrink-0" />
                <span className="whitespace-nowrap">Back to Workspace</span>
              </Button>
            </div>
          </div>

          {/* Help Text */}
          <div className="rounded-lg border border-white/10 bg-white/5 p-4 text-center text-sm text-muted-foreground">
            <p>
              If this error persists, try refreshing the page or{" "}
              <a
                href="/support"
                className="text-primary underline-offset-4 hover:underline"
              >
                contact support
              </a>
              .
            </p>
            {errorType === "network" && (
              <p className="mt-2">
                Check your internet connection and try again.
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }
}
