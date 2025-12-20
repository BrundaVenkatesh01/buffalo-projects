import { test } from "@playwright/test";

test.describe("Debug BMC Demo State", () => {
  test("Debug current page state and navigation", async ({ page }) => {
    console.log("Starting debug validation...");

    // Navigate to homepage
    await page.goto("http://localhost:5182/");

    // Take screenshot of homepage
    await page.screenshot({
      path: ".playwright-mcp/debug-01-homepage.png",
      fullPage: true,
    });

    // Log what buttons are available
    const buttons = await page.locator("button").all();
    console.log(`Found ${buttons.length} buttons on homepage`);

    for (let i = 0; i < buttons.length; i++) {
      const text = await buttons[i].textContent();
      console.log(`Button ${i}: "${text}"`);
    }

    // Try to find the Local Food Delivery button
    const foodDeliveryButton = page.locator(
      'button:has-text("Local Food Delivery")',
    );
    const isVisible = await foodDeliveryButton.isVisible();
    console.log(`Local Food Delivery button visible: ${isVisible}`);

    if (isVisible) {
      // Click it and see what happens
      await foodDeliveryButton.click();

      // Take screenshot after click
      await page.screenshot({
        path: ".playwright-mcp/debug-02-after-click.png",
        fullPage: true,
      });

      // Wait a bit for any loading
      await page.waitForTimeout(3000);

      // Take screenshot after waiting
      await page.screenshot({
        path: ".playwright-mcp/debug-03-after-wait.png",
        fullPage: true,
      });

      // Check what elements are now present
      const currentUrl = page.url();
      console.log(`Current URL: ${currentUrl}`);

      // Look for any canvas-related elements
      const canvasElements = await page
        .locator('[data-testid*="canvas"], [class*="canvas"], [class*="bmc"]')
        .all();
      console.log(`Found ${canvasElements.length} canvas-related elements`);

      // Look for textareas
      const textareas = await page.locator("textarea").all();
      console.log(`Found ${textareas.length} textareas`);

      // Look for any loading indicators
      const loadingElements = await page
        .locator('[class*="loading"], [data-testid*="loading"]')
        .all();
      console.log(`Found ${loadingElements.length} loading elements`);

      // Get page title
      const title = await page.title();
      console.log(`Page title: ${title}`);

      // Check for any error messages in console
      page.on("console", (msg) => {
        if (msg.type() === "error") {
          console.log(`Console error: ${msg.text()}`);
        }
      });
    } else {
      // Look for alternative buttons
      const alternativeButtons = await page.locator("button").all();
      for (let i = 0; i < alternativeButtons.length; i++) {
        const text = await alternativeButtons[i].textContent();
        if (
          (text && text.toLowerCase().includes("food")) ||
          (text && text.toLowerCase().includes("delivery")) ||
          (text && text.toLowerCase().includes("local"))
        ) {
          console.log(`Found potential alternative: "${text}"`);
        }
      }
    }
  });

  test("Check current workspace/BMC implementation", async ({ page }) => {
    console.log("Checking workspace implementation...");

    await page.goto("http://localhost:5182/");

    // Try different navigation paths
    const navigationAttempts = [
      'button:has-text("Start")',
      'button:has-text("Create")',
      'button:has-text("New")',
      'a[href*="workspace"]',
      'a[href*="canvas"]',
      'button:has-text("Local Food Delivery")',
      'button:has-text("Food Delivery")',
      'button:has-text("Demo")',
    ];

    for (const selector of navigationAttempts) {
      try {
        const element = page.locator(selector);
        const isVisible = await element.isVisible();
        if (isVisible) {
          const text = await element.textContent();
          console.log(`✓ Found clickable element: ${selector} - "${text}"`);

          // Try clicking it
          await element.click();
          await page.waitForTimeout(2000);

          const newUrl = page.url();
          console.log(`After clicking, URL: ${newUrl}`);

          await page.screenshot({
            path: `.playwright-mcp/debug-navigation-${selector.replace(/[^a-zA-Z0-9]/g, "-")}.png`,
            fullPage: true,
          });

          // Check if we now have BMC elements
          const bmcElements = await page
            .locator('textarea, [data-testid*="canvas"], [class*="canvas"]')
            .all();
          console.log(
            `Found ${bmcElements.length} potential BMC elements after navigation`,
          );

          if (bmcElements.length > 0) {
            console.log("✓ Successfully found BMC elements!");
            break;
          }

          // Go back to try next option
          await page.goBack();
          await page.waitForTimeout(1000);
        }
      } catch (e) {
        console.log(`✗ Failed to interact with ${selector}: ${e.message}`);
      }
    }
  });
});
