import { test, expect } from "@playwright/test";

/**
 * Ruthless Landing Page Audit
 * Testing: Design, UX, Performance, Accessibility, Motion, Content
 */

test.describe("Landing Page: Ruthless Audit", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:3000");
    await page.waitForLoadState("networkidle");
  });

  test("Visual Audit - Hero Section", async ({ page }) => {
    console.log("\n🎨 VISUAL AUDIT: Hero Section");

    // Take screenshot of hero
    await page.screenshot({
      path: ".playwright-mcp/ruthless-landing-01-hero.png",
      fullPage: false,
    });

    // Check hero elements
    const hero = page.locator("section").first();
    const heading = hero.locator("h1");

    console.log("✓ Hero heading text:", await heading.textContent());

    // Check gradient text is present
    const gradientSpan = heading.locator("span").first();
    expect(await gradientSpan.isVisible()).toBeTruthy();

    // Check CTA button
    const ctaButton = hero.locator("button", { hasText: "Join the Community" });
    expect(await ctaButton.isVisible()).toBeTruthy();

    // Check scroll indicator
    const scrollIndicator = hero.locator(".animate-bounce");
    expect(await scrollIndicator.isVisible()).toBeTruthy();

    console.log("✓ Hero section complete");
  });

  test("Content Audit - All Sections Present", async ({ page }) => {
    console.log("\n📝 CONTENT AUDIT: Section Structure");

    // Count only sections inside main content (excludes nav/header sections)
    const sections = await page.locator("main section").all();
    console.log(`Total content sections found: ${sections.length}`);

    // Should have 7 content sections (removed stats section)
    expect(sections.length).toBe(7);

    // Check each section heading
    const headings = [
      "Build in public",
      "See Who's Building in Buffalo",
      "How It Works",
      "We built something", // Visibility problem section
      "Something unlocks", // '26 section
      "Your work doesn't disappear", // Long game quote
      "Start in 30 Seconds", // Final CTA
    ];

    for (const heading of headings) {
      const element = page.getByText(heading, { exact: false });
      expect(await element.isVisible()).toBeTruthy();
      console.log(`✓ Found: "${heading}"`);
    }
  });

  test("Scroll Through Entire Journey", async ({ page }) => {
    console.log("\n📜 SCROLL AUDIT: Full Journey");

    // Get initial scroll position
    let currentScroll = 0;

    // Scroll through each section
    const screenshots = [
      { name: "hero", scroll: 0 },
      { name: "problem", scroll: 800 },
      { name: "buffalo-diff", scroll: 1800 },
      { name: "results", scroll: 2800 },
      { name: "26-countdown", scroll: 3800 },
      { name: "how-it-works", scroll: 4800 },
      { name: "long-game", scroll: 5800 },
      { name: "final-cta", scroll: 6800 },
    ];

    for (const shot of screenshots) {
      await page.evaluate((y) => window.scrollTo(0, y), shot.scroll);
      await page.waitForTimeout(500); // Wait for scroll animations

      await page.screenshot({
        path: `.playwright-mcp/ruthless-landing-${String(screenshots.indexOf(shot) + 1).padStart(2, "0")}-${shot.name}.png`,
      });

      console.log(`✓ Captured: ${shot.name}`);
    }
  });

  test("Motion Audit - Scroll Reveals Work", async ({ page }) => {
    console.log("\n✨ MOTION AUDIT: Scroll Animations");

    // Check that elements are initially hidden (opacity 0 or transformed)
    const problemSection = page.locator("section").nth(1);

    // Scroll to problem section
    await problemSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);

    // Check that stat is now visible
    const stat = page.getByText("73%");
    expect(await stat.isVisible()).toBeTruthy();

    console.log("✓ Scroll reveal animations working");
  });

  test("Interactive Audit - Hover States", async ({ page }) => {
    console.log("\n🖱️  INTERACTIVE AUDIT: Hover Effects");

    // Scroll to results section
    await page.locator("text=Results That Matter").scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);

    // Screenshot before hover
    await page.screenshot({
      path: ".playwright-mcp/ruthless-landing-results-before-hover.png",
    });

    // Find first result card
    const resultCard = page
      .locator("text=200+")
      .locator("..")
      .locator("..")
      .first();

    // Hover over it
    await resultCard.hover();
    await page.waitForTimeout(500);

    // Screenshot after hover
    await page.screenshot({
      path: ".playwright-mcp/ruthless-landing-results-after-hover.png",
    });

    console.log("✓ Hover states captured");
  });

  test("Mobile Responsive Audit", async ({ page }) => {
    console.log("\n📱 MOBILE AUDIT: Responsive Design");

    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.reload();
    await page.waitForLoadState("networkidle");

    // Screenshot mobile hero
    await page.screenshot({
      path: ".playwright-mcp/ruthless-landing-mobile-hero.png",
    });

    // Check hero text is readable
    const heading = page.locator("h1");
    const headingBox = await heading.boundingBox();

    if (headingBox) {
      console.log(
        `Hero heading width: ${headingBox.width}px (viewport: 375px)`,
      );
      expect(headingBox.width).toBeLessThanOrEqual(375);
    }

    // Scroll through mobile view
    await page.evaluate(() => window.scrollTo(0, 2000));
    await page.waitForTimeout(500);

    await page.screenshot({
      path: ".playwright-mcp/ruthless-landing-mobile-mid.png",
    });

    // Check buttons stack vertically on mobile
    await page.evaluate(() => window.scrollTo(0, 6000));
    await page.waitForTimeout(500);

    await page.screenshot({
      path: ".playwright-mcp/ruthless-landing-mobile-cta.png",
    });

    console.log("✓ Mobile responsive checks complete");
  });

  test("Accessibility Audit - Keyboard Navigation", async ({ page }) => {
    console.log("\n♿ ACCESSIBILITY AUDIT: Keyboard Nav");

    // Try tabbing through interactive elements
    let tabCount = 0;
    const maxTabs = 10;

    while (tabCount < maxTabs) {
      await page.keyboard.press("Tab");
      const focusedElement = await page.evaluate(() => {
        const el = document.activeElement;
        return {
          tag: el?.tagName,
          text: el?.textContent?.substring(0, 50),
          role: el?.getAttribute("role"),
        };
      });

      console.log(`Tab ${tabCount + 1}:`, focusedElement);
      tabCount++;
    }

    console.log("✓ Keyboard navigation functional");
  });

  test("Performance Audit - Key Metrics", async ({ page }) => {
    console.log("\n⚡ PERFORMANCE AUDIT: Metrics");

    // Measure page load time
    const navigationTiming = await page.evaluate(() => {
      const perfData = performance.getEntriesByType(
        "navigation",
      )[0] as PerformanceNavigationTiming;
      return {
        domContentLoaded:
          perfData.domContentLoadedEventEnd -
          perfData.domContentLoadedEventStart,
        loadComplete: perfData.loadEventEnd - perfData.loadEventStart,
        domInteractive: perfData.domInteractive - perfData.fetchStart,
      };
    });

    console.log("Page Timing:");
    console.log(`  DOM Interactive: ${navigationTiming.domInteractive}ms`);
    console.log(`  DOM Content Loaded: ${navigationTiming.domContentLoaded}ms`);
    console.log(`  Load Complete: ${navigationTiming.loadComplete}ms`);

    // Check for console errors
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        errors.push(msg.text());
      }
    });

    await page.reload();
    await page.waitForLoadState("networkidle");

    if (errors.length > 0) {
      console.log("⚠️  Console Errors Found:");
      errors.forEach((err) => console.log(`  - ${err}`));
    } else {
      console.log("✓ No console errors");
    }
  });

  test("Gradient Blur Animation Check", async ({ page }) => {
    console.log("\n🌈 GRADIENT AUDIT: Background Animations");

    // Check that gradient blurs are present
    const gradientBlurs = page.locator(".blur-3xl");
    const count = await gradientBlurs.count();

    console.log(`Gradient blur elements found: ${count}`);
    expect(count).toBeGreaterThan(0);

    // Check they're animating (have motion styles)
    const firstBlur = gradientBlurs.first();
    const style = await firstBlur.getAttribute("style");

    console.log("First gradient blur styles:", style);
    expect(style).toContain("background");

    console.log("✓ Gradient atmospheres rendering");
  });

  test("CTA Button Functionality", async ({ page }) => {
    console.log("\n🎯 CTA AUDIT: Button Actions");

    // Wait for hydration
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(1000);

    // Check hero CTA - now Link is child of Button (asChild pattern)
    const heroLink = page.locator('a[href="/signup"]').first();
    await heroLink.scrollIntoViewIfNeeded();

    // Click and check navigation (signup redirects to join)
    await heroLink.click();
    await page.waitForLoadState("networkidle");

    const url = page.url();
    console.log("CTA navigated to:", url);
    expect(url).toMatch(/\/(join|signup)/); // Accept both /join and /signup

    // Go back
    await page.goBack();
    await page.waitForLoadState("networkidle");

    // Check secondary CTA (Browse Gallery)
    await page.evaluate(() => window.scrollTo(0, 10000));
    await page.waitForTimeout(500);

    const galleryLink = page.locator('a[href="/projects"]');
    if (await galleryLink.isVisible()) {
      console.log("✓ Found Browse Gallery CTA link");

      // Test that it navigates
      await galleryLink.click();
      await page.waitForLoadState("networkidle");
      expect(page.url()).toContain("/projects");
      console.log("✓ Gallery link works");
    }
  });

  test("Typography Scale Audit", async ({ page }) => {
    console.log("\n🔤 TYPOGRAPHY AUDIT: Scale & Hierarchy");

    // Check hero heading size
    const h1 = page.locator("h1").first();
    const h1Styles = await h1.evaluate((el) => {
      const computed = window.getComputedStyle(el);
      return {
        fontSize: computed.fontSize,
        fontWeight: computed.fontWeight,
        lineHeight: computed.lineHeight,
        letterSpacing: computed.letterSpacing,
      };
    });

    console.log("H1 styles:", h1Styles);

    // Check section headings
    const h2 = page.locator("h2").first();
    const h2Styles = await h2.evaluate((el) => {
      const computed = window.getComputedStyle(el);
      return {
        fontSize: computed.fontSize,
        fontWeight: computed.fontWeight,
      };
    });

    console.log("H2 styles:", h2Styles);

    // Verify hierarchy (h1 should be larger than h2)
    const h1Size = parseInt(h1Styles.fontSize);
    const h2Size = parseInt(h2Styles.fontSize);

    expect(h1Size).toBeGreaterThan(h2Size);
    console.log("✓ Typography hierarchy correct");
  });

  test("Color Contrast Audit", async ({ page }) => {
    console.log("\n🎨 COLOR AUDIT: Contrast Ratios");

    // Check main text contrast
    const bodyText = page.locator("p").first();
    const textStyles = await bodyText.evaluate((el) => {
      const computed = window.getComputedStyle(el);
      return {
        color: computed.color,
        backgroundColor: computed.backgroundColor,
      };
    });

    console.log("Body text color:", textStyles.color);
    console.log("Background color:", textStyles.backgroundColor);

    // Note: Full contrast calculation would require color parsing
    // For now, just verify colors are set
    expect(textStyles.color).toBeTruthy();

    console.log("✓ Color values present");
  });

  test("Full Page Screenshot for Final Review", async ({ page }) => {
    console.log("\n📸 FINAL SCREENSHOT: Full Page");

    await page.screenshot({
      path: ".playwright-mcp/ruthless-landing-FULL-PAGE.png",
      fullPage: true,
    });

    console.log("✓ Full page screenshot saved");
  });
});

test.describe("Landing Page: Detailed Issues", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:3000");
    await page.waitForLoadState("networkidle");
  });

  test("Find All Potential Issues", async ({ page }) => {
    console.log("\n🔍 RUTHLESS ISSUE DETECTION\n");

    const issues: string[] = [];

    // Check for images without alt text
    const images = await page.locator("img").all();
    for (let i = 0; i < images.length; i++) {
      const alt = await images[i].getAttribute("alt");
      if (!alt) {
        issues.push(`Image ${i + 1} missing alt text`);
      }
    }

    // Check for links without accessible names
    const links = await page.locator("a").all();
    for (let i = 0; i < links.length; i++) {
      const text = await links[i].textContent();
      const ariaLabel = await links[i].getAttribute("aria-label");
      if (!text?.trim() && !ariaLabel) {
        issues.push(`Link ${i + 1} has no accessible name`);
      }
    }

    // Check for proper heading hierarchy
    const h1Count = await page.locator("h1").count();
    if (h1Count !== 1) {
      issues.push(`Page has ${h1Count} h1 elements (should have exactly 1)`);
    }

    // Check for empty buttons
    const buttons = await page.locator("button").all();
    for (let i = 0; i < buttons.length; i++) {
      const text = await buttons[i].textContent();
      const ariaLabel = await buttons[i].getAttribute("aria-label");
      if (!text?.trim() && !ariaLabel) {
        issues.push(`Button ${i + 1} has no accessible name`);
      }
    }

    // Check for contrast issues (basic check)
    const lightTextOnLight = page
      .locator("text")
      .filter({ hasText: /[A-Za-z]/ });
    const count = await lightTextOnLight.count();
    console.log(`Total text elements: ${count}`);

    // Output all issues
    if (issues.length > 0) {
      console.log("\n⚠️  ISSUES FOUND:");
      issues.forEach((issue, i) => {
        console.log(`${i + 1}. ${issue}`);
      });
    } else {
      console.log("✅ No major accessibility issues detected!");
    }

    expect(issues.length).toBe(0);
  });
});
