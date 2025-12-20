import { describe, expect, it, vi } from "vitest";
import { render, screen, act } from "@testing-library/react";
import React from "react";

const mocks = vi.hoisted(() => ({
  subscribeToNotifications: vi.fn(),
  markAsRead: vi.fn(),
  markAllAsRead: vi.fn(),
}));

vi.mock("@/services/notificationService", () => ({
  notificationService: {
    subscribeToNotifications: (...args: unknown[]) =>
      mocks.subscribeToNotifications(...args),
    markAsRead: (...args: unknown[]) => mocks.markAsRead(...args),
    markAllAsRead: (...args: unknown[]) => mocks.markAllAsRead(...args),
  },
}));

import { useNotifications } from "./useNotifications";

function TestComp({ userId }: { userId: string }) {
  const {
    notifications,
    unreadCount,
    markAllAsRead: markAll,
  } = useNotifications(userId);
  return (
    <div>
      <span data-testid="count">{unreadCount}</span>
      <button
        onClick={() => {
          void markAll();
        }}
      >
        mark
      </button>
      <ul>
        {notifications.map((n) => (
          <li key={n.id}>{n.message}</li>
        ))}
      </ul>
    </div>
  );
}

describe("useNotifications", () => {
  it("subscribes and updates unread count", async () => {
    let listener: ((notes: any[]) => void) | null = null;
    mocks.subscribeToNotifications.mockImplementation(
      (_uid: string, cb: (n: any[]) => void) => {
        listener = cb;
        return () => {
          /* unsubscribe */
        };
      },
    );

    render(<TestComp userId="u1" />);

    act(() => {
      listener?.([
        {
          id: "n1",
          userId: "u1",
          projectId: "p1",
          type: "comment",
          actorId: "a1",
          actorName: "A",
          message: "left feedback",
          read: false,
          createdAt: new Date().toISOString(),
        },
        {
          id: "n2",
          userId: "u1",
          projectId: "p1",
          type: "mention",
          actorId: "a2",
          actorName: "B",
          message: "mentioned you",
          read: true,
          createdAt: new Date().toISOString(),
        },
      ]);
    });

    expect(screen.getByTestId("count").textContent).toBe("1");
  });

  it("marks all as read via service", async () => {
    mocks.subscribeToNotifications.mockImplementationOnce(
      (_uid: string, _cb: (n: any[]) => void) => () => {},
    );
    render(<TestComp userId="u1" />);
    act(() => {
      screen.getByText("mark").click();
    });
    expect(mocks.markAllAsRead).toHaveBeenCalledWith("u1");
  });
});
