/**
 * Domain Layer Public API
 * Export all domain entities, value objects, services, and interfaces
 */

// Shared Value Objects
export { ProjectCode } from "./shared/value-objects/ProjectCode";

// Workspace Bounded Context
export { Workspace } from "./workspace/entities/Workspace";
export { WorkspaceService } from "./workspace/services/WorkspaceService";
export type { IWorkspaceRepository } from "./workspace/repositories/IWorkspaceRepository";
