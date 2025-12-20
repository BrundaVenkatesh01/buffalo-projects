import { describe, it, expect } from "vitest";

import { ProjectCode, Workspace, WorkspaceService } from "@/domain";

describe("Domain public API", () => {
  it("exposes value objects and entities", () => {
    const code = ProjectCode.generate();
    expect(code.value.startsWith("BUF-")).toBe(true);

    const ws = Workspace.create({
      code,
      projectName: "Test Project",
      description: "Domain API smoke test",
    });

    const dto = ws.toDTO();
    expect(dto.code).toBe(code.value);
    expect(dto.projectName).toBe("Test Project");
    expect(dto.description).toBe("Domain API smoke test");
  });

  it("provides WorkspaceService constructor", () => {
    // The service requires a repository via constructor; just verify the class is constructible in type terms.
    // We won’t execute any logic here to keep this a lightweight smoke test.
    expect(typeof WorkspaceService).toBe("function");
  });
});
