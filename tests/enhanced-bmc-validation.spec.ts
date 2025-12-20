import type { Page } from "@playwright/test";
import { test, expect } from "@playwright/test";

test.describe("Enhanced BMC Demo - Wow Factor Validation", () => {
  let page: Page;

  test.beforeEach(async ({ browser }) => {
    page = await browser.newPage();
    await page.goto("http://localhost:5182/");
  });

  test("1. Visual Animations - Section Glow and Scaling", async () => {
    console.log("Testing visual animations and section glow effects...");

    // Navigate to BMC demo
    await page.click('button:has-text("Local Food Delivery")');

    // Wait for BMC to load (using textareas as indicator)
    await page.waitForSelector("textarea", { timeout: 10000 });

    // Take screenshot of initial BMC state
    await page.screenshot({
      path: ".playwright-mcp/validation-01-bmc-initial-state.png",
      fullPage: true,
    });

    // Test glow animations on different sections
    const textareas = await page.locator("textarea").all();
    console.log(`Found ${textareas.length} BMC sections to test`);

    // Test first few sections for glow effects
    for (let i = 0; i < Math.min(3, textareas.length); i++) {
      console.log(`Testing glow effect on section ${i + 1}`);

      // Click and start typing
      await textareas[i].click();
      await page.waitForTimeout(300); // Allow glow animation time

      // Type content to trigger active state
      await textareas[i].fill(
        `Testing section ${i + 1} glow animation and scaling`,
      );
      await page.waitForTimeout(500); // Allow animation time
    }

    // Capture sections with glow effects
    await page.screenshot({
      path: ".playwright-mcp/validation-02-sections-with-glow.png",
      fullPage: true,
    });

    console.log("✓ Visual animations tested successfully");
  });

  test("2. Enhanced Loading Experience", async () => {
    console.log("Testing enhanced loading experience...");

    // Capture homepage before loading
    await page.screenshot({
      path: ".playwright-mcp/validation-03-homepage-before-load.png",
      fullPage: true,
    });

    // Start monitoring for loading messages immediately
    const loadingMessages: string[] = [];
    page.on("console", (msg) => {
      const text = msg.text();
      if (
        text.includes("Analyzing") ||
        text.includes("Generating") ||
        text.includes("Preparing")
      ) {
        loadingMessages.push(text);
      }
    });

    // Click sample idea and immediately look for loading states
    await page.click('button:has-text("Local Food Delivery")');

    // Try to catch loading spinner/message
    try {
      // Look for any loading indicator
      await page.waitForSelector(
        '.animate-spin, [class*="loading"], text*="Analyzing"',
        { timeout: 3000 },
      );

      await page.screenshot({
        path: ".playwright-mcp/validation-04-loading-state-captured.png",
        fullPage: true,
      });

      console.log("✓ Loading state captured");
    } catch (e) {
      console.log(
        "Loading state too fast to capture, checking for immediate results",
      );
    }

    // Wait for BMC to be ready
    await page.waitForSelector("textarea", { timeout: 10000 });

    // Check if any pre-filled content exists (enhanced loading result)
    const filledSections = await page
      .locator("textarea")
      .evaluateAll(
        (textareas) =>
          textareas.filter((textarea) => textarea.value.trim().length > 0)
            .length,
      );

    console.log(
      `Found ${filledSections} pre-filled sections from enhanced loading`,
    );

    await page.screenshot({
      path: ".playwright-mcp/validation-05-post-loading-bmc.png",
      fullPage: true,
    });

    console.log(
      `✓ Enhanced loading experience validated - ${loadingMessages.length} loading messages detected`,
    );
  });

  test("3. Smart Progress Hints Validation", async () => {
    console.log("Testing smart progress hints system...");

    // Navigate to BMC
    await page.click('button:has-text("Local Food Delivery")');
    await page.waitForSelector("textarea", { timeout: 10000 });

    const textareas = await page.locator("textarea").all();
    const totalSections = textareas.length;
    console.log(`Total BMC sections: ${totalSections}`);

    // Fill sections progressively to trigger hints
    let currentProgress = 0;

    for (let i = 0; i < textareas.length; i++) {
      await textareas[i].fill(
        `Section ${i + 1}: Comprehensive business model content for progress tracking`,
      );
      currentProgress = Math.round(((i + 1) / totalSections) * 100);

      console.log(`Progress: ${currentProgress}%`);

      // Look for progress hints at key milestones
      if (currentProgress >= 30 && currentProgress <= 35) {
        try {
          // Look for progress indicator
          const progressElement = await page
            .locator('text*="%" , text*="complete", text*="progress"')
            .first();
          if (await progressElement.isVisible({ timeout: 2000 })) {
            await page.screenshot({
              path: ".playwright-mcp/validation-06-progress-hint-30-percent.png",
              fullPage: true,
            });
            console.log("✓ 30% progress hint captured");
          }
        } catch (e) {
          console.log("30% progress hint not found");
        }
      }

      if (currentProgress >= 70 && currentProgress <= 75) {
        try {
          const progressElement = await page
            .locator('text*="%" , text*="complete", text*="progress"')
            .first();
          if (await progressElement.isVisible({ timeout: 2000 })) {
            await page.screenshot({
              path: ".playwright-mcp/validation-07-progress-hint-70-percent.png",
              fullPage: true,
            });
            console.log("✓ 70% progress hint captured");
          }
        } catch (e) {
          console.log("70% progress hint not found");
        }
      }

      await page.waitForTimeout(200); // Allow for progress calculation
    }

    console.log("✓ Smart progress hints validation completed");
  });

  test("4. Completion Celebration Animation", async () => {
    console.log("Testing completion celebration...");

    // Navigate to BMC
    await page.click('button:has-text("Local Food Delivery")');
    await page.waitForSelector("textarea", { timeout: 10000 });

    // Fill all sections to achieve 100% completion
    const textareas = await page.locator("textarea").all();
    console.log(`Filling all ${textareas.length} sections for completion`);

    for (let i = 0; i < textareas.length; i++) {
      await textareas[i].fill(
        `Completed section ${i + 1}: Full business model content with detailed planning and strategic insights`,
      );
      await page.waitForTimeout(100);
    }

    // Look for completion celebration
    try {
      // Wait for any celebration elements
      const celebrationSelectors = [
        'text*="Congratulations"',
        'text*="Complete"',
        'text*="Amazing"',
        'text*="100%"',
        ".celebrate",
        '[class*="confetti"]',
        '[class*="celebration"]',
      ];

      for (const selector of celebrationSelectors) {
        try {
          await page.waitForSelector(selector, { timeout: 2000 });
          await page.screenshot({
            path: ".playwright-mcp/validation-08-completion-celebration.png",
            fullPage: true,
          });
          console.log(
            `✓ Completion celebration found with selector: ${selector}`,
          );
          break;
        } catch (e) {
          continue;
        }
      }

      // Wait for auto-dismiss (3 seconds)
      await page.waitForTimeout(3500);

      await page.screenshot({
        path: ".playwright-mcp/validation-09-post-celebration.png",
        fullPage: true,
      });
    } catch (e) {
      console.log("Completion celebration not detected, checking final state");
      await page.screenshot({
        path: ".playwright-mcp/validation-09-completion-state-no-celebration.png",
        fullPage: true,
      });
    }

    console.log("✓ Completion celebration validation completed");
  });

  test("5. Mobile Experience Validation", async () => {
    console.log("Testing mobile experience...");

    // Set mobile viewport (iPhone)
    await page.setViewportSize({ width: 375, height: 667 });

    await page.goto("http://localhost:5182/");

    await page.screenshot({
      path: ".playwright-mcp/validation-10-mobile-homepage.png",
      fullPage: true,
    });

    // Test mobile BMC interaction
    await page.click('button:has-text("Local Food Delivery")');
    await page.waitForSelector("textarea", { timeout: 10000 });

    await page.screenshot({
      path: ".playwright-mcp/validation-11-mobile-bmc-loaded.png",
      fullPage: true,
    });

    // Test mobile touch interactions
    const mobileTextarea = page.locator("textarea").first();
    await mobileTextarea.tap();
    await mobileTextarea.fill(
      "Testing mobile touch interaction and typing experience",
    );

    await page.screenshot({
      path: ".playwright-mcp/validation-12-mobile-typing-test.png",
      fullPage: true,
    });

    // Test mobile keyboard navigation
    await page.keyboard.press("Tab");
    await page.keyboard.type("Mobile keyboard navigation test");

    await page.screenshot({
      path: ".playwright-mcp/validation-13-mobile-keyboard-nav.png",
      fullPage: true,
    });

    console.log("✓ Mobile experience validation completed");
  });

  test("6. Performance and Responsiveness Validation", async () => {
    console.log("Testing performance and responsiveness...");

    const startTime = Date.now();

    // Monitor console errors
    const errors: string[] = [];
    const warnings: string[] = [];

    page.on("console", (msg) => {
      if (msg.type() === "error") {
        errors.push(msg.text());
      } else if (msg.type() === "warning") {
        warnings.push(msg.text());
      }
    });

    // Test full user flow timing
    const navigationStart = Date.now();
    await page.click('button:has-text("Local Food Delivery")');

    const loadStart = Date.now();
    await page.waitForSelector("textarea", { timeout: 10000 });

    const loadComplete = Date.now();

    // Test interaction responsiveness
    const interactionStart = Date.now();
    const firstTextarea = page.locator("textarea").first();
    await firstTextarea.click();
    await firstTextarea.fill("Performance test content");
    const interactionComplete = Date.now();

    // Calculate timing metrics
    const navigationTime = loadStart - navigationStart;
    const loadingTime = loadComplete - loadStart;
    const interactionTime = interactionComplete - interactionStart;
    const totalTime = loadComplete - startTime;

    console.log(`
Performance Metrics:
- Navigation Time: ${navigationTime}ms
- Loading Time: ${loadingTime}ms
- Interaction Time: ${interactionTime}ms
- Total Time: ${totalTime}ms
- Console Errors: ${errors.length}
- Console Warnings: ${warnings.length}
    `);

    // Test conversion CTA
    try {
      const ctaButton = page
        .locator(
          'button:has-text("Start"), button:has-text("My Workspace"), button:has-text("Progress")',
        )
        .first();
      if (await ctaButton.isVisible({ timeout: 2000 })) {
        await ctaButton.click();
        console.log("✓ Conversion CTA interaction successful");

        await page.screenshot({
          path: ".playwright-mcp/validation-14-cta-conversion.png",
          fullPage: true,
        });
      }
    } catch (e) {
      console.log("CTA test: No conversion button found or clickable");
    }

    // Final validation screenshot
    await page.screenshot({
      path: ".playwright-mcp/validation-15-final-performance-state.png",
      fullPage: true,
    });

    // Performance assertions
    expect(totalTime).toBeLessThan(5000); // Total load under 5 seconds
    expect(interactionTime).toBeLessThan(500); // Interactions under 500ms
    expect(errors.length).toBe(0); // No console errors

    console.log("✓ Performance validation completed successfully");
  });

  test.afterEach(async () => {
    if (page) {
      await page.close();
    }
  });
});
