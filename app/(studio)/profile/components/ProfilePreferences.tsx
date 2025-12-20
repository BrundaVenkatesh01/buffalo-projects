"use client";

import { m, AnimatePresence } from "framer-motion";
import { useState } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/unified";
import { ChevronDown, Settings } from "@/icons";
import { cn } from "@/lib/utils";

interface ProfilePreferencesProps {
  emailNotifications: boolean;
  mentorMode: boolean;
  onToggleEmail: (value: boolean) => Promise<void>;
  onToggleMentor: (value: boolean) => Promise<void>;
  saving?: boolean;
  mentorSaving?: boolean;
}

export function ProfilePreferences({
  emailNotifications: _emailNotifications,
  mentorMode: _mentorMode,
  onToggleEmail: _onToggleEmail,
  onToggleMentor: _onToggleMentor,
  saving: _saving = false,
  mentorSaving: _mentorSaving = false,
}: ProfilePreferencesProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card
      variant="default"
      padding="md"
      className="transition-all duration-200 hover:shadow-md"
    >
      <CardHeader
        className="cursor-pointer select-none rounded-t-lg transition-all duration-200 hover:bg-muted/30"
        onClick={() => setIsExpanded(!isExpanded)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setIsExpanded(!isExpanded);
          }
        }}
        aria-expanded={isExpanded}
        aria-controls="preferences-content"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <Settings className="h-4 w-4 text-primary" />
            </div>
            <CardTitle>Preferences</CardTitle>
          </div>
          <ChevronDown
            className={cn(
              "h-4 w-4 text-muted-foreground transition-transform duration-300",
              isExpanded && "rotate-180",
            )}
          />
        </div>
        {!isExpanded && (
          <CardDescription className="mt-1.5">
            Manage your account settings and notification preferences
          </CardDescription>
        )}
      </CardHeader>

      <AnimatePresence>
        {isExpanded && (
          <m.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <CardContent id="preferences-content" className="space-y-4 pt-4">
              {/* Features hidden for January launch - deferred to '26

              Mentor Mode
              <div className="group flex flex-col gap-3 rounded-lg border-2 border-border bg-card p-4 transition-all duration-200 hover:border-primary/30 hover:bg-muted/20 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 transition-transform duration-200 group-hover:scale-110">
                    <UserCheck className="h-5 w-5 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <Label
                      htmlFor="mentor-mode"
                      className="text-sm font-semibold text-foreground cursor-pointer"
                    >
                      Mentor Mode
                    </Label>
                    <p className="text-xs text-muted-foreground leading-tight">
                      Access mentor dashboard and provide feedback to Buffalo
                      builders
                    </p>
                  </div>
                </div>
                <Switch
                  id="mentor-mode"
                  checked={mentorMode}
                  disabled={mentorSaving}
                  onCheckedChange={(v) => {
                    void onToggleMentor(v);
                  }}
                  className="shrink-0"
                />
              </div>

              Email Notifications
              <div className="group flex flex-col gap-3 rounded-lg border-2 border-border bg-card p-4 transition-all duration-200 hover:border-primary/30 hover:bg-muted/20 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 transition-transform duration-200 group-hover:scale-110">
                    <Bell className="h-5 w-5 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <Label
                      htmlFor="email-alerts"
                      className="text-sm font-semibold text-foreground cursor-pointer"
                    >
                      Email Notifications
                    </Label>
                    <p className="text-xs text-muted-foreground leading-tight">
                      Receive emails for comments, mentions, and project
                      activity
                    </p>
                  </div>
                </div>
                <Switch
                  id="email-alerts"
                  checked={emailNotifications}
                  disabled={saving}
                  onCheckedChange={(v) => {
                    void onToggleEmail(v);
                  }}
                  className="shrink-0"
                />
              </div>
              */}

              {/* Placeholder for when no preferences are visible */}
              <div className="text-center py-8 text-muted-foreground">
                <p className="text-sm">
                  No preferences available at this time.
                </p>
                <p className="text-xs mt-2">
                  Check back after January 2026 for additional settings.
                </p>
              </div>
            </CardContent>
          </m.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
