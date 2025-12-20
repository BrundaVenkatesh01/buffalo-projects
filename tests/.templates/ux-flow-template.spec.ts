import { test, expect } from "@playwright/test";
import { injectAxe, checkA11y } from "axe-playwright";

/**
 * UX Flow Test Template
 *
 * Copy this template when creating new user flow tests.
 * Remove sections you don't need.
 */

test.describe("Feature Name - User Flow", () => {
  // Configure viewport for consistent testing
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
  });

  test("Complete user journey", async ({ page }) => {
    // 1. Navigate to starting point
    await page.goto("/your-route");
    await page.waitForLoadState("networkidle");

    // 2. Verify initial state
    await expect(page.locator("h1")).toBeVisible();

    // Optional: Screenshot for visual regression
    await page.screenshot({
      path: "tests/screenshots/feature-initial-state.png",
      fullPage: true,
    });

    // 3. Perform user actions
    await page.fill('[name="input"]', "Test value");
    await page.click('button:has-text("Submit")');

    // 4. Verify expected outcome
    await expect(page).toHaveURL(/\/expected-route/);
    await expect(page.locator('[data-testid="success-message"]')).toBeVisible();
  });

  test("Handles error states gracefully", async ({ page }) => {
    await page.goto("/your-route");

    // Trigger error condition
    await page.click('button:has-text("Submit")'); // Without filling form

    // Verify error feedback
    await expect(page.locator('[role="alert"]')).toBeVisible();
    await expect(page.locator("input:invalid")).toHaveCount(1);
  });

  test("Shows loading states during async operations", async ({ page }) => {
    await page.goto("/your-route");

    // Trigger async action
    await page.click('button:has-text("Save")');

    // Verify loading indicator appears
    await expect(page.locator('[aria-busy="true"]')).toBeVisible();

    // Verify loading clears after completion
    await expect(page.locator('[aria-busy="true"]')).not.toBeVisible({
      timeout: 5000,
    });
  });

  test("Is accessible (WCAG AA)", async ({ page }) => {
    await page.goto("/your-route");
    await injectAxe(page);

    await checkA11y(page, undefined, {
      axeOptions: {
        runOnly: ["wcag2a", "wcag2aa"],
      },
      detailedReport: true,
      detailedReportOptions: { html: true },
    });
  });

  test("Works on mobile viewport", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/your-route");

    // Verify mobile layout
    await expect(page.locator("nav")).toBeVisible();

    // Verify touch targets are large enough (min 44x44px)
    const buttons = page.locator("button");
    const buttonCount = await buttons.count();

    for (let i = 0; i < Math.min(buttonCount, 5); i++) {
      const button = buttons.nth(i);
      if (await button.isVisible()) {
        const box = await button.boundingBox();
        if (box) {
          expect(box.height).toBeGreaterThanOrEqual(44);
          expect(box.width).toBeGreaterThanOrEqual(44);
        }
      }
    }

    // Mobile screenshot
    await page.screenshot({
      path: "tests/screenshots/feature-mobile.png",
      fullPage: true,
    });
  });
});
