/**
 * Production-safe logger utility with enhanced error tracking
 * Ensures errors are never silently dropped
 */

import { isDevelopment } from "./env";

const isDev = isDevelopment();

// Type for the monitoring reporter function
type ErrorReporter = (error: {
  message: string;
  stack?: string;
  metadata?: Record<string, unknown>;
  timestamp: string;
  environment: "development" | "production";
}) => void | Promise<void>;

// Configurable error reporter - can be set by the application
let errorReporter: ErrorReporter | null = null;

/**
 * Configure the error reporter for production monitoring
 * @param reporter Function to handle error reporting (e.g., Sentry, LogRocket, etc.)
 */
export function setErrorReporter(reporter: ErrorReporter) {
  errorReporter = reporter;
}

/**
 * Format error details from various input types
 */
function formatErrorDetails(args: unknown[]): {
  message: string;
  stack?: string;
  metadata?: Record<string, unknown>;
} {
  const details: {
    message: string;
    stack?: string;
    metadata?: Record<string, unknown>;
  } = { message: "" };

  // Process each argument
  const messageParts: string[] = [];
  const metadata: Record<string, unknown> = {};

  for (const arg of args) {
    if (arg instanceof Error) {
      // Handle Error instances
      messageParts.push(arg.message);
      if (arg.stack) {
        details.stack = arg.stack;
      }
      // Include any custom properties on the error
      const errorProps = Object.getOwnPropertyNames(arg).filter(
        (prop) => !["message", "stack", "name"].includes(prop),
      );
      if (errorProps.length > 0) {
        errorProps.forEach((prop) => {
          const errorRecord = arg as unknown as Record<string, unknown>;
          metadata[prop] = errorRecord[prop];
        });
      }
    } else if (typeof arg === "object" && arg !== null) {
      // Handle plain objects as metadata
      Object.assign(metadata, arg as Record<string, unknown>);
    } else {
      // Handle primitives
      messageParts.push(String(arg));
    }
  }

  details.message = messageParts.join(" ") || "Unknown error";
  if (Object.keys(metadata).length > 0) {
    details.metadata = metadata;
  }

  return details;
}

/**
 * Fire-and-forget error reporting with safe fallback
 */
function reportErrorSafely(errorDetails: {
  message: string;
  stack?: string;
  metadata?: Record<string, unknown>;
  timestamp: string;
  environment: "development" | "production";
}) {
  if (!errorReporter) {
    // No reporter configured, fall back to console
    console.error("[No Error Reporter Configured]", errorDetails);
    return;
  }

  try {
    // Attempt to report the error
    const result = errorReporter(errorDetails);

    // Handle both sync and async reporters
    if (result instanceof Promise) {
      // Don't await to keep it non-blocking, but catch any rejection
      result.catch((reporterError) => {
        console.error(
          "[Error Reporter Failed]",
          reporterError,
          "Original error:",
          errorDetails,
        );
      });
    }
  } catch (reporterError) {
    // Sync reporter threw an error
    console.error(
      "[Error Reporter Failed]",
      reporterError,
      "Original error:",
      errorDetails,
    );
  }
}

export const logger = {
  log: (...args: unknown[]) => {
    if (isDev) {
      // eslint-disable-next-line no-console
      console.log(...args);
    }
  },

  error: (...args: unknown[]) => {
    // Always call console.error to ensure visibility
    console.error(...args);

    // Format error details for reporting
    const environment: "development" | "production" = isDev
      ? "development"
      : "production";
    const errorDetails = {
      ...formatErrorDetails(args),
      timestamp: new Date().toISOString(),
      environment,
    };

    // In production, also send to monitoring service
    if (!isDev) {
      // Non-blocking error reporting
      reportErrorSafely(errorDetails);
    }
  },

  warn: (...args: unknown[]) => {
    if (isDev) {
      console.warn(...args);
    }
  },

  info: (...args: unknown[]) => {
    if (isDev) {
      // eslint-disable-next-line no-console
      console.info(...args);
    }
  },

  debug: (...args: unknown[]) => {
    if (isDev) {
      // eslint-disable-next-line no-console
      console.debug(...args);
    }
  },

  // Special method for analytics/metrics that should always run
  metric: (name: string, value: number, metadata?: Record<string, unknown>) => {
    if (isDev) {
      // eslint-disable-next-line no-console
      console.log(`[Metric] ${name}:`, value, metadata);
    }
    // TODO: Integrate with analytics service
    // In production, store metrics for eventual transmission
    else {
      // Store metrics in a queue for analytics service integration
      // This prevents console pollution in production
      if (typeof window !== "undefined" && window.localStorage) {
        try {
          const stored = localStorage.getItem("buffalo-metrics");
          const parsed: unknown = stored ? JSON.parse(stored) : [];
          const metrics: Array<Record<string, unknown>> = Array.isArray(parsed)
            ? parsed.filter(
                (entry): entry is Record<string, unknown> =>
                  entry !== null && typeof entry === "object",
              )
            : [];
          metrics.push({ name, value, metadata, timestamp: Date.now() });
          // Keep only last 100 metrics to prevent storage bloat
          if (metrics.length > 100) {
            metrics.shift();
          }
          localStorage.setItem("buffalo-metrics", JSON.stringify(metrics));
        } catch {
          // Silently fail if localStorage is unavailable
        }
      }
    }
  },
};

export default logger;
