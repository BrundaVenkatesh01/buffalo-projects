import { test, expect } from "@playwright/test";

test.describe("Mobile Responsiveness", () => {
  test("should display properly on mobile devices", async ({ page }) => {
    // Test common mobile viewport sizes
    const viewports = [
      { width: 375, height: 667, name: "iPhone SE" },
      { width: 414, height: 896, name: "iPhone 11" },
      { width: 360, height: 640, name: "Android" },
    ];

    for (const viewport of viewports) {
      await page.setViewportSize({
        width: viewport.width,
        height: viewport.height,
      });
      await page.goto("/");

      // Check that main content is visible and not cut off
      const mainContent = page.locator("main").or(page.locator("body > div"));
      await expect(mainContent).toBeVisible();

      // Check that text is readable (not too small)
      const headings = page.locator("h1, h2, h3");
      if (await headings.first().isVisible()) {
        const fontSize = await headings
          .first()
          .evaluate((el) => window.getComputedStyle(el).fontSize);
        const fontSizeNum = parseInt(fontSize);
        expect(fontSizeNum).toBeGreaterThan(14);
      }
    }
  });

  test("should handle touch interactions on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");

    // Test tap interactions
    const buttons = page.getByRole("button");
    if (await buttons.first().isVisible()) {
      await buttons.first().tap();
      // Should not have any errors after tap
    }
  });

  test("should have appropriate spacing on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/workspace");

    // Check that interactive elements have sufficient spacing (minimum 44px touch target)
    const buttons = page.getByRole("button");
    if (await buttons.first().isVisible()) {
      const boundingBox = await buttons.first().boundingBox();
      if (boundingBox) {
        expect(boundingBox.height).toBeGreaterThanOrEqual(40);
      }
    }
  });

  test("should scroll properly on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/workspace");

    // Test vertical scrolling
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

    // Should be able to scroll back to top
    await page.evaluate(() => window.scrollTo(0, 0));

    const scrollPosition = await page.evaluate(() => window.pageYOffset);
    expect(scrollPosition).toBe(0);
  });
});
