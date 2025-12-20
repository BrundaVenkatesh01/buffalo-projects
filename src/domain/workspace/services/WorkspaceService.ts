import type { CanvasState } from "../../../types";
import { ProjectCode } from "../../shared/value-objects/ProjectCode";
import { Workspace } from "../entities/Workspace";
import type { IWorkspaceRepository } from "../repositories/IWorkspaceRepository";

interface CreateWorkspaceDTO {
  projectName: string;
  description: string;
  classCode?: string;
}

/**
 * Workspace Domain Service
 * Contains business logic that doesn't naturally belong to an entity
 */
export class WorkspaceService {
  constructor(private readonly repository: IWorkspaceRepository) {}

  async createWorkspace(data: CreateWorkspaceDTO): Promise<Workspace> {
    const code = ProjectCode.generate();

    const workspace = Workspace.create({
      code,
      projectName: data.projectName,
      description: data.description,
      ...(data.classCode ? { classCode: data.classCode } : {}),
    });

    await this.repository.save(workspace);

    return workspace;
  }

  async getWorkspace(code: ProjectCode): Promise<Workspace | null> {
    return this.repository.findByCode(code);
  }

  async updateWorkspace(
    code: ProjectCode,
    updates: Partial<CanvasState>,
    createVersion: boolean = false,
  ): Promise<Workspace> {
    const workspace = await this.repository.findByCode(code);

    if (!workspace) {
      throw new Error(`Workspace not found: ${code.value}`);
    }

    workspace.updateCanvas(updates, createVersion);

    await this.repository.save(workspace);

    return workspace;
  }

  async deleteWorkspace(code: ProjectCode): Promise<void> {
    await this.repository.delete(code);
  }

  async getUserWorkspaces(): Promise<Workspace[]> {
    return this.repository.findAllByUser();
  }

  async getPublicWorkspaces(limit?: number): Promise<Workspace[]> {
    return this.repository.findPublic(limit);
  }

  async getClassWorkspaces(classCode: string): Promise<Workspace[]> {
    return this.repository.findByClassCode(classCode);
  }

  /**
   * Detect if workspace has undergone a significant pivot
   * Business rule: A pivot is detected when 3+ core canvas fields change significantly
   */
  detectPivot(workspace: Workspace): boolean {
    const versions = workspace.versions;

    if (versions.length < 2) {
      return false;
    }

    const latestVersion = versions[versions.length - 1]!;
    const previousVersion = versions[versions.length - 2]!;

    const coreFields: (keyof CanvasState)[] = [
      "valuePropositions",
      "customerSegments",
      "channels",
      "revenueStreams",
    ];

    let significantChanges = 0;

    for (const field of coreFields) {
      const oldValue = previousVersion.bmcData[field] || "";
      const newValue = latestVersion.bmcData[field] || "";

      // Consider it significant if:
      // 1. Field was empty and now has content (new strategy)
      // 2. Field changed by more than 50% (major revision)
      if (oldValue.length === 0 && newValue.length > 0) {
        significantChanges++;
      } else if (oldValue.length > 0 && newValue.length > 0) {
        const similarity = this.calculateSimilarity(oldValue, newValue);
        if (similarity < 0.5) {
          // Less than 50% similar
          significantChanges++;
        }
      }
    }

    return significantChanges >= 3;
  }

  /**
   * Simple similarity calculation (Jaccard index on words)
   */
  private calculateSimilarity(str1: string, str2: string): number {
    const words1 = new Set(str1.toLowerCase().split(/\s+/));
    const words2 = new Set(str2.toLowerCase().split(/\s+/));

    const intersection = new Set([...words1].filter((x) => words2.has(x)));
    const union = new Set([...words1, ...words2]);

    return intersection.size / union.size;
  }
}
