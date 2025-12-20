import { logger } from "../utils/logger";

import { isFirebaseConfigured } from "./firebase";
import { authService } from "./firebaseAuth";
import { firebaseDatabase } from "./firebaseDatabase";
import { localWorkspaceService } from "./localWorkspaceService";

/**
 * Flushes any locally-created/updated workspaces to Firestore once the user is authenticated.
 * Non-blocking and resilient: logs errors and continues.
 */
export async function flushPendingWorkspaceSync(): Promise<void> {
  try {
    if (!isFirebaseConfigured || !authService.isAuthenticated()) {
      return;
    }

    const codes = localWorkspaceService.getPendingSyncCodes();
    if (!codes || codes.length === 0) {
      return;
    }

    for (const code of codes) {
      try {
        const ws = localWorkspaceService.getWorkspace(code);
        if (!ws) {
          // No local state; clear pending flag and continue
          localWorkspaceService.clearPendingSync(code);
          continue;
        }

        // Ensure an ownerId will be set by saveWorkspace in firebaseDatabase
        await firebaseDatabase.saveWorkspace(ws);
        // Clear from queue after successful push
        localWorkspaceService.clearPendingSync(code);
      } catch (error) {
        logger.error("Background sync failed for workspace", { code, error });
        // Keep in queue to retry later
      }
    }
  } catch (error) {
    logger.error("Background workspace sync failed", error);
  }
}
