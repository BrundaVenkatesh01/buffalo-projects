import { test, expect } from "@playwright/test";

const usingEmulator =
  (process.env.NEXT_PUBLIC_FIREBASE_EMULATOR || "").toString() === "1";
const slug = process.env.SEED_SLUG || "seeded-demo";

test.describe("Discovery with emulator", () => {
  test.skip(
    !usingEmulator,
    "Run with NEXT_PUBLIC_FIREBASE_EMULATOR=1 and seeded data",
  );

  test("Click seeded project card navigates to public page", async ({
    page,
  }) => {
    await page.goto("/projects");

    // Find a link pointing to the seeded slug and click it
    const link = page.locator(`a[href$="/p/${slug}"]`).first();
    await expect(link).toBeVisible({ timeout: 15000 });
    await link.click();

    await expect(page).toHaveURL(new RegExp(`/p/${slug}$`));
    // Basic body check
    await expect(page.locator("h1, h2").first()).toBeVisible();
  });
});
