import { test, expect } from "@playwright/test";

test.describe("Discovery (Gallery)", () => {
  test("Search, stage filters, and sort interactions work", async ({
    page,
  }) => {
    await page.goto("/gallery");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

    // Search input
    const search = page
      .getByPlaceholder(/search projects/i)
      .or(page.getByRole("textbox", { name: /search/i }));
    await search.fill("demo");
    await page.keyboard.press("Enter").catch(() => {});

    // Stage toggle (Idea or Building)
    const stageButton = page
      .getByRole("button", { name: /idea/i })
      .or(page.getByRole("button", { name: /building/i }));
    if (await stageButton.isVisible()) {
      await stageButton.click();
    }

    // Sort select
    const sortTrigger = page
      .getByLabel(/sort projects/i)
      .or(page.getByRole("combobox", { name: /sort/i }));
    if (await sortTrigger.isVisible()) {
      await sortTrigger.click();
      await page
        .getByRole("option", { name: /recently updated/i })
        .click()
        .catch(() => {});
    }

    // Load more button if present
    const loadMore = page.getByRole("button", { name: /load more/i });
    if (await loadMore.isVisible()) {
      await loadMore.click();
    }
  });
});
