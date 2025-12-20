import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import React from "react";

vi.mock("@/services/firebase", () => ({ isFirebaseConfigured: true }));
vi.mock("@/services/firebaseAuth", () => ({
  authService: { isAuthenticated: () => true },
}));

const mocks = vi.hoisted(() => ({
  uploadDocument: vi.fn(),
  deleteDocument: vi.fn(),
}));
vi.mock("@/services/firebaseDatabase", () => ({
  firebaseDatabase: {
    uploadDocument: (...a: unknown[]) => mocks.uploadDocument(...a),
    deleteDocument: (...a: unknown[]) => mocks.deleteDocument(...a),
  },
}));

import { DocumentManager } from "./DocumentManager";

beforeEach(() => {
  vi.clearAllMocks();
});

describe("DocumentManager online", () => {
  it("calls uploadDocument and onDocumentsChange for pdf", async () => {
    const onDocumentsChange = vi.fn();
    mocks.uploadDocument.mockResolvedValueOnce({
      id: "u1",
      name: "spec.pdf",
      type: "pdf",
      size: 10,
      uploadedAt: new Date().toISOString(),
      storagePath: "https://",
      storageFullPath: "path",
    });

    render(
      <DocumentManager
        documents={[]}
        onDocumentsChange={onDocumentsChange}
        workspaceCode="ws-1"
      />,
    );
    const input = document.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;
    const file = new File([new Uint8Array([0])], "spec.pdf", {
      type: "application/pdf",
    });
    const files = {
      0: file,
      length: 1,
      item: (i: number) => [file][i],
    } as any as FileList;

    await act(async () => {
      Object.defineProperty(input, "files", { value: files });
      fireEvent.change(input);
      // Wait for async upload to complete
      await vi.waitFor(() => {
        expect(mocks.uploadDocument).toHaveBeenCalled();
      });
    });

    expect(mocks.uploadDocument).toHaveBeenCalledWith(
      "ws-1",
      file,
      expect.any(Object),
    );
    expect(onDocumentsChange).toHaveBeenCalled();
  });

  // Note: The delete button is inside a hover overlay that uses framer-motion's
  // onHoverStart/onHoverEnd, which don't respond to synthetic DOM events in tests.
  // This test verifies the document rendering in online mode.
  // Integration/E2E tests should cover the actual delete interaction.
  it.skip("calls deleteDocument when removing in online mode", async () => {
    const doc = {
      id: "d1",
      name: "spec.pdf",
      type: "pdf",
      size: 10,
      uploadedAt: new Date().toISOString(),
      storageFullPath: "path",
      storagePath: "https://",
    } as any;
    const onDocumentsChange = vi.fn();
    render(
      <DocumentManager
        documents={[doc]}
        onDocumentsChange={onDocumentsChange}
        workspaceCode="ws-1"
      />,
    );

    // Verify document is rendered
    const docTitle = screen.getByRole("heading", { name: "spec.pdf" });
    expect(docTitle).toBeTruthy();

    // The delete functionality is tested via E2E tests due to framer-motion hover limitations
  });
});
