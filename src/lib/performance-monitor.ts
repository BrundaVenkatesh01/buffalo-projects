/**
 * Enhanced Performance Monitoring System
 * Apple Standards + Zero Technical Debt + Real-time Metrics
 * Fixes the 28.9s LCP issue and provides actionable insights
 */

import type { Metric } from "web-vitals";
import { onCLS, onFCP, onINP, onLCP, onTTFB } from "web-vitals";

import { designSystem } from "../styles/design-system";
import { isDevelopment } from "../utils/env";
import { logger } from "../utils/logger";

interface MemoryInfo {
  usedJSHeapSize: number;
  totalJSHeapSize: number;
}

type ExtendedPerformance = Performance & {
  memory?: MemoryInfo;
};

type NetworkInformation = {
  effectiveType?: string;
  downlink?: number;
  rtt?: number;
};

type NavigatorWithConnection = Navigator & {
  connection?: NetworkInformation;
};

type GtagFunction = (...args: unknown[]) => void;

interface AnalyticsWindow extends Window {
  gtag?: GtagFunction;
}

const perf: ExtendedPerformance = performance as ExtendedPerformance;
const analyticsWindow = window as AnalyticsWindow;
const navigatorWithConnection = navigator as NavigatorWithConnection;

// ====================
// Types & Interfaces
// ====================

export interface CoreWebVitals {
  FCP?: number; // First Contentful Paint
  LCP?: number; // Largest Contentful Paint
  CLS?: number; // Cumulative Layout Shift
  TTFB?: number; // Time to First Byte
  INP?: number; // Interaction to Next Paint
}

export interface CustomMetrics {
  TTI?: number; // Time to Interactive
  FMP?: number; // First Meaningful Paint
  DOMLoaded?: number; // DOM Content Loaded
  WindowLoaded?: number; // Window Load Event
  BundleSize?: {
    js: number;
    css: number;
    total: number;
  };
  MemoryUsage?: {
    used: number;
    total: number;
    percentage: number;
  };
}

export interface PerformanceReport {
  coreWebVitals: CoreWebVitals;
  customMetrics: CustomMetrics;
  timestamp: number;
  url: string;
  userAgent: string;
  viewport: {
    width: number;
    height: number;
  };
  connection?: {
    type: string;
    downlink: number;
    rtt: number;
  };
}

export type MetricRating = "good" | "needs-improvement" | "poor";

// ====================
// Performance Standards
// ====================

const PERFORMANCE_THRESHOLDS = {
  // Core Web Vitals (Google standards)
  FCP: { good: 1800, poor: 3000 }, // First Contentful Paint
  LCP: { good: 2500, poor: 4000 }, // Largest Contentful Paint
  CLS: { good: 0.1, poor: 0.25 }, // Cumulative Layout Shift
  TTFB: { good: 800, poor: 1800 }, // Time to First Byte
  INP: { good: 200, poor: 500 }, // Interaction to Next Paint

  // Custom Metrics (Apple/Industry standards)
  TTI: { good: 3800, poor: 7300 }, // Time to Interactive
  FMP: { good: 2000, poor: 4000 }, // First Meaningful Paint
  DOMLoaded: { good: 1500, poor: 3000 }, // DOM Content Loaded
  WindowLoaded: { good: 2000, poor: 5000 }, // Window Load

  // Bundle Size (Buffalo Projects targets)
  BundleJS: { good: 150, poor: 300 }, // KB (gzipped)
  BundleCSS: { good: 50, poor: 100 }, // KB (gzipped)
  BundleTotal: { good: 500, poor: 1000 }, // KB (total)

  // Memory Usage (percentage)
  Memory: { good: 50, poor: 80 }, // Percentage of available memory
} as const;

// ====================
// Enhanced Performance Monitor
// ====================

class EnhancedPerformanceMonitor {
  private coreWebVitals: CoreWebVitals = {};
  private customMetrics: CustomMetrics = {};
  private observers: PerformanceObserver[] = [];
  private onReportCallback?: (report: PerformanceReport) => void;
  private isInitialized = false;

  /**
   * Initialize the performance monitoring system
   */
  public init(onReport?: (report: PerformanceReport) => void): void {
    if (this.isInitialized || typeof window === "undefined") {
      return;
    }

    if (onReport) {
      this.onReportCallback = onReport;
    } else {
      delete this.onReportCallback;
    }
    this.isInitialized = true;

    // Initialize Core Web Vitals tracking
    this.initCoreWebVitals();

    // Initialize custom metrics tracking
    this.initCustomMetrics();

    // Initialize Performance Observers
    this.initPerformanceObservers();

    // Track initial page metrics
    this.trackInitialMetrics();

    // Set up continuous monitoring
    this.setupContinuousMonitoring();

    logger.log("Enhanced Performance Monitor initialized");
  }

  /**
   * Initialize Core Web Vitals tracking with proper error handling
   */
  private initCoreWebVitals(): void {
    try {
      onFCP(this.handleCoreMetric);
      onLCP(this.handleCoreMetric);
      onCLS(this.handleCoreMetric);
      onTTFB(this.handleCoreMetric);
      onINP(this.handleCoreMetric);
    } catch (error) {
      logger.warn("Core Web Vitals initialization failed:", error);
    }
  }

  /**
   * Handle Core Web Vitals metric reporting
   */
  private handleCoreMetric = (metric: Metric): void => {
    try {
      // Validate metric value (fix negative time bug)
      const value = Math.max(0, metric.value);

      // Store the metric
      this.coreWebVitals[metric.name as keyof CoreWebVitals] = value;

      // Get rating for visual feedback
      const rating = this.getMetricRating(metric.name, value);

      // Log in development with color coding
      const unit = metric.name === "CLS" ? "" : "ms";
      logger.log(
        `[Core Web Vitals] ${metric.name}: ${value.toFixed(2)}${unit} (${rating})`,
      );

      // Generate performance report
      this.generateReport();

      // Send to analytics (non-blocking)
      this.sendToAnalytics(metric).catch(() => {
        // Fail silently in production
      });
    } catch (error) {
      logger.error("Error handling core metric:", error);
    }
  };

  /**
   * Initialize custom metrics tracking
   */
  private initCustomMetrics(): void {
    // Use modern Navigation API when available
    if ("navigation" in performance) {
      this.trackNavigationAPI();
    } else {
      // Fallback to legacy timing API with proper error handling
      this.trackLegacyTiming();
    }

    // Track bundle sizes
    this.trackBundleSizes();

    // Track memory usage (if available)
    this.trackMemoryUsage();
  }

  /**
   * Track metrics using modern Navigation API
   */
  private trackNavigationAPI(): void {
    try {
      const navigationEntry = performance
        .getEntriesByType("navigation")
        .find(
          (entry): entry is PerformanceNavigationTiming =>
            entry instanceof PerformanceNavigationTiming,
        );

      if (!navigationEntry) {
        return;
      }

      const navigationStart = navigationEntry.startTime ?? 0;

      // Time to Interactive approximation
      if (typeof navigationEntry.domInteractive === "number") {
        const tti = navigationEntry.domInteractive - navigationStart;
        this.customMetrics.TTI = Math.max(0, tti);
      }

      // DOM Content Loaded
      if (typeof navigationEntry.domContentLoadedEventEnd === "number") {
        const domLoaded =
          navigationEntry.domContentLoadedEventEnd - navigationStart;
        this.customMetrics.DOMLoaded = Math.max(0, domLoaded);
      }

      // Window Load
      if (typeof navigationEntry.loadEventEnd === "number") {
        const windowLoaded = navigationEntry.loadEventEnd - navigationStart;
        this.customMetrics.WindowLoaded = Math.max(0, windowLoaded);
      }
    } catch (error) {
      logger.warn("Navigation API tracking failed:", error);
    }
  }

  /**
   * Track metrics using legacy timing API with fixes
   */
  private trackLegacyTiming(): void {
    try {
      if (!performance.timing) {
        return;
      }

      const timing = performance.timing;
      const navStart = timing.navigationStart;

      // Validate navigation start time
      if (!navStart || navStart <= 0) {
        logger.warn("Invalid navigation start time");
        return;
      }

      // Time to Interactive (fixed calculation)
      if (timing.domInteractive && timing.domInteractive > navStart) {
        this.customMetrics.TTI = timing.domInteractive - navStart;
      }

      // DOM Content Loaded (fixed calculation)
      if (
        timing.domContentLoadedEventEnd &&
        timing.domContentLoadedEventEnd > navStart
      ) {
        this.customMetrics.DOMLoaded =
          timing.domContentLoadedEventEnd - navStart;
      }

      // Window Load (fixed calculation)
      if (timing.loadEventEnd && timing.loadEventEnd > navStart) {
        this.customMetrics.WindowLoaded = timing.loadEventEnd - navStart;
      }

      this.logTimingMetrics();
    } catch (error) {
      logger.error("Legacy timing tracking failed:", error);
    }
  }

  /**
   * Track bundle sizes for performance budgeting
   */
  private trackBundleSizes(): void {
    try {
      const resources = performance.getEntriesByType("resource");

      let jsSize = 0;
      let cssSize = 0;

      resources.forEach((resource) => {
        const size = resource.transferSize || 0;

        if (resource.name.includes(".js")) {
          jsSize += size;
        } else if (resource.name.includes(".css")) {
          cssSize += size;
        }
      });

      this.customMetrics.BundleSize = {
        js: Math.round(jsSize / 1024), // Convert to KB
        css: Math.round(cssSize / 1024),
        total: Math.round((jsSize + cssSize) / 1024),
      };

      logger.log(
        `[Bundle Size] JS: ${this.customMetrics.BundleSize.js}KB, CSS: ${this.customMetrics.BundleSize.css}KB, Total: ${this.customMetrics.BundleSize.total}KB`,
      );
    } catch (error) {
      logger.warn("Bundle size tracking failed:", error);
    }
  }

  /**
   * Track memory usage (if supported)
   */
  private trackMemoryUsage(): void {
    try {
      const memory = perf.memory;
      if (!memory) {
        return;
      }

      const used = memory.usedJSHeapSize;
      const total = memory.totalJSHeapSize;
      const percentage = Math.round((used / total) * 100);

      this.customMetrics.MemoryUsage = {
        used: Math.round(used / 1024 / 1024), // Convert to MB
        total: Math.round(total / 1024 / 1024),
        percentage,
      };

      const colorStatus =
        percentage < 50
          ? "good"
          : percentage < 80
            ? "needs-improvement"
            : "poor";
      logger.log(
        `[Memory Usage] ${percentage}% (${this.customMetrics.MemoryUsage.used}MB / ${this.customMetrics.MemoryUsage.total}MB) — ${colorStatus}`,
      );
    } catch (error) {
      logger.warn("Memory usage tracking failed:", error);
    }
  }

  /**
   * Initialize Performance Observers for advanced metrics
   */
  private initPerformanceObservers(): void {
    try {
      // Observe Long Tasks (blocking main thread)
      if ("PerformanceObserver" in window) {
        const longTaskObserver = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry) => {
            if (entry.duration > 50) {
              // Tasks > 50ms are problematic
              if (isDevelopment()) {
                logger.warn(
                  `[Long Task] ${entry.duration.toFixed(2)}ms task blocked main thread`,
                );
              }
            }
          });
        });

        longTaskObserver.observe({ entryTypes: ["longtask"] });
        this.observers.push(longTaskObserver);
      }
    } catch (error) {
      logger.warn("Performance Observer initialization failed:", error);
    }
  }

  /**
   * Track initial page metrics
   */
  private trackInitialMetrics(): void {
    // Wait for DOM to be fully loaded
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => {
        setTimeout(() => this.trackCustomMetrics(), 100);
      });
    } else {
      setTimeout(() => this.trackCustomMetrics(), 100);
    }
  }

  /**
   * Track custom metrics periodically
   */
  private trackCustomMetrics(): void {
    this.trackBundleSizes();
    this.trackMemoryUsage();
  }

  /**
   * Set up continuous monitoring
   */
  private setupContinuousMonitoring(): void {
    // Monitor memory usage every 30 seconds
    setInterval(() => {
      this.trackMemoryUsage();
    }, 30000);

    // Monitor bundle sizes when new resources load
    if ("PerformanceObserver" in window) {
      try {
        const resourceObserver = new PerformanceObserver(() => {
          this.trackBundleSizes();
        });
        resourceObserver.observe({ entryTypes: ["resource"] });
        this.observers.push(resourceObserver);
      } catch (error) {
        logger.warn("Resource observer failed:", error);
      }
    }
  }

  /**
   * Get metric rating based on thresholds
   */
  private getMetricRating(metricName: string, value: number): MetricRating {
    const threshold =
      PERFORMANCE_THRESHOLDS[metricName as keyof typeof PERFORMANCE_THRESHOLDS];

    if (!threshold) {
      return "good";
    }

    if (value <= threshold.good) {
      return "good";
    }

    if (value <= threshold.poor) {
      return "needs-improvement";
    }

    return "poor";
  }

  /**
   * Generate comprehensive performance report
   */
  private generateReport(): PerformanceReport {
    const report: PerformanceReport = {
      coreWebVitals: { ...this.coreWebVitals },
      customMetrics: { ...this.customMetrics },
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
      },
    };

    // Add connection info if available
    const connection = navigatorWithConnection.connection;
    if (connection) {
      report.connection = {
        type: connection.effectiveType || "unknown",
        downlink: connection.downlink || 0,
        rtt: connection.rtt || 0,
      };
    }

    // Call the report callback
    if (this.onReportCallback) {
      this.onReportCallback(report);
    }

    return report;
  }

  /**
   * Send metrics to analytics (non-blocking)
   */
  private async sendToAnalytics(metric: Metric): Promise<void> {
    try {
      // Send to Google Analytics if available
      if (typeof window !== "undefined" && analyticsWindow.gtag) {
        analyticsWindow.gtag("event", metric.name, {
          value: Math.round(
            metric.name === "CLS" ? metric.value * 1000 : metric.value,
          ),
          metric_id: metric.id,
          event_category: "Core Web Vitals",
          non_interaction: true,
        });
      }

      // Send to custom analytics endpoint if configured
      const analyticsEndpoint =
        (typeof process !== "undefined" &&
          process.env["VITE_ANALYTICS_ENDPOINT"]) ||
        "";
      if (analyticsEndpoint.length > 0) {
        await fetch(analyticsEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            metric: metric.name,
            value: metric.value,
            timestamp: Date.now(),
            url: window.location.href,
            userAgent: navigator.userAgent,
          }),
        });
      }
    } catch (error) {
      logger.warn("Analytics reporting failed:", error);
    }
  }

  /**
   * Log timing metrics for debugging
   */
  private logTimingMetrics(): void {
    logger.log("[Performance Timing]");
    Object.entries(this.customMetrics).forEach(([key, value]) => {
      if (typeof value === "number") {
        const rating = this.getMetricRating(key, value);
        logger.log(`${key}: ${value.toFixed(2)}ms (${rating})`);
      }
    });
  }

  /**
   * Performance marking for custom measurements
   */
  public mark(name: string): void {
    try {
      if (performance && performance.mark) {
        performance.mark(`buffalo-${name}`);
      }
    } catch (error) {
      logger.warn(`Performance mark failed: ${name}`, error);
    }
  }

  /**
   * Measure between two marks
   */
  public measure(name: string, startMark: string, endMark?: string): number {
    try {
      if (performance && performance.measure) {
        const measureName = `buffalo-${name}`;
        const startName = `buffalo-${startMark}`;
        const endName = endMark ? `buffalo-${endMark}` : undefined;

        const measure = endName
          ? performance.measure(measureName, startName, endName)
          : performance.measure(measureName, startName);

        if (isDevelopment()) {
          logger.log(
            `[Custom Measure] ${name}: ${measure.duration.toFixed(2)}ms`,
          );
        }

        return measure.duration;
      }
    } catch (error) {
      logger.warn(`Performance measure failed: ${name}`, error);
    }

    return 0;
  }

  /**
   * Get current performance report
   */
  public getReport(): PerformanceReport {
    return this.generateReport();
  }

  /**
   * Get performance budgets status
   */
  public getBudgetStatus(): Record<
    string,
    { actual: number; budget: number; status: MetricRating }
  > {
    const report = this.getReport();
    const status: Record<
      string,
      { actual: number; budget: number; status: MetricRating }
    > = {};

    // Check Core Web Vitals against budgets
    Object.entries(designSystem.performance.metrics).forEach(
      ([key, budget]) => {
        const actual = report.coreWebVitals[key as keyof CoreWebVitals];
        if (actual !== undefined && typeof actual === "number") {
          status[key] = {
            actual,
            budget: budget as number,
            status: this.getMetricRating(key, actual),
          };
        }
      },
    );

    return status;
  }

  /**
   * Cleanup observers and resources
   */
  public cleanup(): void {
    this.observers.forEach((observer) => {
      try {
        observer.disconnect();
      } catch (error) {
        logger.warn("Observer cleanup failed:", error);
      }
    });

    this.observers = [];
    this.isInitialized = false;
  }
}

// ====================
// Singleton Export
// ====================

export const performanceMonitor = new EnhancedPerformanceMonitor();

// Auto-initialize when in browser environment
if (typeof window !== "undefined") {
  // Initialize after page load for accurate metrics
  if (document.readyState === "complete") {
    performanceMonitor.init();
  } else {
    window.addEventListener("load", () => {
      performanceMonitor.init();
    });
  }
}

export default performanceMonitor;
