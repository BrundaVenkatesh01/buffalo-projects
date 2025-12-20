#!/usr/bin/env node
/**
 * Lightweight secret scanner for CI and pre-commit hooks.
 * - Scans repo (or provided file list) for common secret patterns.
 * - Exits non-zero on findings unless SECRETS_SCAN_ALLOW_FAILURE=true.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { resolve, relative } from "node:path";

const root = resolve(process.cwd());
const args = process.argv.slice(2);
const providedFiles = args.filter((a) => !a.startsWith("-"));
const isStagedMode = args.includes("--staged");
const allowFailure = process.env.SECRETS_SCAN_ALLOW_FAILURE === "true";

const defaultIgnore = new Set([
  "node_modules",
  ".git",
  "dist",
  "build",
  "coverage",
  ".next",
  ".vercel",
  ".vscode",
  "playwright-report",
  "test-results",
]);

const allowedEnvFiles = new Set([".env.example"]);

const patterns = [
  { name: "Firebase API Key", regex: /AIza[0-9A-Za-z\-_]{35}/g },
  { name: "Private Key", regex: /-----BEGIN (?:RSA )?PRIVATE KEY-----/g },
  { name: "AWS Access Key", regex: /AKIA[0-9A-Z]{16}/g },
  { name: "GitHub Token", regex: /ghp_[A-Za-z0-9]{36}/g },
  { name: "Stripe Secret", regex: /sk_(?:live|test)_[A-Za-z0-9]{24,}/g },
  { name: "Sentry DSN", regex: /https?:\/\/[A-Za-z0-9]+@sentry\.io\/[0-9]+/g },
  { name: "PostHog Key", regex: /phc_[A-Za-z0-9_\-]{20,}/g },
];

const findings = [];

function shouldIgnorePath(filePath) {
  const rel = relative(root, filePath);
  const parts = rel.split(/[\\/]/);
  return parts.some((p) => defaultIgnore.has(p));
}

function scanFile(filePath) {
  if (shouldIgnorePath(filePath)) return;
  let content;
  try {
    const stats = statSync(filePath);
    if (!stats.isFile() || stats.size > 1024 * 1024) return; // skip >1MB
    const base = filePath.split(/[\\/]/).pop();
    if (
      base &&
      base.startsWith(".") &&
      base !== ".env" &&
      base !== ".env.local" &&
      base !== ".env"
    )
      return;
    if (base && base.startsWith(".env") && !allowedEnvFiles.has(base)) {
      findings.push({ file: filePath, line: 1, match: "Committed .env file" });
      return;
    }
    content = readFileSync(filePath, "utf8");
  } catch {
    return;
  }
  const lines = content.split(/\r?\n/);
  lines.forEach((line, i) => {
    for (const { name, regex } of patterns) {
      if (regex.test(line)) {
        findings.push({ file: filePath, line: i + 1, match: name });
      }
      regex.lastIndex = 0; // reset
    }
  });
}

function walk(dir) {
  if (shouldIgnorePath(dir)) return;
  let entries = [];
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const e of entries) {
    const full = resolve(dir, e.name);
    try {
      if (e.isDirectory()) walk(full);
      else if (e.isFile()) scanFile(full);
    } catch {
      /* ignore */
    }
  }
}

if (providedFiles.length > 0 && isStagedMode) {
  for (const f of providedFiles) {
    const p = resolve(root, f);
    scanFile(p);
  }
} else if (providedFiles.length > 0) {
  for (const f of providedFiles) scanFile(resolve(root, f));
} else {
  walk(root);
}

if (findings.length > 0) {
  console.error("\nSecret scan failed with findings:");
  for (const f of findings) {
    console.error(` - ${relative(root, f.file)}:${f.line} => ${f.match}`);
  }
  if (!allowFailure) process.exit(1);
}

process.exit(0);
