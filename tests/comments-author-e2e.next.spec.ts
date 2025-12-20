import { test, expect } from "@playwright/test";

const usingEmulator =
  (process.env.NEXT_PUBLIC_FIREBASE_EMULATOR || "").toString() === "1";
const slug = process.env.SEED_SLUG || "seeded-demo";

test.describe("Author comment edit/delete on public page (emulator)", () => {
  test.skip(
    !usingEmulator,
    "Run with NEXT_PUBLIC_FIREBASE_EMULATOR=1 and seeded data",
  );

  test("post then edit and delete own comment", async ({ page }) => {
    const rand = Math.random().toString(36).slice(2, 7);
    const email = `author_${rand}@e2e.local`;
    const password = "e2ePass1!";

    // Sign up
    await page.goto("/signup");
    await page.getByLabel(/first name/i).fill("Author");
    await page.getByLabel(/last name/i).fill("User");
    await page.getByLabel(/email/i).fill(email);
    await page.getByLabel(/^password$/i).fill(password);
    await page.getByLabel(/confirm password/i).fill(password);
    await page.getByRole("button", { name: /create account/i }).click();
    await expect(page).toHaveURL(/\/workspace(\/|$)/, { timeout: 20_000 });

    // Go to public page
    await page.goto(`/p/${slug}`);

    // Post a comment
    const initialText = `First comment ${rand}`;
    const textArea = page.locator("textarea").first();
    await textArea.waitFor({ state: "visible" });
    await textArea.fill(initialText);
    await page.getByRole("button", { name: /^post$/i }).click();
    await expect(page.getByText(initialText)).toBeVisible({ timeout: 10_000 });

    // Open actions, click Edit
    await page
      .getByRole("button", { name: /open comment actions/i })
      .first()
      .click();
    await page.getByRole("menuitem").filter({ hasText: /edit/i }).click();

    // Edit and save
    const updated = `Edited comment ${rand}`;
    const editBox = page.locator("textarea").first();
    await editBox.fill(updated);
    await page.getByRole("button", { name: /save changes/i }).click();
    await expect(page.getByText(updated)).toBeVisible({ timeout: 10_000 });

    // Delete
    await page
      .getByRole("button", { name: /open comment actions/i })
      .first()
      .click();
    await page
      .getByRole("menuitem")
      .filter({ hasText: /delete/i })
      .click();
    // Confirm in toast
    const deleteButton = page.getByRole("button", { name: /^delete$/i }).last();
    await deleteButton.click();

    // Ensure removed
    await expect(page.getByText(updated)).not.toBeVisible({ timeout: 10_000 });
  });
});
