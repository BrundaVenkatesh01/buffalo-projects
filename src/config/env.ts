/**
 * Environment configuration with validation
 * Ensures required environment variables are present
 *
 * Now imports from the universal env helper instead of accessing directly
 */

import {
  getEnvVar,
  getGeminiApiKey,
  isDevelopment,
  isProduction,
} from "../utils/env";

interface EnvConfig {
  GEMINI_API_KEY: string;
  IS_DEVELOPMENT: boolean;
  IS_PRODUCTION: boolean;
}

class EnvironmentValidator {
  private config: EnvConfig;

  constructor() {
    this.config = this.validateAndLoad();
  }

  private validateAndLoad(): EnvConfig {
    // Get environment variables from universal helper
    const geminiKey = getGeminiApiKey();
    const isDev = isDevelopment();
    const isProd = isProduction();

    // Validation rules
    const errors: string[] = [];

    // Gemini API key is optional - AI features will be disabled without it
    if (
      !geminiKey ||
      geminiKey === "your_api_key_here" ||
      geminiKey === "dev_disabled"
    ) {
      if (isProd) {
        console.warn(
          "[Config] Warning: NEXT_PUBLIC_GEMINI_API_KEY is not configured. AI features will be disabled in production.",
        );
      } else if (isDev) {
        console.warn(
          "[Config] Warning: NEXT_PUBLIC_GEMINI_API_KEY is not configured. AI features will be disabled.",
        );
      }
    }

    // Throw if critical errors exist (currently none - all features are optional)
    if (errors.length > 0 && isProd) {
      const errorMessage = `Environment configuration errors:\n${errors.join("\n")}`;
      throw new Error(errorMessage);
    }

    return {
      GEMINI_API_KEY: geminiKey,
      IS_DEVELOPMENT: isDev,
      IS_PRODUCTION: isProd,
    };
  }

  get geminiApiKey(): string {
    return this.config.GEMINI_API_KEY;
  }

  get isDevelopment(): boolean {
    return this.config.IS_DEVELOPMENT;
  }

  get isProduction(): boolean {
    return this.config.IS_PRODUCTION;
  }

  get hasValidApiKey(): boolean {
    return (
      this.config.GEMINI_API_KEY !== "" &&
      this.config.GEMINI_API_KEY !== "your_api_key_here"
    );
  }

  /**
   * Get a boolean flag from environment, checking multiple keys in order
   * @param primaryKey - The primary environment variable key to check
   * @param fallbackKeys - Array of fallback keys to check if primary is not found
   * @returns true if any key is set to 'true', false otherwise
   */
  getFlag(primaryKey: string, fallbackKeys: string[] = []): boolean {
    const keysToCheck = [primaryKey, ...fallbackKeys];

    for (const key of keysToCheck) {
      const rawValue = getEnvVar(key);

      if (rawValue === "true" || rawValue === "1") {
        return true;
      }

      if (rawValue === "false" || rawValue === "0") {
        return false;
      }
    }

    return false;
  }
}

// Export singleton instance
export const env = new EnvironmentValidator();

// Export for type checking
export type { EnvConfig };
