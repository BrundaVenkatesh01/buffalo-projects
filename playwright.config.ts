import { defineConfig, devices } from "@playwright/test";

const isCI = !!process.env["CI"];
const PORT = process.env["PORT"] || "3000";
const BASE_URL = process.env["BASE_URL"] || `http://localhost:${PORT}`;

export default defineConfig({
  testDir: "./tests",
  testMatch: ["**/*.next.spec.ts"],
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  // Only set workers on CI to satisfy exactOptionalPropertyTypes
  ...(isCI ? { workers: 1 as const } : {}),
  reporter: "html",
  use: {
    baseURL: BASE_URL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },
    {
      name: "Mobile Chrome",
      use: { ...devices["Pixel 5"] },
    },
    {
      name: "Mobile Safari",
      use: { ...devices["iPhone 12"] },
    },
  ],

  webServer: {
    command: "npm run dev",
    url: BASE_URL,
    reuseExistingServer: true,
    timeout: 120 * 1000,
  },
});
