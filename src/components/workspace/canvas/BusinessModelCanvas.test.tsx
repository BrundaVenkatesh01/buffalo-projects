import { describe, expect, it, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import BusinessModelCanvas from "./BusinessModelCanvas";
import { useWorkspaceStore } from "@/stores/workspaceStore";
import type { Workspace } from "@/types";

const makeWorkspace = (overrides: Partial<Workspace> = {}): Workspace => ({
  id: "test-workspace-id",
  code: "ws-test",
  projectName: "Test WS",
  description: "",
  projectDescription: "",
  createdAt: new Date().toISOString(),
  lastModified: new Date().toISOString(),
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
  ...overrides,
});

beforeEach(() => {
  useWorkspaceStore.setState({ currentWorkspace: makeWorkspace() });
});

describe("BusinessModelCanvas", () => {
  it("updates store when editing a canvas field", async () => {
    render(<BusinessModelCanvas />);
    const user = userEvent.setup();

    // Find the Value Propositions block via its unique ID-based heading
    // The h3 has id="valuePropositions-title"
    const sectionHeading = document.getElementById("valuePropositions-title");
    expect(sectionHeading).toBeTruthy();

    // Click the block to open the dialog
    const block = sectionHeading!.closest("[role='button']");
    expect(block).toBeTruthy();
    await user.click(block as HTMLElement);

    // Wait for dialog to open and find the textarea
    const textarea = await screen.findByRole("textbox");
    expect(textarea).toBeTruthy();

    await user.clear(textarea);
    await user.type(textarea, "Clear value promise");

    const updated = useWorkspaceStore.getState().currentWorkspace!;
    expect(updated.bmcData.valuePropositions).toBe("Clear value promise");
  });
});
