"use client";

import { m } from "framer-motion";
import React, { Component, type ReactNode } from "react";

import { Button } from "@/components/ui-next";
import { AlertTriangle, ArrowLeft, Home, RotateCcw } from "@/icons";
import { logger } from "@/utils/logger";

interface ProjectErrorBoundaryProps {
  children: ReactNode;
  fallbackTitle?: string;
  fallbackDescription?: string;
  onRetry?: () => void;
}

interface ProjectErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * ProjectErrorBoundary
 *
 * Buffalo-styled error boundary for public project pages.
 * Provides graceful error handling with branded styling and recovery options.
 *
 * Features:
 * - Animated error state with framer-motion
 * - Multiple recovery actions (retry, back, home)
 * - Branded Buffalo styling with amber warning colors
 * - Error logging with digest tracking
 */
export class ProjectErrorBoundary extends Component<
  ProjectErrorBoundaryProps,
  ProjectErrorBoundaryState
> {
  constructor(props: ProjectErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ProjectErrorBoundaryState {
    return { hasError: true, error };
  }

  override componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    logger.error("ProjectErrorBoundary caught error", {
      error,
      errorInfo,
      componentStack: errorInfo.componentStack,
    });
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
    this.props.onRetry?.();
    window.location.reload();
  };

  handleBack = () => {
    window.history.back();
  };

  handleHome = () => {
    window.location.href = "/";
  };

  override render() {
    if (this.state.hasError) {
      const title = this.props.fallbackTitle || "Unable to load project";
      const description =
        this.props.fallbackDescription ||
        "This project page encountered an error. You can try reloading, go back, or return home.";

      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-background px-6 py-12 text-center">
          <m.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
            className="flex flex-col items-center gap-8"
          >
            {/* Icon */}
            <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-amber-500/30 bg-amber-500/10">
              <AlertTriangle className="h-10 w-10 text-amber-400" />
            </div>

            {/* Content */}
            <div className="space-y-4">
              <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                {title}
              </h1>
              <p className="max-w-md text-base text-muted-foreground">
                {description}
              </p>
              {this.state.error && (
                <details className="mt-4 max-w-md rounded-xl border border-white/10 bg-white/5 p-4 text-left">
                  <summary className="cursor-pointer text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground hover:text-foreground">
                    Technical Details
                  </summary>
                  <p className="mt-3 font-mono text-xs text-red-400">
                    {this.state.error.message}
                  </p>
                </details>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Button
                onClick={this.handleRetry}
                className="rounded-full px-6 text-xs uppercase tracking-[0.24em]"
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Reload page
              </Button>
              <Button
                onClick={this.handleBack}
                variant="outline"
                className="rounded-full border-white/20 px-6 text-xs uppercase tracking-[0.24em] hover:border-white/40"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Go back
              </Button>
              <Button
                onClick={this.handleHome}
                variant="ghost"
                className="rounded-full px-6 text-xs uppercase tracking-[0.24em] text-muted-foreground hover:text-foreground"
              >
                <Home className="mr-2 h-4 w-4" />
                Home
              </Button>
            </div>
          </m.div>

          {/* Footer note */}
          <p className="mt-8 max-w-lg text-xs text-muted-foreground/70">
            If this problem persists, please contact support or try again later.
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}
