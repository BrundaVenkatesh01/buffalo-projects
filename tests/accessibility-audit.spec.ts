/**
 * Comprehensive Accessibility, Performance, and Monitoring Audit
 * Tests WCAG compliance, keyboard navigation, performance metrics, and error handling
 */
import { test, expect } from "@playwright/test";
import { injectAxe, getViolations } from "axe-playwright";

// Configure test timeout for comprehensive testing
test.use({
  baseURL: "http://localhost:5173",
  screenshot: "only-on-failure",
  video: "retain-on-failure",
});

test.describe("Accessibility Audit", () => {
  test("Homepage WCAG 2.1 AA Compliance", async ({ page }) => {
    await page.goto("/");
    await injectAxe(page);

    // Check for accessibility violations
    const violations = await getViolations(page, null, {
      runOnly: {
        type: "tag",
        values: ["wcag2a", "wcag2aa", "wcag21aa"],
      },
    });

    // Log detailed violations
    if (violations.length > 0) {
      console.log("\n🚨 Accessibility Violations Found:");
      violations.forEach((violation, index) => {
        console.log(
          `\n${index + 1}. ${violation.id}: ${violation.description}`,
        );
        console.log(`   Impact: ${violation.impact}`);
        console.log(`   Affected elements: ${violation.nodes.length}`);
        violation.nodes.forEach((node) => {
          console.log(`   - ${node.target.join(", ")}`);
        });
      });
    }

    expect(violations).toHaveLength(0);
  });

  test("Keyboard Navigation", async ({ page }) => {
    await page.goto("/");

    // Test Tab navigation through interactive elements
    const interactiveElements = await page.$$(
      "button, a, input, textarea, select, [tabindex]",
    );
    console.log(
      `\n⌨️ Found ${interactiveElements.length} interactive elements`,
    );

    // Check if all interactive elements are keyboard accessible
    for (let i = 0; i < Math.min(10, interactiveElements.length); i++) {
      await page.keyboard.press("Tab");
      const focusedElement = await page.evaluate(() => {
        const el = document.activeElement;
        return {
          tagName: el?.tagName,
          text: el?.textContent?.slice(0, 30),
          hasOutline: window.getComputedStyle(el!).outline !== "none",
        };
      });

      expect(focusedElement.hasOutline).toBeTruthy();
      console.log(
        `   Tab ${i + 1}: ${focusedElement.tagName} - "${focusedElement.text}"`,
      );
    }
  });

  test("ARIA Labels and Roles", async ({ page }) => {
    await page.goto("/");

    // Check for proper ARIA labels on buttons
    const buttonsWithoutLabels = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll("button"));
      return buttons
        .filter(
          (btn) =>
            !btn.getAttribute("aria-label") &&
            !btn.getAttribute("aria-labelledby") &&
            !btn.textContent?.trim(),
        )
        .map((btn) => btn.outerHTML.slice(0, 100));
    });

    if (buttonsWithoutLabels.length > 0) {
      console.log("\n🏷️ Buttons missing ARIA labels:");
      buttonsWithoutLabels.forEach((btn) => console.log(`   - ${btn}...`));
    }

    expect(buttonsWithoutLabels).toHaveLength(0);

    // Check for landmark roles
    const landmarks = await page.evaluate(() => {
      const regions = {
        main:
          document.querySelector("main") ||
          document.querySelector('[role="main"]'),
        nav:
          document.querySelector("nav") ||
          document.querySelector('[role="navigation"]'),
        header:
          document.querySelector("header") ||
          document.querySelector('[role="banner"]'),
        footer:
          document.querySelector("footer") ||
          document.querySelector('[role="contentinfo"]'),
      };
      return Object.entries(regions).map(([role, el]) => ({
        role,
        exists: !!el,
      }));
    });

    console.log("\n🗺️ Landmark regions:");
    landmarks.forEach(({ role, exists }) => {
      console.log(`   ${exists ? "✅" : "❌"} ${role}`);
    });
  });

  test("Color Contrast", async ({ page }) => {
    await page.goto("/");
    await injectAxe(page);

    // Check specifically for color contrast issues
    const contrastViolations = await getViolations(page, null, {
      runOnly: {
        type: "rule",
        values: ["color-contrast"],
      },
    });

    if (contrastViolations.length > 0) {
      console.log("\n🎨 Color contrast issues:");
      contrastViolations[0].nodes.forEach((node) => {
        console.log(`   - ${node.target.join(", ")}`);
      });
    }

    expect(contrastViolations).toHaveLength(0);
  });

  test("Screen Reader Announcements", async ({ page }) => {
    await page.goto("/");

    // Check for live regions
    const liveRegions = await page.evaluate(() => {
      const ariaLive = document.querySelectorAll("[aria-live]");
      const roleAlert = document.querySelectorAll(
        '[role="alert"], [role="status"]',
      );
      return {
        ariaLive: ariaLive.length,
        alerts: roleAlert.length,
      };
    });

    console.log("\n📢 Screen reader regions:");
    console.log(`   ARIA Live regions: ${liveRegions.ariaLive}`);
    console.log(`   Alert/Status regions: ${liveRegions.alerts}`);
  });
});

test.describe("Performance Monitoring", () => {
  test("Core Web Vitals", async ({ page }) => {
    await page.goto("/");

    // Measure Core Web Vitals
    const metrics = await page.evaluate(() => {
      return new Promise((resolve) => {
        const metrics: any = {};

        // Largest Contentful Paint
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          metrics.LCP = lastEntry.renderTime || lastEntry.loadTime;
        }).observe({ type: "largest-contentful-paint", buffered: true });

        // First Input Delay (simulated)
        metrics.FID = performance.now() < 100 ? "Good" : "Needs Improvement";

        // Cumulative Layout Shift
        let cls = 0;
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!(entry as any).hadRecentInput) {
              cls += (entry as any).value;
            }
          }
          metrics.CLS = cls;
        }).observe({ type: "layout-shift", buffered: true });

        // First Contentful Paint
        const fcp = performance
          .getEntriesByType("paint")
          .find((entry) => entry.name === "first-contentful-paint");
        metrics.FCP = fcp?.startTime || 0;

        // Time to Interactive (simplified)
        metrics.TTI = performance.now();

        setTimeout(() => resolve(metrics), 2000);
      });
    });

    console.log("\n📊 Core Web Vitals:");
    console.log(
      `   FCP (First Contentful Paint): ${(metrics.FCP / 1000).toFixed(2)}s`,
    );
    console.log(
      `   LCP (Largest Contentful Paint): ${(metrics.LCP / 1000).toFixed(2)}s ${metrics.LCP < 2500 ? "✅" : "⚠️"}`,
    );
    console.log(`   FID (First Input Delay): ${metrics.FID}`);
    console.log(
      `   CLS (Cumulative Layout Shift): ${metrics.CLS.toFixed(3)} ${metrics.CLS < 0.1 ? "✅" : "⚠️"}`,
    );
    console.log(
      `   TTI (Time to Interactive): ${(metrics.TTI / 1000).toFixed(2)}s`,
    );

    // Assert performance thresholds
    expect(metrics.LCP).toBeLessThan(4000); // 4 seconds
    expect(metrics.CLS).toBeLessThan(0.25); // Layout shift threshold
  });

  test("Bundle Size Analysis", async ({ page }) => {
    const response = await page.goto("/");
    const resources = await page.evaluate(() => {
      return performance.getEntriesByType("resource").map((entry) => ({
        name: entry.name.split("/").pop(),
        size: (entry as any).transferSize || 0,
        type: entry.name.includes(".js")
          ? "JavaScript"
          : entry.name.includes(".css")
            ? "CSS"
            : entry.name.includes(".png") || entry.name.includes(".jpg")
              ? "Image"
              : "Other",
      }));
    });

    // Group by type and calculate totals
    const byType = resources.reduce(
      (acc, resource) => {
        if (!acc[resource.type]) {
          acc[resource.type] = { count: 0, size: 0 };
        }
        acc[resource.type].count++;
        acc[resource.type].size += resource.size;
        return acc;
      },
      {} as Record<string, { count: number; size: number }>,
    );

    console.log("\n📦 Bundle Size Analysis:");
    Object.entries(byType).forEach(([type, data]) => {
      console.log(
        `   ${type}: ${data.count} files, ${(data.size / 1024).toFixed(2)} KB`,
      );
    });

    const totalSize = Object.values(byType).reduce(
      (sum, data) => sum + data.size,
      0,
    );
    console.log(`   Total: ${(totalSize / 1024).toFixed(2)} KB`);

    // Check if JavaScript bundle is too large
    expect(byType.JavaScript?.size || 0).toBeLessThan(3 * 1024 * 1024); // 3MB limit
  });

  test("Memory Leaks Detection", async ({ page }) => {
    await page.goto("/");

    // Take initial memory snapshot
    const initialMemory = await page.evaluate(() => {
      if ((performance as any).memory) {
        return (performance as any).memory.usedJSHeapSize;
      }
      return 0;
    });

    // Navigate through the app
    await page.click('text="Get Started"').catch(() => {});
    await page.waitForTimeout(1000);
    await page.goBack();
    await page.waitForTimeout(1000);

    // Take final memory snapshot
    const finalMemory = await page.evaluate(() => {
      if ((performance as any).memory) {
        return (performance as any).memory.usedJSHeapSize;
      }
      return 0;
    });

    const memoryIncrease = finalMemory - initialMemory;
    console.log("\n💾 Memory Usage:");
    console.log(`   Initial: ${(initialMemory / 1024 / 1024).toFixed(2)} MB`);
    console.log(`   Final: ${(finalMemory / 1024 / 1024).toFixed(2)} MB`);
    console.log(`   Increase: ${(memoryIncrease / 1024 / 1024).toFixed(2)} MB`);

    // Warn if memory increased by more than 10MB
    if (memoryIncrease > 10 * 1024 * 1024) {
      console.log("   ⚠️ Potential memory leak detected");
    }
  });
});

test.describe("Error Monitoring", () => {
  test("Console Errors", async ({ page }) => {
    const consoleErrors: string[] = [];

    page.on("console", (msg) => {
      if (msg.type() === "error") {
        consoleErrors.push(msg.text());
      }
    });

    page.on("pageerror", (err) => {
      consoleErrors.push(err.message);
    });

    await page.goto("/");
    await page.waitForTimeout(2000);

    console.log("\n🚨 Console Errors:");
    if (consoleErrors.length === 0) {
      console.log("   ✅ No console errors detected");
    } else {
      consoleErrors.forEach((error) => {
        console.log(`   ❌ ${error}`);
      });
    }

    expect(consoleErrors).toHaveLength(0);
  });

  test("Network Failures", async ({ page }) => {
    const failedRequests: string[] = [];

    page.on("requestfailed", (request) => {
      failedRequests.push(`${request.url()} - ${request.failure()?.errorText}`);
    });

    await page.goto("/");
    await page.waitForTimeout(2000);

    console.log("\n🌐 Network Failures:");
    if (failedRequests.length === 0) {
      console.log("   ✅ No network failures");
    } else {
      failedRequests.forEach((failure) => {
        console.log(`   ❌ ${failure}`);
      });
    }

    expect(failedRequests).toHaveLength(0);
  });

  test("Error Boundary Testing", async ({ page }) => {
    await page.goto("/");

    // Check if error boundaries are present
    const hasErrorBoundary = await page.evaluate(() => {
      // Check for React error boundary by looking for specific class names or components
      const errorBoundaryExists =
        document.querySelector('[class*="error-boundary"]') ||
        document.querySelector("[data-error-boundary]");
      return !!errorBoundaryExists;
    });

    console.log("\n🛡️ Error Boundaries:");
    console.log(
      `   ${hasErrorBoundary ? "✅" : "⚠️"} Error boundary ${hasErrorBoundary ? "detected" : "not found"}`,
    );
  });
});

// Generate comprehensive report
test.afterAll(async () => {
  console.log("\n" + "=".repeat(60));
  console.log("📋 ACCESSIBILITY & PERFORMANCE AUDIT COMPLETE");
  console.log("=".repeat(60));
  console.log("\nNext Steps:");
  console.log("1. Fix any accessibility violations (WCAG compliance)");
  console.log("2. Add missing ARIA labels and roles");
  console.log("3. Improve keyboard navigation");
  console.log("4. Optimize bundle size if needed");
  console.log("5. Set up continuous monitoring");
});
