import createDOMPurify from "dompurify";
import type { Config, WindowLike } from "dompurify";

type AllowedTags = NonNullable<Config["ALLOWED_TAGS"]>;
type AllowedAttributes = NonNullable<Config["ALLOWED_ATTR"]>;

const DEFAULT_ALLOWED_TAGS: AllowedTags = [
  "a",
  "b",
  "br",
  "code",
  "del",
  "em",
  "h1",
  "h2",
  "h3",
  "i",
  "li",
  "ol",
  "p",
  "pre",
  "strong",
  "ul",
  "blockquote",
];

const DEFAULT_ALLOWED_ATTR: AllowedAttributes = ["href", "target", "rel"];

const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

let purifier: ReturnType<typeof createDOMPurify> | null = null;

const isWindowLike = (value: unknown): value is WindowLike =>
  typeof value === "object" &&
  value !== null &&
  "document" in (value as Record<string, unknown>);

const getPurifier = (): ReturnType<typeof createDOMPurify> | null => {
  if (purifier) {
    return purifier;
  }

  if (typeof window !== "undefined" && window.document) {
    purifier = createDOMPurify(window as unknown as WindowLike);
    return purifier;
  }

  const maybeWindow = (globalThis as Record<string, unknown>)?.["window"];
  if (isWindowLike(maybeWindow)) {
    purifier = createDOMPurify(maybeWindow);
    return purifier;
  }

  return null;
};

const sanitizeWithConfig = (
  input: string,
  config: Config,
  fallbackEscape = true,
): string => {
  if (!input) {
    return "";
  }

  const instance = getPurifier();
  if (!instance && fallbackEscape) {
    return escapeHtml(input);
  }

  if (!instance) {
    return "";
  }

  return instance.sanitize(input, config);
};

export interface SanitizeHtmlOptions {
  allowedTags?: AllowedTags;
  allowedAttributes?: AllowedAttributes;
  useEscapeFallback?: boolean;
}

export const sanitizeInput = (input: string): string =>
  sanitizeWithConfig(
    input,
    {
      ALLOWED_TAGS: [],
      ALLOWED_ATTR: [],
    },
    true,
  ).trim();

export const sanitizeHTMLContent = (
  input: string,
  options: SanitizeHtmlOptions = {},
): string =>
  sanitizeWithConfig(
    input,
    {
      ALLOWED_TAGS: options.allowedTags ?? DEFAULT_ALLOWED_TAGS,
      ALLOWED_ATTR: options.allowedAttributes ?? DEFAULT_ALLOWED_ATTR,
    },
    options.useEscapeFallback ?? true,
  );

export const sanitizeURLInput = (value: string): string => {
  if (!value) {
    return "";
  }

  try {
    const parsed = new URL(value);

    if (!["http:", "https:"].includes(parsed.protocol)) {
      return "";
    }

    const blocked = ["javascript:", "data:", "vbscript:"];
    if (blocked.some((prefix) => parsed.href.startsWith(prefix))) {
      return "";
    }

    return parsed.toString();
  } catch {
    return "";
  }
};

export const sanitizeURL = (value: string): string => sanitizeURLInput(value);

export const escapeHTML = (input: string): string => escapeHtml(input);

export const sanitizeSearchQuery = (query: string): string =>
  query
    .replace(/[^\w\s-]/g, "")
    .trim()
    .slice(0, 100);
