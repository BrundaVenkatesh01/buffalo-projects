import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";
import { loadEnv } from "vite";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(({ mode }) => {
  // Load test environment variables from .env.test
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    test: {
      environment: "jsdom",
      setupFiles: ["./src/test/setup.ts", "./src/test/setup/firebase-mocks.ts"],
      exclude: [
        "**/node_modules/**",
        "**/dist/**",
        ".dev/**",
        "tests/**",
        "playwright-report/**",
        ".next/**",
        "context/**",
      ],
      globals: true,
      env,
      coverage: {
        provider: "v8", // Faster coverage collection than istanbul
        reporter: ["text", "json-summary", "html", "lcov"],
        exclude: [
          "**/*.test.ts",
          "**/*.test.tsx",
          "**/test/**",
          "**/*.config.*",
          "**/types/**",
          "**/*.d.ts",
          "**/*.stories.tsx",
          "**/*.stories.ts",
          "**/src/stories/**",
        ],
        thresholds: {
          lines: 70,
          functions: 60,
          branches: 60,
          statements: 70,
        },
      },
    },
  };
});
