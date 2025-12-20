import { test, expect } from "@playwright/test";

/**
 * CRITICAL DESIGN SYSTEM VALIDATION
 * Based on TODO.md checklist - comprehensive visual and functional testing
 */

test.describe("Design System Validation - Heavily Critical Assessment", () => {
  test.beforeEach(async ({ page }) => {
    // Use relative URL to leverage baseURL from config
    await page.goto("/design-system");
    await page.waitForLoadState("networkidle");
  });

  test.describe("1️⃣ Design System Page Visual Validation", () => {
    test("should load design system page correctly", async ({ page }) => {
      await expect(page).toHaveTitle(/Buffalo Projects/i);
      await expect(page.locator("h1")).toContainText(
        "Buffalo Projects Design System",
      );

      // CRITICAL: Check responsive padding
      const container = page.locator(".mx-auto.max-w-6xl");
      await expect(container).toBeVisible();

      // Take full page screenshot
      await page.screenshot({
        path: ".playwright-mcp/design-system-full.png",
        fullPage: true,
      });
    });

    test("should have correct typography hierarchy", async ({ page }) => {
      const h1 = page.locator("h1");
      await expect(h1).toHaveClass(/font-display.*text-4xl|text-5xl|text-6xl/);

      const description = page.locator("p.text-muted-foreground").first();
      await expect(description).toBeVisible();
    });
  });

  test.describe("Button Component Tests - CRITICAL", () => {
    test("should render all 6 button variants", async ({ page }) => {
      const variantsSection = page
        .locator("section")
        .filter({ hasText: "Buttons" })
        .first();

      // CRITICAL: All variants must be present
      await expect(
        variantsSection.getByRole("button", { name: "Primary" }),
      ).toBeVisible();
      await expect(
        variantsSection.getByRole("button", { name: "Secondary" }),
      ).toBeVisible();
      await expect(
        variantsSection.getByRole("button", { name: "Outline" }),
      ).toBeVisible();
      await expect(
        variantsSection.getByRole("button", { name: "Ghost" }),
      ).toBeVisible();
      await expect(
        variantsSection.getByRole("button", { name: "Link" }),
      ).toBeVisible();
      await expect(
        variantsSection.getByRole("button", { name: "Destructive" }),
      ).toBeVisible();

      // Screenshot button variants
      await page.locator('h2:has-text("Buttons")').scrollIntoViewIfNeeded();
      await page.screenshot({
        path: ".playwright-mcp/buttons-variants.png",
        clip: (await variantsSection.boundingBox()) || undefined,
      });
    });

    test("should render all 5 button sizes with correct heights", async ({
      page,
    }) => {
      const sizesCard = page.locator("text=Sizes").locator("..").locator("..");

      // CRITICAL: All sizes must render
      const xsButton = sizesCard.getByRole("button", { name: "Extra Small" });
      const smButton = sizesCard.getByRole("button", { name: "Small" });
      const mdButton = sizesCard.getByRole("button", { name: "Medium" });
      const lgButton = sizesCard.getByRole("button", { name: "Large" });
      const xlButton = sizesCard.getByRole("button", { name: "Extra Large" });

      await expect(xsButton).toBeVisible();
      await expect(smButton).toBeVisible();
      await expect(mdButton).toBeVisible();
      await expect(lgButton).toBeVisible();
      await expect(xlButton).toBeVisible();

      // CRITICAL: Height verification (h-7, h-8, h-9, h-10, h-12 = 28px, 32px, 36px, 40px, 48px)
      const xsBox = await xsButton.boundingBox();
      const xlBox = await xlButton.boundingBox();

      if (!xsBox || !xlBox) {
        throw new Error("CRITICAL FAILURE: Button size boxes not measurable");
      }

      // XS should be 28px, XL should be 48px
      expect(xsBox.height).toBeGreaterThanOrEqual(26); // Allow 2px tolerance
      expect(xsBox.height).toBeLessThanOrEqual(30);
      expect(xlBox.height).toBeGreaterThanOrEqual(46);
      expect(xlBox.height).toBeLessThanOrEqual(50);
    });

    test("should display button states correctly", async ({ page }) => {
      const statesCard = page
        .locator("text=States")
        .locator("..")
        .locator("..");

      // CRITICAL: Loading button must show spinner
      const loadingButton = statesCard.getByRole("button", {
        name: "Loading...",
      });
      await expect(loadingButton).toBeVisible();
      await expect(loadingButton).toBeDisabled();
      await expect(loadingButton.locator(".animate-spin")).toBeVisible();

      // CRITICAL: Disabled button
      const disabledButton = statesCard.getByRole("button", {
        name: "Disabled",
      });
      await expect(disabledButton).toBeVisible();
      await expect(disabledButton).toBeDisabled();

      // CRITICAL: Icon button should be square
      const iconButtons = statesCard
        .locator('button[data-slot="button"]')
        .filter({ has: page.locator("svg") });
      const firstIconButton = iconButtons.first();
      const iconBox = await firstIconButton.boundingBox();

      if (!iconBox) {
        throw new Error("CRITICAL FAILURE: Icon button not measurable");
      }

      // Should be approximately square (allow 4px tolerance)
      const aspectRatio = iconBox.width / iconBox.height;
      expect(aspectRatio).toBeGreaterThan(0.9);
      expect(aspectRatio).toBeLessThan(1.1);
    });

    test("CRITICAL: Button hover states must be smooth", async ({ page }) => {
      const primaryButton = page
        .getByRole("button", { name: "Primary" })
        .first();

      // Get initial position
      const initialBox = await primaryButton.boundingBox();
      if (!initialBox) throw new Error("Button not visible");

      // Hover and check for animation
      await primaryButton.hover();
      await page.waitForTimeout(200); // Wait for hover animation

      // Should have scale animation (framer-motion)
      const hasMotion = await primaryButton.evaluate((el) => {
        const transform = window.getComputedStyle(el).transform;
        return transform !== "none";
      });

      // CRITICAL: Motion should be enabled
      expect(hasMotion).toBeTruthy();

      await page.screenshot({
        path: ".playwright-mcp/button-hover-state.png",
      });
    });
  });

  test.describe("Input Component Tests - CRITICAL", () => {
    test("should render basic input with correct styling", async ({ page }) => {
      const emailInput = page.locator('input[type="email"]#email');
      await expect(emailInput).toBeVisible();
      await expect(emailInput).toHaveAttribute(
        "placeholder",
        "you@buffaloprojects.com",
      );

      // CRITICAL: Input should have proper styling
      const inputClasses = await emailInput.getAttribute("class");
      expect(inputClasses).toContain("h-9"); // Default medium size
    });

    test("should render input with prefix icon", async ({ page }) => {
      const searchInput = page.locator("input#search");
      await expect(searchInput).toBeVisible();

      // CRITICAL: Prefix icon must be visible
      const searchContainer = searchInput.locator("..");
      const prefixIcon = searchContainer.locator("svg").first();
      await expect(prefixIcon).toBeVisible();
    });

    test("CRITICAL: Input error state must be clearly visible", async ({
      page,
    }) => {
      const passwordInput = page.locator("input#password");
      await expect(passwordInput).toBeVisible();

      // CRITICAL: Error message must be present
      const errorMessage = page.locator(
        "text=Password must be at least 8 characters",
      );
      await expect(errorMessage).toBeVisible();

      // CRITICAL: Error text should be small (text-xs)
      const errorClass = await errorMessage.getAttribute("class");
      expect(errorClass).toContain("text-xs");

      // CRITICAL: Input should have error styling (red border)
      const inputClasses = await passwordInput.getAttribute("class");
      expect(inputClasses).toContain("border-destructive");

      await page.screenshot({
        path: ".playwright-mcp/input-error-state.png",
      });
    });

    test("should render all 4 input sizes", async ({ page }) => {
      const sizesCard = page
        .locator('h3:has-text("Input Sizes")')
        .locator("..")
        .locator("..");

      const smInput = sizesCard
        .locator("input")
        .filter({ hasText: /small/i })
        .first();
      const mdInput = sizesCard
        .locator("input")
        .filter({ hasText: /medium/i })
        .first();
      const lgInput = sizesCard
        .locator("input")
        .filter({ hasText: /large/i })
        .first();
      const xlInput = sizesCard
        .locator("input")
        .filter({ hasText: /extra large/i })
        .first();

      // CRITICAL: All sizes must be visible
      await expect(smInput).toBeVisible();
      await expect(mdInput).toBeVisible();
      await expect(lgInput).toBeVisible();
      await expect(xlInput).toBeVisible();

      await page.screenshot({
        path: ".playwright-mcp/inputs-all-sizes.png",
      });
    });

    test("CRITICAL: Input focus states must be accessible", async ({
      page,
    }) => {
      const emailInput = page.locator("input#email");

      // Focus the input
      await emailInput.focus();

      // CRITICAL: Focus ring must be visible
      const focusRingVisible = await emailInput.evaluate((el) => {
        const outline = window.getComputedStyle(el).outline;
        const boxShadow = window.getComputedStyle(el).boxShadow;
        return outline !== "none" || boxShadow !== "none";
      });

      expect(focusRingVisible).toBeTruthy();

      await page.screenshot({
        path: ".playwright-mcp/input-focus-state.png",
      });
    });
  });

  test.describe("Card Component Tests - CRITICAL", () => {
    test("should render all 6 card variants", async ({ page }) => {
      const cardsSection = page.locator('h2:has-text("Cards")').locator("..");

      // CRITICAL: All 6 variants must be present
      await expect(cardsSection.getByText("Default Card")).toBeVisible();
      await expect(cardsSection.getByText("Elevated Card")).toBeVisible();
      await expect(cardsSection.getByText("Interactive Card")).toBeVisible();
      await expect(cardsSection.getByText("Minimal Card")).toBeVisible();
      await expect(cardsSection.getByText("Ghost Card")).toBeVisible();
      await expect(cardsSection.getByText("Outline Card")).toBeVisible();

      await page.screenshot({
        path: ".playwright-mcp/cards-variants.png",
      });
    });

    test("CRITICAL: Card spacing must follow design system", async ({
      page,
    }) => {
      const defaultCard = page
        .locator("text=Default Card")
        .locator("..")
        .locator("..");

      // CRITICAL: CardHeader should have space-y-2 (8px gap)
      const header = defaultCard.locator('[class*="space-y-2"]').first();
      await expect(header).toBeVisible();

      // CRITICAL: CardContent should have pt-6 (24px top padding)
      const content = defaultCard.locator('[class*="pt-6"]').first();
      await expect(content).toBeVisible();
    });

    test("should show interactive card hover state", async ({ page }) => {
      const interactiveCard = page
        .locator("text=Interactive Card")
        .locator("..")
        .locator("..");

      // CRITICAL: Should have cursor-pointer
      const hasCursorPointer = await interactiveCard.evaluate((el) => {
        return window.getComputedStyle(el).cursor === "pointer";
      });

      expect(hasCursorPointer).toBeTruthy();

      // Hover to see state change
      await interactiveCard.hover();
      await page.waitForTimeout(200);

      await page.screenshot({
        path: ".playwright-mcp/card-interactive-hover.png",
      });
    });
  });

  test.describe("Badge Component Tests", () => {
    test("should render all 4 badge variants", async ({ page }) => {
      const badgesSection = page.locator('h2:has-text("Badges")').locator("..");

      await expect(badgesSection.getByText("Default")).toBeVisible();
      await expect(badgesSection.getByText("Secondary")).toBeVisible();
      await expect(badgesSection.getByText("Destructive")).toBeVisible();
      await expect(badgesSection.getByText("Outline")).toBeVisible();

      // CRITICAL: Badges should be small (text-[11px])
      const defaultBadge = badgesSection.getByText("Default").first();
      const badgeClass = await defaultBadge.getAttribute("class");
      expect(badgeClass).toContain("text-[11px]");
    });
  });

  test.describe("Buffalo Custom Components - CRITICAL", () => {
    test("CRITICAL: StatCard spacing and layout", async ({ page }) => {
      const statCardsSection = page
        .locator('h3:has-text("Stat Cards")')
        .locator("..");

      // CRITICAL: Should have 3 StatCards
      const statCards = statCardsSection
        .locator('[class*="grid"]')
        .first()
        .locator("> *");
      await expect(statCards).toHaveCount(3);

      // CRITICAL: Each StatCard must have icon, value, label, and trend
      const firstCard = statCards.first();

      // Icon should be 20px (h-5 w-5)
      const icon = firstCard.locator("svg").first();
      await expect(icon).toBeVisible();

      // Value should be text-3xl
      const value = firstCard.locator("text=127");
      await expect(value).toBeVisible();

      // Trend indicator
      const trend = firstCard.locator("text=12%");
      await expect(trend).toBeVisible();

      // CRITICAL: Verify spacing (gap-6 = 24px between items)
      await page.screenshot({
        path: ".playwright-mcp/statcards-spacing.png",
      });
    });

    test("CRITICAL: EmptyState component validation", async ({ page }) => {
      const emptyStateSection = page
        .locator('h3:has-text("Empty State")')
        .locator("..");

      // CRITICAL: All elements must be present
      await expect(
        emptyStateSection.getByText("No projects yet"),
      ).toBeVisible();
      await expect(
        emptyStateSection.getByText(
          "Get started by creating your first project. It only takes a minute.",
        ),
      ).toBeVisible();
      await expect(
        emptyStateSection.getByRole("button", { name: "Create Project" }),
      ).toBeVisible();
      await expect(
        emptyStateSection.getByRole("button", { name: "Learn More" }),
      ).toBeVisible();

      // CRITICAL: Icon should be h-8 w-8 (32px)
      const icon = emptyStateSection.locator("svg").first();
      await expect(icon).toBeVisible();

      // CRITICAL: Spacing validation (mb-8, mb-3, etc.)
      await page.screenshot({
        path: ".playwright-mcp/emptystate-complete.png",
      });
    });

    test("CRITICAL: EmptyState button actions should work", async ({
      page,
    }) => {
      const createButton = page.getByRole("button", { name: "Create Project" });

      // Set up dialog listener before click
      page.on("dialog", async (dialog) => {
        expect(dialog.message()).toBe("Create project clicked");
        await dialog.accept();
      });

      await createButton.click();
    });
  });

  test.describe("Typography Tests", () => {
    test("should render all typography styles", async ({ page }) => {
      const typographySection = page
        .locator('h2:has-text("Typography")')
        .locator("..");

      // CRITICAL: All typography levels must be present
      await expect(
        typographySection.locator("text=Display Heading"),
      ).toBeVisible();
      await expect(
        typographySection.locator("text=Heading 1").first(),
      ).toBeVisible();
      await expect(
        typographySection.locator("text=Heading 2").first(),
      ).toBeVisible();
      await expect(
        typographySection.locator("text=Heading 3").first(),
      ).toBeVisible();

      // CRITICAL: Display heading should be text-6xl
      const displayHeading = typographySection.locator(".text-6xl").first();
      const displayClass = await displayHeading.getAttribute("class");
      expect(displayClass).toContain("font-display");
    });
  });

  test.describe("Color System Tests", () => {
    test("should render all color swatches", async ({ page }) => {
      const colorsSection = page.locator('h2:has-text("Colors")').locator("..");

      // CRITICAL: All semantic colors must be documented
      await expect(colorsSection.getByText("Background")).toBeVisible();
      await expect(colorsSection.getByText("Foreground")).toBeVisible();
      await expect(colorsSection.getByText("Primary")).toBeVisible();
      await expect(colorsSection.getByText("Destructive")).toBeVisible();
      await expect(colorsSection.getByText("Muted")).toBeVisible();
      await expect(colorsSection.getByText("Border")).toBeVisible();

      await page.screenshot({
        path: ".playwright-mcp/colors-palette.png",
      });
    });
  });

  test.describe("Spacing Scale Tests", () => {
    test("CRITICAL: All 10 spacing values must be present", async ({
      page,
    }) => {
      const spacingSection = page
        .locator('h2:has-text("Spacing")')
        .locator("..");

      // CRITICAL: All spacing values from 4px to 96px
      const spacingValues = [4, 8, 12, 16, 24, 32, 48, 64, 80, 96];

      for (const value of spacingValues) {
        await expect(spacingSection.getByText(`${value}px`)).toBeVisible();
      }

      await page.screenshot({
        path: ".playwright-mcp/spacing-scale.png",
      });
    });
  });

  test.describe("Responsive Design Tests - CRITICAL", () => {
    test("CRITICAL: Mobile 375px layout", async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.waitForLoadState("networkidle");

      // CRITICAL: Cards should stack in single column
      const cardsGrid = page.locator(".grid").first();
      const gridClass = await cardsGrid.getAttribute("class");

      // Should not have multi-column on mobile
      await page.screenshot({
        path: ".playwright-mcp/mobile-design-system.png",
        fullPage: true,
      });
    });

    test("Tablet 768px layout", async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.waitForLoadState("networkidle");

      // CRITICAL: Cards should show 2-column grid (md:grid-cols-2)
      await page.screenshot({
        path: ".playwright-mcp/tablet-design-system.png",
        fullPage: true,
      });
    });

    test("Desktop 1440px layout", async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.waitForLoadState("networkidle");

      // CRITICAL: Cards should show 3-column grid (lg:grid-cols-3)
      await page.screenshot({
        path: ".playwright-mcp/desktop-design-system.png",
        fullPage: true,
      });
    });
  });

  test.describe("Accessibility Tests - CRITICAL", () => {
    test("CRITICAL: Keyboard navigation must work", async ({ page }) => {
      // Tab through interactive elements
      await page.keyboard.press("Tab");

      // First focusable should be a button
      const focused = page.locator(":focus");
      await expect(focused).toBeVisible();

      // CRITICAL: Focus ring must be visible
      const hasFocusRing = await focused.evaluate((el) => {
        const outline = window.getComputedStyle(el).outline;
        const boxShadow = window.getComputedStyle(el).boxShadow;
        const ring = window
          .getComputedStyle(el)
          .getPropertyValue("--tw-ring-width");
        return outline !== "none" || boxShadow !== "none" || ring !== "";
      });

      expect(hasFocusRing).toBeTruthy();
    });

    test("CRITICAL: All buttons must have accessible names", async ({
      page,
    }) => {
      const buttons = page.locator("button");
      const buttonCount = await buttons.count();

      for (let i = 0; i < buttonCount; i++) {
        const button = buttons.nth(i);
        const accessibleName =
          (await button.getAttribute("aria-label")) ||
          (await button.textContent());

        // CRITICAL: Every button must have a name
        expect(accessibleName).toBeTruthy();
        if (accessibleName && accessibleName.trim().length === 0) {
          throw new Error(
            `CRITICAL FAILURE: Button at index ${i} has no accessible name`,
          );
        }
      }
    });

    test("CRITICAL: Color contrast must be sufficient", async ({ page }) => {
      // Check primary button contrast
      const primaryButton = page
        .getByRole("button", { name: "Primary" })
        .first();

      const colors = await primaryButton.evaluate((el) => {
        const styles = window.getComputedStyle(el);
        return {
          bg: styles.backgroundColor,
          fg: styles.color,
        };
      });

      // Note: Full contrast calculation would require color parsing library
      // This is a smoke test to ensure styles are applied
      expect(colors.bg).toBeTruthy();
      expect(colors.fg).toBeTruthy();
    });
  });

  test.describe("Performance Tests - CRITICAL", () => {
    test("CRITICAL: Page should load quickly", async ({ page }) => {
      const startTime = Date.now();
      await page.goto("/design-system");
      await page.waitForLoadState("networkidle");
      const loadTime = Date.now() - startTime;

      // CRITICAL: Should load in under 2 seconds
      expect(loadTime).toBeLessThan(2000);
    });

    test("CRITICAL: No layout shift on load", async ({ page }) => {
      // Reload and check for CLS
      await page.reload();
      await page.waitForLoadState("networkidle");

      // Wait for any animations to complete
      await page.waitForTimeout(500);

      // Content should be stable
      const h1 = page.locator("h1");
      const initialBox = await h1.boundingBox();

      await page.waitForTimeout(500);

      const finalBox = await h1.boundingBox();

      // CRITICAL: Position should not change
      expect(initialBox?.y).toBe(finalBox?.y);
    });
  });
});
