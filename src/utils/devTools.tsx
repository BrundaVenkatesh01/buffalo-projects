import type { ReactNode } from "react";

// Development-only utilities that will be tree-shaken in production builds
export const isDevelopment = process.env["NODE_ENV"] === "development";

// Development logging utilities that no-op outside dev
export const devLog = (...args: unknown[]) => {
  if (isDevelopment) {
    // eslint-disable-next-line no-console
    console.log("[DEV]", ...args);
  }
};

export const devWarn = (...args: unknown[]) => {
  if (isDevelopment) {
    console.warn("[DEV]", ...args);
  }
};

export const devError = (...args: unknown[]) => {
  if (isDevelopment) {
    console.error("[DEV]", ...args);
  }
};

const canUsePerformance = (): boolean =>
  typeof window !== "undefined" && typeof window.performance !== "undefined";

// Performance monitoring for development
export const perfMark = (name: string) => {
  if (isDevelopment && canUsePerformance()) {
    window.performance.mark(name);
  }
};

export const perfMeasure = (
  name: string,
  startMark: string,
  endMark: string,
) => {
  if (isDevelopment && canUsePerformance()) {
    window.performance.measure(name, startMark, endMark);
    const measures = window.performance.getEntriesByName(name);
    const duration = measures[0]?.duration;
    if (typeof duration === "number") {
      devLog(`Performance: ${name} took ${duration.toFixed(2)}ms`);
    }
  }
};

// Bundle size analyzer helper
export const logChunkInfo = () => {
  if (
    isDevelopment &&
    typeof window !== "undefined" &&
    typeof navigator !== "undefined"
  ) {
    devLog("Chunk loading info:", {
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
    });
  }
};

// Development-only component debugging
export const DebugComponent = ({
  children,
  name,
}: {
  children: ReactNode;
  name: string;
}) => {
  if (isDevelopment) {
    devLog(`Rendering component: ${name}`);
  }
  return <>{children}</>;
};
