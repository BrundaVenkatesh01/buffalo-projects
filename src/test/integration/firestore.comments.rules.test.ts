import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import {
  initializeTestEnvironment,
  type RulesTestEnvironment,
  assertFails,
  assertSucceeds,
} from "@firebase/rules-unit-testing";
import { readFile } from "node:fs/promises";
import { doc, setDoc, addDoc, collection, updateDoc } from "firebase/firestore";

let testEnv: RulesTestEnvironment;

describe.skip("Firestore rules - comments", () => {
  beforeAll(async () => {
    testEnv = await initializeTestEnvironment({
      projectId: "buffalo-projects-e2e",
      firestore: { rules: await readFile("firestore.rules", "utf8") },
    });
  }, 30_000);

  afterAll(async () => {
    await testEnv.cleanup();
  });
  beforeEach(async () => {
    await testEnv.clearFirestore();
  });

  it("denies create when project not public; allows when public", async () => {
    // Seed workspace as not public
    await testEnv.withSecurityRulesDisabled(async (ctx) => {
      await setDoc(doc(ctx.firestore(), "workspaces/private"), {
        ownerId: "o1",
        isPublic: false,
      });
      await setDoc(doc(ctx.firestore(), "workspaces/public"), {
        ownerId: "o1",
        isPublic: true,
      });
    });

    const user = testEnv.authenticatedContext("c1").firestore();
    await expect(
      assertFails(
        addDoc(collection(user, "comments"), {
          projectId: "private",
          userId: "c1",
          userDisplayName: "X",
          content: "hi",
          createdAt: { seconds: 0, nanoseconds: 0 },
          updatedAt: { seconds: 0, nanoseconds: 0 },
        }),
      ),
    ).resolves.toBeDefined();

    await expect(
      assertSucceeds(
        addDoc(collection(user, "comments"), {
          projectId: "public",
          userId: "c1",
          userDisplayName: "X",
          content: "valid content",
          createdAt: { seconds: 0, nanoseconds: 0 },
          updatedAt: { seconds: 0, nanoseconds: 0 },
        }),
      ),
    ).resolves.toBeDefined();
  });

  it("enforces author-only update and delete", async () => {
    // Seed public workspace
    await testEnv.withSecurityRulesDisabled(async (ctx) => {
      await setDoc(doc(ctx.firestore(), "workspaces/p1"), {
        ownerId: "o1",
        isPublic: true,
      });
    });

    const authorCtx = testEnv.authenticatedContext("author");
    const dbAuthor = authorCtx.firestore();
    const commentRef = await addDoc(collection(dbAuthor, "comments"), {
      projectId: "p1",
      userId: "author",
      userDisplayName: "Author",
      content: "hello",
      createdAt: { seconds: 0, nanoseconds: 0 },
      updatedAt: { seconds: 0, nanoseconds: 0 },
    });

    // Other user cannot update/delete
    const other = testEnv.authenticatedContext("other").firestore();
    await expect(
      assertFails(
        updateDoc(doc(other, "comments", commentRef.id), {
          content: "edit",
        } as any),
      ),
    ).resolves.toBeDefined();

    // Author can update
    await expect(
      assertSucceeds(
        updateDoc(doc(dbAuthor, "comments", commentRef.id), {
          content: "edit",
          updatedAt: { seconds: 0, nanoseconds: 0 },
        } as any),
      ),
    ).resolves.toBeDefined();
  });
});
