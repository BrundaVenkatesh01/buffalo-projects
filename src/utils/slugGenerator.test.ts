import { describe, expect, it } from "vitest";

import { createSlug, withRandomSuffix } from "./slugGenerator";

describe("slugGenerator", () => {
  describe("createSlug", () => {
    it("generates kebab-case slug", () => {
      expect(createSlug("Buffalo Projects")).toBe("buffalo-projects");
    });

    it("strips diacritics and punctuation", () => {
      expect(createSlug("A/B Testing & Growth – 2025!")).toBe(
        "a-b-testing-growth-2025",
      );
    });

    it("falls back to random id when input empty", () => {
      expect(createSlug("")).toHaveLength(6);
    });

    it("limits slug length", () => {
      const longName = "a".repeat(100);
      expect(createSlug(longName)).toHaveLength(48);
    });
  });

  describe("withRandomSuffix", () => {
    it("appends random suffix when under length", () => {
      const slug = "buffalo-projects";
      const withSuffix = withRandomSuffix(slug);
      expect(withSuffix.startsWith("buffalo-projects-")).toBeTruthy();
      expect(withSuffix).toHaveLength(slug.length + 1 + 6);
    });

    it("trims slug when exceeding length cap", () => {
      const base = "a".repeat(60);
      const withSuffix = withRandomSuffix(base);
      expect(withSuffix.length).toBeLessThanOrEqual(48);
    });
  });
});
