import { test, expect } from "@playwright/test";

test.describe("Comprehensive Buffalo Projects UX/UI/IA Audit", () => {
  const screenshotDir = ".playwright-mcp";

  test.beforeEach(async ({ page }) => {
    // Set desktop viewport
    await page.setViewportSize({ width: 1440, height: 900 });
  });

  test("1. Landing Page Analysis - First Impressions & Conversion", async ({
    page,
  }) => {
    await page.goto("http://localhost:5177");

    // Capture initial state
    await page.screenshot({
      path: `${screenshotDir}/01-homepage-initial-state.png`,
      fullPage: true,
    });

    // Analyze value proposition clarity
    const h1 = page.locator("h1");
    await expect(h1).toBeVisible();

    // Check for clear primary CTA
    const primaryButtons = page.locator("button");
    const buttonCount = await primaryButtons.count();

    // Take focused screenshot of hero section
    await page.screenshot({
      path: `${screenshotDir}/02-hero-section-focus.png`,
      clip: { x: 0, y: 0, width: 1440, height: 600 },
    });

    // Analyze information hierarchy
    const headings = {
      h1: await page.locator("h1").count(),
      h2: await page.locator("h2").count(),
      h3: await page.locator("h3").count(),
    };

    console.log("Landing Page Analysis:");
    console.log(
      `- Heading structure: H1(${headings.h1}), H2(${headings.h2}), H3(${headings.h3})`,
    );
    console.log(`- Total buttons found: ${buttonCount}`);
  });

  test("2. Navigation Architecture Analysis", async ({ page }) => {
    await page.goto("http://localhost:5177");

    // Map navigation structure
    const navLinks = page.locator("nav a, header a");
    const navCount = await navLinks.count();

    const navigationItems = [];
    for (let i = 0; i < navCount; i++) {
      const link = navLinks.nth(i);
      const text = await link.textContent();
      const href = await link.getAttribute("href");
      navigationItems.push({ text, href });
    }

    console.log("Navigation Structure:", navigationItems);

    // Test each navigation path
    for (const item of navigationItems) {
      if (item.href && item.href.startsWith("/")) {
        await page.goto(`http://localhost:5177${item.href}`);
        await page.waitForTimeout(1000);

        const pageName = item.href.replace("/", "") || "home";
        await page.screenshot({
          path: `${screenshotDir}/nav-${pageName}.png`,
          fullPage: true,
        });
      }
    }
  });

  test("3. Code Entry Flow Analysis", async ({ page }) => {
    await page.goto("http://localhost:5177");

    // Look for code entry field
    const codeInput = page.locator('input[type="text"]').first();

    if (await codeInput.isVisible()) {
      await page.screenshot({
        path: `${screenshotDir}/03-code-entry-initial.png`,
        fullPage: true,
      });

      // Test code entry
      await codeInput.fill("BUF-TEST");

      await page.screenshot({
        path: `${screenshotDir}/04-code-entry-filled.png`,
        fullPage: true,
      });

      // Look for submit button
      const submitButton = page
        .locator("button")
        .filter({ hasText: /go|enter|access|start/i });
      if (await submitButton.isVisible()) {
        await submitButton.click();
        await page.waitForTimeout(2000);

        await page.screenshot({
          path: `${screenshotDir}/05-after-code-entry.png`,
          fullPage: true,
        });
      }
    }
  });

  test("4. Workspace Analysis - Core User Experience", async ({ page }) => {
    // Direct navigation to workspace
    await page.goto("http://localhost:5177/workspace/BUF-TEST");
    await page.waitForTimeout(3000);

    await page.screenshot({
      path: `${screenshotDir}/06-workspace-loaded.png`,
      fullPage: true,
    });

    // Analyze workspace layout
    const workspaceElements = {
      canvas: await page
        .locator('.business-model-canvas, [class*="canvas"], [class*="bmc"]')
        .count(),
      textareas: await page.locator("textarea").count(),
      inputs: await page.locator("input").count(),
      buttons: await page.locator("button").count(),
      sidePanel: await page
        .locator('[class*="side"], [class*="panel"], aside')
        .count(),
    };

    console.log("Workspace Elements:", workspaceElements);

    // Test Business Model Canvas if present
    const bmcSections = page.locator('textarea, input[type="text"]');
    const bmcCount = await bmcSections.count();

    if (bmcCount > 0) {
      // Focus on first section and test interaction
      const firstSection = bmcSections.first();
      await firstSection.click();
      await firstSection.fill("Testing user interaction with BMC section");

      await page.screenshot({
        path: `${screenshotDir}/07-bmc-interaction-test.png`,
        fullPage: true,
      });
    }
  });

  test("5. Mobile Responsiveness Audit", async ({ page }) => {
    // Test iPhone 12 Pro viewport
    await page.setViewportSize({ width: 390, height: 844 });

    const pages = [
      { url: "http://localhost:5177", name: "mobile-homepage" },
      {
        url: "http://localhost:5177/workspace/BUF-TEST",
        name: "mobile-workspace",
      },
      { url: "http://localhost:5177/gallery", name: "mobile-projects" },
      { url: "http://localhost:5177/about", name: "mobile-about" },
    ];

    for (const pageInfo of pages) {
      await page.goto(pageInfo.url);
      await page.waitForTimeout(2000);

      await page.screenshot({
        path: `${screenshotDir}/mobile-${pageInfo.name}.png`,
        fullPage: true,
      });

      // Check for horizontal scroll issues
      const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
      const viewportWidth = 390;

      if (bodyWidth > viewportWidth) {
        console.log(
          `Mobile overflow detected on ${pageInfo.name}: ${bodyWidth}px > ${viewportWidth}px`,
        );
      }

      // Test touch targets
      const buttons = page.locator("button, a, input, textarea");
      const buttonCount = await buttons.count();

      for (let i = 0; i < Math.min(buttonCount, 5); i++) {
        const button = buttons.nth(i);
        if (await button.isVisible()) {
          const box = await button.boundingBox();
          if (box && (box.height < 44 || box.width < 44)) {
            console.log(
              `Small touch target found on ${pageInfo.name}: ${box.width}x${box.height}px`,
            );
          }
        }
      }
    }
  });

  test("6. Loading States and Performance Analysis", async ({ page }) => {
    // Test cold load performance
    const startTime = Date.now();
    await page.goto("http://localhost:5177");
    const endTime = Date.now();
    const loadTime = endTime - startTime;

    console.log(`Page load time: ${loadTime}ms`);

    // Check for loading indicators
    await page.goto("http://localhost:5177/workspace/BUF-TEST");

    // Look for loading states
    const loadingIndicators = page.locator(
      '.animate-spin, .loading, [class*="load"]',
    );
    const hasLoadingState = (await loadingIndicators.count()) > 0;

    if (hasLoadingState) {
      await page.screenshot({
        path: `${screenshotDir}/08-loading-state.png`,
        fullPage: true,
      });
    }

    await page.waitForTimeout(3000);
    await page.screenshot({
      path: `${screenshotDir}/09-loaded-state.png`,
      fullPage: true,
    });
  });

  test("7. Error State Analysis", async ({ page }) => {
    // Test invalid workspace code
    await page.goto("http://localhost:5177/workspace/INVALID-CODE");
    await page.waitForTimeout(2000);

    await page.screenshot({
      path: `${screenshotDir}/10-error-invalid-code.png`,
      fullPage: true,
    });

    // Test 404 page
    await page.goto("http://localhost:5177/nonexistent-page");
    await page.waitForTimeout(1000);

    await page.screenshot({
      path: `${screenshotDir}/11-404-page.png`,
      fullPage: true,
    });
  });

  test("8. Information Architecture Deep Dive", async ({ page }) => {
    await page.goto("http://localhost:5177");

    // Analyze page structure
    const pageStructure = await page.evaluate(() => {
      const getElementStructure = (element: Element, depth = 0): any => {
        if (depth > 3) {
          return null;
        } // Limit depth

        return {
          tag: element.tagName.toLowerCase(),
          classes: element.className,
          text: element.textContent?.slice(0, 50) + "...",
          children: Array.from(element.children)
            .map((child) => getElementStructure(child, depth + 1))
            .filter(Boolean)
            .slice(0, 5), // Limit children
        };
      };

      return getElementStructure(document.body);
    });

    console.log(
      "Page Structure Analysis:",
      JSON.stringify(pageStructure, null, 2),
    );

    // Check semantic HTML usage
    const semanticElements = {
      header: await page.locator("header").count(),
      nav: await page.locator("nav").count(),
      main: await page.locator("main").count(),
      section: await page.locator("section").count(),
      article: await page.locator("article").count(),
      aside: await page.locator("aside").count(),
      footer: await page.locator("footer").count(),
    };

    console.log("Semantic HTML Usage:", semanticElements);
  });

  test("9. User Journey Mapping - Complete Flow", async ({ page }) => {
    const journey = [
      { step: "Landing", url: "http://localhost:5177" },
      { step: "About", url: "http://localhost:5177/about" },
      { step: "Projects", url: "http://localhost:5177/gallery" },
      { step: "Create", url: "http://localhost:5177/create" },
      { step: "Workspace", url: "http://localhost:5177/workspace/BUF-TEST" },
    ];

    for (const { step, url } of journey) {
      await page.goto(url);
      await page.waitForTimeout(2000);

      await page.screenshot({
        path: `${screenshotDir}/journey-${step.toLowerCase()}.png`,
        fullPage: true,
      });

      // Analyze conversion elements on each page
      const ctaButtons = page.locator('button, .cta, [class*="button"]');
      const ctaCount = await ctaButtons.count();

      console.log(`${step} page - CTAs found: ${ctaCount}`);
    }
  });

  test("10. Business Model Canvas Usability Test", async ({ page }) => {
    await page.goto("http://localhost:5177/workspace/BUF-TEST");
    await page.waitForTimeout(3000);

    // Find all interactive elements in BMC
    const canvasInputs = page.locator('textarea, input[type="text"]');
    const inputCount = await canvasInputs.count();

    console.log(`BMC Interactive Elements: ${inputCount}`);

    if (inputCount > 0) {
      // Test each section for usability
      for (let i = 0; i < Math.min(inputCount, 9); i++) {
        const input = canvasInputs.nth(i);

        if (await input.isVisible()) {
          // Get section label/context
          const parent = page.locator("..").locator(input);
          const context = await parent.textContent();

          // Test interaction
          await input.click();
          await input.fill(`Test content for section ${i + 1}`);

          if (i === 0) {
            await page.screenshot({
              path: `${screenshotDir}/bmc-section-${i + 1}-active.png`,
              fullPage: true,
            });
          }
        }
      }

      // Final state after all inputs
      await page.screenshot({
        path: `${screenshotDir}/12-bmc-all-sections-filled.png`,
        fullPage: true,
      });
    }
  });
});
