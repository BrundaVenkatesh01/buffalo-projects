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
  const addDoc = vi.fn();
  const collection = vi.fn((_db: unknown, path: string) => ({ path }));
  const deleteDoc = vi.fn();
  const doc = vi.fn((_db: unknown, path: string, id?: string) => ({
    path: id ? `${path}/${id}` : path,
    id,
  }));
  const getDocs = vi.fn();
  const limit = vi.fn();
  const onSnapshot = vi.fn();
  const orderBy = vi.fn();
  const query = vi.fn((...args: unknown[]) => ({ args }));
  const serverTimestamp = vi.fn(
    () => new MockTimestamp(new Date("2024-01-01T00:00:00.000Z")),
  );
  const updateDoc = vi.fn();
  const where = vi.fn();
  const logger = { error: vi.fn(), warn: vi.fn(), debug: vi.fn() };
  return {
    MockTimestamp,
    mockDb,
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDocs,
    limit,
    onSnapshot,
    orderBy,
    query,
    serverTimestamp,
    updateDoc,
    where,
    logger,
  };
});

vi.mock("@/services/firebase", () => ({ db: mocks.mockDb }));
vi.mock("@/utils/logger", () => ({ logger: mocks.logger }));
vi.mock("firebase/firestore", () => ({
  addDoc: mocks.addDoc,
  collection: mocks.collection,
  deleteDoc: mocks.deleteDoc,
  doc: mocks.doc,
  getDocs: mocks.getDocs,
  limit: mocks.limit,
  onSnapshot: mocks.onSnapshot,
  orderBy: mocks.orderBy,
  query: mocks.query,
  serverTimestamp: mocks.serverTimestamp,
  Timestamp: mocks.MockTimestamp,
  updateDoc: mocks.updateDoc,
  where: mocks.where,
}));

import { notificationService } from "../notificationService";

const createSnapshotDoc = (id: string, data: Record<string, unknown>) => ({
  id,
  data: () => data,
  ref: { id, path: `notifications/${id}` },
});

beforeEach(() => {
  vi.clearAllMocks();
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
});

describe("notificationService.createNotification", () => {
  it("does not create when actor and user are the same", async () => {
    await notificationService.createNotification({
      userId: "u1",
      projectId: "p1",
      type: "comment",
      actorId: "u1",
      actorName: "Same User",
      message: "noop",
    });

    expect(mocks.addDoc).not.toHaveBeenCalled();
  });

  it("creates with optional fields present", async () => {
    mocks.addDoc.mockResolvedValue({ id: "n-1" });

    await notificationService.createNotification({
      userId: "u2",
      projectId: "p2",
      projectSlug: "solar-sense",
      projectName: "Solar Sense",
      type: "mention",
      actorId: "mentor-1",
      actorName: "Mentor One",
      actorAvatarUrl: "https://example.com/a.png",
      message: "mentioned you",
      link: "/p/solar-sense",
    });

    expect(mocks.addDoc).toHaveBeenCalledTimes(1);
    const payload = mocks.addDoc.mock.calls[0]?.[1] as Record<string, unknown>;
    expect(payload).toMatchObject({
      userId: "u2",
      projectId: "p2",
      type: "mention",
      actorId: "mentor-1",
      actorName: "Mentor One",
      message: "mentioned you",
      read: false,
      projectSlug: "solar-sense",
      projectName: "Solar Sense",
      actorAvatarUrl: "https://example.com/a.png",
      link: "/p/solar-sense",
    });
    expect((payload as any)["createdAt"]).toBeInstanceOf(mocks.MockTimestamp);
  });
});

describe("notificationService.subscribeToNotifications", () => {
  it("maps snapshots to domain notifications and invokes listener", async () => {
    let capturedOnNext:
      | ((snapshot: {
          docs: Array<{ id: string; data: () => unknown }>;
        }) => void)
      | null = null;
    mocks.onSnapshot.mockImplementation((_q, onNext) => {
      capturedOnNext = onNext as typeof capturedOnNext;
      return vi.fn();
    });

    const listener = vi.fn();
    const unsubscribe = notificationService.subscribeToNotifications(
      "u1",
      listener,
    );
    expect(typeof unsubscribe).toBe("function");

    const createdAt = new mocks.MockTimestamp(
      new Date("2024-02-01T10:00:00.000Z"),
    );
    const readAt = new mocks.MockTimestamp(
      new Date("2024-02-02T12:00:00.000Z"),
    );

    (capturedOnNext as any)?.({
      docs: [
        createSnapshotDoc("n-1", {
          userId: "u1",
          projectId: "p9",
          type: "comment",
          actorId: "a1",
          actorName: "Alice",
          message: "left feedback",
          read: false,
          createdAt,
          readAt,
          projectSlug: "proj-slug",
          projectName: "Proj Name",
          actorAvatarUrl: "https://example.com/a.png",
          link: "/p/proj-slug",
        }),
      ],
    });

    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener.mock.calls.length).toBeGreaterThan(0);
    const notifications = listener.mock.calls[0]![0];
    expect(notifications).toEqual([
      {
        id: "n-1",
        userId: "u1",
        projectId: "p9",
        type: "comment",
        actorId: "a1",
        actorName: "Alice",
        message: "left feedback",
        read: false,
        createdAt: "2024-02-01T10:00:00.000Z",
        readAt: "2024-02-02T12:00:00.000Z",
        projectSlug: "proj-slug",
        projectName: "Proj Name",
        actorAvatarUrl: "https://example.com/a.png",
        link: "/p/proj-slug",
      },
    ]);
  });
});

describe("notificationService unread and read operations", () => {
  it("getUnreadNotifications queries and maps results", async () => {
    const createdAt = new mocks.MockTimestamp(
      new Date("2024-03-01T00:00:00.000Z"),
    );
    mocks.getDocs.mockResolvedValueOnce({
      docs: [
        createSnapshotDoc("n-2", {
          userId: "u3",
          projectId: "p3",
          type: "mention",
          actorId: "m1",
          actorName: "Mentor",
          message: "mentioned you",
          read: false,
          createdAt,
        }),
      ],
    });

    const res = await notificationService.getUnreadNotifications("u3");
    expect(res).toEqual([
      {
        id: "n-2",
        userId: "u3",
        projectId: "p3",
        type: "mention",
        actorId: "m1",
        actorName: "Mentor",
        message: "mentioned you",
        read: false,
        createdAt: "2024-03-01T00:00:00.000Z",
      },
    ]);
  });

  it("markAsRead updates a single notification", async () => {
    await notificationService.markAsRead("n-3");
    expect(mocks.updateDoc).toHaveBeenCalled();
    const call0 = mocks.updateDoc.mock.calls[0]! as any[];
    const [ref, updates] = call0;
    expect(ref).toMatchObject({ path: "notifications/n-3" });
    expect(updates).toMatchObject({ read: true });
    expect(updates.readAt).toBeInstanceOf(mocks.MockTimestamp);
  });

  it("markAllAsRead updates each unread notification", async () => {
    const ids = ["n-10", "n-11", "n-12"];
    mocks.getDocs.mockResolvedValueOnce({
      docs: ids.map((id) =>
        createSnapshotDoc(id, {
          userId: "u5",
          projectId: "p5",
          type: "comment",
          actorId: "a5",
          actorName: "Ann",
          message: "left feedback",
          read: false,
          createdAt: new mocks.MockTimestamp(new Date()),
        }),
      ),
    });

    await notificationService.markAllAsRead("u5");
    expect(mocks.updateDoc).toHaveBeenCalledTimes(ids.length);
    ids.forEach((id, index) => {
      const call = mocks.updateDoc.mock.calls[index]! as any[];
      const [ref, updates] = call;
      expect(ref).toMatchObject({ id });
      expect(updates).toMatchObject({ read: true });
      expect(updates.readAt).toBeInstanceOf(mocks.MockTimestamp);
    });
  });
});
