"use client";

import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Skeleton,
} from "@/components/unified";
import { useNotifications } from "@/hooks/useNotifications";
import { AtSign, Bell, CheckCircle2, MessageCircle, Users } from "@/icons";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/authStore";
import type { Notification, NotificationType } from "@/types";

export const dynamic = "force-dynamic";

/**
 * Activity Page
 *
 * Shows notifications, project updates, and activity feed.
 * Part of the unified dashboard experience.
 */

const NOTIFICATION_ICONS: Record<NotificationType, typeof MessageCircle> = {
  comment: MessageCircle,
  mention: AtSign,
  intro: Users,
};

const NOTIFICATION_COLORS: Record<NotificationType, string> = {
  comment: "text-blue-500 bg-blue-500/10",
  mention: "text-purple-500 bg-purple-500/10",
  intro: "text-green-500 bg-green-500/10",
};

interface NotificationItemProps {
  notification: Notification;
  onNavigate: (notificationId: string, link?: string) => Promise<void>;
}

function NotificationItem({ notification, onNavigate }: NotificationItemProps) {
  const Icon = NOTIFICATION_ICONS[notification.type] || Bell;
  const colorClass =
    NOTIFICATION_COLORS[notification.type] || "text-muted-foreground bg-muted";

  const timestamp = notification.createdAt
    ? formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })
    : "Just now";

  return (
    <button
      onClick={() => void onNavigate(notification.id, notification.link)}
      className={cn(
        "w-full text-left p-4 rounded-lg transition-colors",
        "hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/20",
        !notification.read && "bg-primary/5 border-l-2 border-l-primary",
      )}
    >
      <div className="flex gap-3">
        <div className={cn("rounded-full p-2 shrink-0", colorClass)}>
          <Icon className="h-4 w-4" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <p
              className={cn(
                "text-sm",
                !notification.read
                  ? "font-medium text-foreground"
                  : "text-muted-foreground",
              )}
            >
              <span className="font-semibold">{notification.actorName}</span>{" "}
              {notification.message}
            </p>
            {!notification.read && (
              <span className="shrink-0 h-2 w-2 rounded-full bg-primary mt-1.5" />
            )}
          </div>
          <div className="flex items-center gap-2 mt-1">
            {notification.projectName && (
              <span className="text-xs text-muted-foreground truncate">
                {notification.projectName}
              </span>
            )}
            <span className="text-xs text-muted-foreground/60">
              {timestamp}
            </span>
          </div>
        </div>
      </div>
    </button>
  );
}

function NotificationSkeleton() {
  return (
    <div className="p-4">
      <div className="flex gap-3">
        <Skeleton className="h-8 w-8 rounded-full shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
    </div>
  );
}

export default function ActivityPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const { notifications, unreadCount, loading, markAsRead, markAllAsRead } =
    useNotifications(user?.uid);

  const handleNavigate = useCallback(
    async (notificationId: string, link?: string) => {
      await markAsRead(notificationId);
      if (link) {
        router.push(link);
      }
    },
    [markAsRead, router],
  );

  if (!user) {
    return null;
  }

  const hasNotifications = notifications.length > 0;

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Activity</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Comments, mentions, and updates on your projects
            </p>
          </div>
          {unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => void markAllAsRead()}
              className="shrink-0"
            >
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Mark all read
            </Button>
          )}
        </div>

        {/* Stats bar */}
        {hasNotifications && (
          <div className="mb-6 flex items-center gap-4 text-sm text-muted-foreground">
            <span>
              <strong className="text-foreground">
                {notifications.length}
              </strong>{" "}
              notifications
            </span>
            {unreadCount > 0 && (
              <span className="text-primary">
                <strong>{unreadCount}</strong> unread
              </span>
            )}
          </div>
        )}

        {/* Notification List */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-muted-foreground" />
              <CardTitle className="text-lg">Recent Activity</CardTitle>
            </div>
            <CardDescription>
              Stay updated on your projects and community interactions
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="divide-y">
                <NotificationSkeleton />
                <NotificationSkeleton />
                <NotificationSkeleton />
              </div>
            ) : hasNotifications ? (
              <div className="divide-y">
                {notifications.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onNavigate={handleNavigate}
                  />
                ))}
              </div>
            ) : (
              <div className="py-12 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                  <Bell className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium text-foreground">
                  All caught up
                </h3>
                <p className="mt-1 text-sm text-muted-foreground max-w-sm mx-auto">
                  When someone comments on your projects or mentions you, it
                  will show up here.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tips section */}
        <div className="mt-6 rounded-lg border border-dashed p-4">
          <h3 className="text-sm font-medium text-foreground mb-2">
            Get more activity
          </h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>
              <span className="mr-2">1.</span>
              Publish your projects to the community gallery
            </li>
            <li>
              <span className="mr-2">2.</span>
              Comment on other builders&apos; projects to start conversations
            </li>
            <li>
              <span className="mr-2">3.</span>
              Add Give and Asks to help others find and help you
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
