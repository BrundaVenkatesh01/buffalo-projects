import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import {
  initializeTestEnvironment,
  type RulesTestEnvironment,
  assertFails,
  assertSucceeds,
} from "@firebase/rules-unit-testing";
import { readFile } from "node:fs/promises";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

let testEnv: RulesTestEnvironment;

describe.skip("Firestore security rules", () => {
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

  it("allows public read of public_projects and denies write for anon", async () => {
    const anon = testEnv.unauthenticatedContext();
    const db = anon.firestore();
    const ref = doc(db, "public_projects/demo");
    await expect(assertSucceeds(getDoc(ref))).resolves.toBeDefined();

    await expect(
      assertFails(setDoc(ref, { workspaceCode: "ws-1" })),
    ).resolves.toBeDefined();
  });

  it("permits owner to create and update their public_projects entry", async () => {
    const owner = testEnv.authenticatedContext("user-1");
    const db = owner.firestore();

    // Seed workspace document with ownerId
    await assertSucceeds(
      setDoc(doc(db, "workspaces/ws-1"), {
        ownerId: "user-1",
        projectName: "Demo",
        isPublic: true,
        createdAt: { seconds: 0, nanoseconds: 0 },
        lastModified: { seconds: 0, nanoseconds: 0 },
      }),
    );

    const pubRef = doc(db, "public_projects/react-demo");
    await expect(
      assertSucceeds(
        setDoc(pubRef, { workspaceCode: "ws-1", slug: "react-demo" }),
      ),
    ).resolves.toBeDefined();

    await expect(
      assertSucceeds(
        updateDoc(pubRef as any, { workspaceCode: "ws-1", likes: 1 } as any),
      ),
    ).resolves.toBeDefined();
  });

  it("denies reading private workspace for non-owner, allows owner and public", async () => {
    const owner = testEnv.authenticatedContext("owner-9");
    const dbOwner = owner.firestore();
    await assertSucceeds(
      setDoc(doc(dbOwner, "workspaces/secret"), {
        ownerId: "owner-9",
        projectName: "Secret",
        isPublic: false,
        createdAt: { seconds: 0, nanoseconds: 0 },
        lastModified: { seconds: 0, nanoseconds: 0 },
      }),
    );

    const stranger = testEnv.authenticatedContext("user-x").firestore();
    await expect(
      assertFails(getDoc(doc(stranger, "workspaces/secret"))),
    ).resolves.toBeDefined();

    await assertSucceeds(
      updateDoc(
        doc(dbOwner, "workspaces/secret") as any,
        { isPublic: true } as any,
      ),
    );
    const dbPublic = testEnv.unauthenticatedContext().firestore();
    await expect(
      assertSucceeds(getDoc(doc(dbPublic, "workspaces/secret"))),
    ).resolves.toBeDefined();
  });
});
