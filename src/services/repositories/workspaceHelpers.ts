/**
 * Workspace Repository Helpers
 *
 * Shared utility functions used across workspace repositories.
 * Extracted from firebaseDatabase.ts for reusability.
 */

import { Timestamp } from "firebase/firestore";

import type { FirebaseWorkspace } from "./WorkspaceTypes";

import { auth } from "@/services/firebase";
import type { Workspace, ProjectDocumentKind } from "@/types";


/**
 * Check if current user has access to a workspace
 *
 * Access is granted if:
 * - User owns the workspace
 * - Workspace is public
 * - User is a collaborator
 * - No user is logged in but workspace is public
 */
export function hasWorkspaceAccess(workspace: FirebaseWorkspace): boolean {
  const authInstance = auth;
  const currentUserId = authInstance?.currentUser?.uid;

  if (!currentUserId) {
    return workspace.isPublic || false;
  }

  return Boolean(
    workspace.ownerId === currentUserId ||
      workspace.isPublic ||
      (workspace.collaborators &&
        workspace.collaborators.includes(currentUserId)),
  );
}

/**
 * Clean data for Firebase by removing undefined values recursively
 *
 * Firebase Firestore doesn't accept undefined values, so we need to remove them
 * before saving. This function recursively cleans objects and arrays.
 */
export function cleanDataForFirebase<T>(obj: T): T {
  if (obj === undefined || obj === null) {
    return obj;
  }

  if (typeof obj !== "object") {
    return obj;
  }

  if (obj instanceof Date || obj instanceof Timestamp) {
    return obj;
  }

  if (Array.isArray(obj)) {
    const cleanedArray = obj
      .map((item) => cleanDataForFirebase(item) as unknown)
      .filter(
        (item): item is Exclude<typeof item, undefined> => item !== undefined,
      );
    // The generic preserves the original array shape; casting is safe here after runtime filtering

    return cleanedArray as unknown as T;
  }

  const cleanedObject = Object.entries(obj as Record<string, unknown>).reduce<
    Record<string, unknown>
  >((acc, [key, value]) => {
    if (value !== undefined) {
      acc[key] = cleanDataForFirebase(value);
    }
    return acc;
  }, {});

  return cleanedObject as unknown as T;
}

/**
 * Convert Firebase workspace with Timestamps to app workspace with ISO strings
 *
 * Firestore stores dates as Timestamp objects, but our app uses ISO strings.
 * This function converts between the two formats.
 */
export function convertFirebaseWorkspace(
  firebaseWorkspace: FirebaseWorkspace,
): Workspace {
  const cloned: Workspace = {
    ...firebaseWorkspace,
    createdAt: firebaseWorkspace.createdAt.toDate().toISOString(),
    lastModified: firebaseWorkspace.lastModified.toDate().toISOString(),
  } as unknown as Workspace;

  const publishedAtValue = (
    firebaseWorkspace as unknown as {
      publishedAt?: Timestamp | number | string | null;
    }
  ).publishedAt;
  if (publishedAtValue instanceof Timestamp) {
    cloned.publishedAt = publishedAtValue.toMillis();
  } else if (typeof publishedAtValue === "number") {
    cloned.publishedAt = publishedAtValue;
  } else if (typeof publishedAtValue === "string") {
    cloned.publishedAt = new Date(publishedAtValue).getTime();
  } else {
    delete (cloned as Partial<Workspace>).publishedAt;
  }

  return cloned;
}

/**
 * Determine file type from filename and MIME type
 *
 * Used for document uploads to categorize files properly.
 */
export function getFileType(
  filename: string,
  mimeType?: string,
): ProjectDocumentKind {
  const normalizedMime = mimeType?.toLowerCase();
  if (normalizedMime) {
    if (normalizedMime.startsWith("image/")) {
      return "image";
    }
    if (normalizedMime.startsWith("video/")) {
      return "video";
    }
    if (normalizedMime === "application/pdf") {
      return "pdf";
    }
  }

  const extension = filename.split(".").pop()?.toLowerCase();
  switch (extension) {
    case "pdf":
      return "pdf";
    case "jpg":
    case "jpeg":
    case "png":
    case "gif":
    case "webp":
      return "image";
    case "mp4":
    case "webm":
      return "video";
    case "md":
      return "md";
    case "doc":
    case "docx":
      return "doc";
    case "txt":
      return "txt";
    default:
      return "txt";
  }
}
