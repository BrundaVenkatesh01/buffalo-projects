import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import {
  initializeTestEnvironment,
  type RulesTestEnvironment,
  assertFails,
  assertSucceeds,
} from "@firebase/rules-unit-testing";
import { readFile } from "node:fs/promises";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  where,
  updateDoc,
} from "firebase/firestore";

let testEnv: RulesTestEnvironment;

describe.skip("Firestore rules - notifications", () => {
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

  it("only actor can create; user can read own; update is mark read only", async () => {
    const actorDb = testEnv.authenticatedContext("actor").firestore();
    const targetId = "target";

    // Actor creates notification for target
    await expect(
      assertSucceeds(
        addDoc(collection(actorDb, "notifications"), {
          userId: targetId,
          projectId: "p1",
          type: "comment",
          actorId: "actor",
          actorName: "Actor",
          message: "left feedback",
          read: false,
          createdAt: { seconds: 0, nanoseconds: 0 },
        }),
      ),
    ).resolves.toBeDefined();

    // Another user cannot create on behalf of actor
    const otherDb = testEnv.authenticatedContext("other").firestore();
    await expect(
      assertFails(
        addDoc(collection(otherDb, "notifications"), {
          userId: targetId,
          projectId: "p1",
          type: "comment",
          actorId: "actor",
          actorName: "Actor",
          message: "x",
          read: false,
          createdAt: { seconds: 0, nanoseconds: 0 },
        }),
      ),
    ).resolves.toBeDefined();

    // Target can read their notifications
    const targetDb = testEnv.authenticatedContext(targetId).firestore();
    const q = query(
      collection(targetDb, "notifications"),
      where("userId", "==", targetId),
    );
    await expect(assertSucceeds(getDocs(q))).resolves.toBeDefined();

    // Target can mark as read only
    const docs = await getDocs(q);
    const first = docs.docs[0]!;
    await expect(
      assertSucceeds(
        updateDoc(doc(targetDb, "notifications", first.id), {
          read: true,
          readAt: { seconds: 0, nanoseconds: 0 },
        } as any),
      ),
    ).resolves.toBeDefined();

    // Deny random field update
    await expect(
      assertFails(
        updateDoc(doc(targetDb, "notifications", first.id), {
          actorName: "Hacker",
        } as any),
      ),
    ).resolves.toBeDefined();
  });
});
