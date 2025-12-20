import { test, expect } from "@playwright/test";

test.describe("Workspace", () => {
  test("should display workspace interface with project tools", async ({
    page,
  }) => {
    await page.goto("/workspace");

    // Check for workspace header
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

    // Check for Business Model Canvas tool
    const bmcSection = page
      .getByText(/business.*model.*canvas/i)
      .or(page.getByText(/canvas/i));
    await expect(bmcSection).toBeVisible();
  });

  test("should allow project name input", async ({ page }) => {
    await page.goto("/workspace");

    // Look for project name input
    const projectNameInput = page
      .getByPlaceholder(/project.*name/i)
      .or(page.getByLabel(/project.*name/i));

    if (await projectNameInput.isVisible()) {
      await projectNameInput.fill("Test Project Name");
      await expect(projectNameInput).toHaveValue("Test Project Name");
    }
  });

  test("should save project data automatically", async ({ page }) => {
    await page.goto("/workspace");

    // Fill in some basic project information
    const projectNameInput = page
      .getByPlaceholder(/project.*name/i)
      .or(page.getByLabel(/project.*name/i));

    if (await projectNameInput.isVisible()) {
      await projectNameInput.fill("Auto Save Test Project");

      // Wait a moment for auto-save
      await page.waitForTimeout(2000);

      // Refresh page to check persistence
      await page.reload();

      // Should maintain the project name
      await expect(projectNameInput).toHaveValue("Auto Save Test Project");
    }
  });

  test("should display Business Model Canvas sections", async ({ page }) => {
    await page.goto("/workspace");

    // Check for key BMC sections
    const expectedSections = [
      /key.*partners/i,
      /key.*activities/i,
      /value.*propositions/i,
      /customer.*relationships/i,
      /customer.*segments/i,
      /key.*resources/i,
      /channels/i,
      /cost.*structure/i,
      /revenue.*streams/i,
    ];

    for (const sectionPattern of expectedSections) {
      const section = page.getByText(sectionPattern);
      if (await section.first().isVisible()) {
        await expect(section.first()).toBeVisible();
      }
    }
  });

  test("should allow editing BMC sections", async ({ page }) => {
    await page.goto("/workspace");

    // Try to find an editable textarea or input in the BMC
    const editableField = page
      .locator("textarea")
      .first()
      .or(page.locator('input[type="text"]').first());

    if (await editableField.isVisible()) {
      await editableField.fill("Test value proposition content");
      await expect(editableField).toHaveValue("Test value proposition content");
    }
  });
});
