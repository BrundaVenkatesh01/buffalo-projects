import { test, expect } from "@playwright/test";

/**
 * Gallery Auth Tests - Auth-Only Design
 * Gallery is protected by middleware - only authenticated users can access
 * No threshold-based public access
 */
test.describe("Gallery Auth Flow", () => {
  test("redirects unauthenticated users to signin with redirect parameter", async ({
    page,
  }) => {
    // Visit gallery page without being logged in
    await page.goto("/gallery");

    // Should redirect to signin with ?redirect=/gallery
    await expect(page).toHaveURL(/\/signin\?redirect=%2Fgallery/);

    // Verify signin page loaded
    await expect(page.getByRole("heading", { name: /sign in/i })).toBeVisible();
  });

  test("authenticated users can access gallery directly", async ({
    page,
    context,
  }) => {
    // Skip if no E2E credentials
    if (!process.env.E2E_EMAIL || !process.env.E2E_PASSWORD) {
      test.skip();
      return;
    }

    // Sign in first
    await page.goto("/signin");

    // Wait for signin form
    await page.waitForSelector('input[type="email"]', { state: "visible" });

    // Fill in credentials
    await page.fill('input[type="email"]', process.env.E2E_EMAIL);
    await page.fill('input[type="password"]', process.env.E2E_PASSWORD);

    // Submit form
    await page.click('button[type="submit"]');

    // Wait for successful signin (should redirect to profile or home)
    await page.waitForURL(/\/(profile|$)/, { timeout: 10000 });

    // Now visit gallery page
    await page.goto("/gallery");

    // Should stay on gallery page (not redirect)
    await expect(page).toHaveURL(/\/gallery$/);

    // Should see gallery content (heading or grid)
    // Note: May show empty state if no published projects
    await expect(
      page.locator("text=/Gallery|No projects/i").first(),
    ).toBeVisible({ timeout: 5000 });
  });

  test("navigation includes Gallery link", async ({ page }) => {
    await page.goto("/");

    // Should see Gallery link in navigation
    const galleryLink = page.getByRole("link", { name: /gallery/i });
    await expect(galleryLink).toBeVisible();

    // Link should point to /gallery
    await expect(galleryLink).toHaveAttribute("href", "/gallery");
  });

  test("signin redirect parameter works correctly", async ({ page }) => {
    // Skip if no E2E credentials
    if (!process.env.E2E_EMAIL || !process.env.E2E_PASSWORD) {
      test.skip();
      return;
    }

    // Visit gallery page (should redirect to signin)
    await page.goto("/gallery");
    await expect(page).toHaveURL(/\/signin\?redirect=%2Fgallery/);

    // Sign in
    await page.waitForSelector('input[type="email"]', { state: "visible" });
    await page.fill('input[type="email"]', process.env.E2E_EMAIL);
    await page.fill('input[type="password"]', process.env.E2E_PASSWORD);
    await page.click('button[type="submit"]');

    // Should redirect back to gallery after successful signin
    await page.waitForURL(/\/gallery/, { timeout: 10000 });

    // Verify we're on gallery page
    await expect(page).toHaveURL(/\/gallery$/);
  });

  test("gallery displays published projects and supports filtering", async ({
    page,
  }) => {
    // Skip if no E2E credentials
    if (!process.env.E2E_EMAIL || !process.env.E2E_PASSWORD) {
      test.skip();
      return;
    }

    // Sign in first
    await page.goto("/signin");
    await page.waitForSelector('input[type="email"]', { state: "visible" });
    await page.fill('input[type="email"]', process.env.E2E_EMAIL);
    await page.fill('input[type="password"]', process.env.E2E_PASSWORD);
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/(profile|$)/, { timeout: 10000 });

    // Visit gallery
    await page.goto("/gallery");
    await expect(page).toHaveURL(/\/gallery$/);

    // Check for gallery heading
    await expect(
      page.getByRole("heading", { name: /Community Gallery/i }),
    ).toBeVisible();

    // Check for search input
    const searchInput = page.getByPlaceholder(/search projects/i);
    await expect(searchInput).toBeVisible();

    // Check for filter buttons (location and stage filters)
    await expect(
      page.getByRole("button", { name: /All Locations/i }),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: /All Stages/i }),
    ).toBeVisible();

    // If there are projects, verify the grid displays
    const projectCards = page.locator("a[href^='/p/']");
    const projectCount = await projectCards.count();

    if (projectCount > 0) {
      // Verify first project card has expected structure
      const firstCard = projectCards.first();
      await expect(firstCard).toBeVisible();

      // Check that links use slug-only URLs (not code fallback)
      const firstHref = await firstCard.getAttribute("href");
      expect(firstHref).toMatch(/^\/p\/[a-z0-9-]+$/);
    }
  });

  test("gallery supports infinite scroll for pagination", async ({ page }) => {
    // Skip if no E2E credentials
    if (!process.env.E2E_EMAIL || !process.env.E2E_PASSWORD) {
      test.skip();
      return;
    }

    // Sign in first
    await page.goto("/signin");
    await page.waitForSelector('input[type="email"]', { state: "visible" });
    await page.fill('input[type="email"]', process.env.E2E_EMAIL);
    await page.fill('input[type="password"]', process.env.E2E_PASSWORD);
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/(profile|$)/, { timeout: 10000 });

    // Visit gallery
    await page.goto("/gallery");
    await expect(page).toHaveURL(/\/gallery$/);

    // Count initial projects
    const initialProjectCount = await page.locator("a[href^='/p/']").count();

    // If we have more than 20 projects, test infinite scroll
    if (initialProjectCount >= 20) {
      // Scroll to bottom to trigger infinite scroll
      await page.evaluate(() => {
        window.scrollTo(0, document.body.scrollHeight);
      });

      // Wait for loading indicator or new projects
      await page.waitForTimeout(2000);

      // Check if more projects loaded
      const newProjectCount = await page.locator("a[href^='/p/']").count();

      // Either more projects loaded, or we see the "end" message
      const hasMoreProjects = newProjectCount > initialProjectCount;
      const hasEndMessage = await page
        .locator("text=/reached the end/i")
        .isVisible()
        .catch(() => false);

      expect(hasMoreProjects || hasEndMessage).toBeTruthy();
    }
  });
});
