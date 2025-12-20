#!/usr/bin/env node

/**
 * Verify environment variables are loaded correctly
 * This helps debug Firebase config issues
 */

import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

// Load environment variables from .env.local manually (like Next.js does)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Try to load .env.local
const envFiles = [".env.local", ".env"];
for (const envFile of envFiles) {
  try {
    const envPath = join(__dirname, "..", envFile);
    const envContent = readFileSync(envPath, "utf8");
    envContent.split("\n").forEach((line) => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith("#")) {
        const [key, ...valueParts] = trimmed.split("=");
        if (key && valueParts.length > 0 && !process.env[key.trim()]) {
          process.env[key.trim()] = valueParts.join("=").trim();
        }
      }
    });
  } catch (error) {
    // File doesn't exist, continue
  }
}

const EXPECTED_VARS = [
  "NEXT_PUBLIC_FIREBASE_API_KEY",
  "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
  "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
  "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
  "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
  "NEXT_PUBLIC_FIREBASE_APP_ID",
  "NEXT_PUBLIC_GEMINI_API_KEY",
  "NEXT_PUBLIC_SITE_URL",
];

console.log("🔍 Environment Variable Verification\n");
console.log("Environment:", process.env.NODE_ENV || "unknown");
console.log("Vercel:", process.env.VERCEL ? "Yes" : "No");
console.log("");

let hasIssues = false;

for (const varName of EXPECTED_VARS) {
  const value = process.env[varName];

  if (!value) {
    console.log(`❌ ${varName}: MISSING`);
    hasIssues = true;
  } else if (
    value.includes("your_") ||
    value.includes("_here") ||
    value.trim() === ""
  ) {
    console.log(`⚠️  ${varName}: PLACEHOLDER DETECTED`);
    console.log(`   Value: ${value.substring(0, 30)}...`);
    hasIssues = true;
  } else if (
    varName === "NEXT_PUBLIC_FIREBASE_API_KEY" &&
    !value.startsWith("AIza")
  ) {
    console.log(`⚠️  ${varName}: Invalid format (should start with 'AIza')`);
    console.log(`   Value: ${value.substring(0, 10)}...`);
    hasIssues = true;
  } else {
    const preview =
      value.length > 20
        ? `${value.substring(0, 8)}...${value.substring(value.length - 4)}`
        : value;
    console.log(`✅ ${varName}: ${preview}`);
  }
}

console.log("");

if (hasIssues) {
  console.log("❌ Issues detected! Fix the environment variables above.");
  process.exit(1);
} else {
  console.log("✅ All environment variables look good!");
  process.exit(0);
}
