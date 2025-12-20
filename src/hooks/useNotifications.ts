import { useCallback, useEffect, useMemo, useState } from "react";

// notificationService kept for markAsRead/markAllAsRead (no-ops when feature disabled)
import { notificationService } from "@/services/notificationService";
import type { Notification } from "@/types";

export interface UseNotificationsResult {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
}

export function useNotifications(
  userId?: string | null,
): UseNotificationsResult {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Notifications feature disabled for '26 launch - skip Firestore subscription
    // to avoid index errors until notification system is fully implemented
    setNotifications([]);
    setLoading(false);
  }, [userId]);

  const unreadCount = useMemo(
    () => notifications.filter((notification) => !notification.read).length,
    [notifications],
  );

  const markAsRead = useCallback(async (notificationId: string) => {
    await notificationService.markAsRead(notificationId);
  }, []);

  const markAllAsRead = useCallback(async () => {
    if (!userId) {
      return;
    }
    await notificationService.markAllAsRead(userId);
  }, [userId]);

  return {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
  };
}
