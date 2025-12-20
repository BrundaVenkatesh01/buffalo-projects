import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import {
  initializeTestEnvironment,
  type RulesTestEnvironment,
  assertFails,
  assertSucceeds,
} from "@firebase/rules-unit-testing";
import { readFile } from "node:fs/promises";
import { getStorage, ref, uploadBytes } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";

let testEnv: RulesTestEnvironment;

describe.skip("Storage security rules", () => {
  beforeAll(async () => {
    testEnv = await initializeTestEnvironment({
      projectId: "buffalo-projects-e2e",
      firestore: { rules: await readFile("firestore.rules", "utf8") },
      storage: { rules: await readFile("storage.rules", "utf8") },
    });
  }, 30_000);

  afterAll(async () => {
    await testEnv.cleanup();
  });

  beforeEach(async () => {
    await testEnv.clearFirestore();
    await testEnv.clearStorage();
  });

  it("profile images: owner can upload, other users denied", async () => {
    const ownerCtx = testEnv.authenticatedContext("u1");
    const ownerStorage = getStorage((ownerCtx as any).app);
    const otherStorage = getStorage(
      (testEnv.authenticatedContext("u2") as any).app,
    );

    const refOk = ref(ownerStorage, `profile_images/u1/avatar.png`);
    await expect(
      assertSucceeds(
        uploadBytes(refOk, Buffer.from([1, 2, 3]), {
          contentType: "image/png",
        }),
      ),
    ).resolves.toBeDefined();

    const refDenied = ref(otherStorage, `profile_images/u1/intruder.png`);
    await expect(
      assertFails(
        uploadBytes(refDenied, Buffer.from([1, 2, 3]), {
          contentType: "image/png",
        }),
      ),
    ).resolves.toBeDefined();
  });

  it("workspace documents: owner can upload when workspace exists; denies strangers", async () => {
    // Seed workspace with owner u9
    await testEnv.withSecurityRulesDisabled(async (ctx) => {
      await setDoc(doc(ctx.firestore(), "workspaces/ws-x"), {
        ownerId: "u9",
        isPublic: false,
        projectName: "WS",
        createdAt: { seconds: 0, nanoseconds: 0 },
        lastModified: { seconds: 0, nanoseconds: 0 },
      });
    });

    const ownerStorage = getStorage(
      (testEnv.authenticatedContext("u9") as any).app,
    );
    const strangerStorage = getStorage(
      (testEnv.authenticatedContext("u0") as any).app,
    );

    const okRef = ref(ownerStorage, `documents/ws-x/spec.pdf`);
    await expect(
      assertSucceeds(
        uploadBytes(okRef, Buffer.from([0]), {
          contentType: "application/pdf",
        }),
      ),
    ).resolves.toBeDefined();

    const deniedRef = ref(strangerStorage, `documents/ws-x/spec.pdf`);
    await expect(
      assertFails(
        uploadBytes(deniedRef, Buffer.from([0]), {
          contentType: "application/pdf",
        }),
      ),
    ).resolves.toBeDefined();
  });
});
