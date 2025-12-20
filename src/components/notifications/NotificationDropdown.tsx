"use client";

import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui-next";
import { Button } from "@/components/ui-next";
import { useNotifications } from "@/hooks/useNotifications";
import { Bell, Loader2 } from "@/icons";
import { cn } from "@/lib/utils";

interface NotificationDropdownProps {
  userId?: string | null;
}

export function NotificationDropdown({ userId }: NotificationDropdownProps) {
  const router = useRouter();
  const { notifications, unreadCount, loading, markAsRead, markAllAsRead } =
    useNotifications(userId);

  const handleNavigate = useCallback(
    async (notificationId: string, link?: string) => {
      await markAsRead(notificationId);
      if (link) {
        router.push(link);
      }
    },
    [markAsRead, router],
  );

  const hasNotifications = notifications.length > 0;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "relative h-10 w-10 rounded-full text-muted-foreground hover:text-foreground",
            unreadCount > 0 && "text-foreground",
          )}
          disabled={!userId}
          aria-label="Open notifications"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 ? (
            <span className="absolute -right-1 -top-1 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          ) : null}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-80 rounded-2xl border-white/10 bg-[#0b0d0f]/95 p-0 shadow-lg"
      >
        <DropdownMenuLabel className="flex items-center justify-between px-4 py-3 text-xs uppercase tracking-[0.24em] text-muted-foreground">
          Notifications
          {unreadCount > 0 ? (
            <Badge
              variant="outline"
              className="rounded-full text-[10px] uppercase tracking-[0.24em]"
            >
              {unreadCount} unread
            </Badge>
          ) : null}
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-white/5" />

        {loading ? (
          <div className="flex items-center justify-center gap-2 px-4 py-6 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading…
          </div>
        ) : hasNotifications ? (
          <div className="max-h-96 overflow-y-auto py-1">
            {notifications.map((notification) => {
              const timestamp = notification.createdAt
                ? formatDistanceToNow(new Date(notification.createdAt), {
                    addSuffix: true,
                  })
                : "Just now";

              return (
                <DropdownMenuItem
                  key={notification.id}
                  className={cn(
                    "flex flex-col items-start gap-1 px-4 py-3 text-sm text-muted-foreground focus:bg-white/10",
                    !notification.read && "bg-white/5 text-foreground",
                  )}
                  onSelect={() => {
                    void handleNavigate(notification.id, notification.link);
                  }}
                >
                  <div className="flex w-full items-center justify-between">
                    <span className="font-medium text-foreground">
                      {notification.actorName}
                    </span>
                    <span className="text-xs uppercase tracking-[0.24em] text-muted-foreground/60">
                      {timestamp}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {notification.message}
                  </p>
                  {notification.projectName ? (
                    <p className="text-xs text-muted-foreground/60">
                      {notification.projectName}
                    </p>
                  ) : null}
                </DropdownMenuItem>
              );
            })}
          </div>
        ) : (
          <div className="px-4 py-6 text-center text-sm text-muted-foreground">
            You’re all caught up.
          </div>
        )}

        <DropdownMenuSeparator className="bg-white/5" />
        <div className="flex items-center justify-between px-4 py-3">
          <Button
            variant="ghost"
            size="sm"
            className="rounded-full px-4 text-xs uppercase tracking-[0.24em] text-muted-foreground hover:text-foreground"
            onClick={() => {
              void markAllAsRead();
            }}
            disabled={unreadCount === 0 || loading}
          >
            Mark all as read
          </Button>
          <span className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground/70">
            {notifications.length} total
          </span>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
