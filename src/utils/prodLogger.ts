/**
 * Production-safe logger that only logs in development
 * Replaces all console.* statements for production safety
 */

import { isDevelopment as isDev } from "./env";

const isDevelopment = isDev();
const isDebugMode =
  typeof process !== "undefined" && process.env["VITE_DEBUG"] === "true";

type LogContext = Record<string, unknown>;

class Logger {
  private context: string;

  constructor(context: string) {
    this.context = context;
  }

  private formatMessage(
    level: string,
    message: string,
    _data?: LogContext,
  ): string {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] [${level}] [${this.context}] ${message}`;
  }

  log(message: string, data?: LogContext): void {
    if (isDevelopment) {
      // eslint-disable-next-line no-console
      console.log(this.formatMessage("INFO", message), data || "");
    }
  }

  error(message: string, err?: unknown, data?: LogContext): void {
    // Errors should always be logged in production for monitoring
    const errorData = {
      ...data,
      error:
        err instanceof Error
          ? {
              message: err.message,
              stack: err.stack,
              name: err.name,
            }
          : err,
    };

    if (isDevelopment) {
      console.error(this.formatMessage("ERROR", message), errorData);
    } else {
      // In production, send to error reporting service
      // This is where you'd integrate Sentry, LogRocket, etc.
      this.reportToService("error", message, errorData);
    }
  }

  warn(message: string, data?: LogContext): void {
    if (isDevelopment) {
      console.warn(this.formatMessage("WARN", message), data || "");
    }
  }

  info(message: string, data?: LogContext): void {
    if (isDevelopment) {
      // eslint-disable-next-line no-console
      console.info(this.formatMessage("INFO", message), data || "");
    }
  }

  debug(message: string, data?: LogContext): void {
    if (isDevelopment && isDebugMode) {
      // eslint-disable-next-line no-console
      console.debug(this.formatMessage("DEBUG", message), data || "");
    }
  }

  private reportToService(
    level: string,
    message: string,
    data: LogContext,
  ): void {
    // Future: Integrate with error reporting service
    // For now, store critical errors in localStorage for debugging
    if (level === "error") {
      try {
        const stored = localStorage.getItem("app_errors");
        const parsed: unknown = stored ? JSON.parse(stored) : [];
        const errors: Array<Record<string, unknown>> = Array.isArray(parsed)
          ? parsed.filter(
              (e): e is Record<string, unknown> =>
                e !== null && typeof e === "object",
            )
          : [];
        errors.push({
          timestamp: new Date().toISOString(),
          message,
          data,
          url: window.location.href,
          userAgent: navigator.userAgent,
        });
        // Keep only last 10 errors
        if (errors.length > 10) {
          errors.shift();
        }
        localStorage.setItem("app_errors", JSON.stringify(errors));
      } catch {
        // Silently fail if localStorage is full or unavailable
      }
    }
  }
}

// Factory function to create context-specific loggers
export function createLogger(context: string): Logger {
  return new Logger(context);
}

// Default logger for quick use
export const logger = createLogger("App");
