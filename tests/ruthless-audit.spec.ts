import { test } from "@playwright/test";

test.describe("Ruthless UX/UI/IA Audit - Buffalo Projects", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:5175/");
  });

  test("Landing Page - Visual Hierarchy Audit", async ({ page }) => {
    // Take initial screenshot
    await page.screenshot({
      path: "ruthless-audit-landing-initial.png",
      fullPage: true,
    });

    // Test responsive design at different breakpoints
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE
    await page.screenshot({
      path: "ruthless-audit-landing-mobile.png",
      fullPage: true,
    });

    await page.setViewportSize({ width: 768, height: 1024 }); // iPad
    await page.screenshot({
      path: "ruthless-audit-landing-tablet.png",
      fullPage: true,
    });

    await page.setViewportSize({ width: 1920, height: 1080 }); // Desktop
    await page.screenshot({
      path: "ruthless-audit-landing-desktop.png",
      fullPage: true,
    });

    // Audit header consistency
    const header = page.locator("header, .header, nav");
    if ((await header.count()) > 0) {
      await header
        .first()
        .screenshot({ path: "ruthless-audit-header-consistency.png" });
    }

    // Check for typography inconsistencies
    const headings = page.locator("h1, h2, h3, h4, h5, h6");
    const headingCount = await headings.count();
    console.log(`Found ${headingCount} headings to audit`);

    // Check button consistency
    const buttons = page.locator('button, .button, [role="button"]');
    const buttonCount = await buttons.count();
    console.log(`Found ${buttonCount} buttons to audit`);

    // Test hover states on interactive elements
    for (let i = 0; i < Math.min(buttonCount, 5); i++) {
      const button = buttons.nth(i);
      if (await button.isVisible()) {
        await button.hover();
        await page.screenshot({ path: `ruthless-audit-button-hover-${i}.png` });
      }
    }

    // Check for form elements
    const inputs = page.locator("input, textarea, select");
    const inputCount = await inputs.count();
    console.log(`Found ${inputCount} form elements to audit`);

    // Audit spacing consistency - check for elements that might have inconsistent margins/padding
    const containers = page.locator("div, section, main, article");
    console.log(
      `Found ${await containers.count()} containers to audit spacing`,
    );
  });

  test("Navigation Audit - All Navigation Patterns", async ({ page }) => {
    // Test main navigation
    const navLinks = page.locator("nav a, .nav a, header a");
    const navCount = await navLinks.count();
    console.log(`Found ${navCount} navigation links`);

    // Click through each navigation item and screenshot
    for (let i = 0; i < navCount; i++) {
      const link = navLinks.nth(i);
      if (await link.isVisible()) {
        const linkText = await link.textContent();
        console.log(`Testing navigation: ${linkText}`);

        try {
          await link.click();
          await page.waitForLoadState("networkidle", { timeout: 3000 });
          await page.screenshot({
            path: `ruthless-audit-nav-${i}-${linkText?.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase()}.png`,
            fullPage: true,
          });
          await page.goBack();
        } catch (error) {
          console.log(`Navigation error for ${linkText}: ${error}`);
        }
      }
    }

    // Test mobile navigation if exists
    await page.setViewportSize({ width: 375, height: 667 });
    const mobileMenuToggle = page.locator(
      '[aria-label*="menu"], .hamburger, .menu-toggle, button:has-text("Menu")',
    );
    if ((await mobileMenuToggle.count()) > 0) {
      await mobileMenuToggle.first().click();
      await page.screenshot({
        path: "ruthless-audit-mobile-menu-open.png",
        fullPage: true,
      });
    }
  });

  test("Create Project Flow Audit", async ({ page }) => {
    // Navigate to create project
    const createButton = page
      .locator(
        'text="Start New Project", text="Create Project", text="New Project"',
      )
      .first();
    if ((await createButton.count()) > 0) {
      await createButton.click();
      await page.waitForLoadState("networkidle", { timeout: 3000 });
      await page.screenshot({
        path: "ruthless-audit-create-project-form.png",
        fullPage: true,
      });

      // Test form interactions
      const inputs = page.locator('input[type="text"], textarea');
      for (let i = 0; i < (await inputs.count()); i++) {
        const input = inputs.nth(i);
        await input.focus();
        await page.screenshot({ path: `ruthless-audit-form-focus-${i}.png` });
      }

      // Test mobile view of form
      await page.setViewportSize({ width: 375, height: 667 });
      await page.screenshot({
        path: "ruthless-audit-create-project-mobile.png",
        fullPage: true,
      });
    }
  });

  test("Workspace Audit", async ({ page }) => {
    // Try to access a workspace directly
    await page.goto("http://localhost:5175/workspace/BUF-TEST");
    await page.screenshot({
      path: "ruthless-audit-workspace-initial.png",
      fullPage: true,
    });

    // Check if workspace tools are present
    const tools = page.locator(".tool, .canvas, .bmc, .business-model");
    if ((await tools.count()) > 0) {
      await tools
        .first()
        .screenshot({ path: "ruthless-audit-workspace-tools.png" });
    }

    // Test mobile workspace
    await page.setViewportSize({ width: 375, height: 667 });
    await page.screenshot({
      path: "ruthless-audit-workspace-mobile.png",
      fullPage: true,
    });
  });

  test("Projects Gallery Audit", async ({ page }) => {
    await page.goto("http://localhost:5175/gallery");
    await page.screenshot({
      path: "ruthless-audit-projects-gallery.png",
      fullPage: true,
    });

    // Test project cards if they exist
    const projectCards = page.locator(
      '.project-card, .card, [data-testid*="project"]',
    );
    if ((await projectCards.count()) > 0) {
      await projectCards
        .first()
        .screenshot({ path: "ruthless-audit-project-card.png" });
    }

    // Test mobile view
    await page.setViewportSize({ width: 375, height: 667 });
    await page.screenshot({
      path: "ruthless-audit-projects-mobile.png",
      fullPage: true,
    });
  });

  test("About Page Audit", async ({ page }) => {
    await page.goto("http://localhost:5175/about");
    await page.screenshot({
      path: "ruthless-audit-about-page.png",
      fullPage: true,
    });

    // Test mobile view
    await page.setViewportSize({ width: 375, height: 667 });
    await page.screenshot({
      path: "ruthless-audit-about-mobile.png",
      fullPage: true,
    });
  });

  test("Color Consistency Audit", async ({ page }) => {
    // Go back to landing page for color audit
    await page.goto("http://localhost:5175/");

    // Check for color usage by examining different elements
    const primaryButtons = page.locator(
      "button:first-of-type, .btn-primary, .primary",
    );
    if ((await primaryButtons.count()) > 0) {
      await primaryButtons
        .first()
        .screenshot({ path: "ruthless-audit-primary-colors.png" });
    }

    const secondaryButtons = page.locator(".btn-secondary, .secondary");
    if ((await secondaryButtons.count()) > 0) {
      await secondaryButtons
        .first()
        .screenshot({ path: "ruthless-audit-secondary-colors.png" });
    }
  });

  test("Interactive Elements Stress Test", async ({ page }) => {
    // Test all clickable elements
    const clickables = page.locator(
      'button, a, [role="button"], [onclick], .clickable',
    );
    const clickableCount = await clickables.count();
    console.log(`Found ${clickableCount} clickable elements`);

    // Test hover states
    for (let i = 0; i < Math.min(clickableCount, 10); i++) {
      const element = clickables.nth(i);
      if (await element.isVisible()) {
        try {
          await element.hover();
          await page.screenshot({ path: `ruthless-audit-hover-${i}.png` });

          // Test focus states
          await element.focus();
          await page.screenshot({ path: `ruthless-audit-focus-${i}.png` });
        } catch (error) {
          console.log(`Error testing element ${i}: ${error}`);
        }
      }
    }
  });
});
