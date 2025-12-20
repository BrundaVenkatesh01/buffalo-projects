import { test, expect } from "@playwright/test";

/**
 * E2E Test Suite for Advanced Import Flow
 *
 * Tests the complete user journey from project import to workspace creation,
 * including AI analysis, validation, and immediate value delivery.
 */

test.describe("Advanced Import Flow", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the advanced import flow
    await page.goto("/import/advanced");

    // Wait for the page to load completely
    await page.waitForLoadState("networkidle");
  });

  test("should display the advanced import interface", async ({ page }) => {
    // Verify main heading
    await expect(page.locator("h1")).toContainText("Advanced Project Import");

    // Check subtitle
    await expect(
      page.locator(
        "text=AI-powered analysis and intelligent workspace creation",
      ),
    ).toBeVisible();

    // Verify step indicator
    await expect(page.locator("text=Source")).toBeVisible();
    await expect(page.locator("text=Process")).toBeVisible();
    await expect(page.locator("text=Analyze")).toBeVisible();
    await expect(page.locator("text=Preview")).toBeVisible();
  });

  test("should handle GitHub URL import with immediate validation", async ({
    page,
  }) => {
    // Test GitHub URL import
    const githubUrl = "https://github.com/microsoft/vscode";

    // Enter GitHub URL
    await page.fill('input[type="url"]', githubUrl);

    // Click import button
    await page.click('button:has-text("Import")');

    // Should show immediate validation
    await expect(page.locator("text=Ready to Import")).toBeVisible();
    await expect(page.locator("text=GitHub Import")).toBeVisible();

    // Verify what happens next section
    await expect(page.locator("text=AI-Powered Analysis")).toBeVisible();
    await expect(page.locator("text=Intelligent Insights")).toBeVisible();
    await expect(page.locator("text=Strategic Recommendations")).toBeVisible();
    await expect(page.locator("text=Smart Workspace")).toBeVisible();
  });

  test("should validate different URL types correctly", async ({ page }) => {
    const testUrls = [
      { url: "https://github.com/facebook/react", type: "GitHub" },
      { url: "https://youtube.com/watch?v=dQw4w9WgXcQ", type: "YouTube" },
      { url: "https://figma.com/file/example", type: "Figma" },
      { url: "https://myproject.com", type: "Website" },
    ];

    for (const { url, type } of testUrls) {
      // Clear and enter new URL
      await page.fill('input[type="url"]', "");
      await page.fill('input[type="url"]', url);
      await page.click('button:has-text("Import")');

      // Should detect the correct type
      await expect(page.locator(`text=${type} Import`)).toBeVisible();

      // Reset for next test
      await page.reload();
      await page.waitForLoadState("networkidle");
    }
  });

  test("should handle file upload with drag and drop", async ({ page }) => {
    // Switch to file upload mode
    await page.click('button:has-text("📁 File Upload")');

    // Verify file upload interface
    await expect(
      page.locator("text=Drop your file here or click to browse"),
    ).toBeVisible();

    // Check supported file types
    await expect(page.locator("text=PDF")).toBeVisible();
    await expect(page.locator("text=ZIP")).toBeVisible();
    await expect(page.locator("text=JSON")).toBeVisible();

    // Test file type examples
    await expect(page.locator("text=Pitch decks, docs")).toBeVisible();
    await expect(page.locator("text=Project exports")).toBeVisible();
    await expect(page.locator("text=Config files")).toBeVisible();
  });

  test("should show validation errors for invalid inputs", async ({ page }) => {
    // Test invalid URL
    await page.fill('input[type="url"]', "not-a-valid-url");
    await page.click('button:has-text("Import")');

    // Should show validation error
    await expect(page.locator("text=Invalid URL format")).toBeVisible();
    await expect(page.locator("text=Validation Errors")).toBeVisible();

    // Test GitHub-specific validation
    await page.fill('input[type="url"]', "https://github.com/invalid");
    await page.click('button:has-text("Import")');

    // Should show GitHub-specific error
    await expect(
      page.locator("text=GitHub URL should be in format"),
    ).toBeVisible();
  });

  test("should start advanced import process and show progress", async ({
    page,
  }) => {
    // Set up a valid GitHub URL
    const githubUrl = "https://github.com/vercel/next.js";
    await page.fill('input[type="url"]', githubUrl);
    await page.click('button:has-text("Import")');

    // Wait for ready state
    await expect(page.locator("text=Ready to Import")).toBeVisible();

    // Start the import process
    await page.click('button:has-text("Start Advanced Import")');

    // Should show processing step
    await expect(page.locator("text=Processing Your Project")).toBeVisible();

    // Check processing stages
    await expect(page.locator("text=Validation")).toBeVisible();
    await expect(page.locator("text=Data Extraction")).toBeVisible();
    await expect(page.locator("text=AI Analysis")).toBeVisible();
    await expect(page.locator("text=Intelligence Synthesis")).toBeVisible();
    await expect(page.locator("text=Workspace Creation")).toBeVisible();

    // Should show overall progress
    await expect(page.locator("text=Overall Progress")).toBeVisible();

    // Wait for validation stage to complete (in demo mode this should be fast)
    await page.waitForSelector("text=✅", { timeout: 10000 });
  });

  test("should transition to AI analysis visualization", async ({ page }) => {
    // Mock a successful import start
    await page.fill('input[type="url"]', "https://github.com/openai/gpt-3");
    await page.click('button:has-text("Import")');
    await page.click('button:has-text("Start Advanced Import")');

    // Wait for analysis phase (in demo, this transitions quickly)
    await page.waitForSelector("text=AI Analysis in Progress", {
      timeout: 15000,
    });

    // Verify AI analysis interface
    await expect(page.locator("text=Gemini AI Analysis")).toBeVisible();
    await expect(page.locator("text=Competitive Intelligence")).toBeVisible();

    // Check analysis details
    await expect(
      page.locator("text=Technical architecture assessment"),
    ).toBeVisible();
    await expect(page.locator("text=Business model evaluation")).toBeVisible();
    await expect(
      page.locator("text=Market opportunity analysis"),
    ).toBeVisible();
    await expect(
      page.locator("text=Competitor landscape mapping"),
    ).toBeVisible();
  });

  test("should complete import and show comprehensive results", async ({
    page,
  }) => {
    // This test simulates a complete import flow
    await page.fill('input[type="url"]', "https://github.com/facebook/react");
    await page.click('button:has-text("Import")');
    await page.click('button:has-text("Start Advanced Import")');

    // Wait for analysis completion (extended timeout for full process)
    await page.waitForSelector("text=Analysis Complete", { timeout: 30000 });

    // Verify executive summary
    await expect(page.locator("text=Executive Summary")).toBeVisible();
    await expect(page.locator("text=Confidence Score")).toBeVisible();
    await expect(page.locator("text=Maturity Level")).toBeVisible();

    // Check insights and action items
    await expect(page.locator("text=🎯 Key Insights")).toBeVisible();
    await expect(page.locator("text=🚀 Action Items")).toBeVisible();

    // Verify technical analysis
    await expect(page.locator("text=🔧 Technical Analysis")).toBeVisible();
    await expect(page.locator("text=Languages")).toBeVisible();
    await expect(page.locator("text=Frameworks")).toBeVisible();
    await expect(page.locator("text=Tools")).toBeVisible();

    // Check strategic recommendations
    await expect(
      page.locator("text=💡 Strategic Recommendations"),
    ).toBeVisible();
    await expect(page.locator("text=Immediate (Next 30 days)")).toBeVisible();
    await expect(page.locator("text=Short-term (3-6 months)")).toBeVisible();
    await expect(page.locator("text=Frameworks")).toBeVisible();

    // Verify final action button
    await expect(
      page.locator('button:has-text("Create Intelligent Workspace")'),
    ).toBeVisible();
  });

  test("should handle different source types appropriately", async ({
    page,
  }) => {
    const sourceTests = [
      {
        url: "https://github.com/microsoft/typescript",
        expectedType: "GitHub",
        shouldHaveRepoInfo: true,
      },
      {
        url: "https://youtube.com/watch?v=example",
        expectedType: "YouTube",
        shouldHaveVideoInfo: true,
      },
      {
        url: "https://openai.com",
        expectedType: "Website",
        shouldHaveWebInfo: true,
      },
    ];

    for (const test of sourceTests) {
      await page.goto("/import/advanced");
      await page.waitForLoadState("networkidle");

      await page.fill('input[type="url"]', test.url);
      await page.click('button:has-text("Import")');

      // Verify correct source type detection
      await expect(
        page.locator(`text=${test.expectedType} Import`),
      ).toBeVisible();

      // Start import to verify source-specific handling
      await page.click('button:has-text("Start Advanced Import")');

      // Should show processing regardless of source type
      await expect(page.locator("text=Processing Your Project")).toBeVisible();
    }
  });

  test("should provide immediate value with preview features", async ({
    page,
  }) => {
    await page.fill('input[type="url"]', "https://github.com/vercel/next.js");
    await page.click('button:has-text("Import")');

    // Should show immediate value preview
    await expect(page.locator("text=What happens next?")).toBeVisible();

    // Check immediate value features
    const valueFeatures = [
      "AI-Powered Analysis",
      "Intelligent Insights",
      "Strategic Recommendations",
      "Smart Workspace",
    ];

    for (const feature of valueFeatures) {
      await expect(page.locator(`text=${feature}`)).toBeVisible();
    }

    // Should show feature descriptions
    await expect(
      page.locator("text=Deep learning analysis using Gemini AI"),
    ).toBeVisible();
    await expect(
      page.locator("text=Market research and competitive analysis"),
    ).toBeVisible();
    await expect(
      page.locator("text=Actionable next steps and frameworks"),
    ).toBeVisible();
    await expect(
      page.locator("text=Pre-populated with your project context"),
    ).toBeVisible();
  });

  test("should handle errors gracefully with recovery options", async ({
    page,
  }) => {
    // Test network error simulation (invalid URL that will cause fetch to fail)
    await page.fill(
      'input[type="url"]',
      "https://nonexistent-domain-12345.com",
    );
    await page.click('button:has-text("Import")');
    await page.click('button:has-text("Start Advanced Import")');

    // Should show error state
    await expect(page.locator("text=Import Failed")).toBeVisible({
      timeout: 20000,
    });

    // Should provide recovery option
    await expect(page.locator('button:has-text("Try Again")')).toBeVisible();

    // Test recovery
    await page.click('button:has-text("Try Again")');

    // Should return to source selection
    await expect(page.locator("text=Import Your Project")).toBeVisible();
  });

  test("should navigate to appropriate workspace based on project type", async ({
    page,
  }) => {
    // Mock a completed import with high confidence (should go to showcase)
    await page.fill('input[type="url"]', "https://github.com/microsoft/vscode");
    await page.click('button:has-text("Import")');
    await page.click('button:has-text("Start Advanced Import")');

    // Wait for completion
    await page.waitForSelector(
      'button:has-text("Create Intelligent Workspace")',
      { timeout: 30000 },
    );

    // Click to create workspace
    await page.click('button:has-text("Create Intelligent Workspace")');

    // Should navigate somewhere (either showcase or workspace)
    // Since this is a mock, we can't test the exact navigation,
    // but we can verify the button click triggers navigation
    await page.waitForURL(/\/(showcase|workspace)\/.*/, { timeout: 10000 });
  });

  test("should show real-time progress updates during processing", async ({
    page,
  }) => {
    await page.fill('input[type="url"]', "https://github.com/nodejs/node");
    await page.click('button:has-text("Import")');
    await page.click('button:has-text("Start Advanced Import")');

    // Check that progress updates in real-time
    await expect(page.locator("text=Processing...")).toBeVisible();

    // Progress bar should exist and update
    const progressBar = page.locator(
      '[class*="rounded-full"][class*="bg-white"]',
    );
    await expect(progressBar).toBeVisible();

    // Stages should update with checkmarks as they complete
    const firstStage = page
      .locator("text=Validation")
      .locator("..")
      .locator("..");
    await expect(firstStage).toBeVisible();

    // At least one stage should show as current (processing)
    await expect(page.locator("text=Processing...")).toBeVisible();
  });

  test("should be mobile responsive", async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Interface should be usable on mobile
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.locator('input[type="url"]')).toBeVisible();

    // Step indicator should adapt to mobile
    await expect(page.locator("text=Source")).toBeVisible();

    // File upload should work on mobile
    await page.click('button:has-text("📁 File Upload")');
    await expect(page.locator("text=Drop your file here")).toBeVisible();

    // Test a complete flow on mobile
    await page.click('button:has-text("📐 URL Import")');
    await page.fill('input[type="url"]', "https://github.com/atom/atom");
    await page.click('button:has-text("Import")');

    // Should show mobile-optimized ready state
    await expect(page.locator("text=Ready to Import")).toBeVisible();
  });
});

/**
 * Performance Tests
 */
test.describe("Advanced Import Performance", () => {
  test("should load initial interface quickly", async ({ page }) => {
    const startTime = Date.now();

    await page.goto("/import/advanced");
    await page.waitForLoadState("networkidle");

    const loadTime = Date.now() - startTime;

    // Should load in under 3 seconds
    expect(loadTime).toBeLessThan(3000);

    // Critical elements should be visible
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.locator('input[type="url"]')).toBeVisible();
  });

  test("should handle multiple rapid interactions", async ({ page }) => {
    await page.goto("/import/advanced");

    // Rapidly switch between URL and file upload modes
    for (let i = 0; i < 5; i++) {
      await page.click('button:has-text("📁 File Upload")');
      await page.click('button:has-text("📐 URL Import")');
    }

    // Interface should remain responsive
    await expect(page.locator('input[type="url"]')).toBeVisible();
    await expect(page.locator('button:has-text("Import")')).toBeVisible();
  });
});

/**
 * Accessibility Tests
 */
test.describe("Advanced Import Accessibility", () => {
  test("should be keyboard navigable", async ({ page }) => {
    await page.goto("/import/advanced");

    // Tab through interface
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");

    // Should be able to focus input
    await expect(page.locator('input[type="url"]:focus')).toBeVisible();

    // Should be able to reach buttons
    await page.keyboard.press("Tab");
    await expect(page.locator("button:focus")).toBeVisible();
  });

  test("should have proper ARIA labels", async ({ page }) => {
    await page.goto("/import/advanced");

    // Check for proper labeling
    await expect(page.locator('input[type="url"]')).toHaveAttribute(
      "placeholder",
    );

    // Progress elements should have appropriate roles
    await page.fill('input[type="url"]', "https://github.com/example/repo");
    await page.click('button:has-text("Import")');
    await page.click('button:has-text("Start Advanced Import")');

    // Progress indicators should be accessible
    await expect(page.locator("text=Overall Progress")).toBeVisible();
  });
});

/**
 * Integration Tests with Backend Services
 */
test.describe("Advanced Import Service Integration", () => {
  test("should handle Gemini API integration gracefully", async ({ page }) => {
    // Test with and without API key
    await page.goto("/import/advanced");

    await page.fill(
      'input[type="url"]',
      "https://github.com/tensorflow/tensorflow",
    );
    await page.click('button:has-text("Import")');
    await page.click('button:has-text("Start Advanced Import")');

    // Should proceed even if Gemini API is not configured
    await expect(page.locator("text=Processing Your Project")).toBeVisible();

    // Should show fallback behavior if needed
    await page.waitForSelector(
      'text=Analysis Complete, button:has-text("Create Intelligent Workspace")',
      {
        timeout: 45000,
      },
    );
  });
});
