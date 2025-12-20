// Input validation and sanitization utilities
import {
  escapeHTML as baseEscapeHTML,
  sanitizeHTMLContent as baseSanitizeHTMLContent,
  sanitizeInput as baseSanitizeInput,
  sanitizeSearchQuery as baseSanitizeSearchQuery,
  sanitizeURL as baseSanitizeURL,
  sanitizeURLInput as baseSanitizeURLInput,
} from "@/utils/sanitize";

export const sanitizeInput = baseSanitizeInput;
export const sanitizeHTMLContent = baseSanitizeHTMLContent;
export const sanitizeURLInput = baseSanitizeURLInput;
export const sanitizeURL = baseSanitizeURL;
export const escapeHTML = baseEscapeHTML;
export const sanitizeSearchQuery = baseSanitizeSearchQuery;

/**
 * Validate project code format (BUF-XXXX)
 */
export const validateProjectCode = (code: string): boolean => {
  // Remove any non-alphanumeric characters except hyphen
  const sanitized = code.replace(/[^A-Z0-9-]/gi, "");
  return /^BUF-[A-Z0-9]{4}$/i.test(sanitized);
};

/**
 * Sanitize project code
 */
export const sanitizeProjectCode = (code: string): string => {
  return code
    .toUpperCase()
    .replace(/[^A-Z0-9-]/g, "")
    .slice(0, 8); // BUF-XXXX format
};

/**
 * Validate email format
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate URL format
 */
export const validateURL = (url: string): boolean => {
  if (!url) {
    return false;
  }
  return sanitizeURLInput(url).length > 0;
};

/**
 * Validate class code format
 */
export const validateClassCode = (code: string): boolean => {
  // Format: DEPT-###
  return /^[A-Z]{3,4}-\d{3}$/i.test(code);
};

/**
 * Sanitize class code
 */
export const sanitizeClassCode = (code: string): string => {
  return code
    .toUpperCase()
    .replace(/[^A-Z0-9-]/g, "")
    .slice(0, 8);
};

/**
 * Validate project name
 */
export const validateProjectName = (
  name: string,
): {
  isValid: boolean;
  error?: string;
} => {
  if (!name || name.trim().length === 0) {
    return { isValid: false, error: "Project name is required" };
  }

  if (name.length < 3) {
    return {
      isValid: false,
      error: "Project name must be at least 3 characters",
    };
  }

  if (name.length > 100) {
    return {
      isValid: false,
      error: "Project name must be less than 100 characters",
    };
  }

  // Check for potentially malicious patterns after sanitization
  const sanitized = sanitizeInput(name);
  if (sanitized.length !== name.trim().length) {
    return {
      isValid: false,
      error: "Project name contains invalid characters",
    };
  }

  return { isValid: true };
};

/**
 * Sanitize file name for safe storage
 */
export const sanitizeFileName = (fileName: string): string => {
  return fileName
    .replace(/[^a-z0-9.\-_]/gi, "_") // Replace invalid characters with underscore
    .replace(/\.{2,}/g, ".") // Remove multiple dots
    .slice(0, 255); // Limit length
};

/**
 * Validate file type for upload
 */
export const validateFileType = (
  fileName: string,
  allowedTypes: string[],
): boolean => {
  const extension = fileName.split(".").pop()?.toLowerCase();
  if (!extension) {
    return false;
  }
  return allowedTypes.includes(extension);
};

/**
 * Validate file size (in bytes)
 */
export const validateFileSize = (
  size: number,
  maxSizeInMB: number = 10,
): boolean => {
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  return size <= maxSizeInBytes;
};

/**
 * Rate limiting helper
 */
export class RateLimiter {
  private attempts: Map<string, number[]> = new Map();

  constructor(
    private maxAttempts: number = 10,
    private windowMs: number = 60000, // 1 minute
  ) {}

  isAllowed(key: string): boolean {
    const now = Date.now();
    const attempts = this.attempts.get(key) || [];

    // Remove old attempts outside the window
    const validAttempts = attempts.filter((time) => now - time < this.windowMs);

    if (validAttempts.length >= this.maxAttempts) {
      return false;
    }

    validAttempts.push(now);
    this.attempts.set(key, validAttempts);

    return true;
  }

  reset(key: string): void {
    this.attempts.delete(key);
  }
}

/**
 * Validate password strength
 */
export const validatePassword = (
  password: string,
): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push("Password must be at least 8 characters");
  }

  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  }

  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter");
  }

  if (!/\d/.test(password)) {
    errors.push("Password must contain at least one number");
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push("Password must contain at least one special character");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};
