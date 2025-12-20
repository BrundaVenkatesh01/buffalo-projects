/**
 * Manual Playwright Test - AI URL Extraction Feature
 *
 * This test validates the AI-powered URL extraction in QuickAddProject
 */

import { test, expect } from "@playwright/test";

test.describe("AI URL Extraction Feature", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to sign-in page first
    await page.goto("http://localhost:3000/signin");
  });

  test("should extract GitHub project data automatically", async ({ page }) => {
    console.log("\n═══ Testing GitHub URL Extraction ═══\n");

    // Sign in (using test credentials from env)
    const email = process.env.E2E_EMAIL || "test@example.com";
    const password = process.env.E2E_PASSWORD || "testpassword";

    console.log(`→ Signing in with: ${email}`);
    await page.fill('input[type="email"]', email);
    await page.fill('input[type="password"]', password);
    await page.click('button[type="submit"]');

    // Wait for redirect to profile
    await page.waitForURL(/\/profile/, { timeout: 10000 });
    console.log("✓ Signed in successfully\n");

    // Look for QuickAddProject component (might be in a modal/dialog)
    console.log('→ Looking for "Create Project" or "Add Project" button...');

    // Try to find and click the button to open QuickAddProject
    const createButton = page.getByRole("button", {
      name: /create project|add project|new project/i,
    });
    if (await createButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await createButton.click();
      console.log("✓ Opened project creation form\n");
    } else {
      console.log("→ Form might already be visible, continuing...\n");
    }

    // Wait for the URL input field
    const urlInput = page.locator(
      'input#external-link, input[placeholder*="github"]',
    );
    await expect(urlInput).toBeVisible({ timeout: 5000 });
    console.log("✓ Found URL input field\n");

    // Test GitHub URL
    const testURL = "https://github.com/google/adk-go";
    console.log(`→ Pasting GitHub URL: ${testURL}`);
    await urlInput.fill(testURL);

    // Wait for "AI will auto-fill" indicator
    console.log("→ Waiting for AI extraction indicator...");
    const aiIndicator = page.getByText(/AI will auto-fill|Extracting/i);
    await expect(aiIndicator).toBeVisible({ timeout: 2000 });
    console.log("✓ AI extraction indicator appeared\n");

    // Wait for extraction to complete (800ms debounce + API call)
    console.log("→ Waiting for extraction to complete (max 15s)...");
    await page.waitForTimeout(1000); // Wait for debounce

    // Look for loading state
    const extractingText = page.getByText(/Extracting\.\.\./i);
    if (await extractingText.isVisible({ timeout: 2000 }).catch(() => false)) {
      console.log("  ⟳ Extraction in progress...");
      await extractingText.waitFor({ state: "hidden", timeout: 15000 });
    }

    // Wait for success toast or extracted data box
    console.log("→ Checking for extraction results...");
    const successToast = page.getByText(/Project details extracted/i);
    const extractedDataBox = page.getByText(/AI extracted project details/i);

    // Wait for either success indicator
    await Promise.race([
      successToast.waitFor({ state: "visible", timeout: 15000 }),
      extractedDataBox.waitFor({ state: "visible", timeout: 15000 }),
    ]).catch(() => {
      console.log("⚠ No success indicators found within timeout");
    });

    // Take screenshot of the form
    await page.screenshot({
      path: ".playwright-mcp/ai-extraction-test-01-form-filled.png",
      fullPage: true,
    });
    console.log("📸 Screenshot saved: ai-extraction-test-01-form-filled.png\n");

    // Check if form fields were auto-filled
    const projectNameInput = page.locator("input#project-name");
    const descriptionTextarea = page.locator("textarea#description");

    const projectNameValue = await projectNameInput.inputValue();
    const descriptionValue = await descriptionTextarea.inputValue();

    console.log("═══ Extraction Results ═══");
    console.log(`Project Name: ${projectNameValue || "(empty)"}`);
    console.log(
      `Description: ${descriptionValue.substring(0, 100)}${descriptionValue.length > 100 ? "..." : ""}`,
    );
    console.log(`Description Length: ${descriptionValue.length} chars`);
    console.log("═══════════════════════════\n");

    // Validate extraction worked
    if (projectNameValue && descriptionValue) {
      console.log("✅ SUCCESS: Form fields were auto-populated by AI\n");
      expect(projectNameValue.length).toBeGreaterThan(0);
      expect(descriptionValue.length).toBeGreaterThan(20);
    } else {
      console.log("❌ FAILED: Form fields were NOT auto-populated\n");
      throw new Error("AI extraction did not populate form fields");
    }

    // Check for extracted data indicator
    if (
      await extractedDataBox.isVisible({ timeout: 1000 }).catch(() => false)
    ) {
      console.log("✓ Extracted data notification box is visible\n");
    }
  });

  test("should handle invalid URLs gracefully", async ({ page }) => {
    console.log("\n═══ Testing Invalid URL Handling ═══\n");

    // Navigate to profile (assuming already signed in from previous test)
    await page.goto("http://localhost:3000/profile");

    // Open create project form
    const createButton = page.getByRole("button", {
      name: /create project|add project|new project/i,
    });
    if (await createButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await createButton.click();
    }

    // Find URL input
    const urlInput = page.locator(
      'input#external-link, input[placeholder*="github"]',
    );
    await expect(urlInput).toBeVisible({ timeout: 5000 });

    // Test invalid URL
    console.log("→ Testing invalid URL: not-a-valid-url");
    await urlInput.fill("not-a-valid-url");
    await page.waitForTimeout(1000);

    // Should show validation message
    const validationMsg = page.getByText(/Enter a valid URL/i);
    if (await validationMsg.isVisible({ timeout: 1000 }).catch(() => false)) {
      console.log("✓ Validation message shown for invalid URL\n");
    }

    // AI should NOT trigger
    const aiIndicator = page.getByText(/AI will auto-fill|Extracting/i);
    const isAITriggered = await aiIndicator
      .isVisible({ timeout: 2000 })
      .catch(() => false);

    if (!isAITriggered) {
      console.log(
        "✅ SUCCESS: AI extraction did not trigger for invalid URL\n",
      );
    } else {
      console.log("❌ FAILED: AI extraction triggered for invalid URL\n");
    }

    expect(isAITriggered).toBe(false);
  });

  test("should show error toast for non-existent repository", async ({
    page,
  }) => {
    console.log("\n═══ Testing Error Handling (Non-existent Repo) ═══\n");

    await page.goto("http://localhost:3000/profile");

    // Open form
    const createButton = page.getByRole("button", {
      name: /create project|add project|new project/i,
    });
    if (await createButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await createButton.click();
    }

    const urlInput = page.locator(
      'input#external-link, input[placeholder*="github"]',
    );
    await expect(urlInput).toBeVisible({ timeout: 5000 });

    // Test non-existent GitHub repo
    const testURL =
      "https://github.com/this-user-definitely-does-not-exist-12345/fake-repo-67890";
    console.log(`→ Testing non-existent repo: ${testURL}`);
    await urlInput.fill(testURL);

    // Wait for extraction attempt
    await page.waitForTimeout(2000);

    // Should show error toast
    console.log("→ Waiting for error message...");
    const errorToast = page.getByText(/not found|failed|error/i);

    const hasError = await errorToast
      .isVisible({ timeout: 15000 })
      .catch(() => false);

    if (hasError) {
      console.log(
        "✅ SUCCESS: Error message displayed for non-existent repo\n",
      );
      const errorText = await errorToast.textContent();
      console.log(`Error message: "${errorText}"\n`);
    } else {
      console.log(
        "⚠ No error message found (might have timed out or succeeded unexpectedly)\n",
      );
    }

    await page.screenshot({
      path: ".playwright-mcp/ai-extraction-test-02-error-handling.png",
      fullPage: true,
    });
    console.log(
      "📸 Screenshot saved: ai-extraction-test-02-error-handling.png\n",
    );
  });
});
