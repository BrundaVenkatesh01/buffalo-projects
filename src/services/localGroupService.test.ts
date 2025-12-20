import { beforeEach, describe, expect, it } from "vitest";

import { localGroupService } from "./localGroupService";

describe("localGroupService", () => {
  beforeEach(() => {
    localGroupService.clearAll();
  });

  it("creates a group with unique code", () => {
    const group = localGroupService.createGroup({
      name: "Test Cohort",
      ownerId: "owner-123",
    });

    expect(group.name).toBe("Test Cohort");
    expect(group.code.startsWith("BUF-GRP-")).toBe(true);

    const groups = localGroupService.getGroups();
    expect(groups).toHaveLength(1);
    expect(groups[0]!.code).toBe(group.code);
  });

  it("adds members and keeps latest activity date", () => {
    const group = localGroupService.createGroup({ name: "Studio Group" });
    const joinedAt = new Date().toISOString();

    const updated = localGroupService.addMember(group.code, {
      workspaceCode: "BUF-0001",
      projectName: "Buffalo Marketplaces",
      joinedAt,
      lastActivity: joinedAt,
      status: "active",
    });

    expect(updated?.members).toHaveLength(1);
    expect(updated?.members[0]?.projectName).toBe("Buffalo Marketplaces");

    const next = localGroupService.addMember(group.code, {
      workspaceCode: "BUF-0001",
      projectName: "Buffalo Marketplaces",
      joinedAt,
      lastActivity: new Date(Date.now() + 1000).toISOString(),
      status: "active",
    });

    expect(next?.members[0]?.lastActivity).not.toBe(joinedAt);
  });
});
