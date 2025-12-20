/**
 * Workspace Code Repository
 *
 * Handles generation and uniqueness validation of workspace codes (BUF-XXXX format).
 * This repository has no dependencies on other repositories.
 */

import { doc, getDoc } from "firebase/firestore";

import { db } from "@/services/firebase";
import { logger } from "@/utils/logger";

export class WorkspaceCodeRepository {
  private static instance: WorkspaceCodeRepository;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  static getInstance(): WorkspaceCodeRepository {
    if (!WorkspaceCodeRepository.instance) {
      WorkspaceCodeRepository.instance = new WorkspaceCodeRepository();
    }
    return WorkspaceCodeRepository.instance;
  }

  /**
   * Generate a random workspace code in BUF-XXXX format
   * Does not check for uniqueness - use generateUniqueWorkspaceCode() for that
   */
  generateWorkspaceCode(): string {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "BUF-";
    for (let i = 0; i < 4; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  /**
   * Check if a workspace code exists in Firestore
   * @returns true if code is unique (doesn't exist), false if it exists
   */
  async isWorkspaceCodeUnique(code: string): Promise<boolean> {
    try {
      const firestore = db;
      if (!firestore) {
        logger.warn(
          "Firestore not initialized; treating workspace code as unique",
        );
        return true;
      }

      const workspaceDoc = await getDoc(doc(firestore, "workspaces", code));
      return !workspaceDoc.exists();
    } catch (error) {
      logger.error("Error checking workspace code uniqueness:", error);
      return false;
    }
  }

  /**
   * Generate a unique workspace code with retry logic
   * Tries up to 10 times to generate a unique code
   * @throws Error if unable to generate unique code after 10 attempts
   */
  async generateUniqueWorkspaceCode(): Promise<string> {
    let code = this.generateWorkspaceCode();
    let attempts = 0;

    while (!(await this.isWorkspaceCodeUnique(code)) && attempts < 10) {
      code = this.generateWorkspaceCode();
      attempts++;
    }

    if (attempts >= 10) {
      throw new Error("Unable to generate unique workspace code");
    }

    return code;
  }
}

// Export singleton instance
export const workspaceCodeRepository = WorkspaceCodeRepository.getInstance();
