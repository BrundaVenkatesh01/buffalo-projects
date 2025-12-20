import { test } from "@playwright/test";

test.describe("Buffalo Projects - Focused UX/UI/IA Audit", () => {
  const screenshotDir = ".playwright-mcp";

  test("Homepage Desktop & Mobile Analysis", async ({ page }) => {
    // Desktop view
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("http://localhost:5177");
    await page.waitForLoadState("networkidle");

    await page.screenshot({
      path: `${screenshotDir}/final-audit-homepage-desktop.png`,
      fullPage: true,
    });

    // Mobile view
    await page.setViewportSize({ width: 375, height: 667 });
    await page.screenshot({
      path: `${screenshotDir}/final-audit-homepage-mobile.png`,
      fullPage: true,
    });

    // Check touch targets on mobile
    const buttons = page.locator("button, a[href], input, textarea");
    const buttonCount = await buttons.count();

    const touchIssues = [];
    for (let i = 0; i < Math.min(buttonCount, 10); i++) {
      const button = buttons.nth(i);
      if (await button.isVisible()) {
        const box = await button.boundingBox();
        if (box && (box.height < 44 || box.width < 44)) {
          const text = await button.textContent();
          touchIssues.push({
            element: `${await button.evaluate((el) => el.tagName)} - "${text?.slice(0, 30)}"`,
            size: `${box.width}x${box.height}px`,
          });
        }
      }
    }

    console.log("Mobile Touch Target Issues:", touchIssues);
  });

  test("Workspace Creation & Main Interface", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("http://localhost:5177");
    await page.waitForLoadState("networkidle");

    // Look for start project button
    const startButton = page
      .locator(
        'text=/start.*project/i, button:has-text("Create"), button:has-text("Get Started")',
      )
      .first();

    if (await startButton.isVisible()) {
      await startButton.click();
      await page.waitForLoadState("networkidle");

      await page.screenshot({
        path: `${screenshotDir}/final-audit-create-project.png`,
        fullPage: true,
      });

      // Fill out form if present
      const nameInput = page
        .locator('input[placeholder*="name"], input[name*="name"]')
        .first();
      if (await nameInput.isVisible()) {
        await nameInput.fill("UX Audit Test Project");

        const submitBtn = page
          .locator(
            'button[type="submit"], button:has-text("Create"), button:has-text("Start")',
          )
          .first();
        if (await submitBtn.isVisible()) {
          await submitBtn.click();
          await page.waitForLoadState("networkidle");
        }
      }
    } else {
      // Try direct workspace access
      await page.goto("http://localhost:5177/workspace/BUF-AUDIT");
      await page.waitForLoadState("networkidle");
    }

    // Capture workspace
    await page.screenshot({
      path: `${screenshotDir}/final-audit-workspace-desktop.png`,
      fullPage: true,
    });

    // Mobile workspace
    await page.setViewportSize({ width: 375, height: 667 });
    await page.screenshot({
      path: `${screenshotDir}/final-audit-workspace-mobile.png`,
      fullPage: true,
    });
  });

  test("Projects Page Analysis", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("http://localhost:5177/gallery");
    await page.waitForLoadState("networkidle");

    await page.screenshot({
      path: `${screenshotDir}/final-audit-projects-desktop.png`,
      fullPage: true,
    });

    await page.setViewportSize({ width: 375, height: 667 });
    await page.screenshot({
      path: `${screenshotDir}/final-audit-projects-mobile.png`,
      fullPage: true,
    });
  });

  test("About Page Analysis", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("http://localhost:5177/about");
    await page.waitForLoadState("networkidle");

    await page.screenshot({
      path: `${screenshotDir}/final-audit-about-desktop.png`,
      fullPage: true,
    });

    await page.setViewportSize({ width: 375, height: 667 });
    await page.screenshot({
      path: `${screenshotDir}/final-audit-about-mobile.png`,
      fullPage: true,
    });
  });

  test("Navigation & Header Analysis", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("http://localhost:5177");
    await page.waitForLoadState("networkidle");

    // Analyze navigation structure
    const navLinks = page.locator("nav a, header a");
    const navCount = await navLinks.count();

    const navigation = [];
    for (let i = 0; i < navCount; i++) {
      const link = navLinks.nth(i);
      const text = await link.textContent();
      const href = await link.getAttribute("href");
      navigation.push({ text, href });
    }

    console.log("Navigation Structure:", navigation);

    // Check header spacing and layout
    const header = page.locator("header").first();
    if (await header.isVisible()) {
      const headerBox = await header.boundingBox();
      console.log(`Header height: ${headerBox?.height}px`);
    }

    // Mobile navigation
    await page.setViewportSize({ width: 375, height: 667 });

    const mobileMenu = page
      .locator(
        '[aria-label*="menu"], button:has-text("Menu"), .mobile-menu-button',
      )
      .first();
    if (await mobileMenu.isVisible()) {
      await mobileMenu.click();
      await page.screenshot({
        path: `${screenshotDir}/final-audit-mobile-menu.png`,
        fullPage: true,
      });
    }
  });

  test("Design System Analysis", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("http://localhost:5177");
    await page.waitForLoadState("networkidle");

    // Analyze typography scale
    const headings = page.locator("h1, h2, h3, h4, h5, h6");
    const headingCount = await headings.count();

    const typographyAnalysis = [];
    for (let i = 0; i < Math.min(headingCount, 15); i++) {
      const heading = headings.nth(i);
      const tagName = await heading.evaluate((el) => el.tagName);
      const styles = await heading.evaluate((el) => {
        const style = window.getComputedStyle(el);
        return {
          fontSize: style.fontSize,
          fontWeight: style.fontWeight,
          lineHeight: style.lineHeight,
          marginTop: style.marginTop,
          marginBottom: style.marginBottom,
          color: style.color,
        };
      });
      typographyAnalysis.push({ tagName, ...styles });
    }

    console.log("Typography Analysis:", typographyAnalysis);

    // Analyze button consistency
    const buttons = page.locator('button, .btn, a[class*="btn"]');
    const buttonCount = await buttons.count();

    const buttonAnalysis = [];
    for (let i = 0; i < Math.min(buttonCount, 10); i++) {
      const button = buttons.nth(i);
      if (await button.isVisible()) {
        const text = await button.textContent();
        const styles = await button.evaluate((el) => {
          const style = window.getComputedStyle(el);
          return {
            padding: style.padding,
            fontSize: style.fontSize,
            borderRadius: style.borderRadius,
            backgroundColor: style.backgroundColor,
            color: style.color,
            minHeight: style.minHeight,
          };
        });
        buttonAnalysis.push({
          text: text?.slice(0, 30),
          ...styles,
        });
      }
    }

    console.log("Button Consistency Analysis:", buttonAnalysis);

    // Check spacing consistency
    const spacingElements = page.locator(
      'section, div[class*="container"], div[class*="wrapper"]',
    );
    const spacingCount = await spacingElements.count();

    const spacingAnalysis = [];
    for (let i = 0; i < Math.min(spacingCount, 8); i++) {
      const element = spacingElements.nth(i);
      if (await element.isVisible()) {
        const className = await element.getAttribute("class");
        const styles = await element.evaluate((el) => {
          const style = window.getComputedStyle(el);
          return {
            padding: style.padding,
            margin: style.margin,
            gap: style.gap,
          };
        });
        spacingAnalysis.push({
          className: className?.slice(0, 50),
          ...styles,
        });
      }
    }

    console.log("Spacing Analysis:", spacingAnalysis);
  });
});
