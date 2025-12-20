import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";

const mocks = vi.hoisted(() => ({
  getCommentsByProject: vi.fn(),
  subscribeToProjectComments: vi.fn(),
  createComment: vi.fn(),
}));

vi.mock("@/services/commentService", () => ({
  commentService: {
    getCommentsByProject: (...a: unknown[]) => mocks.getCommentsByProject(...a),
    subscribeToProjectComments: (...a: unknown[]) =>
      mocks.subscribeToProjectComments(...a),
    createComment: (...a: unknown[]) => mocks.createComment(...a),
    updateComment: vi.fn(),
    deleteComment: vi.fn(),
  },
}));

import { CommentThread } from "./CommentThread";

describe("CommentThread", () => {
  it("requires auth and calls onRequireAuth when signed out UI is used", async () => {
    const user = userEvent.setup();
    mocks.getCommentsByProject.mockResolvedValueOnce([]);
    mocks.subscribeToProjectComments.mockImplementation(
      (_id: string, cb: (c: any[]) => void) => {
        cb([]);
        return () => {};
      },
    );
    const onRequireAuth = vi.fn();
    render(<CommentThread projectId="ws-1" onRequireAuth={onRequireAuth} />);

    const signin = await screen.findByRole("button", { name: /sign in/i });
    await user.click(signin);
    expect(onRequireAuth).toHaveBeenCalled();
    expect(mocks.createComment).not.toHaveBeenCalled();
  });
});
