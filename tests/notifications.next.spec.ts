import { test, expect } from "@playwright/test";

const usingEmulator =
  (process.env.NEXT_PUBLIC_FIREBASE_EMULATOR || "").toString() === "1";

test.describe("Notifications (emulator)", () => {
  test.skip(
    !usingEmulator,
    "Run with NEXT_PUBLIC_FIREBASE_EMULATOR=1 and emulators running",
  );

  test("placeholder (seed and assert notification list)", async ({ page }) => {
    // TODO: Implement when emulator auth + seeding is wired for CI.
    await page.goto("/mentor");
    await expect(page).toBeTruthy();
  });
});
