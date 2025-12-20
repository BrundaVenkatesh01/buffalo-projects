import { logger } from "../utils/logger";

export interface StorageOptions {
  compress?: boolean;
  encrypt?: boolean;
  ttl?: number; // Time to live in milliseconds
}

export interface StorageItem<T = unknown> {
  data: T;
  timestamp: number;
  ttl?: number;
  version?: string;
}

export class StorageService {
  private static readonly VERSION = "1.0.0";
  private static readonly PREFIX = "buffalo_";

  /**
   * Safely set an item in localStorage with error handling and optional compression
   */
  static setItem<T>(
    key: string,
    value: T,
    options: StorageOptions = {},
  ): boolean {
    try {
      const fullKey = this.getFullKey(key);

      const item: StorageItem<T> = {
        data: value,
        timestamp: Date.now(),
        version: this.VERSION,
      };

      if (options.ttl) {
        item.ttl = options.ttl;
      }

      const serialized = JSON.stringify(item);

      // Check if we're approaching localStorage limit
      if (this.isApproachingStorageLimit(serialized)) {
        logger.warn(`Storage item ${key} is large, may cause issues`);
        this.cleanupExpiredItems();
      }

      localStorage.setItem(fullKey, serialized);
      logger.debug(`Storage: Set item ${key}`, { size: serialized.length });
      return true;
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === "QuotaExceededError") {
          logger.error(`Storage quota exceeded when setting ${key}`);
          this.cleanupExpiredItems();
          // Try again after cleanup
          try {
            const fullKey = this.getFullKey(key);
            const item: StorageItem<T> = {
              data: value,
              timestamp: Date.now(),
              version: this.VERSION,
            };
            const serialized = JSON.stringify(item);
            localStorage.setItem(fullKey, serialized);
            return true;
          } catch (retryError) {
            logger.error(
              `Storage: Failed to set ${key} after cleanup:`,
              retryError,
            );
            return false;
          }
        } else {
          logger.error(`Storage: Failed to set ${key}:`, error);
        }
      }
      return false;
    }
  }

  /**
   * Safely get an item from localStorage with error handling and TTL check
   */
  static getItem<T>(key: string, defaultValue?: T): T | null {
    try {
      const fullKey = this.getFullKey(key);
      const stored = localStorage.getItem(fullKey);

      if (!stored) {
        return defaultValue ?? null;
      }

      const parsed: unknown = JSON.parse(stored);
      if (!parsed || typeof parsed !== "object") {
        throw new Error("Invalid storage format");
      }
      const item = parsed as Partial<StorageItem<T>>;
      if (typeof item.timestamp !== "number" || !("data" in item)) {
        throw new Error("Invalid storage payload");
      }

      // Check TTL
      const timestamp = item.timestamp;
      if (
        item.ttl &&
        typeof timestamp === "number" &&
        Date.now() > timestamp + item.ttl
      ) {
        logger.debug(`Storage: Item ${key} expired, removing`);
        this.removeItem(key);
        return defaultValue ?? null;
      }

      // Version check
      if (item.version && item.version !== this.VERSION) {
        logger.warn(
          `Storage: Item ${key} version mismatch, may need migration`,
        );
      }

      logger.debug(`Storage: Retrieved item ${key}`);
      if ("data" in item) {
        return (item as StorageItem<T>).data;
      }
      return defaultValue ?? null;
    } catch (error) {
      logger.error(`Storage: Failed to get ${key}:`, error);
      // Try to remove corrupted data
      this.removeItem(key);
      return defaultValue ?? null;
    }
  }

  /**
   * Safely remove an item from localStorage
   */
  static removeItem(key: string): boolean {
    try {
      const fullKey = this.getFullKey(key);
      localStorage.removeItem(fullKey);
      logger.debug(`Storage: Removed item ${key}`);
      return true;
    } catch (error) {
      logger.error(`Storage: Failed to remove ${key}:`, error);
      return false;
    }
  }

  /**
   * Check if a key exists in localStorage
   */
  static hasItem(key: string): boolean {
    try {
      const fullKey = this.getFullKey(key);
      return localStorage.getItem(fullKey) !== null;
    } catch (error) {
      logger.error(`Storage: Failed to check ${key}:`, error);
      return false;
    }
  }

  /**
   * Get all keys with the Buffalo prefix
   */
  static getAllKeys(): string[] {
    try {
      const keys: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(this.PREFIX)) {
          keys.push(key.replace(this.PREFIX, ""));
        }
      }
      return keys;
    } catch (error) {
      logger.error("Storage: Failed to get all keys:", error);
      return [];
    }
  }

  /**
   * Clear all Buffalo-prefixed items from localStorage
   */
  static clear(): boolean {
    try {
      const keys = this.getAllKeys();
      keys.forEach((key) => this.removeItem(key));
      logger.info(`Storage: Cleared ${keys.length} items`);
      return true;
    } catch (error) {
      logger.error("Storage: Failed to clear:", error);
      return false;
    }
  }

  /**
   * Get storage usage statistics
   */
  static getStorageStats() {
    try {
      let totalSize = 0;
      let buffaloSize = 0;
      const itemCount = localStorage.length;
      let buffaloItemCount = 0;

      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
          const value = localStorage.getItem(key);
          const size = (key.length + (value?.length || 0)) * 2; // Rough bytes estimate
          totalSize += size;

          if (key.startsWith(this.PREFIX)) {
            buffaloSize += size;
            buffaloItemCount++;
          }
        }
      }

      return {
        totalItems: itemCount,
        buffaloItems: buffaloItemCount,
        totalSize: totalSize,
        buffaloSize: buffaloSize,
        percentageUsed: this.getStoragePercentageUsed(),
      };
    } catch (error) {
      logger.error("Storage: Failed to get stats:", error);
      return null;
    }
  }

  /**
   * Clean up expired items
   */
  static cleanupExpiredItems(): number {
    try {
      const keys = this.getAllKeys();
      let cleanedCount = 0;

      keys.forEach((key) => {
        const item = this.getItem(key); // This will auto-remove expired items
        if (item === null) {
          cleanedCount++;
        }
      });

      if (cleanedCount > 0) {
        logger.info(`Storage: Cleaned up ${cleanedCount} expired items`);
      }

      return cleanedCount;
    } catch (error) {
      logger.error("Storage: Failed to cleanup expired items:", error);
      return 0;
    }
  }

  /**
   * Backup all Buffalo data to a JSON string
   */
  static exportData(): string | null {
    try {
      const keys = this.getAllKeys();
      const data: Record<string, unknown> = {};

      keys.forEach((key) => {
        const value = this.getItem(key);
        if (value !== null) {
          data[key] = value;
        }
      });

      return JSON.stringify({
        version: this.VERSION,
        timestamp: Date.now(),
        data,
      });
    } catch (error) {
      logger.error("Storage: Failed to export data:", error);
      return null;
    }
  }

  /**
   * Import data from a JSON string
   */
  static importData(jsonData: string): boolean {
    try {
      const parsed: unknown = JSON.parse(jsonData);
      if (!parsed || typeof parsed !== "object") {
        throw new Error("Invalid backup format");
      }
      const obj = parsed as { data?: unknown; version?: unknown };
      if (!obj.data || typeof obj.version !== "string") {
        throw new Error("Invalid backup format");
      }
      const entries = Object.entries(obj.data as Record<string, unknown>);
      entries.forEach(([key, value]) => {
        this.setItem(key, value);
      });

      logger.info(`Storage: Imported ${entries.length} items`);
      return true;
    } catch (error) {
      logger.error("Storage: Failed to import data:", error);
      return false;
    }
  }

  // Private helper methods

  private static getFullKey(key: string): string {
    return `${this.PREFIX}${key}`;
  }

  private static isApproachingStorageLimit(data: string): boolean {
    try {
      // Rough estimate: most browsers have 5-10MB localStorage limit
      const currentUsage = JSON.stringify(localStorage).length;
      const dataSize = data.length;
      const estimatedLimit = 5 * 1024 * 1024; // 5MB

      return currentUsage + dataSize > estimatedLimit * 0.8; // 80% threshold
    } catch {
      return false;
    }
  }

  private static getStoragePercentageUsed(): number {
    try {
      const totalSize = JSON.stringify(localStorage).length;
      const estimatedLimit = 5 * 1024 * 1024; // 5MB estimate
      return Math.round((totalSize / estimatedLimit) * 100);
    } catch {
      return 0;
    }
  }
}
