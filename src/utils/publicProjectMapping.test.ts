import { describe, expect, it } from "vitest";

import { toPublicProjectFields } from "./publicProjectMapping";

import type { Workspace } from "@/types";

describe("toPublicProjectFields", () => {
  const baseWorkspace: Workspace = {
    id: "test-project-id",
    code: "BUF-TEST",
    projectName: "Test Project",
    description: "Desc",
    projectDescription: "Proj Desc",
    createdAt: new Date("2024-01-01").toISOString(),
    lastModified: new Date("2024-02-02").toISOString(),
    isPublic: true,
    views: 3,
    appreciations: 1,
    commentCount: 0,
    stage: "idea",
    category: "research",
    location: "buffalo",
    buffaloAffiliated: true,
    tags: ["tag1", "tag2"],
    teamMembers: [{ name: "A", role: "Founder" }],
    milestones: [{ date: "2024-03-03", title: "Start", description: "x" }],
    assets: { logo: "https://example.com/logo.png" },
    embeds: { demo: "https://example.com" },
    creator: "user-1",
    publicLink: "https://buffalo.example.com",
    // Private fields that must be excluded
    bmcData: {
      keyPartners: "",
      keyActivities: "",
      valuePropositions: "secret",
      customerRelationships: "",
      customerSegments: "",
      keyResources: "",
      channels: "",
      costStructure: "",
      revenueStreams: "",
    },
    interviews: [],
    journal: [],
    versions: [],
    pivots: [],
    chatMessages: [],
    documents: [
      {
        id: "1",
        name: "secret.pdf",
        type: "pdf",
        size: 2048,
        uploadedAt: new Date("2024-01-05").toISOString(),
      },
    ],
    contextNotes: [],
    iframeEmbeds: [],
  };

  it("includes only approved public fields", () => {
    const safe = toPublicProjectFields(baseWorkspace);

    // Allowed keys present
    expect(safe).toMatchObject({
      code: baseWorkspace.code,
      projectName: baseWorkspace.projectName,
      description: baseWorkspace.description,
      projectDescription: baseWorkspace.projectDescription,
      createdAt: baseWorkspace.createdAt,
      lastModified: baseWorkspace.lastModified,
      isPublic: true,
      views: 3,
      appreciations: 1,
      commentCount: 0,
      stage: "idea",
      category: "research",
      location: "buffalo",
      buffaloAffiliated: true,
      tags: ["tag1", "tag2"],
      teamMembers: [{ name: "A" }],
      milestones: [{ date: "2024-03-03", title: "Start", description: "x" }],
      assets: { logo: "https://example.com/logo.png" },
      embeds: { demo: "https://example.com" },
      creator: "user-1",
      publicLink: baseWorkspace.publicLink,
    });

    // Forbidden keys absent
    const forbidden = [
      "bmcData",
      "interviews",
      "journal",
      "versions",
      "pivots",
      "chatMessages",
      "documents",
      "contextNotes",
      "iframeEmbeds",
    ];
    for (const key of forbidden) {
      expect(Object.prototype.hasOwnProperty.call(safe, key)).toBe(false);
    }
  });

  it("handles description fallback correctly", () => {
    const safeA = toPublicProjectFields({
      ...baseWorkspace,
      description: "",
      projectDescription: "X",
    });
    expect(safeA).toHaveProperty("description", "X");

    const safeB = toPublicProjectFields({
      ...baseWorkspace,
      description: "Y",
      projectDescription: "",
    });
    expect(safeB).toHaveProperty("projectDescription", "Y");
  });
});
