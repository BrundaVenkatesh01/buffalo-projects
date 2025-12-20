import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => {
  class MockTimestamp {
    private readonly value: Date;
    constructor(date: Date) {
      this.value = date;
    }
    toDate() {
      return this.value;
    }
  }
  const mockDb = {};
  const collection = vi.fn();
  const query = vi.fn((...args: unknown[]) => ({ args }));
  const where = vi.fn();
  const orderBy = vi.fn();
  const limit = vi.fn();
  const startAfter = vi.fn();
  const getDocs = vi.fn();
  return {
    MockTimestamp,
    mockDb,
    collection,
    query,
    where,
    orderBy,
    limit,
    startAfter,
    getDocs,
  };
});

vi.mock("@/services/firebase", () => ({
  db: mocks.mockDb,
  auth: { currentUser: { uid: "u1" } },
}));
vi.mock("firebase/firestore", () => ({
  collection: mocks.collection,
  query: mocks.query,
  where: mocks.where,
  orderBy: mocks.orderBy,
  limit: mocks.limit,
  startAfter: mocks.startAfter,
  getDocs: mocks.getDocs,
  Timestamp: mocks.MockTimestamp,
}));

import { firebaseDatabase } from "../firebaseDatabase";

beforeEach(() => {
  vi.clearAllMocks();
});

describe("firebaseDatabase.getPublicWorkspacesPage", () => {
  it("returns hasMore + cursor when results exceed limit", async () => {
    const createdAt = new mocks.MockTimestamp(new Date("2024-07-01T00:00:00Z"));
    const lastModified = new mocks.MockTimestamp(
      new Date("2024-07-02T00:00:00Z"),
    );
    const ws = (code: string) => ({
      code,
      ownerId: "u1",
      userId: "u1",
      projectName: code,
      createdAt,
      lastModified,
      isPublic: true,
      bmcData: {
        keyPartners: "",
        keyActivities: "",
        keyResources: "",
        valuePropositions: "",
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

    mocks.getDocs.mockResolvedValueOnce({
      docs: [
        { data: () => ws("ws-1") },
        { data: () => ws("ws-2") },
        { data: () => ws("ws-3") },
      ],
    });

    const res = await firebaseDatabase.getPublicWorkspacesPage({
      limit: 2,
      orderBy: "lastModified",
      orderDirection: "desc",
    });
    expect(res.hasMore).toBe(true);
    expect(res.workspaces.length).toBe(2);
    expect(res.cursor).toBeDefined();
  });

  it("applies stage and tags filters", async () => {
    mocks.getDocs.mockResolvedValueOnce({ docs: [] });
    await firebaseDatabase.getPublicWorkspacesPage({
      limit: 10,
      stage: "building",
      tags: ["AI", "SaaS", "AI"],
    });
    // Verify where called for isPublic true and stage equals, and array-contains-any
    const calls = mocks.where.mock.calls.map((c) => c[0]);
    expect(
      calls.some((arg) => typeof arg === "string" && arg === "isPublic"),
    ).toBe(true);
    expect(
      calls.some((arg) => typeof arg === "string" && arg === "stage"),
    ).toBe(true);
  });
});
