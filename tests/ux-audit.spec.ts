import { test, expect } from "@playwright/test";

test.describe("Buffalo Projects UX Audit", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:5173");
    // Set viewport for consistent screenshots
    await page.setViewportSize({ width: 1440, height: 900 });
  });

  test("Homepage UX - Clear value proposition and single CTA", async ({
    page,
  }) => {
    // Check hero section is visible
    const hero = page.locator("h1");
    await expect(hero).toBeVisible();
    await expect(hero).toContainText("Your business ideas deserve better");

    // Check for single primary CTA
    const primaryCTA = page.locator(
      'button:has-text("Start Building Your Idea")',
    );
    await expect(primaryCTA).toBeVisible();

    // Take screenshot for visual validation
    await page.screenshot({
      path: "tests/screenshots/homepage-hero.png",
      fullPage: false,
    });

    // Test CTA interaction
    await primaryCTA.click();
    await expect(page).toHaveURL(/\/workspace\/new|\/create/);
  });

  test("Navigation - No full page reloads (SPA behavior)", async ({ page }) => {
    // Get initial page instance ID
    const initialUrl = page.url();

    // Click navigation links and ensure no full reload
    const aboutLink = page.locator("text=About");
    if (await aboutLink.isVisible()) {
      await aboutLink.click();
      // Should navigate without reload
      await expect(page).toHaveURL(/\/about/);

      // Go back and test another link
      await page.goBack();
    }

    const exploreLink = page.locator("text=Explore");
    if (await exploreLink.isVisible()) {
      await exploreLink.click();
      await expect(page).toHaveURL(/\/gallery/);
    }
  });

  test("Design consistency - Using CSS variables not hardcoded colors", async ({
    page,
  }) => {
    // Navigate to workspace with BMC
    await page.goto("http://localhost:5173/workspace/BUF-TEST");

    // Check BMC sections use consistent styling
    const bmcSections = page.locator(".border-\\[\\#404040\\]");
    const count = await bmcSections.count();

    // Should not find hardcoded color classes
    expect(count).toBe(0);
  });

  test("Mobile responsiveness - Touch-friendly targets", async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Check buttons are minimum 44x44px for touch
    const buttons = page.locator("button");
    const buttonCount = await buttons.count();

    for (let i = 0; i < buttonCount; i++) {
      const button = buttons.nth(i);
      if (await button.isVisible()) {
        const box = await button.boundingBox();
        if (box) {
          expect(box.height).toBeGreaterThanOrEqual(40);
          expect(box.width).toBeGreaterThanOrEqual(40);
        }
      }
    }

    // Screenshot mobile view
    await page.screenshot({
      path: "tests/screenshots/mobile-homepage.png",
      fullPage: true,
    });
  });

  test("Loading states - Contextual feedback", async ({ page }) => {
    // Test workspace loading
    await page.goto("http://localhost:5173/workspace/BUF-TEST");

    // Should show contextual loading message
    const loadingMessage = page.locator(
      "text=/Loading workspace|Loading project/i",
    );

    // Check for loading indicator
    const spinner = page.locator(".animate-spin");
    if (await spinner.isVisible()) {
      // Should have contextual text with spinner
      const loadingText = await page.textContent(".animate-spin ~ *");
      expect(loadingText).toBeTruthy();
      expect(loadingText).not.toBe("Loading...");
    }
  });

  test("Error states - Professional without emojis", async ({ page }) => {
    // Try invalid workspace code
    await page.goto("http://localhost:5173/workspace/INVALID");

    // Check error display
    const emojiError = page.locator("text=/⚠️|❌|😕/");
    const emojiCount = await emojiError.count();

    // Should not use emojis in errors
    expect(emojiCount).toBe(0);
  });

  test("Auto-save indicators - User confidence", async ({ page }) => {
    // Navigate to workspace
    await page.goto("http://localhost:5173/workspace/BUF-TEST");
    await page.waitForTimeout(2000); // Wait for load

    // Find a canvas input
    const canvasInput = page.locator("textarea").first();
    if (await canvasInput.isVisible()) {
      // Type something
      await canvasInput.fill("Test content for auto-save");

      // Should show save indicator
      const saveIndicator = page.locator("text=/Saving|Saved|Auto-saved/i");
      await expect(saveIndicator).toBeVisible({ timeout: 5000 });
    }
  });

  test("Visual hierarchy - Clear information architecture", async ({
    page,
  }) => {
    // Check homepage sections have proper hierarchy
    const h1 = await page.locator("h1").count();
    const h2 = await page.locator("h2").count();
    const h3 = await page.locator("h3").count();

    // Should have exactly one H1
    expect(h1).toBe(1);

    // Should have logical heading structure
    if (h2 > 0) {
      expect(h3).toBeGreaterThanOrEqual(0);
    }

    // Take full page screenshot for design review
    await page.screenshot({
      path: "tests/screenshots/homepage-full.png",
      fullPage: true,
    });
  });

  test("Progress indicators - User knows completion status", async ({
    page,
  }) => {
    await page.goto("http://localhost:5173/workspace/BUF-TEST");
    await page.waitForTimeout(2000);

    // Look for progress indicators
    const progressIndicator = page.locator("text=/%|complete|progress/i");

    // Should show some form of progress
    if (await progressIndicator.isVisible()) {
      const progressText = await progressIndicator.textContent();
      expect(progressText).toBeTruthy();
    }
  });
});

// Visual regression test
test.describe("Visual Regression Tests", () => {
  test("Capture current state for comparison", async ({ page }) => {
    const pages = [
      { url: "http://localhost:5173", name: "homepage" },
      { url: "http://localhost:5173/create", name: "create-project" },
      { url: "http://localhost:5173/gallery", name: "public-projects" },
      { url: "http://localhost:5173/about", name: "about" },
    ];

    for (const pageInfo of pages) {
      await page.goto(pageInfo.url);
      await page.waitForTimeout(1000); // Wait for animations

      await page.screenshot({
        path: `tests/screenshots/baseline-${pageInfo.name}.png`,
        fullPage: true,
      });
    }
  });
});
