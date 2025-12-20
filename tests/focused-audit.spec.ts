import { test } from "@playwright/test";

test.describe("Focused UX Audit - Buffalo Projects", () => {
  test("Landing Page Complete Audit", async ({ page }) => {
    await page.goto("http://localhost:5175/");
    await page.waitForLoadState("networkidle");

    // Desktop audit
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.screenshot({
      path: ".playwright-mcp/ruthless-audit-landing-desktop-full.png",
      fullPage: true,
    });

    // Tablet audit
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.screenshot({
      path: ".playwright-mcp/ruthless-audit-landing-tablet.png",
      fullPage: true,
    });

    // Mobile audit
    await page.setViewportSize({ width: 375, height: 667 });
    await page.screenshot({
      path: ".playwright-mcp/ruthless-audit-landing-mobile.png",
      fullPage: true,
    });

    // Header focus
    await page.setViewportSize({ width: 1920, height: 1080 });
    const header = page.locator("nav, header").first();
    if ((await header.count()) > 0) {
      await header.screenshot({
        path: ".playwright-mcp/ruthless-audit-header-desktop.png",
      });
    }

    // Button consistency audit
    const buttons = page.locator('button, .btn, [role="button"]');
    if ((await buttons.count()) > 0) {
      await buttons.first().screenshot({
        path: ".playwright-mcp/ruthless-audit-primary-button.png",
      });
    }
  });

  test("Navigation Flow Audit", async ({ page }) => {
    await page.goto("http://localhost:5175/");
    await page.setViewportSize({ width: 1920, height: 1080 });

    // Test "Start New Project" flow
    const startButton = page.locator('text="Start New Project"').first();
    if ((await startButton.count()) > 0) {
      await startButton.click();
      await page.waitForLoadState("networkidle");
      await page.screenshot({
        path: ".playwright-mcp/ruthless-audit-start-project-flow.png",
        fullPage: true,
      });
    }

    // Go back and test other navigation
    await page.goBack();

    // Test Projects link
    const projectsLink = page
      .locator('text="My Projects", text="Projects"')
      .first();
    if ((await projectsLink.count()) > 0) {
      await projectsLink.click();
      await page.waitForLoadState("networkidle");
      await page.screenshot({
        path: ".playwright-mcp/ruthless-audit-projects-page.png",
        fullPage: true,
      });
    }
  });

  test("Workspace Audit", async ({ page }) => {
    // Try to access workspace directly
    await page.goto("http://localhost:5175/workspace");
    await page.waitForLoadState("networkidle");
    await page.screenshot({
      path: ".playwright-mcp/ruthless-audit-workspace-main.png",
      fullPage: true,
    });

    // Mobile workspace
    await page.setViewportSize({ width: 375, height: 667 });
    await page.screenshot({
      path: ".playwright-mcp/ruthless-audit-workspace-mobile.png",
      fullPage: true,
    });
  });

  test("About Page Content Audit", async ({ page }) => {
    await page.goto("http://localhost:5175/about");
    await page.waitForLoadState("networkidle");

    // Desktop
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.screenshot({
      path: ".playwright-mcp/ruthless-audit-about-desktop.png",
      fullPage: true,
    });

    // Mobile
    await page.setViewportSize({ width: 375, height: 667 });
    await page.screenshot({
      path: ".playwright-mcp/ruthless-audit-about-mobile.png",
      fullPage: true,
    });
  });

  test("Form and Interactive Elements Audit", async ({ page }) => {
    await page.goto("http://localhost:5175/");
    await page.setViewportSize({ width: 1920, height: 1080 });

    // Check for any forms
    const forms = page.locator("form, input, textarea");
    if ((await forms.count()) > 0) {
      await page.screenshot({
        path: ".playwright-mcp/ruthless-audit-forms.png",
        fullPage: true,
      });

      // Test form focus states
      const firstInput = forms.first();
      if (await firstInput.isVisible()) {
        await firstInput.focus();
        await page.screenshot({
          path: ".playwright-mcp/ruthless-audit-form-focus.png",
        });
      }
    }

    // Check button hover states
    const buttons = page.locator("button");
    if ((await buttons.count()) > 0) {
      const firstButton = buttons.first();
      if (await firstButton.isVisible()) {
        await firstButton.hover();
        await page.screenshot({
          path: ".playwright-mcp/ruthless-audit-button-hover.png",
        });
      }
    }
  });
});
