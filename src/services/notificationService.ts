import {
  addDoc,
  collection,
  doc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { Timestamp, type FieldValue } from "firebase/firestore";

import { db } from "@/services/firebase";
import type { Notification, NotificationType } from "@/types";
import { logger } from "@/utils/logger";

const COLLECTION = "notifications";
const MAX_FETCH = 25;

interface FirestoreNotification {
  userId: string;
  projectId: string;
  projectSlug?: string;
  projectName?: string;
  type: NotificationType;
  actorId: string;
  actorName: string;
  actorAvatarUrl?: string;
  message: string;
  read: boolean;
  createdAt: Timestamp | FieldValue;
  readAt?: Timestamp | null;
  link?: string;
}

const toIso = (
  value: Timestamp | FieldValue | null | undefined,
): string | undefined => {
  if (!value) {
    return undefined;
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
    logger.warn("Failed to convert timestamp", error);
  }
  return undefined;
};

const mapNotification = (
  id: string,
  data: FirestoreNotification,
): Notification => {
  const readAtIso = toIso(data.readAt ?? null);

  return {
    id,
    userId: data.userId,
    projectId: data.projectId,
    type: data.type,
    actorId: data.actorId,
    actorName: data.actorName,
    message: data.message,
    read: data.read,
    createdAt: toIso(data.createdAt) ?? new Date().toISOString(),
    ...(readAtIso ? { readAt: readAtIso } : {}),
    ...(data.projectSlug ? { projectSlug: data.projectSlug } : {}),
    ...(data.projectName ? { projectName: data.projectName } : {}),
    ...(data.actorAvatarUrl ? { actorAvatarUrl: data.actorAvatarUrl } : {}),
    ...(data.link ? { link: data.link } : {}),
  };
};

export interface CreateNotificationInput {
  userId: string;
  projectId: string;
  projectSlug?: string;
  projectName?: string;
  type: NotificationType;
  actorId: string;
  actorName: string;
  actorAvatarUrl?: string | null;
  message: string;
  link?: string;
}

export type NotificationListener = (notifications: Notification[]) => void;

class NotificationService {
  private get firestore() {
    if (!db) {
      throw new Error("Firebase Firestore is not initialized");
    }
    return db;
  }

  async createNotification(input: CreateNotificationInput): Promise<void> {
    if (!input.userId || !input.projectId) {
      throw new Error("Notification requires userId and projectId");
    }

    if (input.userId === input.actorId) {
      return;
    }

    try {
      const firestore = this.firestore;
      const payload: Partial<FirestoreNotification> = {
        userId: input.userId,
        projectId: input.projectId,
        type: input.type,
        actorId: input.actorId,
        actorName: input.actorName,
        message: input.message,
        read: false,
        createdAt: serverTimestamp(),
        readAt: null,
      };

      if (input.projectSlug) {
        payload.projectSlug = input.projectSlug;
      }
      if (input.projectName) {
        payload.projectName = input.projectName;
      }
      if (input.actorAvatarUrl) {
        payload.actorAvatarUrl = input.actorAvatarUrl;
      }
      if (input.link) {
        payload.link = input.link;
      }

      await addDoc(collection(firestore, COLLECTION), payload);
    } catch (error) {
      logger.error("Failed to create notification", error);
    }
  }

  subscribeToNotifications(
    userId: string,
    listener: NotificationListener,
  ): () => void {
    const firestore = this.firestore;
    const q = query(
      collection(firestore, COLLECTION),
      where("userId", "==", userId),
      orderBy("createdAt", "desc"),
      limit(MAX_FETCH),
    );

    return onSnapshot(
      q,
      (snapshot) => {
        const notifications = snapshot.docs.map((docSnapshot) =>
          mapNotification(
            docSnapshot.id,
            docSnapshot.data() as FirestoreNotification,
          ),
        );
        listener(notifications);
      },
      (error) => {
        logger.error("Failed to subscribe to notifications", error);
      },
    );
  }

  async getUnreadNotifications(userId: string): Promise<Notification[]> {
    const firestore = this.firestore;
    const snapshot = await getDocs(
      query(
        collection(firestore, COLLECTION),
        where("userId", "==", userId),
        where("read", "==", false),
        orderBy("createdAt", "desc"),
        limit(MAX_FETCH),
      ),
    );

    return snapshot.docs.map((docSnapshot) =>
      mapNotification(
        docSnapshot.id,
        docSnapshot.data() as FirestoreNotification,
      ),
    );
  }

  async markAsRead(notificationId: string): Promise<void> {
    try {
      const firestore = this.firestore;
      await updateDoc(doc(firestore, COLLECTION, notificationId), {
        read: true,
        readAt: serverTimestamp(),
      });
    } catch (error) {
      logger.error("Failed to mark notification as read", error);
    }
  }

  async markAllAsRead(userId: string): Promise<void> {
    try {
      const firestore = this.firestore;
      const snapshot = await getDocs(
        query(
          collection(firestore, COLLECTION),
          where("userId", "==", userId),
          where("read", "==", false),
          orderBy("createdAt", "desc"),
          limit(MAX_FETCH),
        ),
      );

      await Promise.all(
        snapshot.docs.map((docSnapshot) =>
          updateDoc(docSnapshot.ref, {
            read: true,
            readAt: serverTimestamp(),
          }),
        ),
      );
    } catch (error) {
      logger.error("Failed to mark notifications as read", error);
    }
  }
}

export const notificationService = new NotificationService();
