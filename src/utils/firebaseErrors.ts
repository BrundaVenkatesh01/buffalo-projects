import type { FirebaseError } from "firebase/app";

const OFFLINE_ERROR_CODES = new Set([
  "unavailable",
  "failed-precondition",
  "network-request-failed",
]);

function isNavigatorOffline() {
  return typeof navigator !== "undefined" && navigator.onLine === false;
}

function extractMessage(error: unknown): string {
  if (typeof error === "string") {
    return error;
  }

  if (error instanceof Error && typeof error.message === "string") {
    return error.message;
  }

  return "";
}

function isFirebaseError(value: unknown): value is FirebaseError {
  return (
    typeof value === "object" &&
    value !== null &&
    "code" in value &&
    typeof (value as FirebaseError).code === "string"
  );
}

/**
 * Detect whether a Firestore/Firebase error is caused by the client being offline.
 * Used to downgrade expected offline noise from console errors to warnings.
 */
export function isOfflineFirebaseError(error: unknown): boolean {
  if (isNavigatorOffline()) {
    return true;
  }

  if (isFirebaseError(error) && OFFLINE_ERROR_CODES.has(error.code)) {
    return true;
  }

  const message = extractMessage(error).toLowerCase();
  return message.includes("offline") || message.includes("unavailable");
}
