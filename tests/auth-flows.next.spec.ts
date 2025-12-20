import { test, expect } from "@playwright/test";

test.describe("Auth pages (Next)", () => {
  test("Sign in screen renders form controls", async ({ page }) => {
    await page.goto("/signin");
    await expect(page.getByRole("heading", { name: /sign in/i })).toBeVisible();

    const email = page
      .getByLabel(/email/i)
      .or(page.locator('input[type="email"]'));
    const password = page
      .getByLabel(/password/i)
      .or(page.locator('input[type="password"]'));
    await expect(email).toBeVisible();
    await expect(password).toBeVisible();
  });

  test.skip(
    !process.env.E2E_EMAIL || !process.env.E2E_PASSWORD,
    "Requires E2E_EMAIL/E2E_PASSWORD to run live sign-in",
  );
  test("Live sign in (skipped unless creds)", async ({ page }) => {
    await page.goto("/signin");
    await page.fill('input[type="email"]', process.env.E2E_EMAIL!);
    await page.fill('input[type="password"]', process.env.E2E_PASSWORD!);
    await page.getByRole("button", { name: /sign in/i }).click();
    await expect(page).toHaveURL(/\/(studio|project)\//, { timeout: 20_000 });
  });
});
