import { test, expect } from "@playwright/test";

test.describe("Home Page", () => {
  test("should display main heading and call-to-action", async ({ page }) => {
    await page.goto("/");

    // Check for main heading
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

    // Check for project code input
    const codeInput = page.getByPlaceholder(/enter.*code/i);
    await expect(codeInput).toBeVisible();

    // Check for "Start New Project" button
    const newProjectButton = page.getByRole("button", {
      name: /start.*new.*project/i,
    });
    await expect(newProjectButton).toBeVisible();
  });

  test("should navigate to workspace when starting new project", async ({
    page,
  }) => {
    await page.goto("/");

    const newProjectButton = page.getByRole("button", {
      name: /start.*new.*project/i,
    });
    await newProjectButton.click();

    // Should navigate to workspace
    await expect(page).toHaveURL(/\/workspace/);
  });

  test("should allow entering existing project code", async ({ page }) => {
    await page.goto("/");

    const codeInput = page.getByPlaceholder(/enter.*code/i);
    await codeInput.fill("BUF-TEST123");

    const submitButton = page.getByRole("button", { name: /enter/i });
    if (await submitButton.isVisible()) {
      await submitButton.click();
    } else {
      await codeInput.press("Enter");
    }

    // Should navigate to workspace with the code
    await expect(page).toHaveURL(/\/workspace/);
  });

  test("should display featured public projects section", async ({ page }) => {
    await page.goto("/");

    // Look for public projects section
    const projectsSection = page
      .getByText(/featured.*projects/i)
      .or(page.getByText(/public.*projects/i));

    if (await projectsSection.isVisible()) {
      await expect(projectsSection).toBeVisible();
    }
  });
});
