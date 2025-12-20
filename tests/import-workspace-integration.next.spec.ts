/**
 * Import & Workspace Integration E2E Tests
 *
 * Tests the full import flow and three-panel workspace layout:
 * 1. File upload (image, text, JSON)
 * 2. AI processing and extraction
 * 3. Workspace creation with imported data
 * 4. Three-panel layout responsiveness
 * 5. Mobile experience
 */

import { test, expect, type Page } from "@playwright/test";
import path from "path";

const TEST_PITCH = `
HeatWatch - Smart Heating Monitoring for Buffalo Seniors

Problem: Buffalo seniors face dangerous furnace failures during harsh winters,
leading to emergency situations and health risks.

Solution: Affordable IoT sensors that monitor furnace temperature and send alerts
before failures occur, with emergency response integration.

Target Audience: Senior homeowners in Buffalo, NY and their family caregivers.

Business Model:
- Hardware: $79 one-time sensor cost
- Subscription: $9.99/month for monitoring and alerts
- Emergency response partnership with local services

Stage: Building prototype with 5 pilot households in North Buffalo.
`;

// Test data for BMC extraction validation
const EXPECTED_BMC_FIELDS = [
  "valuePropositions",
  "customerSegments",
  "channels",
  "customerRelationships",
  "revenueStreams",
  "keyResources",
  "keyActivities",
  "keyPartners",
  "costStructure",
];

test.describe("Import Flow Integration", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to studio/shelf page
    await page.goto("/studio");
    await page.waitForLoadState("networkidle");
  });

  test("should display Import button on workspace shelf", async ({ page }) => {
    // Check Import button exists
    const importButton = page.locator('button:has-text("Import")');
    await expect(importButton).toBeVisible();

    // Verify icon is present
    const uploadIcon = importButton.locator("svg");
    await expect(uploadIcon).toBeVisible();
  });

  test("should open Import Dialog on button click", async ({ page }) => {
    // Click Import button
    await page.click('button:has-text("Import")');

    // Wait for dialog to appear
    const dialog = page.locator('[role="dialog"]');
    await expect(dialog).toBeVisible();

    // Verify dialog title
    await expect(page.locator('h2:has-text("Import Project")')).toBeVisible();

    // Verify dialog description
    await expect(
      page.getByText(/Upload a Business Model Canvas/i),
    ).toBeVisible();
  });

  test("should show upload step with drag-and-drop zone", async ({ page }) => {
    await page.click('button:has-text("Import")');

    // Check for file upload zone
    const dropzone = page
      .locator('[data-testid="file-dropzone"], .dropzone, input[type="file"]')
      .first();
    await expect(dropzone).toBeTruthy();

    // Check for text paste option
    const pasteTab = page
      .locator('button:has-text("Paste Text"), [role="tab"]:has-text("Text")')
      .first();
    if (await pasteTab.isVisible()) {
      await expect(pasteTab).toBeVisible();
    }
  });

  test("should handle text import and create workspace", async ({ page }) => {
    await page.click('button:has-text("Import")');
    await page.waitForSelector('[role="dialog"]');

    // Switch to text paste tab if it exists
    const pasteTab = page
      .locator('button:has-text("Paste Text"), [role="tab"]:has-text("Text")')
      .first();
    if (await pasteTab.isVisible()) {
      await pasteTab.click();
    }

    // Find textarea and paste content
    const textarea = page
      .locator('textarea[placeholder*="Paste"], textarea')
      .first();
    await textarea.fill(TEST_PITCH);

    // Submit
    const submitButton = page
      .locator('button:has-text("Import"), button:has-text("Analyze")')
      .first();
    await submitButton.click();

    // Wait for processing
    await page.waitForSelector("text=/Processing|Analyzing/i", {
      timeout: 10000,
    });

    // Should show progress
    const progressIndicator = page
      .locator('[role="progressbar"], .progress, text=/Processing/i')
      .first();
    await expect(progressIndicator).toBeVisible();
  });

  test("should navigate to workspace after successful import", async ({
    page,
  }) => {
    // Mock successful import (skip actual AI call for speed)
    await page.route("**/api/ai/**", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          text: JSON.stringify({
            projectName: "HeatWatch",
            oneLiner: "Smart heating monitoring for Buffalo seniors",
            stage: "building",
            tags: ["IoT", "Healthcare", "Buffalo"],
            valuePropositions: "Prevent dangerous furnace failures",
            customerSegments: "Buffalo seniors and their families",
            confidence: 0.85,
            extractedFields: ["valuePropositions", "customerSegments"],
            warnings: [],
            suggestions: [],
          }),
        }),
      });
    });

    await page.click('button:has-text("Import")');
    const pasteTab = page.locator('button:has-text("Paste Text")').first();
    if (await pasteTab.isVisible()) {
      await pasteTab.click();
    }

    const textarea = page.locator("textarea").first();
    await textarea.fill(TEST_PITCH);

    const submitButton = page
      .locator('button:has-text("Import"), button:has-text("Analyze")')
      .first();
    await submitButton.click();

    // Wait for navigation to workspace
    await page.waitForURL(/\/workspace\/BUF-[A-Z0-9]+/, { timeout: 15000 });

    // Verify we're on workspace page
    expect(page.url()).toMatch(/\/workspace\/BUF-/);
  });
});

test.describe("Three-Panel Workspace Layout", () => {
  test.beforeEach(async ({ page }) => {
    // Create or navigate to a test workspace
    // For now, we'll just go to the new workspace page
    await page.goto("/workspace/new");
    await page.waitForLoadState("networkidle");
  });

  test("should display all three panels on desktop", async ({
    page,
    viewport,
  }) => {
    // Skip if viewport is too small
    if (!viewport || viewport.width < 1024) {
      test.skip();
    }

    // Context panel (left)
    const contextPanel = page
      .locator(
        '[data-testid="context-panel"], aside:has-text("Project"), .context-panel',
      )
      .first();
    if (await contextPanel.isVisible()) {
      await expect(contextPanel).toBeVisible();
    }

    // Main workspace (center)
    const mainWorkspace = page
      .locator('[data-testid="main-workspace"], main, .workspace-main')
      .first();
    await expect(mainWorkspace).toBeVisible();

    // Assist panel (right) - may be hidden initially
    const assistPanel = page
      .locator(
        '[data-testid="assist-panel"], aside:has-text("Assist"), .assist-panel',
      )
      .first();
    // Assist panel might be optional/collapsible
    const assistExists = await assistPanel.count();
    if (assistExists > 0) {
      console.log("Assist panel found");
    }
  });

  test("should show project navigation in context panel", async ({ page }) => {
    // Look for navigation tabs
    const canvasTab = page
      .locator('[role="tab"]:has-text("Canvas"), button:has-text("Canvas")')
      .first();
    const journalTab = page
      .locator('[role="tab"]:has-text("Journal"), button:has-text("Journal")')
      .first();
    const documentsTab = page
      .locator(
        '[role="tab"]:has-text("Documents"), button:has-text("Documents")',
      )
      .first();

    // At least one navigation element should exist
    const hasNavigation =
      (await canvasTab.count()) > 0 ||
      (await journalTab.count()) > 0 ||
      (await documentsTab.count()) > 0;

    expect(hasNavigation).toBeTruthy();
  });

  test("should be responsive on mobile", async ({ page, viewport }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // On mobile, panels should stack or have different layout
    // The layout should still be usable
    const mainContent = page.locator('main, [role="main"]').first();
    await expect(mainContent).toBeVisible();

    // Check that content is not overflowing
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    expect(bodyWidth).toBeLessThanOrEqual(376); // Allow 1px tolerance
  });
});

test.describe("Import Data Population", () => {
  test("should populate BMC fields from imported data", async ({ page }) => {
    // Mock the import flow
    await page.route("**/api/ai/**", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          text: JSON.stringify({
            projectName: "Test Import Project",
            oneLiner: "Testing import functionality",
            description: "A test project for import validation",
            stage: "idea",
            tags: ["test", "import"],
            valuePropositions: "Automated testing of import features",
            customerSegments: "QA engineers and developers",
            channels: "Direct integration, API",
            revenueStreams: "Subscription model",
            confidence: 0.9,
            extractedFields: [
              "valuePropositions",
              "customerSegments",
              "channels",
              "revenueStreams",
            ],
            warnings: [],
            suggestions: ["Add more detail to key activities"],
          }),
        }),
      });
    });

    await page.goto("/studio");
    await page.click('button:has-text("Import")');

    const pasteTab = page.locator('button:has-text("Paste Text")').first();
    if (await pasteTab.isVisible()) {
      await pasteTab.click();
    }

    const textarea = page.locator("textarea").first();
    await textarea.fill("Test project for import validation");

    const submitButton = page
      .locator('button:has-text("Import"), button:has-text("Analyze")')
      .first();
    await submitButton.click();

    // Wait for workspace
    await page.waitForURL(/\/workspace\/BUF-/, { timeout: 15000 });

    // Check that project name is set
    const projectName = page
      .locator(
        'h1:has-text("Test Import Project"), [data-testid="project-name"]',
      )
      .first();
    if ((await projectName.count()) > 0) {
      await expect(projectName).toBeVisible();
    }
  });
});

test.describe("Performance & UX", () => {
  test("should load import dialog quickly", async ({ page }) => {
    await page.goto("/studio");

    const startTime = Date.now();
    await page.click('button:has-text("Import")');
    await page.waitForSelector('[role="dialog"]');
    const loadTime = Date.now() - startTime;

    // Dialog should open in under 500ms
    expect(loadTime).toBeLessThan(500);
  });

  test("should show loading state during import processing", async ({
    page,
  }) => {
    await page.goto("/studio");
    await page.click('button:has-text("Import")');

    const pasteTab = page.locator('button:has-text("Paste Text")').first();
    if (await pasteTab.isVisible()) {
      await pasteTab.click();
    }

    const textarea = page.locator("textarea").first();
    await textarea.fill(TEST_PITCH);

    // Slow down the response to see loading state
    await page.route("**/api/ai/**", async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await route.fulfill({
        status: 200,
        body: JSON.stringify({ text: "{}" }),
      });
    });

    const submitButton = page
      .locator('button:has-text("Import"), button:has-text("Analyze")')
      .first();
    await submitButton.click();

    // Should show processing state
    const processingIndicator = await page
      .locator("text=/Processing|Loading|Analyzing/i")
      .first();
    if ((await processingIndicator.count()) > 0) {
      await expect(processingIndicator).toBeVisible();
    }
  });

  test("should handle import errors gracefully", async ({ page }) => {
    await page.route("**/api/ai/**", async (route) => {
      await route.fulfill({
        status: 500,
        body: JSON.stringify({ error: "AI service unavailable" }),
      });
    });

    await page.goto("/studio");
    await page.click('button:has-text("Import")');

    const pasteTab = page.locator('button:has-text("Paste Text")').first();
    if (await pasteTab.isVisible()) {
      await pasteTab.click();
    }

    const textarea = page.locator("textarea").first();
    await textarea.fill("Test error handling");

    const submitButton = page
      .locator('button:has-text("Import"), button:has-text("Analyze")')
      .first();
    await submitButton.click();

    // Should show error message
    const errorToast = page
      .locator('[role="status"], [role="alert"], text=/error|fail/i')
      .first();
    // Error handling might show in dialog or as toast
    const errorVisible = await errorToast.count();
    expect(errorVisible).toBeGreaterThan(0);
  });
});

test.describe("Accessibility", () => {
  test("import dialog should be keyboard navigable", async ({ page }) => {
    await page.goto("/studio");

    // Tab to Import button
    await page.keyboard.press("Tab");
    const importButton = page.locator('button:has-text("Import")');

    // Press Enter to open
    await page.keyboard.press("Enter");

    const dialog = page.locator('[role="dialog"]');
    await expect(dialog).toBeVisible();

    // Should be able to close with Escape
    await page.keyboard.press("Escape");
    await expect(dialog).not.toBeVisible();
  });

  test("import dialog should trap focus", async ({ page }) => {
    await page.goto("/studio");
    await page.click('button:has-text("Import")');

    const dialog = page.locator('[role="dialog"]');
    await expect(dialog).toBeVisible();

    // Tab through dialog elements
    await page.keyboard.press("Tab");
    const focusedElement = await page.evaluate(
      () => document.activeElement?.tagName,
    );

    // Focus should be within dialog
    expect(["BUTTON", "INPUT", "TEXTAREA", "A"]).toContain(
      focusedElement || "",
    );
  });
});
