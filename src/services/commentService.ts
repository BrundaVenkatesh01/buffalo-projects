import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
  updateDoc,
  where,
  type FieldValue,
} from "firebase/firestore";

import { emailService } from "@/services/emailService";
import { auth, db } from "@/services/firebase";
import { authService } from "@/services/firebaseAuth";
import { firebaseDatabase } from "@/services/firebaseDatabase";
import { notificationService } from "@/services/notificationService";
import type { Comment } from "@/types";
import { logger } from "@/utils/logger";
import type { MentionSuggestion } from "@/utils/mentionParser";

const COMMENTS_COLLECTION = "comments";
const MAX_COMMENTS = 100;

interface FirestoreComment {
  projectId: string;
  userId: string;
  userDisplayName: string;
  content: string;
  mentions?: string[];
  createdAt: Timestamp | FieldValue | null;
  updatedAt: Timestamp | FieldValue | null;
  isEdited?: boolean;
}

const toIsoString = (
  value: Timestamp | FieldValue | null | undefined,
): string => {
  if (!value) {
    return new Date().toISOString();
  }

  try {
    if (value instanceof Timestamp) {
      return value.toDate().toISOString();
    }

    const maybeTimestamp = value as { toDate?: () => Date };
    if (typeof maybeTimestamp.toDate === "function") {
      return maybeTimestamp.toDate().toISOString();
    }
  } catch (error) {
    logger.warn("Failed to convert Firestore timestamp", error);
  }

  return new Date().toISOString();
};

const mapComment = (id: string, data: FirestoreComment): Comment => ({
  id,
  projectId: data.projectId,
  userId: data.userId,
  userDisplayName: data.userDisplayName,
  content: data.content,
  createdAt: toIsoString(data.createdAt),
  updatedAt: toIsoString(data.updatedAt ?? data.createdAt),
  isEdited: Boolean(data.isEdited),
  mentions: data.mentions ?? [],
});

export interface CreateCommentInput {
  projectId: string;
  content: string;
  mentionIds?: string[];
  projectSlug?: string;
  projectName?: string;
  projectOwnerId?: string;
}

export interface UpdateCommentInput {
  commentId: string;
  content: string;
  mentionIds?: string[];
}

export type CommentListener = (comments: Comment[]) => void;

class CommentService {
  private get firestore() {
    if (!db) {
      throw new Error("Firebase Firestore is not initialized");
    }
    return db;
  }

  async createComment(input: CreateCommentInput): Promise<Comment> {
    const { projectId, content } = input;
    if (!projectId || !content.trim()) {
      throw new Error("Project ID and content are required");
    }

    const authInstance = auth;
    const currentUser =
      authInstance?.currentUser ?? authService.getCurrentUser();

    if (!currentUser) {
      throw new Error("User must be authenticated to leave a comment");
    }

    const displayName =
      currentUser.displayName?.trim() ||
      currentUser.email?.split("@")[0] ||
      "Community Member";

    const mentionSet = new Set(
      (input.mentionIds ?? []).filter((id) => typeof id === "string"),
    );
    mentionSet.delete(currentUser.uid);

    const firestore = this.firestore;
    const now = serverTimestamp();

    const docRef = await addDoc(collection(firestore, COMMENTS_COLLECTION), {
      projectId,
      userId: currentUser.uid,
      userDisplayName: displayName,
      content: content.trim(),
      mentions: Array.from(mentionSet),
      createdAt: now,
      updatedAt: now,
      isEdited: false,
    } satisfies FirestoreComment);

    await firebaseDatabase.adjustCommentCount(projectId, 1);

    const recipients = new Set<string>();
    if (input.projectOwnerId && input.projectOwnerId !== currentUser.uid) {
      recipients.add(input.projectOwnerId);
    }

    mentionSet.forEach((id) => {
      if (id !== currentUser.uid) {
        recipients.add(id);
      }
    });

    if (recipients.size > 0) {
      const messageBase = input.projectName?.trim().length
        ? `left feedback on “${input.projectName.trim()}”`
        : "left feedback on your project";

      await Promise.all(
        Array.from(recipients).map(async (userId) => {
          const type = userId === input.projectOwnerId ? "comment" : "mention";
          const message =
            type === "comment"
              ? `${displayName} ${messageBase}`
              : `${displayName} mentioned you in a comment`;

          const notificationLink = input.projectSlug
            ? `/p/${input.projectSlug}`
            : undefined;

          await notificationService.createNotification({
            userId,
            projectId,
            type,
            actorId: currentUser.uid,
            actorName: displayName,
            message,
            ...(input.projectSlug ? { projectSlug: input.projectSlug } : {}),
            ...(input.projectName ? { projectName: input.projectName } : {}),
            ...(currentUser.photoURL
              ? { actorAvatarUrl: currentUser.photoURL }
              : {}),
            ...(notificationLink ? { link: notificationLink } : {}),
          });

          await emailService.sendCommentNotification({
            recipientId: userId,
            type,
            actorName: displayName,
            commentPreview: content,
            projectId,
            ...(input.projectSlug ? { projectSlug: input.projectSlug } : {}),
            ...(input.projectName ? { projectName: input.projectName } : {}),
          });
        }),
      );
    }

    return {
      id: docRef.id,
      projectId,
      userId: currentUser.uid,
      userDisplayName: displayName,
      content: content.trim(),
      mentions: Array.from(mentionSet),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isEdited: false,
    };
  }

  async getCommentsByProject(projectId: string): Promise<Comment[]> {
    try {
      const firestore = this.firestore;
      const snapshot = await getDocs(
        query(
          collection(firestore, COMMENTS_COLLECTION),
          where("projectId", "==", projectId),
          orderBy("createdAt", "desc"),
          limit(MAX_COMMENTS),
        ),
      );

      return snapshot.docs.map((docSnapshot) =>
        mapComment(docSnapshot.id, docSnapshot.data() as FirestoreComment),
      );
    } catch (error) {
      logger.error("Failed to fetch comments", error);
      // Sanitize error message - never expose raw Firebase errors to users
      const message = error instanceof Error ? error.message : String(error);
      if (message.includes("index")) {
        throw new Error(
          "Comments are currently being set up. Please try again in a moment.",
        );
      }
      throw new Error(
        "Unable to load comments at this time. Please try again later.",
      );
    }
  }

  subscribeToProjectComments(
    projectId: string,
    listener: CommentListener,
    onError?: (error: string) => void,
  ): () => void {
    const firestore = this.firestore;
    const q = query(
      collection(firestore, COMMENTS_COLLECTION),
      where("projectId", "==", projectId),
      orderBy("createdAt", "desc"),
      limit(MAX_COMMENTS),
    );

    return onSnapshot(
      q,
      (snapshot) => {
        const comments = snapshot.docs.map((docSnapshot) =>
          mapComment(docSnapshot.id, docSnapshot.data() as FirestoreComment),
        );
        listener(comments);
      },
      (error) => {
        logger.error("Failed to subscribe to comments", error);
        // Sanitize error message - never expose raw Firebase errors to users
        const message = error instanceof Error ? error.message : String(error);
        let userFriendlyMessage =
          "Unable to load comments at this time. Please try again later.";

        if (message.includes("index")) {
          userFriendlyMessage =
            "Comments are currently being set up. Please try again in a moment.";
        } else if (message.includes("permission")) {
          userFriendlyMessage =
            "You don't have permission to view these comments.";
        } else if (message.includes("network")) {
          userFriendlyMessage =
            "Network error. Please check your connection and try again.";
        }

        if (onError) {
          onError(userFriendlyMessage);
        }
      },
    );
  }

  async updateComment(input: UpdateCommentInput): Promise<void> {
    const authInstance = auth;
    const currentUser =
      authInstance?.currentUser ?? authService.getCurrentUser();

    if (!currentUser) {
      throw new Error("You must be signed in to edit comments");
    }

    const mentionSet = new Set(
      (input.mentionIds ?? []).filter((id) => typeof id === "string"),
    );
    mentionSet.delete(currentUser.uid);

    const firestore = this.firestore;
    const commentRef = doc(firestore, COMMENTS_COLLECTION, input.commentId);

    await updateDoc(commentRef, {
      content: input.content.trim(),
      mentions: Array.from(mentionSet),
      updatedAt: serverTimestamp(),
      isEdited: true,
    });
  }

  async deleteComment(commentId: string, projectId: string): Promise<void> {
    const firestore = this.firestore;
    await deleteDoc(doc(firestore, COMMENTS_COLLECTION, commentId));
    await firebaseDatabase.adjustCommentCount(projectId, -1);
  }

  async buildDefaultMentionSuggestions(
    projectId: string,
  ): Promise<MentionSuggestion[]> {
    try {
      const comments = await this.getCommentsByProject(projectId);
      const seen = new Map<string, MentionSuggestion>();

      comments.forEach((comment) => {
        if (seen.has(comment.userId)) {
          return;
        }
        seen.set(comment.userId, {
          id: comment.userId,
          displayName: comment.userDisplayName,
          handle: comment.userDisplayName
            .toLowerCase()
            .replace(/[^a-z0-9_]/g, ""),
        });
      });

      return Array.from(seen.values());
    } catch (error) {
      logger.warn("Failed to build mention suggestions", error);
      return [];
    }
  }
}

export const commentService = new CommentService();
