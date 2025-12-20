import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";

import { CommentInput } from "./CommentInput";
import type { MentionSuggestion } from "@/utils/mentionParser";

describe("CommentInput", () => {
  it("shows mention suggestions and inserts handle", async () => {
    const user = userEvent.setup();
    const suggestions: MentionSuggestion[] = [
      { id: "u1", displayName: "Mentor One", handle: "mentorone" },
      { id: "u2", displayName: "Alice Beta", handle: "alicebeta" },
    ];

    const onSubmit = async () => {
      /* noop */
    };
    render(
      <CommentInput onSubmit={onSubmit} mentionCandidates={suggestions} />,
    );

    const textarea = screen.getByRole("textbox");
    await user.type(textarea, "Hello @me");

    // Suggestion list opens and shows candidates
    expect(await screen.findByText(/Mentor One/)).toBeVisible();

    await user.click(screen.getByText(/Mentor One/));

    // Textarea should now include @mentorone
    expect((textarea as HTMLTextAreaElement).value).toContain("@mentorone");
  });

  it("toggles preview mode", async () => {
    const user = userEvent.setup();
    render(
      <CommentInput
        onSubmit={async () => {
          /* noop */
        }}
      />,
    );
    const previewBtn = screen.getByRole("button", { name: /preview/i });
    await user.click(previewBtn);
    expect(await screen.findByText(/Preview your comment/i)).toBeVisible();
  });
});
