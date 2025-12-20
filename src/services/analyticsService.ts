import type { PostHog } from "posthog-js";

import { getAnalyticsConfig, isProduction } from "../utils/env";
import { logger } from "../utils/logger";

type AnalyticsProperties = Record<string, unknown>;
type TimingProperties = {
  category: string;
  variable: string;
  time: number;
  label: string;
};

interface AnalyticsEvent {
  name: string;
  properties?: AnalyticsProperties;
  timestamp?: number;
}

interface UserProperties {
  role?:
    | "student"
    | "teacher"
    | "mentor"
    | "admin"
    | "first_time"
    | "serial"
    | "educator";
  organization?: string;
  projectCount?: number;
  classCode?: string;
}

type GtagFunction = (...args: unknown[]) => void;

interface AnalyticsWindow extends Window {
  dataLayer?: unknown[];
  gtag?: GtagFunction;
  posthog?: PostHog;
}

const analyticsWindow: AnalyticsWindow | undefined =
  typeof window !== "undefined" ? (window as AnalyticsWindow) : undefined;

const isBrowserOffline = () =>
  typeof navigator !== "undefined" && navigator.onLine === false;

class AnalyticsService {
  private static initialized = false;
  private static userId: string | null = null;
  private static queue: AnalyticsEvent[] = [];

  // Initialize analytics services
  static async initialize() {
    if (this.initialized) {
      return;
    }

    const config = getAnalyticsConfig();
    if (!config.enabled) {
      logger.log("Analytics disabled");
      return;
    }

    if (isBrowserOffline()) {
      logger.log("Analytics skipped while offline");
      return;
    }

    try {
      // Initialize Google Analytics
      if (config.analyticsId) {
        this.initializeGA();
      }

      // Initialize PostHog
      if (config.posthogKey) {
        await this.initializePostHog();
      }

      this.initialized = true;
      this.flushQueue();
      logger.log("Analytics initialized");
    } catch (error) {
      logger.error("Failed to initialize analytics:", error);
    }
  }

  // Initialize Google Analytics
  private static initializeGA() {
    const windowRef = analyticsWindow;
    if (!windowRef || typeof document === "undefined") {
      logger.warn("Window not available; skipping GA initialization");
      return;
    }

    if (isBrowserOffline()) {
      logger.log("Skipping GA initialization while offline");
      return;
    }

    const config = getAnalyticsConfig();
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${config.analyticsId}`;
    script.onerror = () => {
      logger.warn(
        "Google Analytics script blocked or failed to load; analytics disabled for this session",
      );
      windowRef.gtag = undefined;
    };
    document.head.appendChild(script);

    windowRef.dataLayer = windowRef.dataLayer || [];
    windowRef.gtag = (...args: unknown[]) => {
      windowRef.dataLayer?.push(args);
    };
    windowRef.gtag?.("js", new Date());
    windowRef.gtag?.("config", config.analyticsId);
  }

  // Initialize PostHog
  private static async initializePostHog() {
    const windowRef = analyticsWindow;
    if (!windowRef) {
      logger.warn("Window not available; skipping PostHog initialization");
      return;
    }

    if (isBrowserOffline()) {
      logger.log("Skipping PostHog initialization while offline");
      return;
    }

    const module: unknown = await import("posthog-js");
    if (!module || typeof module !== "object" || !("default" in module)) {
      throw new Error("PostHog module failed to load");
    }

    const maybePosthog = (module as { default: unknown }).default;
    if (!AnalyticsService.isPosthogClient(maybePosthog)) {
      throw new Error("PostHog client is invalid");
    }

    const posthog = maybePosthog;

    const config = getAnalyticsConfig();

    posthog.init(config.posthogKey, {
      api_host: config.posthogHost,
      capture_pageview: true,
      capture_pageleave: true,
      autocapture: true,
      session_recording: {
        maskTextSelector: ".sensitive-data",
      },
    });

    windowRef.posthog = posthog;
  }

  private static isPosthogClient(value: unknown): value is PostHog {
    return (
      !!value &&
      typeof value === "object" &&
      "init" in value &&
      typeof (value as PostHog).init === "function" &&
      "identify" in value &&
      typeof (value as PostHog).identify === "function" &&
      "capture" in value &&
      typeof (value as PostHog).capture === "function"
    );
  }

  // Identify user
  static identify(userId: string, properties?: UserProperties) {
    this.userId = userId;

    if (!this.initialized) {
      logger.warn("Analytics not initialized");
      return;
    }

    try {
      // Google Analytics
      if (analyticsWindow?.gtag) {
        const config = getAnalyticsConfig();
        analyticsWindow.gtag("config", config.analyticsId, {
          user_id: userId,
        });
      }

      // PostHog
      if (analyticsWindow?.posthog) {
        analyticsWindow.posthog.identify(userId, properties);
      }
    } catch (error) {
      logger.error("Failed to identify user:", error);
    }
  }

  // Track event
  static track(eventName: string, properties?: AnalyticsProperties) {
    const event: AnalyticsEvent = {
      name: eventName,
      properties: {
        ...properties,
        timestamp: Date.now(),
        userId: this.userId,
      },
    };

    if (!this.initialized) {
      this.queue.push(event);
      return;
    }

    this.sendEvent(event);
  }

  // Send event to analytics services
  private static sendEvent(event: AnalyticsEvent) {
    try {
      // Google Analytics
      if (analyticsWindow?.gtag) {
        analyticsWindow.gtag("event", event.name, {
          event_category: "engagement",
          event_label: event.properties?.["label"],
          value: event.properties?.["value"],
          ...event.properties,
        });
      }

      // PostHog
      if (analyticsWindow?.posthog) {
        analyticsWindow.posthog.capture(event.name, event.properties);
      }
    } catch (error) {
      logger.error("Failed to track event:", error);
    }
  }

  // Track page view
  static pageView(path: string, title?: string) {
    this.track("page_view", {
      path,
      title: title || document.title,
      referrer: document.referrer,
    });
  }

  // Track workspace events
  static trackWorkspace(
    action: string,
    workspaceCode: string,
    details?: AnalyticsProperties,
  ) {
    this.track(`workspace_${action}`, {
      workspace_code: workspaceCode,
      ...details,
    });
  }

  // Track tool usage
  static trackToolUsage(
    toolName: string,
    action: string,
    details?: AnalyticsProperties,
  ) {
    this.track(`tool_${action}`, {
      tool: toolName,
      ...details,
    });
  }

  // Track AI interactions
  static trackAI(
    action: string,
    section?: string,
    details?: AnalyticsProperties,
  ) {
    this.track(`ai_${action}`, {
      section,
      ...details,
    });
  }

  // Track conversion events
  static trackConversion(
    type: string,
    value?: number,
    details?: AnalyticsProperties,
  ) {
    this.track(`conversion_${type}`, {
      value,
      currency: "USD",
      ...details,
    });
  }

  // Track errors
  static trackError(error: Error, context?: AnalyticsProperties) {
    this.track("error", {
      message: error.message,
      stack: error.stack,
      context,
    });
  }

  // Flush queued events
  private static flushQueue() {
    while (this.queue.length > 0) {
      const event = this.queue.shift();
      if (event) {
        this.sendEvent(event);
      }
    }
  }

  // Set user properties
  static setUserProperties(properties: UserProperties) {
    if (analyticsWindow?.posthog) {
      analyticsWindow.posthog.people.set(properties);
    }
  }

  // Track timing
  static trackTiming(category: string, variable: string, time: number) {
    const payload: TimingProperties = {
      category,
      variable,
      time,
      label: `${category}_${variable}`,
    };
    this.track("timing_complete", payload);
  }

  // Track feature usage
  static trackFeature(featureName: string, used: boolean = true) {
    this.track("feature_usage", {
      feature: featureName,
      used,
    });
  }

  // Session recording control
  static startSessionRecording() {
    if (analyticsWindow?.posthog) {
      analyticsWindow.posthog.startSessionRecording();
    }
  }

  static stopSessionRecording() {
    if (analyticsWindow?.posthog) {
      analyticsWindow.posthog.stopSessionRecording();
    }
  }

  // Reset analytics (on logout)
  static reset() {
    this.userId = null;

    if (analyticsWindow?.posthog) {
      analyticsWindow.posthog.reset();
    }
  }

  // Consent management
  private static CONSENT_KEY = "buffalo-analytics-consent";

  static getConsentState(): "granted" | "denied" | "unset" {
    if (typeof window === "undefined") {
      return "unset";
    }

    try {
      const stored = localStorage.getItem(this.CONSENT_KEY);
      if (stored === "granted" || stored === "denied") {
        return stored;
      }
      return "unset";
    } catch {
      return "unset";
    }
  }

  static setConsent(granted: boolean) {
    const consentValue = granted ? "granted" : "denied";

    // Store consent state
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(this.CONSENT_KEY, consentValue);
      } catch {
        logger.warn("Failed to store consent state");
      }
    }

    // Initialize or stop analytics based on consent
    if (granted) {
      void this.initialize();
    } else {
      // Disable tracking
      this.initialized = false;
      if (analyticsWindow?.posthog) {
        analyticsWindow.posthog.opt_out_capturing();
      }
    }

    logger.log(`Analytics consent: ${consentValue}`);
  }
}

// Auto-initialize on import if in production and consent is granted
if (isProduction()) {
  const consent = AnalyticsService.getConsentState();
  if (consent === "granted") {
    void AnalyticsService.initialize();
  }
}

export default AnalyticsService;
