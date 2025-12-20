import { test, expect } from "@playwright/test";

const usingEmulator =
  (process.env.NEXT_PUBLIC_FIREBASE_EMULATOR || "").toString() === "1";

test.describe("Profile mentor toggle (emulator)", () => {
  test.skip(!usingEmulator, "Run with NEXT_PUBLIC_FIREBASE_EMULATOR=1");

  test("User signs up, toggles mentor mode, and opens mentor page", async ({
    page,
  }) => {
    const rand = Math.random().toString(36).slice(2, 8);
    const email = `mentor_${rand}@e2e.local`;
    const password = "e2ePass1!";

    await page.goto("/join");
    await page.getByLabel(/first name/i).fill("Mentor");
    await page.getByLabel(/last name/i).fill("Tester");
    await page.getByLabel(/email/i).fill(email);
    await page.getByLabel(/^password$/i).fill(password);
    await page.getByLabel(/confirm password/i).fill(password);
    await page.getByRole("button", { name: /create account/i }).click();
    await expect(page).toHaveURL(/\/workspace(\/|$)/, { timeout: 20_000 });

    await page.goto("/profile");
    const mentorSwitch = page
      .getByLabel(/mentor mode access/i)
      .or(page.getByRole("switch", { name: /mentor/i }));
    await mentorSwitch.click();

    await page.goto("/mentor");
    await expect(
      page.getByRole("heading", { name: /help buffalo builders/i }),
    ).toBeVisible();
  });
});
