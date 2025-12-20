import { beforeEach, describe, expect, it } from "vitest";
import { useWorkspaceStore } from "../workspaceStore";

const create = async () => {
  return await useWorkspaceStore
    .getState()
    .createWorkspace({ projectName: "Trim Test" });
};

beforeEach(async () => {
  localStorage.clear();
  useWorkspaceStore.setState({
    currentWorkspace: null,
    workspaces: [],
    loading: false,
    error: null,
  });
});

describe("workspaceStore snapshot trimming", () => {
  it("keeps only last 50 versions", async () => {
    await create();
    for (let i = 0; i < 55; i++) {
      // Update a field to ensure lastModified changes
      const ws = useWorkspaceStore.getState().currentWorkspace!;
      useWorkspaceStore.getState().updateWorkspace({
        bmcData: { ...ws.bmcData, valuePropositions: `v${i}` },
      });
      // Create snapshot
      await useWorkspaceStore.getState().saveAndCreateSnapshot(`snapshot ${i}`);
    }

    const versions = useWorkspaceStore.getState().currentWorkspace!.versions;
    expect(versions.length).toBe(50);
  });
});
