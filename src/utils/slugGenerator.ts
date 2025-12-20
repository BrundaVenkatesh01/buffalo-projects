import { customAlphabet } from "nanoid";

const MAX_SLUG_LENGTH = 48;
const RANDOM_SUFFIX_LENGTH = 6;
const RANDOM_ALPHABET = "abcdefghijklmnopqrstuvwxyz0123456789";

const randomId = customAlphabet(RANDOM_ALPHABET, RANDOM_SUFFIX_LENGTH);

function normalizeBase(text: string): string {
  return text
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
    .replace(/--+/g, "-");
}

export function createSlug(name: string): string {
  const normalized = normalizeBase(name);

  if (!normalized) {
    return randomId();
  }

  if (normalized.length <= MAX_SLUG_LENGTH) {
    return normalized;
  }

  return normalized.slice(0, MAX_SLUG_LENGTH).replace(/(^-|-$)+/g, "");
}

export function withRandomSuffix(slug: string): string {
  const cleaned = slug.replace(/(^-|-$)+/g, "");
  const suffix = randomId();
  const combined = `${cleaned}-${suffix}`;

  if (combined.length <= MAX_SLUG_LENGTH) {
    return combined;
  }

  const allowedPrefixLength = Math.max(
    MAX_SLUG_LENGTH - (suffix.length + 1),
    12,
  );
  const prefix = cleaned
    .slice(0, allowedPrefixLength)
    .replace(/(^-|-$)+/g, "")
    .replace(/-+$/g, "");

  if (!prefix) {
    return suffix;
  }

  return `${prefix}-${suffix}`;
}
