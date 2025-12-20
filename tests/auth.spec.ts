import { test, expect } from "@playwright/test";

const builderEmail = process.env.E2E_EMAIL;
const builderPassword = process.env.E2E_PASSWORD;

test.describe("Authentication flows", () => {
  test("Sign-in form renders and rejects invalid credentials", async ({
    page,
  }) => {
    await page.goto("/signin");

    await expect(
      page.getByRole("heading", { level: 1, name: /sign in/i }),
    ).toBeVisible();

    await page.fill('input[type="email"]', "test@example.com");
    await page.fill('input[type="password"]', "wrong-password");
    await page.getByRole("button", { name: /sign in/i }).click();

    await expect(page).toHaveURL(/\/signin/i, { timeout: 5_000 });
  });

  test("Existing user can sign in and out", async ({ page }) => {
    test.skip(!builderEmail || !builderPassword, "Seeded credentials required");

    await page.goto("/signin");
    await page.fill('input[type="email"]', builderEmail!);
    await page.fill('input[type="password"]', builderPassword!);
    await page.getByRole("button", { name: /sign in/i }).click();

    await expect(page).toHaveURL(/workspace/i, { timeout: 15_000 });

    await page.locator("[data-radix-dropdown-menu-trigger]").click();
    await page.getByRole("menuitem", { name: /sign out/i }).click();
    await expect(page).toHaveURL(/\/?$/i, { timeout: 10_000 });
  });

  test("Protected routes redirect unauthenticated users", async ({ page }) => {
    await page.context().clearCookies();
    await page.goto("/mentor");
    await expect(page).toHaveURL(/\/profile/i, { timeout: 10_000 });
    await page.goto("/project/demo");
    await expect(page).toHaveURL(/\/signin/i, { timeout: 10_000 });
  });
});
