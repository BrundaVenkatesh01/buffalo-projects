import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  getEmailConfig: vi.fn(),
  isEmailConfigured: vi.fn(),
  getSiteUrl: vi.fn(() => "https://example.com"),
  logger: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
  } as const,
  getDoc: vi.fn(),
  doc: vi.fn((_db: unknown, path: string, id: string) => ({
    path: `${path}/${id}`,
  })),
}));

vi.mock("@/utils/env", () => ({
  getEmailConfig: () => mocks.getEmailConfig(),
  isEmailConfigured: () => mocks.isEmailConfigured(),
  getSiteUrl: () => mocks.getSiteUrl(),
}));
vi.mock("@/utils/logger", () => ({ logger: mocks.logger }));

vi.mock("firebase/firestore", () => ({ getDoc: mocks.getDoc, doc: mocks.doc }));
vi.mock("@/services/firebase", () => ({ db: {} }));

import { emailService } from "../emailService";

beforeEach(() => {
  vi.clearAllMocks();
});

describe("emailService.sendCommentNotification", () => {
  const payload = {
    recipientId: "u1",
    type: "comment" as const,
    actorName: "Mentor",
    commentPreview: "Nice progress!",
    projectId: "ws-1",
    projectSlug: "proj",
    projectName: "Proj",
  };

  it("returns false when email not configured", async () => {
    mocks.isEmailConfigured.mockReturnValue(false);
    const res = await emailService.sendCommentNotification(payload);
    expect(res).toBe(false);
    expect(mocks.logger.info).toHaveBeenCalled();
  });

  it("returns false when recipient profile missing or opts out", async () => {
    mocks.isEmailConfigured.mockReturnValue(true);
    mocks.getDoc.mockResolvedValueOnce({ exists: () => false });
    let res = await emailService.sendCommentNotification(payload);
    expect(res).toBe(false);

    // Now exists but opts out
    mocks.getDoc.mockResolvedValueOnce({
      exists: () => true,
      data: () => ({ email: "x@x.com", emailNotifications: false }),
    });
    res = await emailService.sendCommentNotification(payload);
    expect(res).toBe(false);
  });

  it("sends via Resend when configured", async () => {
    mocks.isEmailConfigured.mockReturnValue(true);
    mocks.getDoc.mockResolvedValueOnce({
      exists: () => true,
      data: () => ({
        email: "x@x.com",
        emailNotifications: true,
        displayName: "Builder",
      }),
    });
    mocks.getEmailConfig.mockReturnValue({
      provider: "resend",
      apiKey: "resend_key",
      fromEmail: "noreply@buffalo.com",
      fromName: "Buffalo Projects",
    });

    const fetchSpy = vi
      .spyOn(global, "fetch" as any)
      .mockResolvedValue({ ok: true, text: async () => "ok" } as any);
    const res = await emailService.sendCommentNotification(payload);
    expect(res).toBe(true);
    expect(fetchSpy).toHaveBeenCalled();
  });
});
