import { test, expect } from "@playwright/test";

const usingEmulator =
  (process.env.NEXT_PUBLIC_FIREBASE_EMULATOR || "").toString() === "1";

test.describe("Notifications flow (emulator)", () => {
  test.skip(
    !usingEmulator,
    "Run with NEXT_PUBLIC_FIREBASE_EMULATOR=1 and emulators running",
  );

  test("Owner publishes; commenter leaves feedback; owner sees notification", async ({
    browser,
  }) => {
    const rand = Math.random().toString(36).slice(2, 8);
    const ownerEmail = `owner_${rand}@e2e.local`;
    const commenterEmail = `commenter_${rand}@e2e.local`;
    const password = "e2ePass1!";

    // OWNER CONTEXT: sign up, create project, publish, capture slug
    const ownerCtx = await browser.newContext();
    const owner = await ownerCtx.newPage();
    await owner.goto("/join");
    await owner.getByLabel(/first name/i).fill("Owner");
    await owner.getByLabel(/last name/i).fill("User");
    await owner.getByLabel(/email/i).fill(ownerEmail);
    await owner.getByLabel(/^password$/i).fill(password);
    await owner.getByLabel(/confirm password/i).fill(password);
    await owner.getByRole("button", { name: /create account/i }).click();
    await expect(owner).toHaveURL(/\/workspace(\/|$)/, { timeout: 20_000 });

    // Create new project
    await owner.goto("/workspace/new");
    await owner.getByLabel(/project name/i).fill(`Notif E2E ${rand}`);
    await owner
      .getByLabel(/description/i)
      .fill("Project for notifications e2e");
    await owner.getByLabel(/project stage/i).click();
    await owner
      .getByRole("option", { name: /idea|building/i })
      .first()
      .click();
    await owner.getByRole("button", { name: /create project/i }).click();
    await expect(owner).toHaveURL(/\/project\//);

    // Fill publish checklist fields (value prop, customer segments, channels)
    const vp = owner
      .getByRole("heading", { name: /value propositions/i })
      .locator("..")
      .locator("..")
      .locator("textarea");
    await vp.fill("Strong value proposition over 20 characters long.");
    const cs = owner
      .getByRole("heading", { name: /customer segments/i })
      .locator("..")
      .locator("..")
      .locator("textarea");
    await cs.fill(
      "Meaningful customer segment description exceeding 20 chars.",
    );
    const ch = owner
      .getByRole("heading", { name: /channels/i })
      .locator("..")
      .locator("..")
      .locator("textarea");
    await ch.fill("Early adopter outreach via campus and mentors.");

    // Publish
    await owner.getByRole("button", { name: /^share$/i }).click();
    const publish = owner.getByRole("button", { name: /publish project/i });
    await expect(publish).toBeEnabled();
    await publish.click();
    const publicUrlInput = owner
      .getByLabel(/public url/i)
      .or(owner.getByRole("textbox", { name: /public url/i }));
    await expect(publicUrlInput).toBeVisible();
    const publicUrl = await publicUrlInput.inputValue();
    const slugMatch = publicUrl.match(/\/p\/([^/]+)/);
    expect(slugMatch).toBeTruthy();
    const slug = slugMatch?.[1]!;

    // COMMENTER CONTEXT: sign up and leave comment on public page
    const commenterCtx = await browser.newContext();
    const commenter = await commenterCtx.newPage();
    await commenter.goto("/join");
    await commenter.getByLabel(/first name/i).fill("Commenter");
    await commenter.getByLabel(/last name/i).fill("User");
    await commenter.getByLabel(/email/i).fill(commenterEmail);
    await commenter.getByLabel(/^password$/i).fill(password);
    await commenter.getByLabel(/confirm password/i).fill(password);
    await commenter.getByRole("button", { name: /create account/i }).click();
    await expect(commenter).toHaveURL(/\/workspace(\/|$)/, { timeout: 20_000 });

    // Navigate to public page and post a comment
    await commenter.goto(`/p/${slug}`);
    // Wait for comment input to load
    const textArea = commenter
      .locator("textarea", { hasText: undefined })
      .first();
    await textArea.waitFor({ state: "visible" });
    await textArea.fill("Great progress! Excited to see more.");
    await commenter.getByRole("button", { name: /^post$/i }).click();

    // OWNER checks notifications and navigates via item
    await owner.reload();
    // Open notifications dropdown
    const bell = owner.getByRole("button", { name: /open notifications/i });
    await bell.click();
    // Should have at least one unread
    const menu = owner.getByText(/notifications/i);
    await expect(menu).toBeVisible();
    const items = owner
      .locator('[role="menuitem"]')
      .or(owner.locator("[data-radix-collection-item]"));
    await expect(items).toContainText(/left feedback|mentioned you/i, {
      timeout: 10_000,
    });
    await items.first().click();
    await expect(owner).toHaveURL(/\/p\//, { timeout: 10_000 });
  });
});
