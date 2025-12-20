import {
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";

import { auth, db, isFirebaseConfigured } from "./firebase";
import { localGroupService } from "./localGroupService";

import type { Assignment, Group, GroupMember, Workspace } from "@/types";
import { logger } from "@/utils/logger";

type FirestoreTimestamp = {
  toDate: () => Date;
};

type FirestoreGroup = Partial<Group> & {
  createdAt?: FirestoreTimestamp;
  updatedAt?: FirestoreTimestamp;
  members?: unknown;
  assignments?: unknown;
};

const resolveTimestamp = (value: unknown, fallback: string): string => {
  if (
    value &&
    typeof value === "object" &&
    "toDate" in value &&
    typeof (value as FirestoreTimestamp).toDate === "function"
  ) {
    return (value as FirestoreTimestamp).toDate().toISOString();
  }
  return fallback;
};

const normalizeMembers = (value: unknown): GroupMember[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((member): member is GroupMember => {
    if (!member || typeof member !== "object") {
      return false;
    }

    const candidate = member as Partial<GroupMember>;
    return (
      typeof candidate.workspaceCode === "string" &&
      typeof candidate.projectName === "string" &&
      typeof candidate.joinedAt === "string" &&
      typeof candidate.lastActivity === "string" &&
      typeof candidate.status === "string"
    );
  });
};

const normalizeAssignments = (value: unknown): Assignment[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((assignment): assignment is Assignment => {
    if (!assignment || typeof assignment !== "object") {
      return false;
    }
    const candidate = assignment as Partial<Assignment>;
    return (
      typeof candidate.id === "string" &&
      typeof candidate.title === "string" &&
      typeof candidate.description === "string" &&
      typeof candidate.dueDate === "string"
    );
  });
};

interface CreateGroupInput {
  name: string;
  description?: string;
  semester?: string;
  institution?: string;
}

class GroupService {
  private static instance: GroupService;

  static getInstance(): GroupService {
    if (!GroupService.instance) {
      GroupService.instance = new GroupService();
    }
    return GroupService.instance;
  }

  async createGroup(input: CreateGroupInput): Promise<Group> {
    const ownerId = auth?.currentUser?.uid ?? undefined;
    const group = localGroupService.createGroup({
      ...input,
      ...(ownerId ? { ownerId } : {}),
    });

    if (isFirebaseConfigured && db && ownerId) {
      try {
        await setDoc(doc(db, "groups", group.code), {
          ...group,
          memberIds: [], // Initialize empty for Firestore rules
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      } catch (error) {
        logger.error("Failed to persist group to Firestore", error);
      }
    }

    return group;
  }

  async getGroups(): Promise<Group[]> {
    const localGroups = localGroupService.getGroups();

    if (!isFirebaseConfigured || !db || !auth?.currentUser?.uid) {
      return localGroups;
    }

    try {
      const groupsQuery = query(
        collection(db, "groups"),
        where("ownerId", "==", auth.currentUser.uid),
      );
      const snapshot = await getDocs(groupsQuery);

      const remoteGroups: Group[] = snapshot.docs
        .map((document) => {
          const data = document.data() as FirestoreGroup;
          const fallbackTimestamp = new Date().toISOString();
          const createdAt = resolveTimestamp(data.createdAt, fallbackTimestamp);
          const updatedAt = resolveTimestamp(data.updatedAt, createdAt);

          return {
            id: data.id ?? document.id,
            code: data.code ?? document.id,
            name: data.name ?? "Untitled group",
            description: data.description,
            semester: data.semester,
            institution: data.institution,
            ownerId: data.ownerId,
            members: normalizeMembers(data.members),
            assignments: normalizeAssignments(data.assignments),
            allowPublicProjects: data.allowPublicProjects ?? true,
            requireProjectSubmission: data.requireProjectSubmission ?? false,
            createdAt,
            updatedAt,
          } as Group;
        })
        .sort(
          (a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
        );

      remoteGroups.forEach((group) => {
        localGroupService.saveGroup(group);
      });

      return remoteGroups;
    } catch (error) {
      logger.error("Failed to load groups from Firestore", error);
      return localGroups;
    }
  }

  async joinGroup(
    groupCode: string,
    member: GroupMember,
  ): Promise<Group | null> {
    const updatedGroup = localGroupService.addMember(groupCode, member);

    if (isFirebaseConfigured && db && auth?.currentUser?.uid) {
      try {
        const groupRef = doc(db, "groups", groupCode);
        const snapshot = await getDoc(groupRef);
        if (!snapshot.exists()) {
          logger.warn("Group not found in Firestore when joining", {
            groupCode,
          });
        } else {
          await updateDoc(groupRef, {
            members: arrayUnion(member),
            memberIds: arrayUnion(auth.currentUser.uid),
            updatedAt: serverTimestamp(),
          });
        }
      } catch (error) {
        logger.error("Failed to join group in Firestore", error);
      }
    }

    return updatedGroup;
  }

  async leaveGroup(
    groupCode: string,
    workspaceCode: string,
  ): Promise<Group | null> {
    const updatedGroup = localGroupService.removeMember(
      groupCode,
      workspaceCode,
    );

    if (isFirebaseConfigured && db) {
      try {
        const groupRef = doc(db, "groups", groupCode);
        const snapshot = await getDoc(groupRef);
        if (snapshot.exists()) {
          const data = snapshot.data() as Group;
          const filteredMembers = (data.members ?? []).filter(
            (entry) => entry.workspaceCode !== workspaceCode,
          );
          await updateDoc(groupRef, {
            members: filteredMembers,
            updatedAt: serverTimestamp(),
          });
        }
      } catch (error) {
        logger.error("Failed to leave group in Firestore", error);
      }
    }

    return updatedGroup;
  }

  async getGroup(groupCode: string): Promise<Group | null> {
    // Check local first
    const localGroup = localGroupService.getGroup(groupCode);

    if (!isFirebaseConfigured || !db) {
      return localGroup;
    }

    try {
      const groupRef = doc(db, "groups", groupCode);
      const snapshot = await getDoc(groupRef);

      if (!snapshot.exists()) {
        return null;
      }

      const data = snapshot.data() as FirestoreGroup;
      const fallbackTimestamp = new Date().toISOString();
      const createdAt = resolveTimestamp(data.createdAt, fallbackTimestamp);
      const updatedAt = resolveTimestamp(data.updatedAt, createdAt);

      const group: Group = {
        id: data.id ?? snapshot.id,
        code: data.code ?? snapshot.id,
        name: data.name ?? "Untitled group",
        description: data.description,
        semester: data.semester,
        institution: data.institution,
        ownerId: data.ownerId,
        members: normalizeMembers(data.members),
        assignments: normalizeAssignments(data.assignments),
        allowPublicProjects: data.allowPublicProjects ?? true,
        requireProjectSubmission: data.requireProjectSubmission ?? false,
        createdAt,
        updatedAt,
      };

      // Cache locally
      localGroupService.saveGroup(group);

      return group;
    } catch (error) {
      logger.error("Failed to get group from Firestore", error);
      return localGroup;
    }
  }

  async getGroupProjects(groupCode: string): Promise<Workspace[]> {
    if (!isFirebaseConfigured || !db || !auth?.currentUser?.uid) {
      logger.warn("Cannot fetch group projects - Firebase not configured or not authenticated");
      return [];
    }

    try {
      // Query all workspaces with this classCode
      const workspacesQuery = query(
        collection(db, "workspaces"),
        where("classCode", "==", groupCode),
      );
      const snapshot = await getDocs(workspacesQuery);

      const workspaces: Workspace[] = snapshot.docs.map((document) => {
        const data = document.data();
        return {
          ...data,
          code: document.id,
        } as Workspace;
      });

      // Sort by lastModified descending
      workspaces.sort((a, b) => {
        const aTime = new Date(a.lastModified || a.createdAt).getTime();
        const bTime = new Date(b.lastModified || b.createdAt).getTime();
        return bTime - aTime;
      });

      return workspaces;
    } catch (error) {
      logger.error("Failed to get group projects from Firestore", error);
      return [];
    }
  }
}

export const groupService = GroupService.getInstance();
