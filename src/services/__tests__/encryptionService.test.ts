/**
 * Tests for Encryption Service
 */

import { describe, it, expect } from "vitest";

import {
  encrypt,
  decrypt,
  encryptWorkspace,
  decryptWorkspace,
  isEncryptedWorkspace,
  hashPassword,
  verifyPassword,
  generateKeyHint,
} from "../encryptionService";
import type { Workspace } from "@/types";

describe("encryptionService", () => {
  const testPassword = "test-password-123";

  describe("encrypt/decrypt", () => {
    it("should encrypt and decrypt a string", () => {
      const data = "Hello, World!";
      const encrypted = encrypt(data, testPassword);
      const decrypted = decrypt<string>(encrypted, testPassword);

      expect(decrypted).toBe(data);
    }, 15000);

    it("should encrypt and decrypt an object", () => {
      const data = { name: "Test", value: 42, nested: { key: "value" } };
      const encrypted = encrypt(data, testPassword);
      const decrypted = decrypt<typeof data>(encrypted, testPassword);

      expect(decrypted).toEqual(data);
    }, 15000);

    it("should encrypt and decrypt an array", () => {
      const data = [1, 2, 3, "test", { key: "value" }];
      const encrypted = encrypt(data, testPassword);
      const decrypted = decrypt<typeof data>(encrypted, testPassword);

      expect(decrypted).toEqual(data);
    });

    it("should produce different ciphertext for same data (random IV/salt)", () => {
      const data = "Same data";
      const encrypted1 = encrypt(data, testPassword);
      const encrypted2 = encrypt(data, testPassword);

      expect(encrypted1.ciphertext).not.toBe(encrypted2.ciphertext);
      expect(encrypted1.salt).not.toBe(encrypted2.salt);
      expect(encrypted1.iv).not.toBe(encrypted2.iv);
    });

    it("should fail decryption with wrong password", () => {
      const data = "Secret data";
      const encrypted = encrypt(data, testPassword);

      expect(() => decrypt(encrypted, "wrong-password")).toThrow(
        "Decryption failed",
      );
    });

    it("should include correct metadata in envelope", () => {
      const data = "Test";
      const encrypted = encrypt(data, testPassword);

      expect(encrypted.algorithm).toBe("AES-256-CBC");
      expect(encrypted.kdf).toBe("PBKDF2");
      expect(encrypted.iterations).toBe(100000);
      expect(encrypted.version).toBe(1);
    });
  });

  describe("encryptWorkspace/decryptWorkspace", () => {
    const mockWorkspace: Workspace = {
      id: "workspace-123",
      code: "BUF-1234",
      projectName: "Test Project",
      projectDescription: "A test project description",
      description: "A test project description",
      ownerId: "user-123",
      isPublic: false,
      createdAt: "2024-01-01T00:00:00.000Z",
      lastModified: "2024-01-02T00:00:00.000Z",
      bmcData: {
        keyPartners: "Partner 1",
        keyActivities: "Activity 1",
        valuePropositions: "Value 1",
        customerRelationships: "Relationship 1",
        customerSegments: "Segment 1",
        keyResources: "Resource 1",
        channels: "Channel 1",
        costStructure: "Cost 1",
        revenueStreams: "Revenue 1",
      },
      versions: [],
      journal: [{ id: "j1", timestamp: "2024-01-01", content: "Entry 1" }],
      chatMessages: [],
      documents: [],
      contextNotes: [],
      pivots: [],
      stage: "building",
      category: "startup",
      tags: ["tech", "saas"],
      location: "buffalo",
      gives: ["mentoring"],
      asks: ["funding"],
    };

    it("should encrypt and decrypt a workspace", () => {
      const encrypted = encryptWorkspace(mockWorkspace, testPassword);
      const decrypted = decryptWorkspace(encrypted, testPassword);

      expect(decrypted.code).toBe(mockWorkspace.code);
      expect(decrypted.projectName).toBe(mockWorkspace.projectName);
      expect(decrypted.description).toBe(mockWorkspace.description);
      expect(decrypted.bmcData).toEqual(mockWorkspace.bmcData);
      expect(decrypted.journal).toEqual(mockWorkspace.journal);
      expect(decrypted.gives).toEqual(mockWorkspace.gives);
      expect(decrypted.asks).toEqual(mockWorkspace.asks);
    });

    it("should preserve non-sensitive metadata", () => {
      const encrypted = encryptWorkspace(mockWorkspace, testPassword);

      expect(encrypted.code).toBe(mockWorkspace.code);
      expect(encrypted.projectName).toBe(mockWorkspace.projectName);
      expect(encrypted.isPublic).toBe(mockWorkspace.isPublic);
      expect(encrypted.stage).toBe(mockWorkspace.stage);
      expect(encrypted.category).toBe(mockWorkspace.category);
      expect(encrypted.tags).toEqual(mockWorkspace.tags);
      expect(encrypted.location).toEqual(mockWorkspace.location);
    });

    it("should set isEncrypted flag", () => {
      const encrypted = encryptWorkspace(mockWorkspace, testPassword);

      expect(encrypted.isEncrypted).toBe(true);
      expect(isEncryptedWorkspace(encrypted)).toBe(true);
    });

    it("should not expose sensitive data in encrypted workspace", () => {
      const encrypted = encryptWorkspace(mockWorkspace, testPassword);
      const stringified = JSON.stringify(encrypted);

      expect(stringified).not.toContain("Partner 1");
      expect(stringified).not.toContain("A test project description");
      expect(stringified).not.toContain("Entry 1");
    });

    it("should fail decryption with wrong password", () => {
      const encrypted = encryptWorkspace(mockWorkspace, testPassword);

      expect(() => decryptWorkspace(encrypted, "wrong-password")).toThrow(
        "Decryption failed",
      );
    });
  });

  describe("isEncryptedWorkspace", () => {
    it("should return true for encrypted workspace", () => {
      const encrypted = encryptWorkspace(
        {
          id: "test-id",
          code: "BUF-1234",
          projectName: "Test",
          projectDescription: "",
          description: "",
          ownerId: "",
          isPublic: false,
          createdAt: "",
          lastModified: "",
          bmcData: {
            keyPartners: "",
            keyActivities: "",
            valuePropositions: "",
            customerRelationships: "",
            customerSegments: "",
            keyResources: "",
            channels: "",
            costStructure: "",
            revenueStreams: "",
          },
          versions: [],
          journal: [],
          chatMessages: [],
          documents: [],
          contextNotes: [],
          pivots: [],
        },
        testPassword,
      );

      expect(isEncryptedWorkspace(encrypted)).toBe(true);
    });

    it("should return false for regular workspace", () => {
      const workspace = {
        code: "BUF-1234",
        projectName: "Test",
        isPublic: false,
      };

      expect(isEncryptedWorkspace(workspace)).toBe(false);
    });

    it("should return false for null/undefined", () => {
      expect(isEncryptedWorkspace(null)).toBe(false);
      expect(isEncryptedWorkspace(undefined)).toBe(false);
    });
  });

  describe("hashPassword/verifyPassword", () => {
    it("should hash and verify a password", () => {
      const password = "my-secret-password";
      const hash = hashPassword(password);

      expect(verifyPassword(password, hash)).toBe(true);
    });

    it("should fail verification with wrong password", () => {
      const hash = hashPassword("correct-password");

      expect(verifyPassword("wrong-password", hash)).toBe(false);
    });

    it("should produce different hashes for same password (random salt)", () => {
      const password = "same-password";
      const hash1 = hashPassword(password);
      const hash2 = hashPassword(password);

      expect(hash1).not.toBe(hash2);
      expect(verifyPassword(password, hash1)).toBe(true);
      expect(verifyPassword(password, hash2)).toBe(true);
    });

    it("should use provided salt", () => {
      const password = "test";
      const salt = "fixed-salt";
      const hash1 = hashPassword(password, salt);
      const hash2 = hashPassword(password, salt);

      expect(hash1).toBe(hash2);
    });
  });

  describe("generateKeyHint", () => {
    it("should generate consistent hints for same password", () => {
      const hint1 = generateKeyHint("password");
      const hint2 = generateKeyHint("password");

      expect(hint1).toBe(hint2);
    });

    it("should generate different hints for different passwords", () => {
      const hint1 = generateKeyHint("password1");
      const hint2 = generateKeyHint("password2");

      expect(hint1).not.toBe(hint2);
    });

    it("should return 8 characters", () => {
      const hint = generateKeyHint("any-password");

      expect(hint).toHaveLength(8);
    });
  });
});
