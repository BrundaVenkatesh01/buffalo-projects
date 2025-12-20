import { test, expect } from "@playwright/test";
import { injectAxe, checkA11y } from "axe-playwright";

test.describe("Accessibility (Next routes)", () => {
  test("Gallery page has no critical violations", async ({ page }) => {
    await page.goto("/gallery");
    await injectAxe(page);
    await checkA11y(page, undefined, {
      axeOptions: { runOnly: ["wcag2a", "wcag2aa"] },
      detailedReport: true,
      detailedReportOptions: { html: true },
    });
    await expect(page.getByRole("heading")).toBeVisible();
  });

  test("Workspace new project page is accessible", async ({ page }) => {
    await page.goto("/workspace/new");
    await injectAxe(page);
    await checkA11y(page, undefined, {
      axeOptions: { runOnly: ["wcag2a", "wcag2aa"] },
      detailedReport: true,
      detailedReportOptions: { html: true },
    });
    await expect(
      page.getByRole("heading", { name: /create a new project/i }),
    ).toBeVisible();
  });

  test("Mentor page (seeded auth) is accessible", async ({ page }) => {
    await page.addInitScript(() => {
      const state = {
        state: {
          user: {
            uid: "mentor-a11y",
            email: "mentor@example.com",
            displayName: "Mentor",
            emailVerified: true,
            isMentor: true,
          },
        },
        version: 0,
      };
      localStorage.setItem("auth-storage", JSON.stringify(state));
    });
    await page.goto("/mentor");
    await injectAxe(page);
    await checkA11y(page, undefined, {
      axeOptions: { runOnly: ["wcag2a", "wcag2aa"] },
      detailedReport: true,
      detailedReportOptions: { html: true },
    });
    await expect(
      page.getByRole("heading", { name: /help buffalo builders/i }),
    ).toBeVisible();
  });
});
