import { describe, expect, it } from "vitest";

import {
  PublishGate,
  Ranking,
  type Evidence,
  type RankingSignals,
} from "./types";

describe("PublishGate", () => {
  const evidence: Evidence[] = [
    {
      id: "evi-1",
      projectId: "proj-1",
      kind: "image",
      src: "https://example.com/demo.png",
      createdAt: new Date().toISOString(),
      featured: true,
    },
  ];

  it("marks gate as pass when one-liner, ask, and featured evidence exist", () => {
    const status = PublishGate.evaluate(
      {
        oneLiner: "Build smarter project pages.",
        asks: ["Pilot partners"],
        featuredEvidenceId: "evi-1",
      },
      evidence,
    );

    expect(status.canPublish).toBe(true);
    expect(status.missing).toEqual([]);
  });

  it("collects missing requirements when gate is incomplete", () => {
    const status = PublishGate.evaluate(
      {
        oneLiner: "",
        asks: [],
        featuredEvidenceId: "fake",
      },
      evidence,
    );

    expect(status.canPublish).toBe(false);
    expect(status.missing).toContain("oneLiner");
    expect(status.missing).toContain("ask");
    expect(status.missing).toContain("featuredEvidence");
  });
});

describe("Ranking", () => {
  const baseSignals: RankingSignals = {
    daysSinceUpdate: 3,
    hasFeaturedDemo: true,
    proofSignal: 2,
    mentorNotesCount: 1,
    recentUpdateCount30d: 2,
    stalenessPenalty: 0,
  };

  it("applies default weights to compute rankings", () => {
    const score = Ranking.score(baseSignals);
    expect(score).toBeGreaterThan(0);
  });

  it("allows weight overrides for experimentation", () => {
    const boosted = Ranking.score(baseSignals, { proofSignal: 50 });
    const baseline = Ranking.score(baseSignals);
    expect(boosted).toBeGreaterThan(baseline);
  });
});
