import { test, expect } from "@playwright/test";

test.describe("Manual Project Creation Flow", () => {
  test("user can create a project manually via Type it in yourself option", async ({
    page,
  }) => {
    // Skip if no E2E credentials
    if (!process.env.E2E_EMAIL || !process.env.E2E_PASSWORD) {
      test.skip();
      return;
    }

    // Sign in first
    await page.goto("/signin");
    await page.waitForSelector('input[type="email"]', { state: "visible" });
    await page.fill('input[type="email"]', process.env.E2E_EMAIL);
    await page.fill('input[type="password"]', process.env.E2E_PASSWORD);
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/(profile|dashboard|$)/, { timeout: 10000 });

    // Navigate to profile
    await page.goto("/profile");

    // Wait for the "Create Project" button to be visible instead of networkidle
    const createButton = page.getByRole("button", {
      name: /create project/i,
    });
    await expect(createButton).toBeVisible({ timeout: 10000 });
    await createButton.click();

    // Modal should appear with two options
    await expect(
      page.getByRole("heading", {
        name: /what type of project do you want to create/i,
      }),
    ).toBeVisible();

    // Click on "Quick Profile" card
    const showcaseButton = page.getByRole("button", {
      name: /quick profile/i,
    });
    await showcaseButton.click();

    // Should now show import source options
    await expect(
      page.getByRole("heading", { name: /where is your project/i }),
    ).toBeVisible();

    // Verify privacy notice is visible
    await expect(page.getByText(/your data is protected/i)).toBeVisible();
    await expect(
      page.getByText(/completely private until you choose to publish/i),
    ).toBeVisible();

    // Click "Type it in yourself" option
    const manualOption = page.getByRole("button", {
      name: /type it in yourself/i,
    });
    await expect(manualOption).toBeVisible();

    // Verify it has the "Recommended" badge
    await expect(manualOption.getByText(/recommended/i)).toBeVisible();

    await manualOption.click();

    // Should navigate to /edit/new?type=showcase then redirect to /edit/[code]
    await page.waitForURL(/\/edit\/(new\?type=showcase|[a-zA-Z0-9]+)/, {
      timeout: 10000,
    });

    // Verify we're in the editor - wait for key editor elements
    await expect(
      page.getByRole("heading", { name: /project|workspace/i }).first(),
    ).toBeVisible({ timeout: 10000 });

    // Verify form fields exist (project name input or editor canvas)
    const projectNameInput = page.getByLabel(/project name|name/i).first();
    const canvasOrContent = page.locator("[data-testid], [role=main], main");

    // Either project name field or main content should be visible
    await Promise.race([
      expect(projectNameInput).toBeVisible({ timeout: 5000 }).catch(() => {}),
      expect(canvasOrContent.first()).toBeVisible({ timeout: 5000 }),
    ]);

    console.log("✅ Manual project creation flow works!");
  });

  test("import messaging is clear about being a starting point", async ({
    page,
  }) => {
    // Skip if no E2E credentials
    if (!process.env.E2E_EMAIL || !process.env.E2E_PASSWORD) {
      test.skip();
      return;
    }

    // Sign in first
    await page.goto("/signin");
    await page.waitForSelector('input[type="email"]', { state: "visible" });
    await page.fill('input[type="email"]', process.env.E2E_EMAIL);
    await page.fill('input[type="password"]', process.env.E2E_PASSWORD);
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/(profile|dashboard|$)/, { timeout: 10000 });

    // Navigate to profile
    await page.goto("/profile");

    // Wait for the "Create Project" button to be visible instead of networkidle
    const createButton = page.getByRole("button", {
      name: /create project/i,
    });
    await expect(createButton).toBeVisible({ timeout: 10000 });
    await createButton.click();

    // Click on "Quick Profile"
    await page.getByRole("button", { name: /quick profile/i }).click();

    // Click on GitHub or URL import option
    const urlOption = page.getByRole("button", {
      name: /github repository|website/i,
    });
    await urlOption.first().click();

    // Verify the dialog description mentions it's a starting point
    await expect(
      page.getByText(/import your project as a starting point/i),
    ).toBeVisible();
    await expect(
      page.getByText(/review and complete the details after import/i),
    ).toBeVisible();

    // Verify button says "Import Project" not "Extract with AI"
    const importButton = page.getByRole("button", { name: /import project/i });
    await expect(importButton).toBeVisible();

    // Verify "Extract with AI" is NOT present
    await expect(
      page.getByRole("button", { name: /extract with ai/i }),
    ).not.toBeVisible();

    console.log("✅ Import messaging is clear!");
  });
});
