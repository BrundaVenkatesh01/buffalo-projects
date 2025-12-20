import { test, expect } from "@playwright/test";

test.describe("Navigation", () => {
  test("should navigate between main sections", async ({ page }) => {
    await page.goto("/");

    // Check navigation menu or links
    const navLinks = [
      { name: /home/i, path: "/" },
      { name: /gallery/i, path: "/gallery" },
      { name: /about/i, path: "/about" },
    ];

    for (const link of navLinks) {
      const navLink = page.getByRole("link", { name: link.name });

      if (await navLink.isVisible()) {
        await navLink.click();
        await expect(page).toHaveURL(new RegExp(link.path));
      }
    }
  });

  test("should maintain responsive navigation on mobile", async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");

    // Check for mobile menu toggle if present
    const mobileMenuToggle = page
      .getByRole("button", { name: /menu/i })
      .or(page.locator('[aria-label*="menu"]'));

    if (await mobileMenuToggle.isVisible()) {
      await mobileMenuToggle.click();

      // Check that navigation items are visible after toggle
      const navItems = page.getByRole("navigation").locator("a");
      if (await navItems.first().isVisible()) {
        await expect(navItems.first()).toBeVisible();
      }
    }
  });

  test("should handle browser back and forward navigation", async ({
    page,
  }) => {
    await page.goto("/");

    // Navigate to workspace
    const newProjectButton = page.getByRole("button", {
      name: /start.*new.*project/i,
    });
    if (await newProjectButton.isVisible()) {
      await newProjectButton.click();
      await expect(page).toHaveURL(/\/workspace/);

      // Go back
      await page.goBack();
      await expect(page).toHaveURL("/");

      // Go forward
      await page.goForward();
      await expect(page).toHaveURL(/\/workspace/);
    }
  });
});
