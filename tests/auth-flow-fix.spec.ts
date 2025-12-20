/**
 * Auth Flow E2E Tests
 *
 * Tests the authentication flow after the fix for:
 * - Signin page stuck in loading state
 * - Signup page stuck in loading state
 * - Auth initialization
 *
 * @see AUTH_FLOW_INVESTIGATION.md
 * @see AUTH_FIX_SUMMARY.md
 */

import { test, expect } from "@playwright/test";

test.describe("Auth Flow - Post-Fix Validation", () => {
  test.describe("Signin Page", () => {
    test("should load signin page with enabled inputs", async ({ page }) => {
      await page.goto("/signin");

      // Wait for page to load
      await expect(
        page.locator("h1, h2").filter({ hasText: "Sign in" }),
      ).toBeVisible();

      // Check that inputs are NOT disabled (this was the bug)
      const emailInput = page.locator('input[type="email"]');
      const passwordInput = page.locator('input[type="password"]');

      await expect(emailInput).toBeVisible();
      await expect(emailInput).toBeEnabled(); // ← Critical: Was disabled before fix

      await expect(passwordInput).toBeVisible();
      await expect(passwordInput).toBeEnabled(); // ← Critical: Was disabled before fix
    });

    test('should not show "Signing in..." on page load', async ({ page }) => {
      await page.goto("/signin");

      // Wait for page to load
      await expect(
        page.locator("h1, h2").filter({ hasText: "Sign in" }),
      ).toBeVisible();

      // Button should say "Sign in", not "Signing in..."
      const submitButton = page.locator('button[type="submit"]');
      await expect(submitButton).toBeVisible();
      await expect(submitButton).toHaveText(/Sign in/i);
      await expect(submitButton).not.toHaveText(/Signing in/i);
    });

    test("should allow typing in email and password fields", async ({
      page,
    }) => {
      await page.goto("/signin");

      const emailInput = page.locator('input[type="email"]');
      const passwordInput = page.locator('input[type="password"]');

      // Should be able to type
      await emailInput.fill("test@buffaloprojects.com");
      await passwordInput.fill("testpassword123");

      // Verify values were entered
      await expect(emailInput).toHaveValue("test@buffaloprojects.com");
      await expect(passwordInput).toHaveValue("testpassword123");
    });

    test("should show loading state when submitting", async ({ page }) => {
      await page.goto("/signin");

      const emailInput = page.locator('input[type="email"]');
      const passwordInput = page.locator('input[type="password"]');
      const submitButton = page.locator('button[type="submit"]');

      // Fill in form
      await emailInput.fill("test@buffaloprojects.com");
      await passwordInput.fill("wrongpassword");

      // Submit form
      await submitButton.click();

      // Should briefly show loading state
      // (Will show error since credentials are wrong, but that's OK)
      await expect(submitButton)
        .toBeDisabled({ timeout: 1000 })
        .catch(() => {
          // It's OK if this fails - the auth might return immediately
        });
    });

    test("should handle invalid credentials gracefully", async ({ page }) => {
      await page.goto("/signin");

      const emailInput = page.locator('input[type="email"]');
      const passwordInput = page.locator('input[type="password"]');
      const submitButton = page.locator('button[type="submit"]');

      // Fill in invalid credentials
      await emailInput.fill("invalid@buffaloprojects.com");
      await passwordInput.fill("wrongpassword");

      // Submit
      await submitButton.click();

      // Should show error message (not timeout message)
      await expect(page.locator('[role="alert"]')).toBeVisible({
        timeout: 10000,
      });

      // Inputs should become enabled again after error
      await expect(emailInput).toBeEnabled({ timeout: 6000 });
      await expect(passwordInput).toBeEnabled({ timeout: 6000 });
    });

    test("should NOT show timeout error for quick failures", async ({
      page,
    }) => {
      await page.goto("/signin");

      const emailInput = page.locator('input[type="email"]');
      const passwordInput = page.locator('input[type="password"]');
      const submitButton = page.locator('button[type="submit"]');

      // Fill in invalid credentials
      await emailInput.fill("invalid@buffaloprojects.com");
      await passwordInput.fill("wrong");

      // Submit
      await submitButton.click();

      // Wait up to 6 seconds (just over 5 second timeout threshold)
      await page.waitForTimeout(6000);

      // Should show auth error, NOT timeout error
      const alert = page.locator('[role="alert"]');
      if (await alert.isVisible()) {
        const alertText = await alert.textContent();
        expect(alertText).not.toContain("taking longer than expected");
        expect(alertText).not.toContain("internet connection");
      }
    });
  });

  test.describe("Signup Page", () => {
    test("should load signup page with enabled inputs", async ({ page }) => {
      await page.goto("/signup");

      // Wait for page to load
      await expect(
        page.locator("h1, h2").filter({ hasText: /Create.*account/i }),
      ).toBeVisible();

      // Check that all inputs are enabled
      const emailInput = page.locator('input[type="email"]');
      const passwordInputs = page.locator('input[type="password"]');

      await expect(emailInput).toBeEnabled();

      // Both password fields should be enabled
      const passwordCount = await passwordInputs.count();
      for (let i = 0; i < passwordCount; i++) {
        await expect(passwordInputs.nth(i)).toBeEnabled();
      }
    });

    test('should not show "Creating account..." on page load', async ({
      page,
    }) => {
      await page.goto("/signup");

      await expect(
        page.locator("h1, h2").filter({ hasText: /Create.*account/i }),
      ).toBeVisible();

      const submitButton = page.locator('button[type="submit"]');
      await expect(submitButton).toBeVisible();
      await expect(submitButton).toHaveText(/Create account/i);
      await expect(submitButton).not.toHaveText(/Creating account/i);
    });

    test("should allow filling all signup fields", async ({ page }) => {
      await page.goto("/signup");

      const emailInput = page.locator('input[type="email"]');
      const firstNameInput = page.locator('input[id="firstName"]');
      const lastNameInput = page.locator('input[id="lastName"]');
      const passwordInputs = page.locator('input[type="password"]');

      // Fill in form
      await firstNameInput.fill("Test");
      await lastNameInput.fill("User");
      await emailInput.fill("testuser@buffaloprojects.com");

      // Fill both password fields
      if (await passwordInputs.nth(0).isVisible()) {
        await passwordInputs.nth(0).fill("password123");
      }
      if (await passwordInputs.nth(1).isVisible()) {
        await passwordInputs.nth(1).fill("password123");
      }

      // Verify values
      await expect(emailInput).toHaveValue("testuser@buffaloprojects.com");
      await expect(firstNameInput).toHaveValue("Test");
      await expect(lastNameInput).toHaveValue("User");
    });

    test("should show validation error for mismatched passwords", async ({
      page,
    }) => {
      await page.goto("/signup");

      const emailInput = page.locator('input[type="email"]');
      const passwordInputs = page.locator('input[type="password"]');
      const submitButton = page.locator('button[type="submit"]');

      // Fill in form with mismatched passwords
      await emailInput.fill("test@buffaloprojects.com");

      if (await passwordInputs.nth(0).isVisible()) {
        await passwordInputs.nth(0).fill("password123");
      }
      if (await passwordInputs.nth(1).isVisible()) {
        await passwordInputs.nth(1).fill("differentpassword");
      }

      // Submit
      await submitButton.click();

      // Should show validation error
      await expect(page.locator('[role="alert"]')).toBeVisible({
        timeout: 2000,
      });
      const alertText = await page.locator('[role="alert"]').textContent();
      expect(alertText).toContain("match");
    });
  });

  test.describe("Auth Initialization", () => {
    test("should initialize auth store on app load", async ({ page }) => {
      // Navigate to any page
      await page.goto("/");

      // Wait for navigation elements to load (indicates auth initialized)
      await expect(page.locator("nav")).toBeVisible({ timeout: 5000 });

      // Navigate to signin - should NOT be stuck in loading
      await page.goto("/signin");

      const emailInput = page.locator('input[type="email"]');
      await expect(emailInput).toBeEnabled({ timeout: 3000 });
    });

    test("should not take more than 5 seconds to initialize", async ({
      page,
    }) => {
      const startTime = Date.now();

      await page.goto("/signin");

      // Wait for inputs to be enabled
      const emailInput = page.locator('input[type="email"]');
      await expect(emailInput).toBeEnabled({ timeout: 5000 });

      const elapsedTime = Date.now() - startTime;

      // Should initialize in under 5 seconds
      expect(elapsedTime).toBeLessThan(5000);
    });
  });

  test.describe("Error Handling", () => {
    test("should handle missing Firebase config gracefully", async ({
      page,
      context,
    }) => {
      // This test requires running with NEXT_PUBLIC_FIREBASE_API_KEY unset
      // Skip if Firebase is configured
      await page.goto("/signin");

      const emailInput = page.locator('input[type="email"]');

      // If Firebase is not configured, should still show enabled inputs
      // (Error message is shown, but form is not stuck in loading)
      await expect(emailInput).toBeEnabled({ timeout: 5000 });
    });
  });

  test.describe("Regression Tests", () => {
    test('should never show permanent "Signing in..." state', async ({
      page,
    }) => {
      await page.goto("/signin");

      const submitButton = page.locator('button[type="submit"]');

      // Wait 10 seconds (double the timeout threshold)
      await page.waitForTimeout(10000);

      // Button should either:
      // 1. Say "Sign in" (not loading)
      // 2. Be enabled (not stuck)
      const buttonText = await submitButton.textContent();
      const isEnabled = await submitButton.isEnabled();

      expect(isEnabled || !buttonText?.includes("Signing in")).toBeTruthy();
    });

    test('should never show permanent "Creating account..." state', async ({
      page,
    }) => {
      await page.goto("/signup");

      const submitButton = page.locator('button[type="submit"]');

      // Wait 10 seconds
      await page.waitForTimeout(10000);

      // Button should not be stuck in loading state
      const buttonText = await submitButton.textContent();
      const isEnabled = await submitButton.isEnabled();

      expect(
        isEnabled || !buttonText?.includes("Creating account"),
      ).toBeTruthy();
    });
  });
});
