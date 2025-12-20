import { nanoid } from "nanoid";

import { StorageService } from "./storageService";

import type { Group, GroupMember } from "@/types";
import { logger } from "@/utils/logger";

interface CreateGroupInput {
  name: string;
  description?: string;
  semester?: string;
  institution?: string;
  ownerId?: string;
}

const GROUP_KEY_PREFIX = "group_";
const GROUP_INDEX_KEY = "group_index";

class LocalGroupService {
  private static instance: LocalGroupService;
  private memoryStore = new Map<string, Group>();
  private memoryIndex = new Set<string>();

  static getInstance(): LocalGroupService {
    if (!LocalGroupService.instance) {
      LocalGroupService.instance = new LocalGroupService();
    }
    return LocalGroupService.instance;
  }

  createGroup(input: CreateGroupInput): Group {
    const code = this.generateGroupCode();
    const now = new Date().toISOString();

    const group: Group = {
      id: nanoid(),
      code,
      name: input.name,
      createdAt: now,
      updatedAt: now,
      members: [],
      assignments: [],
      allowPublicProjects: true,
      requireProjectSubmission: false,
      ...(input.description ? { description: input.description } : {}),
      ...(input.semester ? { semester: input.semester } : {}),
      ...(input.institution ? { institution: input.institution } : {}),
      ...(input.ownerId ? { ownerId: input.ownerId } : {}),
    };

    this.saveGroup(group);
    return group;
  }

  saveGroup(group: Group): void {
    this.setInStorage(group.code, group);
    this.ensureIndexed(group.code);
  }

  getGroups(): Group[] {
    const codes = this.getIndex();
    const results = codes
      .map((code) => this.getGroup(code))
      .filter((group): group is Group => Boolean(group));

    return results.sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    );
  }

  getGroup(code: string): Group | null {
    const stored = this.getFromStorage(code);
    return stored ?? null;
  }

  addMember(code: string, member: GroupMember): Group | null {
    const group = this.getGroup(code);
    if (!group) {
      return null;
    }

    const existingIndex = group.members.findIndex(
      (entry) => entry.workspaceCode === member.workspaceCode,
    );

    const updatedMembers =
      existingIndex >= 0
        ? group.members.map((entry, index) =>
            index === existingIndex
              ? { ...entry, ...member, lastActivity: member.lastActivity }
              : entry,
          )
        : [...group.members, member];

    const updatedGroup: Group = {
      ...group,
      members: updatedMembers,
      updatedAt: new Date().toISOString(),
    };

    this.saveGroup(updatedGroup);
    return updatedGroup;
  }

  removeMember(code: string, workspaceCode: string): Group | null {
    const group = this.getGroup(code);
    if (!group) {
      return null;
    }

    const updatedGroup: Group = {
      ...group,
      members: group.members.filter(
        (member) => member.workspaceCode !== workspaceCode,
      ),
      updatedAt: new Date().toISOString(),
    };

    this.saveGroup(updatedGroup);
    return updatedGroup;
  }

  deleteGroup(code: string): void {
    this.removeFromStorage(code);
    this.removeFromIndex(code);
  }

  clearAll(): void {
    const codes = this.getIndex();
    codes.forEach((groupCode) => this.removeFromStorage(groupCode));
    this.setIndex([]);
    this.memoryStore.clear();
    this.memoryIndex.clear();
  }

  private generateGroupCode(): string {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "BUF-GRP-";

    for (let attempt = 0; attempt < 20; attempt++) {
      const suffix = Array.from({ length: 4 })
        .map(() => chars.charAt(Math.floor(Math.random() * chars.length)))
        .join("");
      code = `BUF-GRP-${suffix}`;
      if (!this.getGroup(code)) {
        return code;
      }
    }

    const fallback = `BUF-GRP-${nanoid(5).toUpperCase()}`;
    logger.warn("Generated fallback group code", { code: fallback });
    return fallback;
  }

  private ensureIndexed(code: string): void {
    const index = new Set(this.getIndex());
    if (!index.has(code)) {
      index.add(code);
      this.setIndex([...index]);
    }
  }

  private getIndex(): string[] {
    if (!this.isStorageAvailable()) {
      return Array.from(this.memoryIndex);
    }
    return StorageService.getItem<string[]>(GROUP_INDEX_KEY, []) ?? [];
  }

  private setIndex(index: string[]): void {
    if (!this.isStorageAvailable()) {
      this.memoryIndex = new Set(index);
      return;
    }
    StorageService.setItem(GROUP_INDEX_KEY, index);
  }

  private getFromStorage(code: string): Group | undefined {
    if (!this.isStorageAvailable()) {
      return this.memoryStore.get(code);
    }
    return (
      StorageService.getItem<Group>(`${GROUP_KEY_PREFIX}${code}`) ?? undefined
    );
  }

  private setInStorage(code: string, group: Group): void {
    if (!this.isStorageAvailable()) {
      this.memoryStore.set(code, group);
      this.memoryIndex.add(code);
      return;
    }

    const success = StorageService.setItem(`${GROUP_KEY_PREFIX}${code}`, group);
    if (!success) {
      logger.error("Failed to save group locally", { code });
    }
  }

  private removeFromStorage(code: string): void {
    if (!this.isStorageAvailable()) {
      this.memoryStore.delete(code);
      return;
    }
    StorageService.removeItem(`${GROUP_KEY_PREFIX}${code}`);
  }

  private removeFromIndex(code: string): void {
    const index = new Set(this.getIndex());
    if (index.delete(code)) {
      this.setIndex([...index]);
    }
  }

  private isStorageAvailable(): boolean {
    return (
      typeof window !== "undefined" &&
      typeof window.localStorage !== "undefined"
    );
  }
}

export const localGroupService = LocalGroupService.getInstance();
