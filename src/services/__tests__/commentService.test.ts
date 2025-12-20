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
    static now() {
      return new MockTimestamp(new Date());
    }
  }
  interface MockFirebaseUser {
    uid: string;
    email: string | null;
    displayName: string | null;
    photoURL: string | null;
    emailVerified?: boolean;
  }
  const mockAuth: { currentUser: MockFirebaseUser | null } = {
    currentUser: {
      uid: "user-initial",
      email: "initial@example.com",
      displayName: "Initial User",
      photoURL: null,
      emailVerified: true,
    },
  };
  const mockDb = {};
  const addDoc = vi.fn();
  const collection = vi.fn((_db: unknown, path: string) => ({ path }));
  const deleteDoc = vi.fn();
  const doc = vi.fn((_db: unknown, path: string, id?: string) => ({
    path: id ? `${path}/${id}` : path,
    id,
  }));
  const getDocs = vi.fn();
  const getDoc = vi.fn();
  const limit = vi.fn();
  const onSnapshot = vi.fn();
  const orderBy = vi.fn();
  const query = vi.fn((...args: unknown[]) => ({ args }));
  const serverTimestamp = vi.fn();
  const updateDoc = vi.fn();
  const where = vi.fn();
  const increment = vi.fn();
  const arrayUnion = vi.fn();
  const arrayRemove = vi.fn();
  const startAfter = vi.fn();
  const mockGetCurrentUser = vi.fn();
  const adjustCommentCount = vi.fn();
  const createNotification = vi.fn();
  const sendCommentNotification = vi.fn();
  const logger = {
    error: vi.fn(),
    warn: vi.fn(),
    debug: vi.fn(),
    info: vi.fn(),
    log: vi.fn(),
    metric: vi.fn(),
  };
  return {
    MockTimestamp,
    mockAuth,
    mockDb,
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDocs,
    getDoc,
    limit,
    onSnapshot,
    orderBy,
    query,
    serverTimestamp,
    updateDoc,
    where,
    increment,
    arrayUnion,
    arrayRemove,
    startAfter,
    mockGetCurrentUser,
    adjustCommentCount,
    createNotification,
    sendCommentNotification,
    logger,
  };
});

vi.mock("@/services/firebase", () => ({
  auth: mocks.mockAuth,
  db: mocks.mockDb,
}));
vi.mock("@/services/firebaseAuth", () => ({
  authService: { getCurrentUser: mocks.mockGetCurrentUser },
}));
vi.mock("@/services/firebaseDatabase", () => ({
  firebaseDatabase: { adjustCommentCount: mocks.adjustCommentCount },
}));
vi.mock("@/services/notificationService", () => ({
  notificationService: { createNotification: mocks.createNotification },
}));
vi.mock("@/services/emailService", () => ({
  emailService: { sendCommentNotification: mocks.sendCommentNotification },
}));
vi.mock("@/utils/logger", () => ({ logger: mocks.logger }));
vi.mock("firebase/firestore", () => ({
  addDoc: mocks.addDoc,
  arrayRemove: mocks.arrayRemove,
  arrayUnion: mocks.arrayUnion,
  collection: mocks.collection,
  deleteDoc: mocks.deleteDoc,
  doc: mocks.doc,
  getDoc: mocks.getDoc,
  getDocs: mocks.getDocs,
  increment: mocks.increment,
  limit: mocks.limit,
  onSnapshot: mocks.onSnapshot,
  orderBy: mocks.orderBy,
  query: mocks.query,
  serverTimestamp: mocks.serverTimestamp,
  startAfter: mocks.startAfter,
  Timestamp: mocks.MockTimestamp,
  updateDoc: mocks.updateDoc,
  where: mocks.where,
  getCountFromServer: vi.fn(),
}));

import { commentService } from "../commentService";

const setCurrentUser = (
  overrides?: Partial<{
    uid: string;
    email: string | null;
    displayName: string | null;
    photoURL: string | null;
    emailVerified?: boolean;
  }>,
) => {
  mocks.mockAuth.currentUser = {
    uid: "user-123",
    email: "founder@example.com",
    displayName: "Buffalo Builder",
    photoURL: "https://example.com/avatar.png",
    emailVerified: true,
    ...overrides,
  };
};

const createSnapshotDoc = (id: string, data: Record<string, unknown>) => ({
  id,
  data: () => data,
});

beforeEach(() => {
  vi.clearAllMocks();
  setCurrentUser();
  mocks.mockGetCurrentUser.mockReset();
  mocks.collection.mockImplementation((_db, path) => ({ path }));
  mocks.doc.mockImplementation((_db, path, id) => ({
    path: id ? `${path}/${id}` : path,
    id,
  }));
  mocks.query.mockImplementation((...args) => ({ args }));
  mocks.limit.mockImplementation((value) => value);
  mocks.orderBy.mockImplementation((field, direction) => ({
    field,
    direction,
  }));
  mocks.where.mockImplementation((field, op, value) => ({ field, op, value }));
  mocks.onSnapshot.mockImplementation(() => vi.fn());
  mocks.increment.mockImplementation((delta: number) => ({ delta }));
  mocks.serverTimestamp.mockImplementation(
    () => new mocks.MockTimestamp(new Date("2024-01-01T00:00:00.000Z")),
  );
  mocks.getDocs.mockReset();
});

describe("commentService.createComment", () => {
  it("creates a comment, adjusts counts, and notifies recipients", async () => {
    mocks.addDoc.mockResolvedValue({ id: "comment-001" });

    const result = await commentService.createComment({
      projectId: "workspace-42",
      content: "  Loved the new pivot!  ",
      mentionIds: ["owner-99", "mentor-77", "owner-99", "user-123"],
      projectOwnerId: "owner-99",
      projectSlug: "solar-sense",
      projectName: "Solar Sense",
    });

    expect(mocks.addDoc).toHaveBeenCalledTimes(1);
    const addDocPayload = mocks.addDoc.mock.calls[0]?.[1] as Record<
      string,
      unknown
    >;
    expect(addDocPayload).toMatchObject({
      projectId: "workspace-42",
      userId: "user-123",
      userDisplayName: "Buffalo Builder",
      content: "Loved the new pivot!",
      mentions: ["owner-99", "mentor-77"],
      isEdited: false,
    });

    expect(mocks.adjustCommentCount).toHaveBeenCalledWith("workspace-42", 1);

    expect(mocks.createNotification).toHaveBeenCalledTimes(2);
    expect(mocks.createNotification).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        userId: "owner-99",
        projectId: "workspace-42",
        type: "comment",
        actorId: "user-123",
        actorName: "Buffalo Builder",
        message: "Buffalo Builder left feedback on “Solar Sense”",
        projectSlug: "solar-sense",
      }),
    );
    expect(mocks.createNotification).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        userId: "mentor-77",
        type: "mention",
        projectId: "workspace-42",
      }),
    );

    expect(mocks.sendCommentNotification).toHaveBeenCalledTimes(2);
    expect(mocks.sendCommentNotification).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        recipientId: "owner-99",
        type: "comment",
        projectId: "workspace-42",
        projectSlug: "solar-sense",
        projectName: "Solar Sense",
      }),
    );
    expect(mocks.sendCommentNotification).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        recipientId: "mentor-77",
        type: "mention",
      }),
    );

    expect(result).toMatchObject({
      id: "comment-001",
      projectId: "workspace-42",
      userId: "user-123",
      userDisplayName: "Buffalo Builder",
      content: "Loved the new pivot!",
      mentions: ["owner-99", "mentor-77"],
      isEdited: false,
    });
    expect(new Date(result.createdAt).toISOString()).toBe(result.createdAt);
    expect(new Date(result.updatedAt).toISOString()).toBe(result.updatedAt);
  });

  it("falls back to authService when Firebase auth user is missing", async () => {
    mocks.mockAuth.currentUser = null;
    mocks.mockGetCurrentUser.mockReturnValue({
      uid: "fallback-user",
      email: "fallback@example.com",
      displayName: "Fallback User",
      photoURL: null,
      emailVerified: true,
    });
    mocks.addDoc.mockResolvedValue({ id: "comment-002" });

    const result = await commentService.createComment({
      projectId: "workspace-7",
      content: "Great momentum!",
    });

    expect(result.userId).toBe("fallback-user");
    expect(mocks.addDoc).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        userId: "fallback-user",
        userDisplayName: "Fallback User",
      }),
    );
  });

  it("throws when content is empty after trimming", async () => {
    await expect(
      commentService.createComment({
        projectId: "workspace-x",
        content: "   ",
      }),
    ).rejects.toThrow("Project ID and content are required");

    expect(mocks.addDoc).not.toHaveBeenCalled();
  });
});

describe("commentService.getCommentsByProject", () => {
  it("maps Firestore comments to domain model with ISO timestamps", async () => {
    const createdAt = new mocks.MockTimestamp(
      new Date("2024-02-15T12:34:56.000Z"),
    );
    const updatedAt = new mocks.MockTimestamp(
      new Date("2024-02-16T08:00:00.000Z"),
    );

    mocks.getDocs.mockResolvedValueOnce({
      docs: [
        createSnapshotDoc("comment-101", {
          projectId: "workspace-42",
          userId: "mentor-1",
          userDisplayName: "Mentor One",
          content: "Keep iterating!",
          createdAt,
          updatedAt,
          mentions: ["founder-1"],
          isEdited: true,
        }),
      ],
    });

    const comments = await commentService.getCommentsByProject("workspace-42");

    expect(comments).toHaveLength(1);
    expect(comments[0]).toMatchObject({
      id: "comment-101",
      projectId: "workspace-42",
      userId: "mentor-1",
      userDisplayName: "Mentor One",
      content: "Keep iterating!",
      mentions: ["founder-1"],
      isEdited: true,
      createdAt: "2024-02-15T12:34:56.000Z",
      updatedAt: "2024-02-16T08:00:00.000Z",
    });
  });
});

describe("commentService.subscribeToProjectComments", () => {
  it("invokes listener with mapped comments on snapshot", async () => {
    let captured:
      | ((snapshot: {
          docs: Array<{ id: string; data: () => unknown }>;
        }) => void)
      | null = null;
    mocks.onSnapshot.mockImplementation((_q, onNext) => {
      captured = onNext as typeof captured;
      return vi.fn();
    });

    const listener = vi.fn();
    const unsubscribe = commentService.subscribeToProjectComments(
      "ws-sub",
      listener,
    );
    expect(typeof unsubscribe).toBe("function");

    const createdAt = new mocks.MockTimestamp(
      new Date("2024-04-01T00:00:00.000Z"),
    );
    (captured as any)?.({
      docs: [
        createSnapshotDoc("c-1", {
          projectId: "ws-sub",
          userId: "u1",
          userDisplayName: "User 1",
          content: "Hello",
          createdAt,
          updatedAt: null,
          isEdited: false,
        }),
      ],
    });

    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener.mock.calls.length).toBeGreaterThan(0);
    const comments = listener.mock.calls[0]![0];
    expect(comments).toEqual([
      expect.objectContaining({
        id: "c-1",
        projectId: "ws-sub",
        userId: "u1",
        userDisplayName: "User 1",
        content: "Hello",
        createdAt: "2024-04-01T00:00:00.000Z",
        updatedAt: "2024-04-01T00:00:00.000Z",
        isEdited: false,
      }),
    ]);
  });
});

describe("commentService.buildDefaultMentionSuggestions", () => {
  it("deduplicates commenters and normalizes handles", async () => {
    mocks.getDocs.mockResolvedValueOnce({
      docs: [
        createSnapshotDoc("comment-a", {
          projectId: "workspace-1",
          userId: "mentor-1",
          userDisplayName: "Mentor Alpha",
          content: "Great job!",
          createdAt: new mocks.MockTimestamp(
            new Date("2024-01-01T00:00:00.000Z"),
          ),
          updatedAt: null,
        }),
        createSnapshotDoc("comment-b", {
          projectId: "workspace-1",
          userId: "mentor-1",
          userDisplayName: "Mentor Alpha",
          content: "Following up",
          createdAt: new mocks.MockTimestamp(
            new Date("2024-01-02T00:00:00.000Z"),
          ),
          updatedAt: null,
        }),
        createSnapshotDoc("comment-c", {
          projectId: "workspace-1",
          userId: "founder-9",
          userDisplayName: "Founder 9!",
          content: "Thanks!",
          createdAt: new mocks.MockTimestamp(
            new Date("2024-01-03T00:00:00.000Z"),
          ),
          updatedAt: null,
        }),
      ],
    });

    const suggestions =
      await commentService.buildDefaultMentionSuggestions("workspace-1");

    expect(suggestions).toEqual([
      {
        id: "mentor-1",
        displayName: "Mentor Alpha",
        handle: "mentoralpha",
      },
      {
        id: "founder-9",
        displayName: "Founder 9!",
        handle: "founder9",
      },
    ]);
  });

  it("returns empty array when fetching comments fails", async () => {
    mocks.getDocs.mockRejectedValueOnce(new Error("Firestore unavailable"));

    await expect(
      commentService.buildDefaultMentionSuggestions("workspace-404"),
    ).resolves.toEqual([]);
    expect(mocks.logger.warn).toHaveBeenCalledWith(
      "Failed to build mention suggestions",
      expect.any(Error),
    );
  });
});

describe("commentService.deleteComment", () => {
  it("removes comment and adjusts comment count", async () => {
    const docRef = { path: "comments/comment-123", id: "comment-123" };
    mocks.doc.mockReturnValueOnce(docRef);

    await commentService.deleteComment("comment-123", "workspace-7");

    expect(mocks.deleteDoc).toHaveBeenCalledWith(docRef);
    expect(mocks.adjustCommentCount).toHaveBeenCalledWith("workspace-7", -1);
  });
});

describe("commentService.updateComment", () => {
  it("updates trimmed content, filters self mentions, and sets edited flag", async () => {
    setCurrentUser({ uid: "user-xyz" });
    const ref = { path: "comments/c-55", id: "c-55" };
    mocks.doc.mockReturnValueOnce(ref);

    await commentService.updateComment({
      commentId: "c-55",
      content: "  Updated content  ",
      mentionIds: ["user-xyz", "mentor-99"],
    });

    expect(mocks.updateDoc).toHaveBeenCalledWith(
      ref,
      expect.objectContaining({
        content: "Updated content",
        mentions: ["mentor-99"],
        isEdited: true,
      }),
    );
    const [_ref, update] = mocks.updateDoc.mock.calls.at(-1)!;
    expect(update.updatedAt).toBeInstanceOf(mocks.MockTimestamp);
  });
});
