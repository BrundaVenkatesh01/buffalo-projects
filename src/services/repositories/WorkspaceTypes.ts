/**
 * Workspace Repository Types
 *
 * Shared TypeScript interfaces used across workspace repositories.
 * Extracted from firebaseDatabase.ts for better modularity.
 */

import type { DocumentSnapshot, Timestamp } from "firebase/firestore";

import type { Workspace } from "@/types";

/**
 * Firebase-compatible workspace type with Firestore Timestamps
 */
export interface FirebaseWorkspace
  extends Omit<Workspace, "createdAt" | "lastModified"> {
  createdAt: Timestamp;
  lastModified: Timestamp;
  ownerId: string; // Firebase UID
  collaborators?: string[]; // Array of Firebase UIDs
}

/**
 * Query options for workspace searches
 */
export interface WorkspaceQuery {
  limit?: number;
  orderBy?: "createdAt" | "lastModified" | "projectName" | "publishedAt";
  orderDirection?: "asc" | "desc";
  category?: string;
  stage?: string;
  isPublic?: boolean;
  ownerId?: string;
  classCode?: string;
  startAfter?: DocumentSnapshot;
  tagsAny?: string[];
}

/**
 * Input for creating a new project/workspace
 */
export interface CreateProjectInput {
  projectName: string;
  description?: string;
  stage?: Workspace["stage"];
  tags?: string[];
  location?: Workspace["location"];
  category?: string;
  classCode?: string;
  buffaloAffiliated?: boolean;
  projectType?: "showcase" | "workspace";
  oneLiner?: string;
  publicLink?: string;
}
