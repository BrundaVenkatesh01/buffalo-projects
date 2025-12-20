import { test, expect } from "@playwright/test";

const usingEmulator =
  (process.env.NEXT_PUBLIC_FIREBASE_EMULATOR || "").toString() === "1";
const slug = process.env.SEED_SLUG || "seeded-demo";

test.describe("Public project page (emulator)", () => {
  test.skip(
    !usingEmulator,
    "Run with NEXT_PUBLIC_FIREBASE_EMULATOR=1 and seeded data",
  );

  test("renders seeded public project", async ({ page }) => {
    await page.goto(`/p/${slug}`);
    // Title and some stats sections present
    await expect(
      page
        .locator("h1, h2")
        .filter({ hasText: /seeded public project/i })
        .first(),
    ).toBeVisible();
    await expect(page.getByText(/comments/i)).toBeVisible();
    await expect(page.getByText(/pivots/i)).toBeVisible();
  });
});
