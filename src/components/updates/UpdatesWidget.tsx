/**
 * UpdatesWidget - Always-visible updates indicator
 *
 * Fixed position bottom-right widget that shows platform updates.
 * Displays unread count badge and expands to show changelog.
 */

"use client";

import { AnimatePresence, m } from "framer-motion";
import { Rocket, X } from "lucide-react";
import { useEffect } from "react";

import { Button } from "@/components/ui-next/Button";
import {
  PLATFORM_UPDATES,
  getUpdateTypeInfo,
  type PlatformUpdate,
} from "@/data/updates";
import { ANIMATIONS } from "@/lib/animations";
import { cn } from "@/lib/utils";
import {
  useUpdatesStore,
  useUnreadUpdatesCount,
  useIsUpdateUnread,
} from "@/stores/updatesStore";
import { BUFFALO_BLUE } from "@/tokens";

export function UpdatesWidget() {
  const { isPanelOpen, togglePanel, closePanel, markAllAsSeen } =
    useUpdatesStore();
  const unreadCount = useUnreadUpdatesCount(PLATFORM_UPDATES.map((u) => u.id));

  // Mark all as seen when panel is opened
  useEffect(() => {
    if (isPanelOpen) {
      markAllAsSeen(PLATFORM_UPDATES.map((u) => u.id));
    }
  }, [isPanelOpen, markAllAsSeen]);

  return (
    <>
      {/* Fixed bottom-right button */}
      <m.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ ...ANIMATIONS.transition.smooth, delay: 0.5 }}
      >
        <Button
          variant="secondary"
          size="icon-lg"
          onClick={togglePanel}
          className="relative shadow-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/50"
          aria-label={
            unreadCount > 0
              ? `${unreadCount} new updates`
              : "View platform updates"
          }
        >
          <Rocket className="h-5 w-5 text-zinc-400" />

          {/* Unread badge */}
          {unreadCount > 0 && (
            <m.span
              className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-md"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={ANIMATIONS.spring.bounce}
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </m.span>
          )}
        </Button>
      </m.div>

      {/* Updates panel */}
      <AnimatePresence>
        {isPanelOpen && (
          <>
            {/* Backdrop */}
            <m.div
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closePanel}
            />

            {/* Panel */}
            <m.div
              className="fixed bottom-6 right-6 z-50 w-[420px] max-h-[600px] flex flex-col rounded-lg border border-white/10 bg-black/95 shadow-2xl backdrop-blur-xl"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={ANIMATIONS.transition.smooth}
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-white/10 p-4">
                <h2 className="text-lg font-semibold text-white">
                  What&apos;s New
                </h2>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={closePanel}
                  aria-label="Close updates"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Updates list */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {PLATFORM_UPDATES.length === 0 ? (
                  <div className="text-center text-white/60 py-8">
                    No updates yet. Check back soon!
                  </div>
                ) : (
                  PLATFORM_UPDATES.map((update) => (
                    <UpdateItem key={update.id} update={update} />
                  ))
                )}
              </div>

              {/* Footer */}
              <div className="border-t border-white/10 p-3 text-center">
                <p className="text-xs text-white/40">
                  Built with ❤️ by the Buffalo community
                </p>
              </div>
            </m.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

/**
 * Individual update item in the list
 */
function UpdateItem({ update }: { update: PlatformUpdate }) {
  const isUnread = useIsUpdateUnread(update.id);
  const typeInfo = getUpdateTypeInfo(update.type);
  const date = new Date(update.date);
  const formattedDate = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <m.div
      className={cn(
        "rounded-lg border p-4 transition-all",
        isUnread
          ? "border-white/20 bg-white/5"
          : "border-white/10 bg-transparent",
      )}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={ANIMATIONS.transition.smooth}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2">
          <span className="text-lg">{typeInfo.icon}</span>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-white text-sm">
                {update.title}
              </h3>
              {isUnread && (
                <span className="h-2 w-2 rounded-full bg-blue-500" />
              )}
            </div>
            <p className="text-xs text-white/60">{formattedDate}</p>
          </div>
        </div>
        <span
          className="text-xs font-medium px-2 py-0.5 rounded-full"
          style={{
            backgroundColor: `${typeInfo.color}20`,
            color: typeInfo.color,
          }}
        >
          {typeInfo.label}
        </span>
      </div>

      {/* Description */}
      <p className="text-sm text-white/80 leading-relaxed">
        {update.description}
      </p>

      {/* Optional link */}
      {update.link && (
        <a
          href={update.link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs font-medium mt-3 transition-colors"
          style={{ color: BUFFALO_BLUE }}
        >
          Learn more →
        </a>
      )}
    </m.div>
  );
}
