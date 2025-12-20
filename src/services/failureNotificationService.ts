/**
 * Silent Failure Notification Service
 *
 * Centralized system for detecting and reporting silent failures
 * in background operations (autosave, publish, sync, etc.)
 *
 * Features:
 * - Toast notifications for user-facing errors
 * - Error logging for developer debugging
 * - Rate limiting to prevent notification spam
 * - Failure categorization (transient vs. permanent)
 * - Retry suggestions and recovery actions
 */

import { toast } from "sonner";

import { logger } from "@/utils/logger";

export type FailureCategory =
  | "autosave"
  | "publish"
  | "upload"
  | "delete"
  | "sync"
  | "comment"
  | "notification"
  | "analytics"
  | "ai"
  | "unknown";

export type FailureSeverity = "low" | "medium" | "high" | "critical";

export interface FailureContext {
  /** Operation that failed */
  operation: string;
  /** Category of failure */
  category: FailureCategory;
  /** User-facing message */
  message?: string;
  /** Additional context for debugging */
  metadata?: Record<string, unknown>;
  /** Is this a transient failure that might succeed on retry? */
  isTransient?: boolean;
  /** Suggested recovery action */
  recovery?: "retry" | "manual" | "ignore" | "reload";
}

interface FailureRecord {
  category: FailureCategory;
  count: number;
  lastSeen: number; // timestamp
}

class FailureNotificationService {
  private static instance: FailureNotificationService;

  // Track recent failures to prevent notification spam
  private failureHistory = new Map<string, FailureRecord>();

  // Rate limit: max 3 notifications per category per 5 minutes
  private readonly RATE_LIMIT_WINDOW = 5 * 60 * 1000; // 5 minutes
  private readonly RATE_LIMIT_MAX = 3;

  private constructor() {
    // Private constructor for singleton
  }

  static getInstance(): FailureNotificationService {
    if (!FailureNotificationService.instance) {
      FailureNotificationService.instance = new FailureNotificationService();
    }
    return FailureNotificationService.instance;
  }

  /**
   * Report a silent failure
   *
   * @param error - The error that occurred
   * @param context - Context about the failure
   */
  reportFailure(error: unknown, context: FailureContext): void {
    const err = error instanceof Error ? error : new Error(String(error));

    // Log to monitoring service
    logger.error(`Silent failure: ${context.operation}`, {
      error: err,
      category: context.category,
      operation: context.operation,
      metadata: context.metadata,
      isTransient: context.isTransient,
      recovery: context.recovery,
      timestamp: new Date().toISOString(),
    });

    // Determine severity
    const severity = this.determineSeverity(context);

    // Check rate limit
    if (!this.shouldNotify(context.category)) {
      logger.warn(
        `Rate limit exceeded for ${context.category} failures - suppressing notification`,
      );
      return;
    }

    // Show user-facing notification
    this.showNotification(err, context, severity);

    // Track failure
    this.recordFailure(context.category);
  }

  /**
   * Report a transient failure with retry information
   */
  reportTransientFailure(
    error: unknown,
    context: FailureContext,
    retryCount: number,
    maxRetries: number,
  ): void {
    const err = error instanceof Error ? error : new Error(String(error));

    logger.warn(
      `Transient failure: ${context.operation} (retry ${retryCount}/${maxRetries})`,
      {
        error: err,
        category: context.category,
        retryCount,
        maxRetries,
        metadata: context.metadata,
      },
    );

    // Only notify user if we're approaching max retries
    if (retryCount >= maxRetries - 1) {
      const backoffSeconds = Math.ceil(
        Math.min(1000 * Math.pow(2, retryCount), 10000) / 1000,
      );

      toast.warning(
        context.message ||
          `${context.operation} failed. Retrying in ${backoffSeconds}s... (${retryCount}/${maxRetries})`,
        {
          id: `retry-${context.category}`,
          duration: backoffSeconds * 1000,
        },
      );
    }
  }

  /**
   * Report a permanent failure (max retries exceeded)
   */
  reportPermanentFailure(error: unknown, context: FailureContext): void {
    const err = error instanceof Error ? error : new Error(String(error));

    logger.error(`Permanent failure: ${context.operation}`, {
      error: err,
      category: context.category,
      operation: context.operation,
      metadata: context.metadata,
    });

    if (!this.shouldNotify(context.category)) {
      return;
    }

    const message = this.getRecoveryMessage(context);

    toast.error(message, {
      id: `failed-${context.category}`,
      duration: 10000, // Longer duration for permanent failures
      action:
        context.recovery === "retry"
          ? {
              label: "Retry",
              onClick: () => {
                // Emit custom event for retry
                window.dispatchEvent(
                  new CustomEvent(`retry-${context.category}`, {
                    detail: context,
                  }),
                );
              },
            }
          : context.recovery === "reload"
            ? {
                label: "Reload",
                onClick: () => window.location.reload(),
              }
            : undefined,
    });

    this.recordFailure(context.category);
  }

  /**
   * Report a successful recovery from failure
   */
  reportRecovery(category: FailureCategory, operation: string): void {
    logger.info(`Recovered from failure: ${operation}`, { category });

    // Clear failure history for this category
    this.failureHistory.delete(category);

    // Show success toast
    toast.success(`${operation} completed successfully`, {
      id: `recovered-${category}`,
      duration: 3000,
    });
  }

  /**
   * Clear failure history (useful for testing or manual reset)
   */
  clearHistory(): void {
    this.failureHistory.clear();
  }

  /**
   * Get failure statistics for monitoring
   */
  getStatistics(): Array<{
    category: FailureCategory;
    count: number;
    lastSeen: Date;
  }> {
    return Array.from(this.failureHistory.entries()).map(
      ([category, record]) => ({
        category: category as FailureCategory,
        count: record.count,
        lastSeen: new Date(record.lastSeen),
      }),
    );
  }

  // Private methods

  private determineSeverity(context: FailureContext): FailureSeverity {
    // Critical: Data loss risk
    if (context.category === "autosave" || context.category === "delete") {
      return "critical";
    }

    // High: User-initiated operations
    if (context.category === "publish" || context.category === "upload") {
      return "high";
    }

    // Medium: Background operations
    if (context.category === "sync" || context.category === "notification") {
      return "medium";
    }

    // Low: Non-essential features
    return "low";
  }

  private shouldNotify(category: FailureCategory): boolean {
    const record = this.failureHistory.get(category);

    if (!record) {
      return true; // First failure, always notify
    }

    const timeSinceLastFailure = Date.now() - record.lastSeen;

    // Reset counter if outside rate limit window
    if (timeSinceLastFailure > this.RATE_LIMIT_WINDOW) {
      this.failureHistory.delete(category);
      return true;
    }

    // Check if under rate limit
    return record.count < this.RATE_LIMIT_MAX;
  }

  private recordFailure(category: FailureCategory): void {
    const existing = this.failureHistory.get(category);

    if (existing) {
      existing.count++;
      existing.lastSeen = Date.now();
    } else {
      this.failureHistory.set(category, {
        category,
        count: 1,
        lastSeen: Date.now(),
      });
    }
  }

  private showNotification(
    error: Error,
    context: FailureContext,
    severity: FailureSeverity,
  ): void {
    const message =
      context.message || `${context.operation} failed: ${error.message}`;

    const duration =
      severity === "critical" ? 10000 : severity === "high" ? 7000 : 5000;

    if (severity === "critical" || severity === "high") {
      toast.error(message, {
        id: `error-${context.category}`,
        duration,
        description: this.getErrorDescription(context),
      });
    } else {
      toast.warning(message, {
        id: `warning-${context.category}`,
        duration,
      });
    }
  }

  private getErrorDescription(context: FailureContext): string | undefined {
    if (context.isTransient) {
      return "We'll keep trying automatically.";
    }

    if (context.recovery === "reload") {
      return "Try refreshing the page.";
    }

    if (context.recovery === "manual") {
      return "Please try again manually.";
    }

    return undefined;
  }

  private getRecoveryMessage(context: FailureContext): string {
    const baseMessage =
      context.message || `Unable to complete ${context.operation}. `;

    switch (context.category) {
      case "autosave":
        return (
          baseMessage +
          "Your work is stored locally and will sync when connection is restored."
        );

      case "publish":
        return (
          baseMessage +
          "Your workspace is still private. Please try publishing again."
        );

      case "upload":
        return baseMessage + "The file was not uploaded. Please try again.";

      case "delete":
        return (
          baseMessage +
          "The item was not deleted. Please try again or refresh the page."
        );

      case "sync":
        return (
          baseMessage +
          "Some changes may not be synced. Your local copy is safe."
        );

      case "comment":
        return baseMessage + "Your comment was not posted. Please try again.";

      case "notification":
        return (
          baseMessage +
          "You may have missed some notifications. Check your notification center."
        );

      case "ai":
        return (
          baseMessage +
          "AI assistance is temporarily unavailable. Try again later."
        );

      default:
        return (
          baseMessage + "Please try again or contact support if this persists."
        );
    }
  }
}

// Export singleton instance
export const failureNotificationService =
  FailureNotificationService.getInstance();
