import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
vi.mock("next/navigation", () => ({ useRouter: () => ({ push: vi.fn() }) }));

const hook = vi.hoisted(() => ({
  notifications: [
    {
      id: "n1",
      userId: "u1",
      projectId: "p1",
      type: "comment",
      actorId: "a1",
      actorName: "Alice",
      message: "left feedback",
      read: false,
      createdAt: new Date().toISOString(),
    },
  ],
  unreadCount: 1,
  loading: false,
  markAsRead: vi.fn(),
  markAllAsRead: vi.fn(),
}));

vi.mock("@/hooks/useNotifications", () => ({
  useNotifications: () => hook,
}));

import { NotificationDropdown } from "./NotificationDropdown";

describe("NotificationDropdown", () => {
  it("opens dropdown and marks all as read", async () => {
    const user = userEvent.setup();
    render(<NotificationDropdown userId="u1" />);
    const open = screen.getByRole("button", { name: /open notifications/i });
    await user.click(open);
    await user.click(screen.getByRole("button", { name: /mark all as read/i }));
    expect(hook.markAllAsRead).toHaveBeenCalled();
  });
});
