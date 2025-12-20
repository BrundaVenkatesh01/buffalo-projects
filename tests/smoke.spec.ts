import { test, expect } from "@playwright/test";

test.describe("Buffalo Projects smoke", () => {
  test("Landing hero renders and primary CTA is visible", async ({ page }) => {
    await page.goto("/");

    await expect(
      page.getByRole("heading", {
        level: 1,
        name: /buffalo projects/i,
      }),
    ).toBeVisible();

    await expect(
      page.getByRole("button", { name: /start.*new.*project/i }),
    ).toBeVisible();
  });

  test("Global navigation links to resources and about", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("link", { name: /resources/i }).click();
    await expect(
      page.getByRole("heading", { level: 1, name: /resources/i }),
    ).toBeVisible();

    await page.getByRole("link", { name: /about/i }).click();
    await expect(
      page.getByRole("heading", { level: 1, name: /about/i }),
    ).toBeVisible();
  });

  test("Protected dashboard redirects unauthenticated users to sign in", async ({
    page,
  }) => {
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/\/signin/i);
    await expect(
      page.getByRole("heading", { level: 1, name: /sign in/i }),
    ).toBeVisible();
  });

  test("Unknown route falls back to not found experience", async ({ page }) => {
    await page.goto("/totally-made-up-route");

    await expect(
      page.getByRole("heading", { level: 1, name: /404/ }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: /return home/i }),
    ).toBeVisible();
  });
});
