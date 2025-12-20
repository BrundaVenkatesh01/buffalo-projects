import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { WorkspaceSharePanel } from "./WorkspaceSharePanel";
import { useWorkspaceStore } from "@/stores/workspaceStore";
import type { Workspace } from "@/types";

const baseWorkspace: Workspace = {
  id: "test-share-workspace",
  code: "ws-share",
  projectName: "Shareable",
  description: "Long enough summary for one-liner.",
  projectDescription: "Long enough summary for one-liner.",
  createdAt: new Date().toISOString(),
  lastModified: new Date().toISOString(),
  isPublic: false,
  bmcData: {
    keyPartners: "",
    keyActivities: "",
    keyResources: "",
    valuePropositions: "This is at least twenty characters long.",
    customerRelationships: "",
    channels: "Email and campus events",
    customerSegments: "University founders and early-stage builders with pains",
    costStructure: "",
    revenueStreams: "",
  },
  interviews: [],
  journal: [],
  versions: [],
  pivots: [],
  chatMessages: [],
  documents: [],
  evidenceLinks: {},
  contextNotes: [],
  iframeEmbeds: [],
  views: 0,
  appreciations: 0,
  commentCount: 0,
};

beforeEach(() => {
  useWorkspaceStore.setState({ currentWorkspace: { ...baseWorkspace } });
});

describe("WorkspaceSharePanel", () => {
  it("enables publish when checklist is satisfied and calls publish", async () => {
    const user = userEvent.setup();
    const publishSpy = vi.fn().mockResolvedValue({
      ...baseWorkspace,
      isPublic: true,
      slug: "shareable-slug",
      publishedAt: new Date().toISOString(),
    });
    useWorkspaceStore.setState({ publishWorkspace: publishSpy });

    render(<WorkspaceSharePanel />);

    const publish = await screen.findByRole("button", {
      name: /publish project/i,
    });
    expect(publish).toBeEnabled();
    await user.click(publish);

    expect(publishSpy).toHaveBeenCalledWith("ws-share");
  });
});
