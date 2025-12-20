// Seed Firebase emulator with a public workspace and directory entry
// Usage: NEXT_PUBLIC_FIREBASE_EMULATOR=1 node scripts/seed-emulator.mjs

import { initializeTestEnvironment } from "@firebase/rules-unit-testing";
import { readFile } from "node:fs/promises";
import { doc, setDoc } from "firebase/firestore";

const projectId = process.env.FIREBASE_PROJECT_ID || "demo-buffalo";

const slug = process.env.SEED_SLUG || "seeded-demo";
const code = process.env.SEED_CODE || "WS-SEED-1";
const ownerId = process.env.SEED_OWNER || "owner-seed";

const now = new Date().toISOString();

async function main() {
  const rules = await readFile("firestore.rules", "utf8");

  const testEnv = await initializeTestEnvironment({
    projectId,
    firestore: { rules },
  });

  try {
    await testEnv.clearFirestore();
    await testEnv.withSecurityRulesDisabled(async (ctx) => {
      const db = ctx.firestore();

      await setDoc(doc(db, "workspaces", code), {
        code,
        ownerId,
        userId: ownerId,
        projectName: "Seeded Public Project",
        description: "Seeded via emulator script for E2E tests",
        isPublic: true,
        slug,
        createdAt: { seconds: 0, nanoseconds: 0 },
        lastModified: { seconds: 0, nanoseconds: 0 },
        bmcData: {
          keyPartners: "",
          keyActivities: "",
          keyResources: "",
          valuePropositions: "Seeded VP",
          customerRelationships: "",
          channels: "",
          customerSegments: "",
          costStructure: "",
          revenueStreams: "",
        },
        journal: [],
        versions: [],
        pivots: [],
        chatMessages: [],
        documents: [],
        evidenceLinks: {},
        contextNotes: [],
        viewCount: 0,
        likeCount: 0,
        commentCount: 0,
      });

      await setDoc(doc(db, "public_projects", slug), {
        workspaceCode: code,
        slug,
        title: "Seeded Public Project",
        description: "From emulator seed",
        publishedAt: now,
        updatedAt: now,
        stage: "idea",
        commentCount: 0,
      });
    });
    // eslint-disable-next-line no-console
    console.log(`Seed complete. Workspace ${code}, slug /p/${slug}`);
  } finally {
    await testEnv.cleanup();
  }
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});
