import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const unsetGeminiKey = () => {
  delete process.env["NEXT_PUBLIC_GEMINI_API_KEY"];
  delete (process.env as Record<string, string | undefined>)[
    "VITE_GEMINI_API_KEY"
  ];
};

describe("GeminiService", () => {
  beforeEach(() => {
    vi.resetModules();
    unsetGeminiKey();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    unsetGeminiKey();
  });

  it("returns an intelligent fallback response when no API key is configured", async () => {
    const { GeminiService } = await import("../geminiService");

    const prompt =
      "Help me improve my value proposition for a new product launch.";
    const response = await GeminiService.generateContent(prompt, false);

    expect(response.text).toContain("value");
    expect(response.suggestions).toContain(
      "Quantify the value - use specific numbers, time saved, or costs reduced",
    );
    expect(response.insights).toBe(
      "The best value propositions focus on outcomes, not features.",
    );
    expect(response.confidence).toBeCloseTo(0.7);
  });

  it("caches responses for identical prompts", async () => {
    const { GeminiService } = await import("../geminiService");

    const prompt = "Share MVP launch advice.";
    const first = await GeminiService.generateContent(prompt);
    const second = await GeminiService.generateContent(prompt);

    // Test deep equality since cache may return a copy of the cached value
    expect(second).toStrictEqual(first);
  });

  it("passes rich project context to Gemini prompts when requesting BMC suggestions", async () => {
    const { GeminiService } = await import("../geminiService");
    const mockResponse = {
      text: "ok",
      suggestions: [],
      insights: "insight",
      confidence: 1,
    };

    const spy = vi
      .spyOn(GeminiService, "generateContent")
      .mockResolvedValue(mockResponse);

    const context = { projectName: "Solar Sense", description: "Energy AI" };
    await GeminiService.getBMCSuggestions(
      "Channels",
      "Direct partners",
      { valuePropositions: "Predictive energy insights" },
      context,
    );

    expect(spy).toHaveBeenCalledTimes(1);
    const [prompt] = spy.mock.calls[0]!;

    expect(prompt).toContain("Channels");
    expect(prompt).toContain("Predictive energy insights");
    expect(prompt).toContain("Solar Sense");
    expect(prompt).toContain("Key insight");
  });

  it("builds interview questions prompt with context", async () => {
    const { GeminiService } = await import("../geminiService");
    const mockResponse = { text: "ok" } as any;
    const spy = vi
      .spyOn(GeminiService as any, "generateContent")
      .mockResolvedValue(mockResponse);

    await GeminiService.getInterviewQuestions("early adopters", {
      projectName: "Hydrogen Bikes",
      description: "Lightweight mobility",
    });

    expect(spy).toHaveBeenCalled();
    const [prompt] = spy.mock.calls[0]!;
    expect(prompt).toContain("early adopters");
    expect(prompt).toContain("Hydrogen Bikes");
  });

  it("builds MVP suggestions prompt with optional value proposition", async () => {
    const { GeminiService } = await import("../geminiService");
    const mockResponse = { text: "ok" } as any;
    const spy = vi
      .spyOn(GeminiService as any, "generateContent")
      .mockResolvedValue(mockResponse);

    await GeminiService.getMVPSuggestions("web app", {
      projectName: "Campus Connect",
      description: "Match mentors and students",
      bmcData: { valuePropositions: "Mentor matching" },
    });

    const [prompt] = spy.mock.calls[0]!;
    expect(prompt).toContain("web app");
    expect(prompt).toContain("Campus Connect");
    expect(prompt).toContain("Mentor matching");
  });
});
