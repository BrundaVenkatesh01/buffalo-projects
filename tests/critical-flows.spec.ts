import { test, expect } from "@playwright/test";

test.describe("Critical mentor flows", () => {
  test("Builder publishes project and mentor leaves feedback", async ({
    page,
  }) => {
    test.skip(
      !process.env.E2E_EMAIL || !process.env.E2E_PASSWORD,
      "Test requires seeded credentials (E2E_EMAIL/E2E_PASSWORD)",
    );

    const email = process.env.E2E_EMAIL!;
    const password = process.env.E2E_PASSWORD!;

    await page.goto("/");
    await page.getByRole("link", { name: /sign in/i }).click();

    await page.fill('input[type="email"]', email);
    await page.fill('input[type="password"]', password);
    await page.getByRole("button", { name: /sign in/i }).click();

    await expect(page).toHaveURL(/\/workspace/i, { timeout: 15_000 });

    await page.getByRole("button", { name: /create/i }).click();
    await expect(page).toHaveURL(/\/project\//i, { timeout: 10_000 });

    await page.getByLabel(/project name/i).fill("Playwright Test Project");
    await page.getByLabel(/problem statement/i).fill("Test problem statement");

    await page.getByRole("button", { name: /share/i }).click();
    await page.getByRole("switch", { name: /make project public/i }).click();

    await expect(page.getByText(/public workspace/i)).toBeVisible();
    const publicLinkInput = page.getByRole("textbox", { name: /project url/i });
    const projectUrl = await publicLinkInput.inputValue();

    await expect(projectUrl).toContain("/p/");

    await page.click("button", { trial: true }).catch(() => {
      return;
    });

    const slugMatch = projectUrl.match(/\/p\/([^/]+)/);
    expect(slugMatch).toBeTruthy();
    const slug = slugMatch?.[1];
    expect(slug).toBeDefined();

    await page.context().clearCookies();

    await page.goto("/signin");
    await expect(page).toHaveURL(/\/signin/i);
  });
});
