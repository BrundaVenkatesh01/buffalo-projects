import { ProjectCode } from "../domain/shared/value-objects/ProjectCode";
import type { Workspace, ProjectCategory } from "../types";
import { logger } from "../utils/logger";

import { StorageService } from "./storageService";

interface WorkspaceInput {
  projectName: string;
  description?: string;
  category?: ProjectCategory;
  classCode?: string;
  stage?: Workspace["stage"];
  tags?: string[];
  location?: Workspace["location"];
}

interface SaveOptions {
  markForSync?: boolean;
}

const WORKSPACE_KEY_PREFIX = "workspace_";
const WORKSPACE_INDEX_KEY = "workspace_index";
const SYNC_QUEUE_KEY = "workspace_sync_queue";

function createEmptyCanvas(): Workspace["bmcData"] {
  return {
    keyPartners: "",
    keyActivities: "",
    keyResources: "",
    valuePropositions: "",
    customerRelationships: "",
    channels: "",
    customerSegments: "",
    costStructure: "",
    revenueStreams: "",
  };
}

class LocalWorkspaceService {
  private static instance: LocalWorkspaceService;

  private memoryStore = new Map<string, Workspace>();
  private memoryIndex = new Set<string>();
  private memorySyncQueue = new Set<string>();

  private constructor() {
    return;
  }

  static getInstance(): LocalWorkspaceService {
    if (!LocalWorkspaceService.instance) {
      LocalWorkspaceService.instance = new LocalWorkspaceService();
    }
    return LocalWorkspaceService.instance;
  }

  createWorkspace(input: WorkspaceInput): Workspace {
    const code = this.generateUniqueCode();
    const now = new Date().toISOString();

    const workspace: Workspace = {
      id: code, // Use code as ID for local workspaces
      code,
      projectName: input.projectName || "Untitled Project",
      description: input.description ?? "",
      projectDescription: input.description ?? "",
      createdAt: now,
      lastModified: now,
      isPublic: false,
      bmcData: createEmptyCanvas(),
      interviews: [],
      journal: [],
      versions: [],
      pivots: [],
      chatMessages: [],
      documents: [],
      evidenceLinks: {},
      contextNotes: [],
      iframeEmbeds: [],
      views: 0,
      appreciations: 0,
      commentCount: 0,
      stage: input.stage,
      tags: input.tags ?? [],
      location: input.location,
      category: input.category,
      classCode: input.classCode,
    };

    this.saveWorkspace(workspace, { markForSync: true });
    this.syncLocalProjectsCookie();
    return workspace;
  }

  getWorkspace(code: string): Workspace | null {
    const stored = this.getFromStorage(code);
    return stored ?? null;
  }

  getWorkspaces(): Workspace[] {
    const codes = this.getWorkspaceIndex();
    const workspaces = codes
      .map((code) => this.getWorkspace(code))
      .filter((workspace): workspace is Workspace => Boolean(workspace));

    return workspaces.sort((a, b) => {
      return (
        new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime()
      );
    });
  }

  saveWorkspace(workspace: Workspace, options: SaveOptions = {}): void {
    const { markForSync = true } = options;

    this.setInStorage(workspace.code, workspace);
    this.ensureIndexed(workspace.code);

    if (markForSync) {
      this.markForFirebaseSync(workspace.code);
    } else {
      this.clearPendingSync(workspace.code);
    }
    this.syncLocalProjectsCookie();
  }

  deleteWorkspace(code: string): void {
    this.removeFromStorage(code);
    this.removeFromIndex(code);
    this.clearPendingSync(code);
    this.syncLocalProjectsCookie();
  }

  getPendingSyncCodes(): string[] {
    return this.getSyncQueue();
  }

  markForFirebaseSync(code: string): void {
    if (!code) {
      return;
    }
    const queue = new Set(this.getSyncQueue());
    queue.add(code);
    this.setSyncQueue([...queue]);
  }

  clearPendingSync(code: string): void {
    const queue = new Set(this.getSyncQueue());
    if (queue.delete(code)) {
      this.setSyncQueue([...queue]);
    }
  }

  private generateUniqueCode(): string {
    let attempts = 0;
    while (attempts < 10) {
      const code = ProjectCode.generate().value;
      if (!this.getWorkspace(code)) {
        return code;
      }
      attempts++;
    }

    throw new Error("Unable to generate unique workspace code locally");
  }

  private ensureIndexed(code: string): void {
    const index = new Set(this.getWorkspaceIndex());
    if (!index.has(code)) {
      index.add(code);
      this.setWorkspaceIndex([...index]);
    }
  }

  private removeFromIndex(code: string): void {
    const index = new Set(this.getWorkspaceIndex());
    if (index.delete(code)) {
      this.setWorkspaceIndex([...index]);
    }
  }

  private getWorkspaceIndex(): string[] {
    if (!this.isStorageAvailable()) {
      return Array.from(this.memoryIndex);
    }
    return StorageService.getItem<string[]>(WORKSPACE_INDEX_KEY, []) ?? [];
  }

  private setWorkspaceIndex(index: string[]): void {
    if (!this.isStorageAvailable()) {
      this.memoryIndex = new Set(index);
      return;
    }
    StorageService.setItem(WORKSPACE_INDEX_KEY, index);
  }

  private getSyncQueue(): string[] {
    if (!this.isStorageAvailable()) {
      return Array.from(this.memorySyncQueue);
    }
    return StorageService.getItem<string[]>(SYNC_QUEUE_KEY, []) ?? [];
  }

  private setSyncQueue(queue: string[]): void {
    if (!this.isStorageAvailable()) {
      this.memorySyncQueue = new Set(queue);
      return;
    }
    StorageService.setItem(SYNC_QUEUE_KEY, queue);
  }

  private getFromStorage(code: string): Workspace | undefined {
    if (!this.isStorageAvailable()) {
      return this.memoryStore.get(code);
    }
    return (
      StorageService.getItem<Workspace>(`${WORKSPACE_KEY_PREFIX}${code}`) ??
      undefined
    );
  }

  private setInStorage(code: string, workspace: Workspace): void {
    if (!this.isStorageAvailable()) {
      this.memoryStore.set(code, workspace);
      this.memoryIndex.add(code);
      return;
    }

    const success = StorageService.setItem(
      `${WORKSPACE_KEY_PREFIX}${code}`,
      workspace,
    );
    if (!success) {
      logger.error("Failed to save workspace locally", { code });
    }
  }

  private removeFromStorage(code: string): void {
    if (!this.isStorageAvailable()) {
      this.memoryStore.delete(code);
      return;
    }
    StorageService.removeItem(`${WORKSPACE_KEY_PREFIX}${code}`);
  }

  private isStorageAvailable(): boolean {
    return (
      typeof window !== "undefined" &&
      typeof window.localStorage !== "undefined"
    );
  }

  /**
   * Mirror local workspace codes into a cookie for middleware to allow access
   * when auth is not present. The cookie is read-only by the Edge middleware.
   */
  private syncLocalProjectsCookie(): void {
    if (typeof document === "undefined") {
      return;
    }
    try {
      const codes = this.getWorkspaceIndex();
      // Limit cookie size — keep most recent 20 codes
      const trimmed = codes.slice(0, 20);
      const value = trimmed.join("|");
      const maxAge = 60 * 60 * 24 * 30; // 30 days
      document.cookie = `bp_local_projects=${encodeURIComponent(value)}; Path=/; Max-Age=${maxAge}; SameSite=Lax`;
    } catch (error) {
      logger.warn("Failed to sync local projects cookie", error);
    }
  }
}

export const localWorkspaceService = LocalWorkspaceService.getInstance();
