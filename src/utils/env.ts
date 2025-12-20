/**
 * Universal environment variable access for both Vite and Next.js
 * Handles the differences between import.meta.env (Vite) and process.env (Next.js)
 */

import { z } from "zod";

type EnvPrimitive = string | boolean | undefined;

// Zod schemas for runtime validation
const firebaseConfigSchema = z.object({
  apiKey: z.string().min(1, "Firebase API key is required"),
  authDomain: z.string().min(1, "Firebase auth domain is required"),
  projectId: z.string().min(1, "Firebase project ID is required"),
  storageBucket: z.string().min(1, "Firebase storage bucket is required"),
  messagingSenderId: z.string().min(1, "Firebase messaging sender ID is required"),
  appId: z.string().min(1, "Firebase app ID is required"),
  measurementId: z.string().optional(),
});

const emailConfigSchema = z.object({
  provider: z.string().min(1),
  apiKey: z.string().min(1),
  fromEmail: z.string().email(),
  fromName: z.string().min(1),
});

const rateLimitConfigSchema = z.object({
  enabled: z.boolean(),
  redisUrl: z.string().optional(),
  redisToken: z.string().optional(),
  prefix: z.string(),
  window: z.string(),
  windowMs: z.number().positive(),
  limit: z.number().positive(),
});

const getProcessEnvValue = (key: string): EnvPrimitive => {
  if (
    typeof process !== "undefined" &&
    typeof process.env === "object" &&
    process.env !== null
  ) {
    const envRecord = process.env as Record<string, EnvPrimitive>;
    return envRecord[key];
  }
  return undefined;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const getImportMetaEnvValue = (key: string): EnvPrimitive => {
  try {
    const envRecord = (
      import.meta as ImportMeta & {
        env?: Record<string, unknown>;
      }
    ).env;
    if (envRecord && typeof envRecord === "object") {
      const value: unknown = envRecord[key];
      if (typeof value === "string" || typeof value === "boolean") {
        return value;
      }
    }
  } catch {
    // `import.meta` is not available in some runtimes (like Node during tests)
  }
  return undefined;
};

const getNextDataEnvValue = (key: string): EnvPrimitive => {
  if (typeof globalThis === "undefined") {
    return undefined;
  }

  const globalRecord = globalThis as Record<string, unknown>;
  const nextDataRaw = globalRecord["__NEXT_DATA__"];

  if (!isRecord(nextDataRaw)) {
    return undefined;
  }

  const envSource = nextDataRaw["env"];
  if (!isRecord(envSource)) {
    return undefined;
  }

  const value = envSource[key];
  if (typeof value === "string" || typeof value === "boolean") {
    return value;
  }

  return undefined;
};

const normalizeEnvKeys = (key: string): string[] => {
  // Prefer NEXT_PUBLIC_ over VITE_ (Vite is deprecated)
  const keys = new Set<string>();

  if (key.startsWith("VITE_")) {
    // VITE_ is deprecated, check NEXT_PUBLIC_ first
    keys.add(key.replace(/^VITE_/, "NEXT_PUBLIC_"));
    keys.add(key); // Fallback to VITE_ for migration
  } else if (key.startsWith("NEXT_PUBLIC_")) {
    keys.add(key); // NEXT_PUBLIC_ is preferred
    keys.add(key.replace(/^NEXT_PUBLIC_/, "VITE_")); // Fallback to VITE_
  } else {
    keys.add(key);
  }

  return Array.from(keys);
};

// Track deprecated VITE_ usage in development
const warnDeprecatedViteUsage = (key: string, _value: string) => {
  if (
    typeof process !== "undefined" &&
    process.env?.NODE_ENV === "development"
  ) {
    console.warn(
      `DEPRECATED: ${key} is using VITE_ prefix. Please migrate to NEXT_PUBLIC_${key.replace(/^VITE_/, "")}`,
    );
  }
};

/**
 * Get an environment variable value, checking both Next.js and Vite sources
 * Prefers NEXT_PUBLIC_ prefix over deprecated VITE_ prefix
 */
export function getEnvVar(key: string): string | undefined {
  const candidates = normalizeEnvKeys(key);

  for (const candidate of candidates) {
    const processValue = getProcessEnvValue(candidate);
    if (typeof processValue === "string") {
      // Warn if using deprecated VITE_ prefix
      if (candidate.startsWith("VITE_")) {
        warnDeprecatedViteUsage(candidate, processValue);
      }
      return processValue;
    }

    const nextDataValue = getNextDataEnvValue(candidate);
    if (typeof nextDataValue === "string") {
      if (candidate.startsWith("VITE_")) {
        warnDeprecatedViteUsage(candidate, nextDataValue);
      }
      return nextDataValue;
    }

    const importMetaValue = getImportMetaEnvValue(candidate);
    if (typeof importMetaValue === "string") {
      if (candidate.startsWith("VITE_")) {
        warnDeprecatedViteUsage(candidate, importMetaValue);
      }
      return importMetaValue;
    }

    if (typeof nextDataValue === "boolean") {
      return nextDataValue ? "true" : "false";
    }

    if (typeof importMetaValue === "boolean") {
      return importMetaValue ? "true" : "false";
    }
  }

  return undefined;
}

/**
 * Check if we're in development mode
 */
export function isDevelopment(): boolean {
  const nodeEnv = getProcessEnvValue("NODE_ENV");
  if (typeof nodeEnv === "string") {
    return nodeEnv === "development";
  }

  const devFlag = getImportMetaEnvValue("DEV");
  if (typeof devFlag === "boolean") {
    return devFlag;
  }
  if (typeof devFlag === "string") {
    return devFlag === "true";
  }

  return false;
}

/**
 * Check if we're in production mode
 */
export function isProduction(): boolean {
  const nodeEnv = getProcessEnvValue("NODE_ENV");
  if (typeof nodeEnv === "string") {
    return nodeEnv === "production";
  }

  const prodFlag = getImportMetaEnvValue("PROD");
  if (typeof prodFlag === "boolean") {
    return prodFlag;
  }
  if (typeof prodFlag === "string") {
    return prodFlag === "true";
  }

  return false;
}

/**
 * Determine if demo-only routes (design system, OpenAI playground, etc.) should be accessible.
 * Defaults to development mode unless an explicit NEXT_PUBLIC_ENABLE_DEMOS=true flag is present.
 */
export function allowDemoContent(): boolean {
  const explicit = getEnvVar("NEXT_PUBLIC_ENABLE_DEMOS");
  if (typeof explicit === "string") {
    return explicit.toLowerCase() === "true";
  }
  return isDevelopment();
}

/**
 * Get Firebase configuration from environment
 * Note: Direct process.env access is required for Next.js static replacement to work
 */
export function getFirebaseConfig() {
  return {
    apiKey:
      process.env["NEXT_PUBLIC_FIREBASE_API_KEY"] ||
      getEnvVar("VITE_FIREBASE_API_KEY") ||
      "",
    authDomain:
      process.env["NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN"] ||
      getEnvVar("VITE_FIREBASE_AUTH_DOMAIN") ||
      "",
    projectId:
      process.env["NEXT_PUBLIC_FIREBASE_PROJECT_ID"] ||
      getEnvVar("VITE_FIREBASE_PROJECT_ID") ||
      "",
    storageBucket:
      process.env["NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET"] ||
      getEnvVar("VITE_FIREBASE_STORAGE_BUCKET") ||
      "",
    messagingSenderId:
      process.env["NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID"] ||
      getEnvVar("VITE_FIREBASE_MESSAGING_SENDER_ID") ||
      "",
    appId:
      process.env["NEXT_PUBLIC_FIREBASE_APP_ID"] ||
      getEnvVar("VITE_FIREBASE_APP_ID") ||
      "",
    measurementId:
      process.env["NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID"] ||
      getEnvVar("VITE_FIREBASE_MEASUREMENT_ID") ||
      "",
  };
}

/**
 * Get Gemini API key from environment
 * @deprecated API key now handled server-side in /api/ai/suggest
 * This function is kept for backward compatibility but should not be used
 */
export function getGeminiApiKey(): string {
  return ""; // API key now handled server-side
}

/**
 * Get analytics configuration
 */
export function getAnalyticsConfig() {
  return {
    enabled: getEnvVar("NEXT_PUBLIC_ENABLE_ANALYTICS") === "true",
    analyticsId: getEnvVar("NEXT_PUBLIC_ANALYTICS_ID") || "",
    posthogKey: getEnvVar("NEXT_PUBLIC_POSTHOG_KEY") || "",
    posthogHost:
      getEnvVar("NEXT_PUBLIC_POSTHOG_HOST") || "https://app.posthog.com",
  };
}

/**
 * Get error tracking configuration
 */
export function getErrorTrackingConfig() {
  return {
    enabled: getEnvVar("NEXT_PUBLIC_ENABLE_ERROR_TRACKING") === "true",
    sentryDsn: getEnvVar("NEXT_PUBLIC_SENTRY_DSN") || "",
    environment: getEnvVar("NEXT_PUBLIC_SENTRY_ENVIRONMENT") || "development",
    tracesSampleRate: parseFloat(
      getEnvVar("NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE") || "0.1",
    ),
    replaySampleRate: parseFloat(
      getEnvVar("NEXT_PUBLIC_SENTRY_REPLAY_SAMPLE_RATE") || "0.0",
    ),
    replayErrorSampleRate: parseFloat(
      getEnvVar("NEXT_PUBLIC_SENTRY_REPLAY_ERROR_SAMPLE_RATE") || "1.0",
    ),
  };
}

/**
 * Resolve the canonical site URL for building absolute links.
 * Falls back to production domain when no environment override is present.
 */
export function getSiteUrl(): string {
  const fallback = "https://buffaloprojects.com";
  const raw = getEnvVar("NEXT_PUBLIC_SITE_URL") || fallback;
  return raw.replace(/\/+$/, "") || fallback;
}

export function getEmailConfig() {
  const provider = getEnvVar("EMAIL_PROVIDER") || "";
  const apiKey = getEnvVar("EMAIL_API_KEY") || "";
  const fromEmail = getEnvVar("EMAIL_FROM_ADDRESS") || "";
  const fromName = getEnvVar("EMAIL_FROM_NAME") || "Buffalo Projects";

  return {
    provider: provider.toLowerCase(),
    apiKey,
    fromEmail,
    fromName,
  };
}

export function isEmailConfigured(): boolean {
  const config = getEmailConfig();
  return (
    Boolean(config.provider) &&
    Boolean(config.apiKey) &&
    Boolean(config.fromEmail)
  );
}

export function getRateLimitConfig() {
  const redisUrl = getEnvVar("UPSTASH_REDIS_REST_URL") || "";
  const redisToken = getEnvVar("UPSTASH_REDIS_REST_TOKEN") || "";
  const prefix = getEnvVar("RATE_LIMIT_PREFIX") || "bp::rl";
  const windowRaw = getEnvVar("RATE_LIMIT_WINDOW") || "1m";

  const parseWindowToMs = (
    value: string | number | boolean | null | undefined,
  ): number => {
    const normalized = String(value ?? "")
      .trim()
      .toLowerCase();
    const match = normalized.match(
      /^(\d+(?:\.\d+)?)(?:\s*(ms|milliseconds?|s|sec|seconds?|m|min|minutes?|h|hr|hours?))?$/,
    );

    if (!match) {
      return 60_000;
    }

    const amount = Number.parseFloat(match[1] ?? "0");
    const unit = match[2];

    if (!Number.isFinite(amount) || amount <= 0) {
      return 60_000;
    }

    switch (unit) {
      case "ms":
      case "millisecond":
      case "milliseconds":
        return amount;
      case "s":
      case "sec":
      case "second":
      case "seconds":
        return amount * 1_000;
      case "m":
      case "min":
      case "minute":
      case "minutes":
        return amount * 60_000;
      case "h":
      case "hr":
      case "hour":
      case "hours":
        return amount * 3_600_000;
      default:
        return amount;
    }
  };

  const windowMs = parseWindowToMs(windowRaw);

  const parsedLimit = Number.parseInt(
    getEnvVar("RATE_LIMIT_MAX_REQUESTS") ?? "",
    10,
  );
  const limit =
    Number.isFinite(parsedLimit) && parsedLimit > 0 ? parsedLimit : 10;

  return {
    enabled: Boolean(redisUrl && redisToken),
    redisUrl,
    redisToken,
    prefix,
    window: windowRaw,
    windowMs,
    limit,
  };
}

/**
 * Validate Firebase configuration with Zod
 * Returns validation result without throwing errors
 */
export function validateFirebaseConfig() {
  const config = getFirebaseConfig();
  return firebaseConfigSchema.safeParse(config);
}

/**
 * Validate email configuration with Zod
 * Returns validation result without throwing errors
 */
export function validateEmailConfig() {
  const config = getEmailConfig();
  return emailConfigSchema.safeParse(config);
}

/**
 * Validate rate limit configuration with Zod
 * Returns validation result without throwing errors
 */
export function validateRateLimitConfig() {
  const config = getRateLimitConfig();
  return rateLimitConfigSchema.safeParse(config);
}

/**
 * Validate all critical environment configurations
 * Returns array of validation errors, empty array if all valid
 */
export function validateEnvironment(): { section: string; errors: string[] }[] {
  const issues: { section: string; errors: string[] }[] = [];

  // Only validate Firebase in production or when explicitly configured
  const shouldValidateFirebase =
    isProduction() || getEnvVar("NEXT_PUBLIC_FIREBASE_API_KEY");

  if (shouldValidateFirebase) {
    const firebaseResult = validateFirebaseConfig();
    if (!firebaseResult.success) {
      issues.push({
        section: "Firebase",
        errors: firebaseResult.error.issues.map((e) => `${e.path.join(".")}: ${e.message}`),
      });
    }
  }

  // Only validate email if EMAIL_PROVIDER is set
  if (getEnvVar("EMAIL_PROVIDER")) {
    const emailResult = validateEmailConfig();
    if (!emailResult.success) {
      issues.push({
        section: "Email",
        errors: emailResult.error.issues.map((e) => `${e.path.join(".")}: ${e.message}`),
      });
    }
  }

  // Rate limiting is optional
  const rateLimitResult = validateRateLimitConfig();
  if (!rateLimitResult.success) {
    // Only warn, don't fail on rate limit config issues
    if (isDevelopment()) {
      console.warn("Rate limit configuration issues:", rateLimitResult.error.issues);
    }
  }

  return issues;
}
