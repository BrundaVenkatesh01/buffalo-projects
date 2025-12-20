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
  const doc = vi.fn((_db: unknown, path: string, id?: string) => ({
    path: id ? `${path}/${id}` : path,
    id,
  }));
  const updateDoc = vi.fn();
  const getDoc = vi.fn();
  const getDocs = vi.fn();
  const setDoc = vi.fn();
  const deleteDoc = vi.fn();
  const collection = vi.fn((_db: unknown, path: string) => ({ path }));
  const serverTimestamp = vi.fn(
    () => new MockTimestamp(new Date("2024-01-01T00:00:00.000Z")),
  );
  const increment = vi.fn((delta: number) => ({ delta }));
  const query = vi.fn((...args: unknown[]) => ({ args }));
  const where = vi.fn();
  const orderBy = vi.fn();
  const limit = vi.fn();
  const startAfter = vi.fn();
  const onSnapshot = vi.fn();
  const arrayUnion = vi.fn();
  const arrayRemove = vi.fn();
  const getCountFromServer = vi.fn();
  const logger = {
    error: vi.fn(),
    warn: vi.fn(),
    debug: vi.fn(),
    info: vi.fn(),
  };
  const runTransaction = vi.fn(
    async (
      _firestore: unknown,
      updateFunction: (transaction: unknown) => Promise<unknown>,
    ) => {
      const transaction = {
        get: (ref: unknown) => getDoc(ref),
        update: (ref: unknown, data: unknown) => updateDoc(ref, data),
        set: (ref: unknown, data: unknown, options?: unknown) =>
          setDoc(ref, data, options),
        delete: (ref: unknown) => deleteDoc(ref),
      };
      return updateFunction(transaction as never);
    },
  );
  return {
    MockTimestamp,
    mockDb,
    doc,
    updateDoc,
    getDoc,
    getDocs,
    setDoc,
    deleteDoc,
    collection,
    serverTimestamp,
    increment,
    query,
    where,
    orderBy,
    limit,
    startAfter,
    onSnapshot,
    arrayUnion,
    arrayRemove,
    getCountFromServer,
    runTransaction,
    logger,
  };
});

vi.mock("@/services/firebase", () => ({
  db: mocks.mockDb,
  auth: { currentUser: { uid: "u1" } },
  storage: {},
}));
vi.mock("@/utils/logger", () => ({ logger: mocks.logger }));
vi.mock("firebase/firestore", () => ({
  doc: mocks.doc,
  updateDoc: mocks.updateDoc,
  getDoc: mocks.getDoc,
  getDocs: mocks.getDocs,
  setDoc: mocks.setDoc,
  deleteDoc: mocks.deleteDoc,
  collection: mocks.collection,
  query: mocks.query,
  where: mocks.where,
  orderBy: mocks.orderBy,
  limit: mocks.limit,
  startAfter: mocks.startAfter,
  onSnapshot: mocks.onSnapshot,
  serverTimestamp: mocks.serverTimestamp,
  increment: mocks.increment,
  arrayUnion: mocks.arrayUnion,
  arrayRemove: mocks.arrayRemove,
  getCountFromServer: mocks.getCountFromServer,
  Timestamp: mocks.MockTimestamp,
  runTransaction: mocks.runTransaction,
}));

// Import after mocks are set up
import { firebaseDatabase } from "../firebaseDatabase";

beforeEach(() => {
  vi.clearAllMocks();
});

describe("firebaseDatabase.adjustCommentCount", () => {
  it("increments workspace count, clamps negatives, and syncs public project", async () => {
    // First call increments, then we read a snapshot showing negative existing count
    mocks.getDoc.mockResolvedValueOnce({
      data: () => ({ commentCount: -1, slug: "proj-slug" }),
    });

    await firebaseDatabase.adjustCommentCount("ws-1", 1);

    // First update increments
    expect(mocks.updateDoc).toHaveBeenNthCalledWith(
      1,
      { path: "workspaces/ws-1", id: "ws-1" },
      expect.objectContaining({
        commentCount: expect.objectContaining({ delta: 1 }),
      }),
    );

    // Clamp workspace to zero when negative
    expect(mocks.updateDoc).toHaveBeenNthCalledWith(
      2,
      { path: "workspaces/ws-1", id: "ws-1" },
      { commentCount: 0 },
    );

    // Sync public_projects with increment and timestamp
    expect(mocks.setDoc).toHaveBeenCalledWith(
      { path: "public_projects/proj-slug", id: "proj-slug" },
      expect.objectContaining({
        commentCount: expect.objectContaining({ delta: 1 }),
      }),
      { merge: true },
    );

    // Clamp public project commentCount as well
    expect(mocks.updateDoc).toHaveBeenCalledWith(
      { path: "public_projects/proj-slug", id: "proj-slug" },
      { commentCount: 0 },
    );
  });
});

describe("firebaseDatabase.incrementViewCount", () => {
  it("increments view count and sets lastViewedAt", async () => {
    await firebaseDatabase.incrementViewCount("ws-2");
    expect(mocks.updateDoc).toHaveBeenCalledWith(
      { path: "workspaces/ws-2", id: "ws-2" },
      expect.objectContaining({
        viewCount: expect.objectContaining({ delta: 1 }),
      }),
    );
  });
});

describe("firebaseDatabase.queryWorkspaces", () => {
  it("returns mapped workspaces and hasMore when more docs than limit", async () => {
    const createdAt = new mocks.MockTimestamp(
      new Date("2024-05-01T00:00:00.000Z"),
    );
    const lastModified = new mocks.MockTimestamp(
      new Date("2024-05-02T00:00:00.000Z"),
    );

    const ws1 = {
      code: "ws-1",
      ownerId: "u1",
      userId: "u1",
      projectName: "Query One",
      description: "",
      projectDescription: "",
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
    };

    const ws2 = { ...ws1, code: "ws-2", projectName: "Query Two" };
    mocks.getDocs.mockResolvedValueOnce({
      docs: [{ data: () => ws1 }, { data: () => ws2 }],
    });

    const res = await (
      await import("../firebaseDatabase")
    ).firebaseDatabase.queryWorkspaces({ limit: 1 });
    expect(res.hasMore).toBe(true);
    expect(res.workspaces.length).toBe(1);
    expect(res.workspaces.length).toBeGreaterThan(0);
    expect(res.workspaces[0]!.code).toBe("ws-1");
    expect(typeof res.workspaces[0]!.createdAt).toBe("string");
    expect(typeof res.workspaces[0]!.lastModified).toBe("string");
  });
  it("getPublicWorkspaceBySlug returns mapped workspace", async () => {
    const createdAt = new mocks.MockTimestamp(
      new Date("2024-06-01T00:00:00.000Z"),
    );
    const lastModified = new mocks.MockTimestamp(
      new Date("2024-06-02T00:00:00.000Z"),
    );
    mocks.getDocs.mockResolvedValueOnce({
      docs: [
        {
          data: () => ({
            code: "ws-slug",
            ownerId: "u1",
            userId: "u1",
            projectName: "Slug Project",
            description: "",
            projectDescription: "",
            createdAt,
            lastModified,
            isPublic: true,
            slug: "slug-1",
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
          }),
        },
      ],
    });

    const { firebaseDatabase } = await import("../firebaseDatabase");
    const ws = await firebaseDatabase.getPublicWorkspaceBySlug("slug-1");
    expect(ws?.code).toBe("ws-slug");
    expect(ws?.slug).toBe("slug-1");
    expect(typeof ws?.createdAt).toBe("string");
  });
});

describe("firebaseDatabase publish/unpublish (online path)", () => {
  it("publishes when owner matches and syncs public_projects", async () => {
    // Auth owner
    const { firebaseDatabase } = await import("../firebaseDatabase");
    // First getDoc call: load workspace for publish permission
    mocks.getDoc.mockResolvedValueOnce({
      exists: () => true,
      data: () => ({
        ownerId: "u1",
        projectName: "Publish Me",
        slug: null,
        createdAt: new mocks.MockTimestamp(new Date("2024-05-01T00:00:00Z")),
        lastModified: new mocks.MockTimestamp(new Date("2024-05-02T00:00:00Z")),
        isPublic: false,
      }),
    });
    // slugExists -> query workspaces with slug (none)
    mocks.getDocs.mockResolvedValueOnce({ docs: [] });
    // slugExists -> check public_projects doc (doesn't exist)
    mocks.getDoc.mockResolvedValueOnce({ exists: () => false });
    // After updateDoc, publish reads workspace again to return updated data
    mocks.getDoc.mockResolvedValueOnce({
      exists: () => true,
      data: () => ({
        ownerId: "u1",
        userId: "u1",
        code: "ws-1",
        projectName: "Publish Me",
        slug: "publish-me",
        createdAt: new mocks.MockTimestamp(new Date("2024-05-01T00:00:00Z")),
        lastModified: new mocks.MockTimestamp(new Date("2024-05-02T00:00:00Z")),
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
      }),
    });

    const updated = await firebaseDatabase.publishWorkspace("ws-1");
    // Updated payload returned
    expect(updated.isPublic).toBe(true);
    expect(updated.slug).toMatch(/publish/);
    // updateDoc called to set isPublic + timestamps
    expect(mocks.updateDoc).toHaveBeenCalledWith(
      { path: "workspaces/ws-1", id: "ws-1" },
      expect.objectContaining({ isPublic: true }),
    );
    // public_projects synced
    const setCalls = mocks.setDoc.mock.calls.filter((c) =>
      (c[0] as any).path?.startsWith("public_projects/"),
    );
    expect(setCalls.length).toBeGreaterThanOrEqual(1);
  });

  it("unpublishes and removes public_projects document", async () => {
    // permission check
    mocks.getDoc.mockResolvedValueOnce({
      exists: () => true,
      data: () => ({ ownerId: "u1", slug: "publish-me" }),
    });
    // After update, getWorkspace
    mocks.getDoc.mockResolvedValueOnce({
      exists: () => true,
      data: () => ({
        ownerId: "u1",
        userId: "u1",
        code: "ws-1",
        projectName: "Publish Me",
        slug: "publish-me",
        createdAt: new mocks.MockTimestamp(new Date("2024-05-01T00:00:00Z")),
        lastModified: new mocks.MockTimestamp(new Date("2024-05-02T00:00:00Z")),
        isPublic: false,
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
      }),
    });

    await firebaseDatabase.unpublishWorkspace("ws-1");
    expect(mocks.updateDoc).toHaveBeenCalledWith(
      { path: "workspaces/ws-1", id: "ws-1" },
      expect.objectContaining({ isPublic: false }),
    );
    expect(mocks.deleteDoc).toHaveBeenCalledWith(
      expect.objectContaining({ path: "public_projects/publish-me" }),
    );
  });
});

describe("firebaseDatabase shortlist operations", () => {
  it("getShortlistedProjects returns filtered string array", async () => {
    mocks.getDoc.mockResolvedValueOnce({
      exists: () => true,
      data: () => ({ shortlistedProjects: ["ws-1", 123, null, "ws-2"] }),
    });

    const { firebaseDatabase } = await import("../firebaseDatabase");
    const res = await firebaseDatabase.getShortlistedProjects("u1");
    expect(res).toEqual(["ws-1", "ws-2"]);
  });

  it("addProjectToShortlist writes arrayUnion to user doc", async () => {
    mocks.arrayUnion.mockImplementation((x) => ({ union: x }));
    const { firebaseDatabase } = await import("../firebaseDatabase");
    await firebaseDatabase.addProjectToShortlist("ws-77");
    const [ref, payload, options] = mocks.setDoc.mock.calls.at(-1)!;
    expect(ref).toMatchObject({ path: "users/u1" });
    expect(payload.shortlistedProjects).toMatchObject({ union: "ws-77" });
    expect(options).toEqual({ merge: true });
  });

  it("removeProjectFromShortlist writes arrayRemove to user doc", async () => {
    mocks.arrayRemove.mockImplementation((x) => ({ remove: x }));
    const { firebaseDatabase } = await import("../firebaseDatabase");
    await firebaseDatabase.removeProjectFromShortlist("ws-77");
    const [ref, payload, options] = mocks.setDoc.mock.calls.at(-1)!;
    expect(ref).toMatchObject({ path: "users/u1" });
    expect(payload.shortlistedProjects).toMatchObject({ remove: "ws-77" });
    expect(options).toEqual({ merge: true });
  });
});
