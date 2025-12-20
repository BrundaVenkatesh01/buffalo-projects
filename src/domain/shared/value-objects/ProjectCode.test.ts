import { describe, it, expect } from "vitest";

import { ProjectCode } from "./ProjectCode";

describe("ProjectCode Value Object", () => {
  describe("creation", () => {
    it("should create a valid BUF-XXXX code", () => {
      const code = ProjectCode.generate();

      expect(code.value).toMatch(/^BUF-[A-Z0-9]{4}$/);
      expect(code.toString()).toMatch(/^BUF-[A-Z0-9]{4}$/);
    });

    it("should create from existing valid code", () => {
      const code = ProjectCode.fromString("BUF-TEST");

      expect(code.value).toBe("BUF-TEST");
    });

    it("should throw error for invalid format", () => {
      expect(() => ProjectCode.fromString("INVALID")).toThrow(
        "Invalid project code format",
      );
      expect(() => ProjectCode.fromString("BUF-")).toThrow(
        "Invalid project code format",
      );
      expect(() => ProjectCode.fromString("")).toThrow(
        "Invalid project code format",
      );
    });
  });

  describe("equality", () => {
    it("should be equal when codes match", () => {
      const code1 = ProjectCode.fromString("BUF-TEST");
      const code2 = ProjectCode.fromString("BUF-TEST");

      expect(code1.equals(code2)).toBe(true);
    });

    it("should not be equal when codes differ", () => {
      const code1 = ProjectCode.fromString("BUF-AAA1");
      const code2 = ProjectCode.fromString("BUF-BBB2");

      expect(code1.equals(code2)).toBe(false);
    });
  });

  describe("validation", () => {
    it("should validate BUF prefix", () => {
      expect(() => ProjectCode.fromString("TEST-1234")).toThrow();
    });

    it("should require minimum length", () => {
      expect(() => ProjectCode.fromString("BUF-A")).toThrow();
    });
  });
});
