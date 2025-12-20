import { test, expect } from "@playwright/test";

test.describe("Critical flows (Next.js)", () => {
  test("Create → Edit → Autosave → Publish (offline-safe)", async ({
    page,
  }) => {
    // Create a new project
    await page.goto("/workspace/new");
    await expect(
      page.getByRole("heading", { name: /create a new project/i }),
    ).toBeVisible();

    await page.getByLabel(/project name/i).fill("E2E Demo Project");
    await page
      .getByLabel(/description/i)
      .fill("An example project used to verify end-to-end flows.");

    // Optional: tag + stage
    await page.getByLabel(/project stage/i).click();
    await page.getByRole("option", { name: /building/i }).click();

    await page.getByRole("button", { name: /create project/i }).click();

    // Land in the workspace editor
    await expect(page).toHaveURL(/\/project\//);
    await expect(page.getByText(/business model canvas/i)).toBeVisible();

    // Fill core sections to pass publish checklist
    await page
      .getByRole("heading", { name: /value propositions/i })
      .scrollIntoViewIfNeeded();
    await page
      .locator("textarea")
      .first()
      .fill(
        "Clear, outcome-focused value proposition exceeding 20+ characters.",
      );

    // Find specific canvas fields by headings context and fill
    // Customer segments
    const custSegTextarea = page
      .getByRole("heading", { name: /customer segments/i })
      .locator("..")
      .locator("..")
      .locator("textarea");
    await custSegTextarea.scrollIntoViewIfNeeded();
    await custSegTextarea.fill(
      "Early adopters at universities and local startups with clear pains.",
    );

    // Channels
    const channelsTextarea = page
      .getByRole("heading", { name: /channels/i })
      .locator("..")
      .locator("..")
      .locator("textarea");
    await channelsTextarea.scrollIntoViewIfNeeded();
    await channelsTextarea.fill(
      "Mentor intros, founder communities, and campus events.",
    );

    // Navigate to Share tab
    await page.getByRole("button", { name: /^share$/i }).click();
    await expect(
      page
        .getByText(/publish checklist/i)
        .or(page.getByText(/publish project/i)),
    ).toBeVisible();

    // Publish (offline path still updates local state)
    const publishButton = page.getByRole("button", {
      name: /publish project/i,
    });
    await expect(publishButton).toBeEnabled();
    await publishButton.click();

    // Confirm share links and public URL appear
    await expect(page.getByText(/share links/i)).toBeVisible();
    const publicUrlInput = page
      .getByLabel(/public url/i)
      .or(page.getByRole("textbox", { name: /public url/i }));
    await expect(publicUrlInput).toBeVisible();
    const publicUrl = await publicUrlInput.inputValue();
    expect(publicUrl).toMatch(/\/p\//);
  });

  test("Discovery flow: browse and filter public projects UI", async ({
    page,
  }) => {
    await page.goto("/"); // redirects to /gallery
    await expect(page).toHaveURL(/\/gallery/);
    await expect(
      page.getByRole("heading", { name: /track buffalo/i }),
    ).toBeVisible();

    // Interact with filters (UI-only validation)
    const sortTrigger = page.getByLabel(/sort projects/i);
    if (await sortTrigger.isVisible()) {
      await sortTrigger.click();
      await page.getByRole("option", { name: /recently updated/i }).click();
    }

    // Toggle a stage filter if present
    const stageButton = page
      .getByRole("button", { name: /idea/i })
      .or(page.getByRole("button", { name: /building/i }));
    if (await stageButton.isVisible()) {
      await stageButton.click();
    }

    // Search box exists
    const search = page
      .getByPlaceholder(/search projects/i)
      .or(page.getByRole("textbox", { name: /search/i }));
    await expect(search).toBeVisible();
  });

  test("Mentor flow UI (unlocked via localStorage seed)", async ({ page }) => {
    // Seed Zustand auth persistence before navigation
    await page.addInitScript(() => {
      const state = {
        state: {
          user: {
            uid: "mentor-e2e",
            email: "mentor@example.com",
            displayName: "E2E Mentor",
            photoURL: null,
            emailVerified: true,
            isMentor: true,
            notificationsEnabled: true,
          },
        },
        version: 0,
      };
      localStorage.setItem("auth-storage", JSON.stringify(state));
    });

    await page.goto("/mentor");
    await expect(
      page.getByRole("heading", { name: /help buffalo builders ship faster/i }),
    ).toBeVisible();

    // Filters panel present
    await page.getByRole("button", { name: /filters/i }).click();
    await expect(page.getByText(/tags/i)).toBeVisible();
  });
});
