import type { ProjectCode } from "../../shared/value-objects/ProjectCode";
import type { Workspace } from "../entities/Workspace";

/**
 * Workspace Repository Interface
 * Defines the contract for workspace persistence
 * Implementation lives in infrastructure layer
 */
export interface IWorkspaceRepository {
  /**
   * Find workspace by code
   */
  findByCode(code: ProjectCode): Promise<Workspace | null>;

  /**
   * Save workspace (create or update)
   */
  save(workspace: Workspace): Promise<void>;

  /**
   * Delete workspace
   */
  delete(code: ProjectCode): Promise<void>;

  /**
   * Find all workspaces for current user
   */
  findAllByUser(): Promise<Workspace[]>;

  /**
   * Find public workspaces
   */
  findPublic(limit?: number): Promise<Workspace[]>;

  /**
   * Find workspaces by class code
   */
  findByClassCode(classCode: string): Promise<Workspace[]>;

  /**
   * Check if workspace exists
   */
  exists(code: ProjectCode): Promise<boolean>;
}
