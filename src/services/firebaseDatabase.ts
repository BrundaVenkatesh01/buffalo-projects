import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  onSnapshot,
  serverTimestamp,
  increment,
  arrayUnion,
  arrayRemove,
  Timestamp,
  type FieldValue,
  getCountFromServer,
  runTransaction,
} from "firebase/firestore";
import type { DocumentSnapshot } from "firebase/firestore";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { nanoid } from "nanoid";

import type {
  Workspace,
  JournalEntry,
  ContextNote,
  ProjectDocument,
  ProjectDocumentKind,
  User,
  ProjectCategory,
} from "../types";
import { isOfflineFirebaseError } from "../utils/firebaseErrors";
import { logger } from "../utils/logger";
import { createSlug, withRandomSuffix } from "../utils/slugGenerator";

import { failureNotificationService } from "./failureNotificationService";
import { db, storage, auth } from "./firebase";

export interface FirebaseWorkspace
  extends Omit<Workspace, "createdAt" | "lastModified"> {
  createdAt: Timestamp;
  lastModified: Timestamp;
  ownerId: string; // Firebase UID
  collaborators?: string[]; // Array of Firebase UIDs
}

export interface WorkspaceQuery {
  limit?: number;
  orderBy?: "createdAt" | "lastModified" | "projectName" | "publishedAt";
  orderDirection?: "asc" | "desc";
  category?: ProjectCategory;
  stage?: string;
  isPublic?: boolean;
  ownerId?: string;
  classCode?: string;
  startAfter?: DocumentSnapshot;
  tagsAny?: string[];
  location?: "buffalo" | "remote";
  buffaloAffiliated?: boolean;
}

export interface CreateProjectInput {
  projectName: string;
  description?: string;
  stage?: Workspace["stage"];
  tags?: string[];
  location?: Workspace["location"];
  category?: ProjectCategory;
  classCode?: string;
  buffaloAffiliated?: boolean;
  /**
   * @deprecated projectType is no longer used. All projects are unified.
   * This parameter is kept for backwards compatibility and will be ignored.
   */
  projectType?: "showcase" | "workspace";
  oneLiner?: string;
  publicLink?: string;
}

class FirebaseDatabaseService {
  private static instance: FirebaseDatabaseService;

  private constructor() {
    return;
  }

  static getInstance(): FirebaseDatabaseService {
    if (!FirebaseDatabaseService.instance) {
      FirebaseDatabaseService.instance = new FirebaseDatabaseService();
    }
    return FirebaseDatabaseService.instance;
  }

  // Generate unique workspace code
  generateWorkspaceCode(): string {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "BUF-";
    for (let i = 0; i < 4; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  // Check if workspace code exists
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

  // Generate unique workspace code (with uniqueness check)
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

  async createProject(projectData: CreateProjectInput): Promise<Workspace> {
    const authInstance = auth;
    if (!authInstance || !authInstance.currentUser) {
      throw new Error("User must be authenticated to create project");
    }

    try {
      const firestore = db;
      if (!firestore) {
        throw new Error("Firebase Firestore is not initialized");
      }

      const projectRef = doc(collection(firestore, "workspaces"));
      const projectId = projectRef.id;
      const now = serverTimestamp();

      const firebaseWorkspace: Partial<
        Omit<FirebaseWorkspace, "createdAt" | "lastModified">
      > & {
        createdAt: FieldValue;
        lastModified: FieldValue;
      } = {
        code: projectId,
        ownerId: authInstance.currentUser.uid,
        userId: authInstance.currentUser.uid,
        projectName: projectData.projectName,
        description: projectData.description || "",
        projectDescription: projectData.description || "",
        ...(projectData.stage ? { stage: projectData.stage } : {}),
        tags: projectData.tags ?? [],
        ...(projectData.location ? { location: projectData.location } : {}),
        ...(projectData.category ? { category: projectData.category } : {}),
        ...(projectData.classCode ? { classCode: projectData.classCode } : {}),
        ...(projectData.projectType
          ? { projectType: projectData.projectType }
          : {}),
        ...(projectData.oneLiner ? { oneLiner: projectData.oneLiner } : {}),
        ...(projectData.publicLink
          ? { publicLink: projectData.publicLink }
          : {}),
        buffaloAffiliated: projectData.buffaloAffiliated ?? false,
        createdAt: now,
        lastModified: now,
        isPublic: false,
        bmcData: {
          keyPartners: "",
          keyActivities: "",
          keyResources: "",
          valuePropositions: "",
          customerRelationships: "",
          channels: "",
          customerSegments: "",
          costStructure: "",
          revenueStreams: "",
        },
        journal: [],
        versions: [],
        pivots: [],
        chatMessages: [],
        documents: [],
        evidenceLinks: {},
        contextNotes: [],

        // Analytics
        views: 0,
        appreciations: 0,
        commentCount: 0,
      };

      // Enrich with creator name from user profile
      try {
        const userDocRef = doc(
          firestore,
          "users",
          authInstance.currentUser.uid,
        );
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = userDoc.data() as {
            displayName?: string;
            firstName?: string;
            lastName?: string;
          };
          const creatorName =
            userData.displayName ||
            (userData.firstName && userData.lastName
              ? `${userData.firstName} ${userData.lastName}`
              : null);
          if (creatorName) {
            firebaseWorkspace.creator = creatorName;
          }
        }
      } catch (error) {
        // Don't fail workspace creation if user profile fetch fails
        logger.warn(
          "Could not fetch user profile for creator attribution:",
          error,
        );
      }

      await setDoc(projectRef, firebaseWorkspace);

      // Return the workspace with converted timestamps
      return this.convertFirebaseWorkspace({
        ...firebaseWorkspace,
        createdAt: Timestamp.now(),
        lastModified: Timestamp.now(),
      } as FirebaseWorkspace);
    } catch (error) {
      logger.error("Error creating project:", error);
      throw error;
    }
  }

  // Create new workspace (legacy wrapper)
  async createWorkspace(workspaceData: {
    projectName: string;
    description?: string;
    category?: ProjectCategory;
    classCode?: string;
    stage?: Workspace["stage"];
    tags?: string[];
    location?: Workspace["location"];
    buffaloAffiliated?: boolean;
    projectType?: "showcase" | "workspace";
    oneLiner?: string;
    publicLink?: string;
  }): Promise<Workspace> {
    return this.createProject({
      projectName: workspaceData.projectName,
      ...(workspaceData.description
        ? { description: workspaceData.description }
        : {}),
      ...(workspaceData.category ? { category: workspaceData.category } : {}),
      ...(workspaceData.classCode
        ? { classCode: workspaceData.classCode }
        : {}),
      ...(workspaceData.stage ? { stage: workspaceData.stage } : {}),
      ...(workspaceData.tags ? { tags: workspaceData.tags } : {}),
      ...(workspaceData.location ? { location: workspaceData.location } : {}),
      ...(workspaceData.buffaloAffiliated !== undefined
        ? { buffaloAffiliated: workspaceData.buffaloAffiliated }
        : {}),
      ...(workspaceData.projectType
        ? { projectType: workspaceData.projectType }
        : {}),
      ...(workspaceData.oneLiner ? { oneLiner: workspaceData.oneLiner } : {}),
      ...(workspaceData.publicLink
        ? { publicLink: workspaceData.publicLink }
        : {}),
    });
  }

  // Get workspace by code
  async getWorkspace(code: string): Promise<Workspace | null> {
    try {
      const firestore = db;
      if (!firestore) {
        logger.warn(
          "Firestore not initialized; returning null for workspace lookup",
        );
        return null;
      }

      const workspaceDoc = await getDoc(doc(firestore, "workspaces", code));

      if (!workspaceDoc.exists()) {
        return null;
      }

      const data = workspaceDoc.data() as FirebaseWorkspace;

      // Check if user has access to this workspace
      if (!this.hasWorkspaceAccess(data)) {
        logger.warn("Access denied to workspace:", code);
        return null; // Return null instead of throwing to allow fallback
      }

      return this.convertFirebaseWorkspace(data);
    } catch (error) {
      if (isOfflineFirebaseError(error)) {
        logger.warn("Firestore offline; returning null for workspace lookup");
        return null;
      }
      logger.error("Error getting workspace:", error);
      // Return null to allow fallback to localStorage instead of throwing
      return null;
    }
  }

  async getPublicWorkspaceBySlug(slug: string): Promise<Workspace | null> {
    try {
      const firestore = db;
      if (!firestore) {
        logger.warn(
          "Firestore not initialized; returning null for public workspace lookup",
        );
        return null;
      }

      const q = query(
        collection(firestore, "workspaces"),
        where("slug", "==", slug),
        where("isPublic", "==", true),
        limit(1),
      );

      const snapshot = await getDocs(q);
      if (snapshot.empty) {
        return null;
      }

      const docSnapshot = snapshot.docs[0]!;
      const data = docSnapshot.data() as FirebaseWorkspace;
      return this.convertFirebaseWorkspace(data);
    } catch (error) {
      if (isOfflineFirebaseError(error)) {
        logger.warn("Firestore offline; returning null for slug lookup");
        return null;
      }
      logger.error("Error fetching public workspace by slug:", error);
      return null;
    }
  }

  // Save workspace (create or update)
  async saveWorkspace(workspace: Workspace): Promise<void> {
    try {
      const authInstance = auth;
      const firestore = db;

      // Skip Firebase save if no auth
      if (!authInstance || !authInstance.currentUser) {
        logger.debug("No authenticated user, skipping Firebase save");
        return;
      }

      if (!firestore) {
        logger.warn("Firestore not initialized; skipping workspace save");
        return;
      }

      // Clean workspace data to remove undefined values that Firebase doesn't accept
      const cleanWorkspace = this.cleanDataForFirebase(workspace);

      // Convert regular workspace to Firebase format
      const firebaseWorkspace: Partial<FirebaseWorkspace> = {
        ...cleanWorkspace,
        createdAt: Timestamp.fromDate(new Date(workspace.createdAt)),
        lastModified: Timestamp.fromDate(new Date(workspace.lastModified)),
        ownerId: authInstance.currentUser?.uid || "anonymous",
      };

      await setDoc(
        doc(firestore, "workspaces", workspace.code),
        firebaseWorkspace,
      );
    } catch (error) {
      logger.error("Error saving workspace to Firebase:", error);
      // Don't throw - just log error to prevent blocking local saves
      // throw error;
    }
  }

  // Update workspace
  async updateWorkspace(
    code: string,
    updates: Partial<Workspace>,
  ): Promise<Workspace> {
    const authInstance = auth;
    const firestore = db;

    if (!authInstance || !authInstance.currentUser) {
      throw new Error("User must be authenticated");
    }

    if (!firestore) {
      throw new Error("Firebase Firestore is not initialized");
    }

    try {
      // Check if user owns this workspace
      const workspaceDoc = await getDoc(doc(firestore, "workspaces", code));
      if (!workspaceDoc.exists()) {
        throw new Error("Workspace not found");
      }

      const workspace = workspaceDoc.data() as FirebaseWorkspace;
      if (workspace.ownerId !== authInstance.currentUser.uid) {
        throw new Error("Access denied - you do not own this workspace");
      }

      // Prepare updates with server timestamp
      const updateData = {
        ...updates,
        lastModified: serverTimestamp(),
      };

      // Remove undefined values
      Object.keys(updateData).forEach((key) => {
        if (updateData[key as keyof typeof updateData] === undefined) {
          delete updateData[key as keyof typeof updateData];
        }
      });

      await updateDoc(doc(firestore, "workspaces", code), updateData);

      // Return updated workspace
      const updatedWorkspace = await this.getWorkspace(code);
      if (!updatedWorkspace) {
        throw new Error("Workspace not found after update");
      }
      return updatedWorkspace;
    } catch (error) {
      logger.error("Error updating workspace:", error);
      throw error;
    }
  }

  // Delete workspace
  async deleteWorkspace(code: string): Promise<void> {
    const authInstance = auth;
    const firestore = db;
    const storageInstance = storage;

    if (!authInstance || !authInstance.currentUser) {
      throw new Error("User must be authenticated");
    }

    if (!firestore) {
      throw new Error("Firebase Firestore is not initialized");
    }

    try {
      // Check ownership
      const workspaceDoc = await getDoc(doc(firestore, "workspaces", code));
      if (!workspaceDoc.exists()) {
        throw new Error("Workspace not found");
      }

      const workspace = workspaceDoc.data() as FirebaseWorkspace;
      if (workspace.ownerId !== authInstance.currentUser.uid) {
        throw new Error("Access denied - you do not own this workspace");
      }

      // Delete associated documents from storage
      if (
        storageInstance &&
        workspace.documents &&
        workspace.documents.length > 0
      ) {
        const deletePromises = workspace.documents.map(async (doc) => {
          if (doc.type !== "iframe_embed") {
            try {
              const storageRef = ref(
                storageInstance,
                `documents/${code}/${doc.id}`,
              );
              await deleteObject(storageRef);
            } catch (error) {
              logger.warn("Error deleting document from storage:", error);
            }
          }
        });
        await Promise.all(deletePromises);
      }

      // Delete workspace document
      await deleteDoc(doc(firestore, "workspaces", code));
    } catch (error) {
      logger.error("Error deleting workspace:", error);
      throw error;
    }
  }

  async publishWorkspace(code: string): Promise<Workspace> {
    const authInstance = auth;
    const firestore = db;

    if (!authInstance || !authInstance.currentUser) {
      throw new Error("User must be authenticated to publish workspace");
    }

    if (!firestore) {
      throw new Error("Firebase Firestore is not initialized");
    }

    try {
      // First, get the workspace and generate slug outside transaction
      const workspaceRef = doc(firestore, "workspaces", code);
      const workspaceSnap = await getDoc(workspaceRef);

      if (!workspaceSnap.exists()) {
        throw new Error("Workspace not found");
      }

      const data = workspaceSnap.data() as FirebaseWorkspace & {
        publishedAt?: Timestamp | null;
        slug?: string;
      };

      if (data.ownerId !== authInstance.currentUser.uid) {
        throw new Error("Access denied - you do not own this workspace");
      }

      // Generate slug - if one exists, keep it; otherwise create new one with random suffix
      const previousSlug = data.slug ?? null;
      const slug =
        previousSlug ||
        withRandomSuffix(createSlug(data.projectName) || "project");

      // Now update in a simple write operation (not transaction)
      await updateDoc(workspaceRef, {
        isPublic: true,
        slug,
        publishedAt: serverTimestamp(),
        lastModified: serverTimestamp(),
      });

      const result = { slug, previousSlug };

      // Fetch updated workspace after transaction
      const updatedWorkspace = await this.getWorkspace(code);
      if (!updatedWorkspace) {
        throw new Error("Workspace not found after publish");
      }

      logger.info("Workspace published successfully", {
        code,
        slug: result.slug,
        ...(result.previousSlug ? { previousSlug: result.previousSlug } : {}),
      });

      return updatedWorkspace;
    } catch (error) {
      logger.error("Error publishing workspace:", error);

      // Report failure to notification service
      failureNotificationService.reportFailure(error, {
        operation: "Publish project",
        category: "publish",
        message: "Failed to publish project",
        isTransient: false,
        recovery: "retry",
        metadata: { workspaceCode: code },
      });

      throw error;
    }
  }

  async unpublishWorkspace(code: string): Promise<Workspace> {
    const authInstance = auth;
    const firestore = db;

    if (!authInstance || !authInstance.currentUser) {
      throw new Error("User must be authenticated to unpublish workspace");
    }

    if (!firestore) {
      throw new Error("Firebase Firestore is not initialized");
    }

    try {
      // Use transaction to ensure atomic updates
      const result = await runTransaction(firestore, async (transaction) => {
        const workspaceRef = doc(firestore, "workspaces", code);
        const workspaceDoc = await transaction.get(workspaceRef);

        if (!workspaceDoc.exists()) {
          throw new Error("Workspace not found");
        }

        const data = workspaceDoc.data() as FirebaseWorkspace & {
          slug?: string;
        };
        if (data.ownerId !== authInstance.currentUser!.uid) {
          throw new Error("Access denied - you do not own this workspace");
        }

        const slug = data.slug;

        // Atomic update: workspace document - set isPublic to false
        transaction.update(workspaceRef, {
          isPublic: false,
          publishedAt: null,
          lastModified: serverTimestamp(),
        });

        return { slug };
      });

      // Fetch updated workspace after transaction
      const updatedWorkspace = await this.getWorkspace(code);
      if (!updatedWorkspace) {
        throw new Error("Workspace not found after unpublish");
      }

      logger.info("Workspace unpublished successfully", {
        code,
        ...(result.slug ? { slug: result.slug } : {}),
      });

      return updatedWorkspace;
    } catch (error) {
      logger.error("Error unpublishing workspace:", error);

      // Report failure to notification service
      failureNotificationService.reportFailure(error, {
        operation: "Unpublish project",
        category: "publish",
        message: "Failed to unpublish project",
        isTransient: false,
        recovery: "retry",
        metadata: { workspaceCode: code },
      });

      throw error;
    }
  }

  // Query workspaces
  async queryWorkspaces(queryOptions: WorkspaceQuery = {}): Promise<{
    workspaces: Workspace[];
    lastDoc?: DocumentSnapshot;
    hasMore: boolean;
  }> {
    try {
      const firestore = db;
      if (!firestore) {
        logger.warn(
          "Firestore not initialized; returning empty workspace query result",
        );
        return {
          workspaces: [],
          hasMore: false,
        };
      }

      const {
        limit: queryLimit = 20,
        orderBy: orderField = "lastModified",
        orderDirection = "desc",
        category,
        stage,
        isPublic,
        ownerId,
        classCode,
        startAfter: startAfterDoc,
        tagsAny,
        location,
        buffaloAffiliated,
      } = queryOptions;

      let q = query(collection(firestore, "workspaces"));

      // Add filters
      if (category) {
        q = query(q, where("category", "==", category));
      }
      if (stage) {
        q = query(q, where("stage", "==", stage));
      }
      if (isPublic !== undefined) {
        q = query(q, where("isPublic", "==", isPublic));
      }
      if (ownerId) {
        q = query(q, where("ownerId", "==", ownerId));
      }
      if (classCode) {
        q = query(q, where("classCode", "==", classCode));
      }
      if (location) {
        q = query(q, where("location", "==", location));
      }
      if (buffaloAffiliated !== undefined) {
        q = query(q, where("buffaloAffiliated", "==", buffaloAffiliated));
      }
      if (tagsAny && tagsAny.length > 0) {
        const uniqueTags = Array.from(new Set(tagsAny)).slice(0, 10);
        if (uniqueTags.length > 0) {
          q = query(q, where("tags", "array-contains-any", uniqueTags));
        }
      }

      // Add ordering
      q = query(q, orderBy(orderField, orderDirection));

      // Add pagination
      if (startAfterDoc) {
        q = query(q, startAfter(startAfterDoc));
      }
      q = query(q, limit(queryLimit + 1)); // Fetch one extra to check if there are more

      const querySnapshot = await getDocs(q);
      const docs = querySnapshot.docs;

      const hasMore = docs.length > queryLimit;
      const workspaceDocs = hasMore ? docs.slice(0, -1) : docs;

      const workspaces = workspaceDocs
        .map((doc) => doc.data() as FirebaseWorkspace)
        .filter((workspace) => this.hasWorkspaceAccess(workspace))
        .map((workspace) => this.convertFirebaseWorkspace(workspace));

      const lastDoc =
        workspaceDocs.length > 0
          ? workspaceDocs[workspaceDocs.length - 1]
          : undefined;

      return {
        workspaces,
        ...(lastDoc ? { lastDoc } : {}),
        hasMore,
      };
    } catch (error) {
      if (isOfflineFirebaseError(error)) {
        logger.warn(
          "Firestore offline; returning empty workspace query result",
        );
        return {
          workspaces: [],
          hasMore: false,
        };
      }
      logger.error("Error querying workspaces:", error);
      throw error;
    }
  }

  // Get user's workspaces
  async getUserWorkspaces(userId?: string): Promise<Workspace[]> {
    const currentAuth = auth;
    const targetUserId = userId || currentAuth?.currentUser?.uid;
    if (!targetUserId) {
      throw new Error("User ID required");
    }

    const result = await this.queryWorkspaces({
      ownerId: targetUserId,
      orderBy: "lastModified",
      orderDirection: "desc",
    });

    return result.workspaces;
  }

  async getShortlistedProjects(userId?: string): Promise<string[]> {
    const authInstance = auth;
    const targetUserId = userId || authInstance?.currentUser?.uid;
    if (!targetUserId) {
      return [];
    }

    const firestore = db;
    if (!firestore) {
      return [];
    }

    try {
      const userRef = doc(firestore, "users", targetUserId);
      const snapshot = await getDoc(userRef);
      if (!snapshot.exists()) {
        return [];
      }
      const data = snapshot.data() as
        | { shortlistedProjects?: unknown }
        | undefined;
      const shortlist = data?.shortlistedProjects;
      return Array.isArray(shortlist)
        ? shortlist.filter(
            (value): value is string => typeof value === "string",
          )
        : [];
    } catch (error) {
      logger.warn("Failed to load shortlist", error);
      return [];
    }
  }

  async addProjectToShortlist(
    projectCode: string,
    userId?: string,
  ): Promise<void> {
    const authInstance = auth;
    const targetUserId = userId || authInstance?.currentUser?.uid;
    if (!targetUserId) {
      throw new Error("User must be signed in to shortlist projects");
    }

    const firestore = db;
    if (!firestore) {
      throw new Error("Firebase Firestore is not initialized");
    }

    await setDoc(
      doc(firestore, "users", targetUserId),
      { shortlistedProjects: arrayUnion(projectCode) },
      { merge: true },
    );
  }

  async removeProjectFromShortlist(
    projectCode: string,
    userId?: string,
  ): Promise<void> {
    const authInstance = auth;
    const targetUserId = userId || authInstance?.currentUser?.uid;
    if (!targetUserId) {
      throw new Error("User must be signed in to update shortlist");
    }

    const firestore = db;
    if (!firestore) {
      throw new Error("Firebase Firestore is not initialized");
    }

    await setDoc(
      doc(firestore, "users", targetUserId),
      { shortlistedProjects: arrayRemove(projectCode) },
      { merge: true },
    );
  }

  // Get public workspaces (legacy signature retained for compatibility)
  async getPublicWorkspaces(
    options:
      | number
      | (Omit<WorkspaceQuery, "isPublic" | "tagsAny"> & {
          tags?: string[];
        }) = 20,
  ): Promise<Workspace[]> {
    const normalized =
      typeof options === "number" ? { limit: options } : options;

    const { tags, ...rest } = normalized as Omit<
      WorkspaceQuery,
      "isPublic" | "tagsAny"
    > & {
      tags?: string[];
    };

    const queryOptions: WorkspaceQuery = {
      isPublic: true,
      ...(typeof rest.limit === "number" ? { limit: rest.limit } : {}),
      ...(rest.orderBy ? { orderBy: rest.orderBy } : {}),
      ...(rest.orderDirection ? { orderDirection: rest.orderDirection } : {}),
      ...(rest.category ? { category: rest.category } : {}),
      ...(rest.stage ? { stage: rest.stage } : {}),
      ...(rest.ownerId ? { ownerId: rest.ownerId } : {}),
      ...(rest.classCode ? { classCode: rest.classCode } : {}),
      ...(rest.startAfter ? { startAfter: rest.startAfter } : {}),
      ...(Array.isArray(tags) && tags.length > 0 ? { tagsAny: tags } : {}),
    };

    const result = await this.queryWorkspaces(queryOptions);

    return result.workspaces;
  }

  // Backwards-compatible wrapper for older callers expecting `{ projects }`
  // Accepts `{ limit, orderBy, direction, stage, tags }` and maps to
  // the newer getPublicWorkspaces/getPublicWorkspacesPage APIs.
  async getPublicProjects(
    options: {
      limit?: number;
      orderBy?: WorkspaceQuery["orderBy"];
      direction?: WorkspaceQuery["orderDirection"];
      stage?: Workspace["stage"];
      tags?: string[];
      cursor?: DocumentSnapshot;
    } = {},
  ): Promise<{
    projects: Workspace[];
    hasMore?: boolean;
    cursor?: DocumentSnapshot;
  }> {
    const { direction, cursor, ...rest } = options;
    const page = await this.getPublicWorkspacesPage({
      ...rest,
      ...(direction ? { orderDirection: direction } : {}),
      ...(cursor ? { startAfter: cursor } : {}),
    });
    return {
      projects: page.workspaces,
      hasMore: page.hasMore,
      ...(page.cursor ? { cursor: page.cursor } : {}),
    };
  }

  async getPublicWorkspacesPage(
    options: {
      limit?: number;
      stage?: Workspace["stage"];
      orderBy?: WorkspaceQuery["orderBy"];
      orderDirection?: WorkspaceQuery["orderDirection"];
      startAfter?: DocumentSnapshot;
      tags?: string[];
      category?: ProjectCategory;
      location?: "buffalo" | "remote";
      buffaloAffiliated?: boolean;
    } = {},
  ): Promise<{
    workspaces: Workspace[];
    hasMore: boolean;
    cursor?: DocumentSnapshot;
  }> {
    const queryOptions: WorkspaceQuery = {
      isPublic: true,
      ...(typeof options.limit === "number" ? { limit: options.limit } : {}),
      ...(options.orderBy ? { orderBy: options.orderBy } : {}),
      ...(options.orderDirection
        ? { orderDirection: options.orderDirection }
        : {}),
      ...(options.stage ? { stage: options.stage } : {}),
      ...(options.category ? { category: options.category } : {}),
      ...(options.location ? { location: options.location } : {}),
      ...(options.buffaloAffiliated !== undefined
        ? { buffaloAffiliated: options.buffaloAffiliated }
        : {}),
      ...(options.startAfter ? { startAfter: options.startAfter } : {}),
      ...(Array.isArray(options.tags) && options.tags.length > 0
        ? { tagsAny: options.tags }
        : {}),
    };

    const { workspaces, hasMore, lastDoc } =
      await this.queryWorkspaces(queryOptions);

    return {
      workspaces,
      hasMore,
      ...(lastDoc ? { cursor: lastDoc } : {}),
    };
  }

  async getPublicWorkspaceStageCounts(
    stages: Array<Exclude<Workspace["stage"], undefined>>,
  ): Promise<Partial<Record<Exclude<Workspace["stage"], undefined>, number>>> {
    const firestore = db;
    const uniqueStages = Array.from(new Set(stages));

    if (!firestore || uniqueStages.length === 0) {
      return uniqueStages.reduce<
        Partial<Record<Exclude<Workspace["stage"], undefined>, number>>
      >((acc, stage) => {
        acc[stage] = 0;
        return acc;
      }, {});
    }

    const results = await Promise.all(
      uniqueStages.map(async (stage) => {
        try {
          const stageQuery = query(
            collection(firestore, "workspaces"),
            where("isPublic", "==", true),
            where("stage", "==", stage),
          );
          const snapshot = await getCountFromServer(stageQuery);
          return [stage, snapshot.data().count] as const;
        } catch (error) {
          logger.warn("Unable to fetch stage count", { stage, error });
          return [stage, 0] as const;
        }
      }),
    );

    return results.reduce<
      Partial<Record<Exclude<Workspace["stage"], undefined>, number>>
    >((acc, [stage, count]) => {
      acc[stage] = count;
      return acc;
    }, {});
  }

  // Get users who have published at least one public project
  async getPublicCreators(
    options: {
      limit?: number;
      buffaloConnection?: string;
    } = {},
  ): Promise<User[]> {
    const firestore = db;
    if (!firestore) {
      logger.warn("Firestore not initialized; returning empty creators list");
      return [];
    }

    try {
      // First, get all public workspaces to find unique owner IDs
      const publicWorkspaces = await this.getPublicWorkspaces({
        limit: 1000, // Get more to find unique owners
        orderBy: "publishedAt",
        orderDirection: "desc",
      });

      // Get unique owner IDs
      const ownerIds = Array.from(
        new Set(publicWorkspaces.map((w) => w.ownerId).filter(Boolean)),
      );

      if (ownerIds.length === 0) {
        return [];
      }

      // Fetch user documents for these owner IDs
      // Note: Firestore "in" queries support max 30 values, so batch if needed
      const users: User[] = [];
      const batchSize = 30;

      for (let i = 0; i < ownerIds.length; i += batchSize) {
        const batch = ownerIds.slice(i, i + batchSize);
        const usersQuery = query(
          collection(firestore, "users"),
          where("__name__", "in", batch),
        );

        const snapshot = await getDocs(usersQuery);
        snapshot.forEach((doc) => {
          const userData = doc.data() as User;
          // Filter by buffaloConnection if specified
          if (
            !options.buffaloConnection ||
            userData.buffaloConnection === options.buffaloConnection
          ) {
            users.push({ ...userData, uid: doc.id });
          }
        });
      }

      // Limit results
      const limitedUsers = options.limit
        ? users.slice(0, options.limit)
        : users;

      return limitedUsers;
    } catch (error) {
      logger.error("Error fetching public creators", { error });
      return [];
    }
  }

  // Upload document
  async uploadDocument(
    workspaceCode: string,
    file: File,
    options: {
      title?: string;
      category?: string;
      onProgress?: (progress: number) => void;
    } = {},
  ): Promise<ProjectDocument> {
    const authInstance = auth;
    const firestore = db;
    const storageInstance = storage;

    if (!authInstance || !authInstance.currentUser) {
      throw new Error("User must be authenticated");
    }

    if (!firestore) {
      throw new Error("Firebase Firestore is not initialized");
    }

    if (!storageInstance) {
      throw new Error("Firebase Storage is not initialized");
    }

    try {
      // Verify workspace ownership
      const workspace = await this.getWorkspace(workspaceCode);
      if (!workspace) {
        throw new Error("Workspace not found");
      }

      const documentId = nanoid();
      const fileName = `${documentId}_${file.name}`;
      const storageRef = ref(
        storageInstance,
        `evidence/${authInstance.currentUser.uid}/${workspaceCode}/${fileName}`,
      );

      const uploadTask = uploadBytesResumable(storageRef, file);

      const snapshot = await new Promise<
        ReturnType<typeof uploadBytesResumable>["snapshot"]
      >((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          (taskSnapshot) => {
            if (options.onProgress && taskSnapshot.totalBytes > 0) {
              const progress = Math.round(
                (taskSnapshot.bytesTransferred / taskSnapshot.totalBytes) * 100,
              );
              options.onProgress(progress);
            }
          },
          (error) => reject(error),
          () => resolve(uploadTask.snapshot),
        );
      });

      const downloadURL = await getDownloadURL(snapshot.ref);

      const docType = this.getFileType(file.name, file.type);
      const previewUrl = docType === "image" ? downloadURL : undefined;

      const document: ProjectDocument = {
        id: documentId,
        name: options.title || file.name,
        type: docType,
        size: file.size,
        uploadedAt: new Date().toISOString(),
        ...(previewUrl ? { previewUrl } : {}),
        storagePath: downloadURL,
        storageFullPath: snapshot.ref.fullPath,
      };

      // Update workspace with new document
      await updateDoc(doc(firestore, "workspaces", workspaceCode), {
        documents: arrayUnion(document),
        lastModified: serverTimestamp(),
      });

      return document;
    } catch (error) {
      logger.error("Error uploading document:", error);

      // Report failure to notification service
      failureNotificationService.reportFailure(error, {
        operation: "Upload document",
        category: "upload",
        message: "Failed to upload document",
        isTransient: false,
        recovery: "retry",
        metadata: { workspaceCode, fileName: file.name, fileSize: file.size },
      });

      throw error;
    }
  }

  async deleteDocument(
    workspaceCode: string,
    document: ProjectDocument,
  ): Promise<void> {
    const authInstance = auth;
    const firestore = db;
    const storageInstance = storage;

    if (!authInstance || !authInstance.currentUser) {
      throw new Error("User must be authenticated");
    }

    if (!firestore) {
      throw new Error("Firebase Firestore is not initialized");
    }

    try {
      if (storageInstance && document.storageFullPath) {
        try {
          const storageRef = ref(storageInstance, document.storageFullPath);
          await deleteObject(storageRef);
        } catch (storageError) {
          logger.warn("Failed to remove document from storage", storageError);
        }
      }

      const workspaceRef = doc(firestore, "workspaces", workspaceCode);
      const workspaceSnapshot = await getDoc(workspaceRef);
      if (!workspaceSnapshot.exists()) {
        return;
      }

      const workspaceData = workspaceSnapshot.data() as FirebaseWorkspace;
      const documents = (workspaceData.documents ?? []).filter(
        (entry) => entry.id !== document.id,
      );

      await updateDoc(workspaceRef, {
        documents,
        lastModified: serverTimestamp(),
      });
    } catch (error) {
      logger.error("Error deleting document:", error);

      // Report failure to notification service
      failureNotificationService.reportFailure(error, {
        operation: "Delete document",
        category: "delete",
        message: "Failed to delete document",
        isTransient: false,
        recovery: "retry",
        metadata: {
          workspaceCode,
          documentId: document.id,
          documentName: document.name,
        },
      });

      throw error;
    }
  }

  // Upload cover image for showcase project
  async uploadCoverImage(
    workspaceCode: string,
    file: File,
    options: {
      onProgress?: (progress: number) => void;
    } = {},
  ): Promise<string> {
    const authInstance = auth;
    const firestore = db;
    const storageInstance = storage;

    if (!authInstance || !authInstance.currentUser) {
      throw new Error("User must be authenticated");
    }

    if (!firestore) {
      throw new Error("Firebase Firestore is not initialized");
    }

    if (!storageInstance) {
      throw new Error("Firebase Storage is not initialized");
    }

    // Validate file is an image
    if (!file.type.startsWith("image/")) {
      throw new Error("File must be an image");
    }

    // Validate file size (max 5MB)
    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      throw new Error("Image must be smaller than 5MB");
    }

    try {
      // Verify workspace ownership with timeout
      const workspace = await Promise.race([
        this.getWorkspace(workspaceCode),
        new Promise<null>((_, reject) =>
          setTimeout(
            () => reject(new Error("Workspace verification timeout")),
            10000,
          ),
        ),
      ]);

      if (!workspace) {
        throw new Error("Workspace not found");
      }

      const imageId = nanoid();
      const fileName = `cover_${imageId}_${file.name}`;
      const storageRef = ref(
        storageInstance,
        `covers/${authInstance.currentUser.uid}/${workspaceCode}/${fileName}`,
      );

      const uploadTask = uploadBytesResumable(storageRef, file);

      // Report initial progress
      if (options.onProgress) {
        options.onProgress(0);
      }

      // Add timeout to upload operation (60 seconds)
      const snapshot = await Promise.race([
        new Promise<ReturnType<typeof uploadBytesResumable>["snapshot"]>(
          (resolve, reject) => {
            uploadTask.on(
              "state_changed",
              (taskSnapshot) => {
                if (options.onProgress && taskSnapshot.totalBytes > 0) {
                  const progress = Math.round(
                    (taskSnapshot.bytesTransferred / taskSnapshot.totalBytes) *
                      100,
                  );
                  options.onProgress(progress);
                }
              },
              (error) => reject(error),
              () => resolve(uploadTask.snapshot),
            );
          },
        ),
        new Promise<never>((_, reject) =>
          setTimeout(
            () =>
              reject(
                new Error("Upload timeout - please check your connection"),
              ),
            60000,
          ),
        ),
      ]);

      const downloadURL = await getDownloadURL(snapshot.ref);

      // Update workspace with cover image URL
      await updateDoc(doc(firestore, "workspaces", workspaceCode), {
        "assets.coverImage": downloadURL,
        lastModified: serverTimestamp(),
      });

      logger.info("Cover image uploaded successfully", {
        workspaceCode,
        fileName,
      });

      return downloadURL;
    } catch (error) {
      logger.error("Error uploading cover image:", error);

      failureNotificationService.reportFailure(error, {
        operation: "Upload cover image",
        category: "upload",
        message: "Failed to upload cover image",
        isTransient: false,
        recovery: "retry",
        metadata: { workspaceCode, fileName: file.name, fileSize: file.size },
      });

      throw error;
    }
  }

  // Delete cover image
  async deleteCoverImage(workspaceCode: string): Promise<void> {
    const authInstance = auth;
    const firestore = db;
    const storageInstance = storage;

    if (!authInstance || !authInstance.currentUser) {
      throw new Error("User must be authenticated");
    }

    if (!firestore) {
      throw new Error("Firebase Firestore is not initialized");
    }

    try {
      const workspace = await this.getWorkspace(workspaceCode);
      if (!workspace?.assets?.coverImage) {
        return; // No cover image to delete
      }

      // Try to delete from storage if possible
      if (storageInstance) {
        try {
          // Extract storage path from download URL
          const url = new URL(workspace.assets.coverImage);
          const pathMatch = url.pathname.match(/\/o\/(.+?)\?/);
          if (pathMatch) {
            const storagePath = decodeURIComponent(pathMatch[1] ?? "");
            const storageRef = ref(storageInstance, storagePath);
            await deleteObject(storageRef);
          }
        } catch (storageError) {
          logger.warn(
            "Failed to remove cover image from storage",
            storageError,
          );
        }
      }

      // Remove from Firestore
      await updateDoc(doc(firestore, "workspaces", workspaceCode), {
        "assets.coverImage": null,
        lastModified: serverTimestamp(),
      });

      logger.info("Cover image deleted successfully", { workspaceCode });
    } catch (error) {
      logger.error("Error deleting cover image:", error);

      failureNotificationService.reportFailure(error, {
        operation: "Delete cover image",
        category: "delete",
        message: "Failed to delete cover image",
        isTransient: false,
        recovery: "retry",
        metadata: { workspaceCode },
      });

      throw error;
    }
  }

  // Upload project image
  async uploadProjectImage(
    workspaceCode: string,
    file: File,
    options: {
      onProgress?: (progress: number) => void;
    } = {},
  ): Promise<string> {
    const authInstance = auth;
    const firestore = db;
    const storageInstance = storage;

    if (!authInstance || !authInstance.currentUser) {
      throw new Error("User must be authenticated");
    }

    if (!firestore) {
      throw new Error("Firebase Firestore is not initialized");
    }

    if (!storageInstance) {
      throw new Error("Firebase Storage is not initialized");
    }

    // Validate file is an image
    if (!file.type.startsWith("image/")) {
      throw new Error("File must be an image");
    }

    // Validate file size (max 5MB)
    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      throw new Error("Image must be smaller than 5MB");
    }

    try {
      // Verify workspace ownership with timeout
      const workspace = await Promise.race([
        this.getWorkspace(workspaceCode),
        new Promise<null>((_, reject) =>
          setTimeout(
            () => reject(new Error("Workspace verification timeout")),
            10000,
          ),
        ),
      ]);

      if (!workspace) {
        throw new Error("Workspace not found");
      }

      // Check image limit (max 10 images)
      const currentImages = workspace.assets?.screenshots || [];
      if (currentImages.length >= 10) {
        throw new Error("Maximum 10 images allowed");
      }

      const imageId = nanoid();
      const fileName = `image_${imageId}_${file.name}`;
      const storageRef = ref(
        storageInstance,
        `project-images/${authInstance.currentUser.uid}/${workspaceCode}/${fileName}`,
      );

      const uploadTask = uploadBytesResumable(storageRef, file);

      // Report initial progress
      if (options.onProgress) {
        options.onProgress(0);
      }

      // Add timeout to upload operation (60 seconds)
      const snapshot = await Promise.race([
        new Promise<ReturnType<typeof uploadBytesResumable>["snapshot"]>(
          (resolve, reject) => {
            uploadTask.on(
              "state_changed",
              (taskSnapshot) => {
                if (options.onProgress && taskSnapshot.totalBytes > 0) {
                  const progress = Math.round(
                    (taskSnapshot.bytesTransferred / taskSnapshot.totalBytes) *
                      100,
                  );
                  options.onProgress(progress);
                }
              },
              (error) => reject(error),
              () => resolve(uploadTask.snapshot),
            );
          },
        ),
        new Promise<never>((_, reject) =>
          setTimeout(
            () =>
              reject(
                new Error("Upload timeout - please check your connection"),
              ),
            60000,
          ),
        ),
      ]);

      const downloadURL = await getDownloadURL(snapshot.ref);

      // Update workspace with new image URL (still using screenshots field for backward compatibility)
      await updateDoc(doc(firestore, "workspaces", workspaceCode), {
        "assets.screenshots": [...currentImages, downloadURL],
        lastModified: serverTimestamp(),
      });

      logger.info("Project image uploaded successfully", {
        workspaceCode,
        fileName,
      });

      return downloadURL;
    } catch (error) {
      logger.error("Error uploading project image:", error);

      failureNotificationService.reportFailure(error, {
        operation: "Upload project image",
        category: "upload",
        message: "Failed to upload project image",
        isTransient: false,
        recovery: "retry",
        metadata: { workspaceCode, fileName: file.name, fileSize: file.size },
      });

      throw error;
    }
  }

  // Delete project image
  async deleteProjectImage(
    workspaceCode: string,
    imageUrl: string,
  ): Promise<void> {
    const authInstance = auth;
    const firestore = db;
    const storageInstance = storage;

    if (!authInstance || !authInstance.currentUser) {
      throw new Error("User must be authenticated");
    }

    if (!firestore) {
      throw new Error("Firebase Firestore is not initialized");
    }

    try {
      const workspace = await this.getWorkspace(workspaceCode);
      if (!workspace?.assets?.screenshots) {
        return; // No images to delete
      }

      // Try to delete from storage if possible
      if (storageInstance) {
        try {
          // Extract storage path from download URL
          const url = new URL(imageUrl);
          const pathMatch = url.pathname.match(/\/o\/(.+?)\?/);
          if (pathMatch) {
            const storagePath = decodeURIComponent(pathMatch[1] ?? "");
            const storageRef = ref(storageInstance, storagePath);
            await deleteObject(storageRef);
          }
        } catch (storageError) {
          logger.warn(
            "Failed to remove project image from storage",
            storageError,
          );
        }
      }

      // Remove from Firestore
      const updatedImages = workspace.assets.screenshots.filter(
        (url) => url !== imageUrl,
      );
      await updateDoc(doc(firestore, "workspaces", workspaceCode), {
        "assets.screenshots": updatedImages,
        lastModified: serverTimestamp(),
      });

      logger.info("Project image deleted successfully", {
        workspaceCode,
        imageUrl,
      });
    } catch (error) {
      logger.error("Error deleting project image:", error);

      failureNotificationService.reportFailure(error, {
        operation: "Delete project image",
        category: "delete",
        message: "Failed to delete project image",
        isTransient: false,
        recovery: "retry",
        metadata: { workspaceCode, imageUrl },
      });

      throw error;
    }
  }

  // Add journal entry
  async addJournalEntry(
    workspaceCode: string,
    entry: Omit<JournalEntry, "id" | "timestamp">,
  ): Promise<JournalEntry> {
    const authInstance = auth;
    const firestore = db;

    if (!authInstance || !authInstance.currentUser) {
      throw new Error("User must be authenticated");
    }

    if (!firestore) {
      throw new Error("Firebase Firestore is not initialized");
    }

    try {
      const journalEntry: JournalEntry = {
        id: nanoid(),
        timestamp: new Date().toISOString(),
        ...entry,
      };

      await updateDoc(doc(firestore, "workspaces", workspaceCode), {
        journal: arrayUnion(journalEntry),
        lastModified: serverTimestamp(),
      });

      return journalEntry;
    } catch (error) {
      logger.error("Error adding journal entry:", error);
      throw error;
    }
  }

  // Add context note
  async addContextNote(
    workspaceCode: string,
    note: Omit<ContextNote, "id" | "createdAt">,
  ): Promise<ContextNote> {
    const authInstance = auth;
    const firestore = db;

    if (!authInstance || !authInstance.currentUser) {
      throw new Error("User must be authenticated");
    }

    if (!firestore) {
      throw new Error("Firebase Firestore is not initialized");
    }

    try {
      const contextNote: ContextNote = {
        id: nanoid(),
        createdAt: new Date().toISOString(),
        ...note,
      };

      await updateDoc(doc(firestore, "workspaces", workspaceCode), {
        contextNotes: arrayUnion(contextNote),
        lastModified: serverTimestamp(),
      });

      return contextNote;
    } catch (error) {
      logger.error("Error adding context note:", error);
      throw error;
    }
  }

  // Subscribe to workspace changes (real-time)
  subscribeToWorkspace(
    code: string,
    callback: (workspace: Workspace | null) => void,
  ): () => void {
    const firestore = db;
    if (!firestore) {
      logger.warn("Firestore not initialized; workspace subscription disabled");
      callback(null);
      return () => {
        return;
      };
    }

    const unsubscribe = onSnapshot(
      doc(firestore, "workspaces", code),
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          const data = docSnapshot.data() as FirebaseWorkspace;
          if (this.hasWorkspaceAccess(data)) {
            callback(this.convertFirebaseWorkspace(data));
          } else {
            callback(null);
          }
        } else {
          callback(null);
        }
      },
      (error) => {
        logger.error("Error in workspace subscription:", error);
        callback(null);
      },
    );

    return unsubscribe;
  }

  // Increment workspace view count
  async incrementViewCount(code: string): Promise<void> {
    try {
      const firestore = db;
      if (!firestore) {
        logger.debug(
          "Firestore not initialized; skipping view count increment",
        );
        return;
      }

      await updateDoc(doc(firestore, "workspaces", code), {
        views: increment(1),
        lastViewedAt: serverTimestamp(),
      });
    } catch (error) {
      logger.error("Error incrementing view count:", error);
      // Don't throw - this is non-critical
    }
  }

  // Increment workspace appreciation count
  async incrementAppreciation(code: string): Promise<number> {
    try {
      const firestore = db;
      if (!firestore) {
        logger.debug(
          "Firestore not initialized; skipping appreciation increment",
        );
        return 0;
      }

      const workspaceRef = doc(firestore, "workspaces", code);

      await updateDoc(workspaceRef, {
        appreciations: increment(1),
        lastModified: serverTimestamp(),
      });

      // Get updated count to return
      const workspaceSnapshot = await getDoc(workspaceRef);
      const workspaceData = workspaceSnapshot.data() as Workspace | undefined;

      return workspaceData?.appreciations || 0;
    } catch (error) {
      logger.error("Error incrementing appreciation:", error);
      throw error;
    }
  }

  async adjustCommentCount(code: string, delta: number): Promise<void> {
    try {
      const firestore = db;
      if (!firestore) {
        logger.debug(
          "Firestore not initialized; skipping comment count adjustment",
        );
        return;
      }

      const workspaceRef = doc(firestore, "workspaces", code);

      await updateDoc(workspaceRef, {
        commentCount: increment(delta),
        lastModified: serverTimestamp(),
      });

      const workspaceSnapshot = await getDoc(workspaceRef);
      const workspaceData = workspaceSnapshot.data() as
        | FirebaseWorkspace
        | undefined;
      const currentCount = workspaceData?.commentCount ?? 0;
      if (currentCount < 0) {
        await updateDoc(workspaceRef, { commentCount: 0 });
      }

      const slug = workspaceData?.slug;

      if (slug) {
        await setDoc(
          doc(firestore, "public_projects", slug),
          {
            commentCount: increment(delta),
            updatedAt: serverTimestamp(),
          } satisfies Record<string, unknown>,
          { merge: true },
        );

        if (currentCount < 0) {
          try {
            await updateDoc(doc(firestore, "public_projects", slug), {
              commentCount: 0,
            });
          } catch {
            await setDoc(
              doc(firestore, "public_projects", slug),
              { commentCount: 0 } satisfies Record<string, unknown>,
              { merge: true },
            );
          }
        }
      }
    } catch (error) {
      logger.warn("Error adjusting comment count", error);
    }
  }

  // Delete user data from Firestore
  async deleteUserData(userId: string): Promise<void> {
    const firestore = db;

    if (!firestore) {
      throw new Error("Firebase Firestore is not initialized");
    }

    try {
      // Delete user profile document
      await deleteDoc(doc(firestore, "users", userId));

      logger.info("User data deleted successfully", { userId });
    } catch (error) {
      logger.error("Error deleting user data:", error);

      failureNotificationService.reportFailure(error, {
        operation: "Delete user data",
        category: "delete",
        message: "Failed to delete user profile data",
        isTransient: false,
        recovery: "manual",
        metadata: { userId },
      });

      throw error;
    }
  }

  // Helper methods
  private hasWorkspaceAccess(workspace: FirebaseWorkspace): boolean {
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

  // Clean data for Firebase (remove undefined values)
  private cleanDataForFirebase<T>(obj: T): T {
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
        .map((item) => this.cleanDataForFirebase(item) as unknown)
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
        acc[key] = this.cleanDataForFirebase(value);
      }
      return acc;
    }, {});

    return cleanedObject as unknown as T;
  }

  private convertFirebaseWorkspace(
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

  private getFileType(
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

  // ============================================================
  // TwentySix Program Resource Management
  // ============================================================

  /**
   * Create a new TwentySix resource volunteer sign-up
   * @param resourceData - The resource volunteer data (name, email, expertise)
   * @returns The created resource ID
   */
  async createTwentySixResource(resourceData: {
    name: string;
    email: string;
    expertise: string;
  }): Promise<string> {
    try {
      const firestore = db;
      if (!firestore) {
        throw new Error("Firestore not initialized");
      }

      // Generate unique ID
      const resourceId = nanoid();
      const resourceRef = doc(firestore, "twentySixResources", resourceId);

      // Check if email already exists (duplicate prevention)
      // Note: This check will fail for non-authenticated users due to Firestore rules,
      // but we'll let Firestore handle the duplicate check on create
      try {
        const existingResource = await this.getTwentySixResourceByEmail(
          resourceData.email,
        );
        if (existingResource) {
          throw new Error(
            "This email has already been registered as a TwentySix resource",
          );
        }
      } catch {
        // Ignore permission errors - non-authenticated users can't query
        logger.info(
          "Could not check for duplicate email (expected for unauthenticated users)",
        );
      }

      // Create Firestore document
      const firebaseResource = {
        id: resourceId,
        name: resourceData.name.trim(),
        email: resourceData.email.trim().toLowerCase(),
        expertise: resourceData.expertise.trim(),
        status: "pending" as const,
        createdAt: serverTimestamp(),
        helpedCount: 0,
      };

      await setDoc(resourceRef, firebaseResource);

      logger.info("TwentySix resource created:", resourceId);
      return resourceId;
    } catch (error) {
      logger.error("Error creating TwentySix resource:", error);
      throw error;
    }
  }

  /**
   * Get a TwentySix resource by email (for duplicate checking)
   * @param email - The email to search for
   * @returns The resource if found, null otherwise
   */
  async getTwentySixResourceByEmail(
    email: string,
  ): Promise<{ id: string; email: string } | null> {
    try {
      const firestore = db;
      if (!firestore) {
        logger.warn("Firestore not initialized");
        return null;
      }

      // Note: This query will fail with Firestore rules since regular users
      // cannot read twentySixResources. This is intentional for privacy.
      // The API endpoint will handle this check server-side if needed.
      const resourcesRef = collection(firestore, "twentySixResources");
      const q = query(
        resourcesRef,
        where("email", "==", email.trim().toLowerCase()),
        limit(1),
      );

      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        return null;
      }

      const firstDoc = snapshot.docs[0];
      if (!firstDoc) {
        return null;
      }

      const data = firstDoc.data();
      return {
        id: firstDoc.id,
        email: data["email"] as string,
      };
    } catch (error) {
      // If permission denied (expected for non-admin users), return null
      if (
        error instanceof Error &&
        error.message.includes("permission-denied")
      ) {
        logger.info(
          "Permission denied checking for existing resource (expected for non-admin)",
        );
        return null;
      }
      logger.error("Error checking for existing TwentySix resource:", error);
      return null;
    }
  }

  /**
   * Get all TwentySix resources (admin only)
   * @returns Array of all resource volunteers
   */
  async getAllTwentySixResources(): Promise<
    Array<{
      id: string;
      name: string;
      email: string;
      expertise: string;
      status: string;
      createdAt: string;
    }>
  > {
    try {
      const firestore = db;
      if (!firestore) {
        throw new Error("Firestore not initialized");
      }

      // Note: This will fail for non-admin users due to Firestore rules
      const resourcesRef = collection(firestore, "twentySixResources");
      const q = query(resourcesRef, orderBy("createdAt", "desc"));

      const snapshot = await getDocs(q);

      return snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data["name"] as string,
          email: data["email"] as string,
          expertise: data["expertise"] as string,
          status: data["status"] as string,
          createdAt:
            data["createdAt"] instanceof Timestamp
              ? data["createdAt"].toDate().toISOString()
              : new Date().toISOString(),
        };
      });
    } catch (error) {
      logger.error("Error getting all TwentySix resources:", error);
      throw error;
    }
  }
}

// Export singleton instance
export const firebaseDatabase = FirebaseDatabaseService.getInstance();
