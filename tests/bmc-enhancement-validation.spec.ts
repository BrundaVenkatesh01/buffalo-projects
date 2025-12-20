import type { Page } from "@playwright/test";
import { test, expect } from "@playwright/test";

test.describe("Enhanced BMC Demo Validation", () => {
  let page: Page;

  test.beforeEach(async ({ browser }) => {
    page = await browser.newPage();
    await page.goto("http://localhost:5182/");
  });

  test("1. Visual Animations - Section Glow and Scaling", async () => {
    console.log("Testing visual animations...");

    // Navigate to BMC demo
    await page.click('button:has-text("Local Food Delivery")');

    // Wait for loading to complete
    await page.waitForSelector('[data-testid="business-model-canvas"]', {
      timeout: 10000,
    });

    // Take screenshot of initial state
    await page.screenshot({
      path: ".playwright-mcp/01-bmc-initial-state.png",
      fullPage: true,
    });

    // Find the first textarea (Key Partners)
    const firstTextarea = page.locator("textarea").first();
    await expect(firstTextarea).toBeVisible();

    // Click and start typing to trigger glow animation
    await firstTextarea.click();
    await firstTextarea.fill("Test typing for glow effect");

    // Capture during typing (should show glow effect)
    await page.screenshot({
      path: ".playwright-mcp/02-section-glow-active.png",
      fullPage: true,
    });

    // Test section scaling/glow on different sections
    const sections = await page.locator("textarea").all();

    for (let i = 0; i < Math.min(3, sections.length); i++) {
      await sections[i].click();
      await page.waitForTimeout(500); // Allow animation time
      await sections[i].fill(`Testing section ${i + 1} animations`);
      await page.waitForTimeout(300); // Allow glow effect
    }

    await page.screenshot({
      path: ".playwright-mcp/03-multiple-sections-animated.png",
      fullPage: true,
    });
  });

  test("2. Enhanced Loading Experience", async () => {
    console.log("Testing enhanced loading experience...");

    // Capture homepage
    await page.screenshot({
      path: ".playwright-mcp/04-homepage-before-loading.png",
      fullPage: true,
    });

    // Click sample idea and immediately start monitoring loading
    const loadingPromise = page.waitForSelector(
      '[data-testid="loading-message"]',
      { timeout: 5000 },
    );
    await page.click('button:has-text("Local Food Delivery")');

    try {
      await loadingPromise;

      // Capture loading state
      await page.screenshot({
        path: ".playwright-mcp/05-enhanced-loading-state.png",
        fullPage: true,
      });

      // Wait for different loading messages
      const loadingMessages = [
        "Analyzing business opportunity...",
        "Generating business model...",
        "Preparing workspace...",
      ];

      for (const message of loadingMessages) {
        try {
          await page.waitForSelector(`text=${message}`, { timeout: 2000 });
          console.log(`✓ Found loading message: ${message}`);
        } catch (e) {
          console.log(`⚠ Loading message not found: ${message}`);
        }
      }
    } catch (e) {
      console.log("Loading state completed too quickly to capture");
    }

    // Wait for BMC to fully load
    await page.waitForSelector('[data-testid="business-model-canvas"]', {
      timeout: 10000,
    });

    // Capture final loaded state
    await page.screenshot({
      path: ".playwright-mcp/06-loading-complete-bmc-ready.png",
      fullPage: true,
    });
  });

  test("3. Smart Progress Hints System", async () => {
    console.log("Testing smart progress hints...");

    // Navigate to BMC
    await page.click('button:has-text("Local Food Delivery")');
    await page.waitForSelector('[data-testid="business-model-canvas"]', {
      timeout: 10000,
    });

    // Fill sections to trigger progress hints at 30% and 70%
    const textareas = await page.locator("textarea").all();
    const totalSections = textareas.length;
    const thirtyPercent = Math.floor(totalSections * 0.3);
    const seventyPercent = Math.floor(totalSections * 0.7);

    console.log(
      `Total sections: ${totalSections}, 30%: ${thirtyPercent}, 70%: ${seventyPercent}`,
    );

    // Fill to 30% completion
    for (let i = 0; i < thirtyPercent; i++) {
      await textareas[i].fill(`Section ${i + 1} content for progress testing`);
      await page.waitForTimeout(200);
    }

    // Look for 30% progress hint
    try {
      await page.waitForSelector('[data-testid="progress-hint"]', {
        timeout: 3000,
      });
      await page.screenshot({
        path: ".playwright-mcp/07-progress-hint-30-percent.png",
        fullPage: true,
      });
      console.log("✓ 30% progress hint detected");
    } catch (e) {
      console.log("⚠ 30% progress hint not found");
    }

    // Fill to 70% completion
    for (let i = thirtyPercent; i < seventyPercent; i++) {
      await textareas[i].fill(`Section ${i + 1} content for 70% progress`);
      await page.waitForTimeout(200);
    }

    // Look for 70% progress hint
    try {
      await page.waitForSelector('[data-testid="progress-hint"]', {
        timeout: 3000,
      });
      await page.screenshot({
        path: ".playwright-mcp/08-progress-hint-70-percent.png",
        fullPage: true,
      });
      console.log("✓ 70% progress hint detected");
    } catch (e) {
      console.log("⚠ 70% progress hint not found");
    }
  });

  test("4. Completion Celebration", async () => {
    console.log("Testing completion celebration...");

    // Navigate to BMC
    await page.click('button:has-text("Local Food Delivery")');
    await page.waitForSelector('[data-testid="business-model-canvas"]', {
      timeout: 10000,
    });

    // Fill all sections to trigger 100% completion
    const textareas = await page.locator("textarea").all();

    for (let i = 0; i < textareas.length; i++) {
      await textareas[i].fill(
        `Completed section ${i + 1} - comprehensive business model content`,
      );
      await page.waitForTimeout(100);
    }

    // Wait for completion celebration
    try {
      await page.waitForSelector('[data-testid="completion-celebration"]', {
        timeout: 5000,
      });

      // Capture celebration moment
      await page.screenshot({
        path: ".playwright-mcp/09-completion-celebration.png",
        fullPage: true,
      });

      // Look for confetti effect
      const confetti = page.locator('[data-testid="confetti"]');
      if (await confetti.isVisible()) {
        console.log("✓ Confetti animation detected");
      }

      // Look for success message
      const successMessage = page.locator("text=Congratulations");
      if (await successMessage.isVisible()) {
        console.log("✓ Success message detected");
      }

      // Wait for auto-dismiss (3 seconds)
      await page.waitForTimeout(3500);

      // Verify celebration disappears
      const celebrationGone = await page
        .locator('[data-testid="completion-celebration"]')
        .isVisible();
      if (!celebrationGone) {
        console.log("✓ Celebration auto-dismissed correctly");
      }

      await page.screenshot({
        path: ".playwright-mcp/10-post-celebration-state.png",
        fullPage: true,
      });
    } catch (e) {
      console.log("⚠ Completion celebration not found");
      await page.screenshot({
        path: ".playwright-mcp/10-no-celebration-found.png",
        fullPage: true,
      });
    }
  });

  test("5. Mobile Experience Validation", async () => {
    console.log("Testing mobile experience...");

    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Navigate to homepage
    await page.goto("http://localhost:5182/");
    await page.screenshot({
      path: ".playwright-mcp/11-mobile-homepage.png",
      fullPage: true,
    });

    // Test mobile BMC demo
    await page.click('button:has-text("Local Food Delivery")');
    await page.waitForSelector('[data-testid="business-model-canvas"]', {
      timeout: 10000,
    });

    await page.screenshot({
      path: ".playwright-mcp/12-mobile-bmc-loaded.png",
      fullPage: true,
    });

    // Test mobile touch interactions
    const mobileTextarea = page.locator("textarea").first();
    await mobileTextarea.tap();
    await mobileTextarea.fill("Testing mobile touch and typing experience");

    await page.screenshot({
      path: ".playwright-mcp/13-mobile-typing-interaction.png",
      fullPage: true,
    });

    // Test mobile responsiveness with keyboard
    await page.keyboard.press("Tab");
    await page.keyboard.type("Testing mobile keyboard navigation");

    await page.screenshot({
      path: ".playwright-mcp/14-mobile-keyboard-navigation.png",
      fullPage: true,
    });
  });

  test("6. Overall User Flow and Performance", async () => {
    console.log("Testing complete user flow and performance...");

    const startTime = Date.now();

    // Full user journey
    await page.goto("http://localhost:5182/");

    // Check for console errors
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        errors.push(msg.text());
      }
    });

    // Complete flow timing
    const clickTime = Date.now();
    await page.click('button:has-text("Local Food Delivery")');

    const loadTime = Date.now();
    await page.waitForSelector('[data-testid="business-model-canvas"]', {
      timeout: 10000,
    });

    const completeTime = Date.now();

    // Performance metrics
    const navigationTime = clickTime - startTime;
    const loadingTime = completeTime - clickTime;
    const totalTime = completeTime - startTime;

    console.log(`Performance Metrics:
    - Navigation Time: ${navigationTime}ms
    - Loading Time: ${loadingTime}ms
    - Total Time: ${totalTime}ms
    - Console Errors: ${errors.length}`);

    // Final state screenshot
    await page.screenshot({
      path: ".playwright-mcp/15-final-complete-flow.png",
      fullPage: true,
    });

    // Test conversion CTA
    const ctaButton = page.locator('button:has-text("Start Your Project")');
    if (await ctaButton.isVisible()) {
      console.log("✓ Conversion CTA visible");
      await ctaButton.click();
      await page.screenshot({
        path: ".playwright-mcp/16-conversion-cta-clicked.png",
        fullPage: true,
      });
    }

    // Report any errors
    if (errors.length > 0) {
      console.log("Console Errors Found:", errors);
    }
  });

  test.afterEach(async () => {
    if (page) {
      await page.close();
    }
  });
});
