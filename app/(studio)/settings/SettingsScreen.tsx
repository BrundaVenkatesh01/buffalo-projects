"use client";
/* eslint-disable @typescript-eslint/require-await */

import { m } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

import { ProfileAccountDanger } from "../profile/components/ProfileAccountDanger";
import { ProfilePreferences } from "../profile/components/ProfilePreferences";

import { ArrowLeft, User, Shield, Bell, Lock } from "@/icons";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/authStore";

type SettingsSection = "profile" | "account" | "notifications" | "privacy";

export function SettingsScreen() {
  const { user } = useAuthStore();
  const [activeSection, setActiveSection] =
    useState<SettingsSection>("profile");
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [mentorMode, setMentorMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [mentorSaving, setMentorSaving] = useState(false);

  const handleToggleEmail = async (value: boolean) => {
    setSaving(true);
    try {
      setEmailNotifications(value);
      toast.success(
        value ? "Email notifications enabled" : "Email notifications disabled",
      );
    } catch {
      toast.error("Failed to update email preferences");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleMentor = async (value: boolean) => {
    setMentorSaving(true);
    try {
      setMentorMode(value);
      toast.success(value ? "Mentor mode enabled" : "Mentor mode disabled");
    } catch {
      toast.error("Failed to update mentor mode");
    } finally {
      setMentorSaving(false);
    }
  };

  const sections = [
    {
      id: "profile" as const,
      label: "Profile",
      icon: User,
      description: "Manage your profile preferences",
    },
    {
      id: "account" as const,
      label: "Account",
      icon: Shield,
      description: "Security and danger zone",
    },
    {
      id: "notifications" as const,
      label: "Notifications",
      icon: Bell,
      description: "Coming soon",
    },
    {
      id: "privacy" as const,
      label: "Privacy",
      icon: Lock,
      description: "Coming soon",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        {/* Breadcrumb & Header */}
        <m.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 space-y-4"
        >
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
          <div>
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground tracking-tight">
              Settings
            </h1>
            <p className="mt-2 text-base text-muted-foreground">
              Manage your account settings and preferences
            </p>
          </div>
        </m.div>

        {/* Settings Layout */}
        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          {/* Navigation Sidebar */}
          <m.nav
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-1"
          >
            {sections.map((section) => {
              const Icon = section.icon;
              const isActive = activeSection === section.id;
              const isDisabled =
                section.id === "notifications" || section.id === "privacy";

              return (
                <button
                  key={section.id}
                  onClick={() => !isDisabled && setActiveSection(section.id)}
                  disabled={isDisabled}
                  className={cn(
                    "w-full flex items-start gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-left",
                    isActive &&
                      "bg-primary/10 text-primary border border-primary/20",
                    !isActive &&
                      !isDisabled &&
                      "hover:bg-muted text-muted-foreground hover:text-foreground",
                    isDisabled && "opacity-50 cursor-not-allowed",
                  )}
                >
                  <Icon className="h-5 w-5 mt-0.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium">{section.label}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {section.description}
                    </div>
                  </div>
                </button>
              );
            })}
          </m.nav>

          {/* Content Area */}
          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {activeSection === "profile" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2">
                    Profile Preferences
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Customize how your profile appears to others
                  </p>
                </div>
                <ProfilePreferences
                  emailNotifications={emailNotifications}
                  mentorMode={mentorMode}
                  onToggleEmail={handleToggleEmail}
                  onToggleMentor={handleToggleMentor}
                  saving={saving}
                  mentorSaving={mentorSaving}
                />
              </div>
            )}

            {activeSection === "account" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Account Settings</h2>
                  <p className="text-sm text-muted-foreground">
                    Manage your account security and data
                  </p>
                </div>
                {user && (
                  <ProfileAccountDanger
                    userId={user.uid}
                    userEmail={user.email || ""}
                  />
                )}
              </div>
            )}

            {activeSection === "notifications" && (
              <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.02] p-12 text-center">
                <Bell className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                <h3 className="text-xl font-bold mb-2">
                  Notifications Coming Soon
                </h3>
                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                  Email preferences, in-app notifications, and alerts will be
                  available here.
                </p>
              </div>
            )}

            {activeSection === "privacy" && (
              <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.02] p-12 text-center">
                <Lock className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                <h3 className="text-xl font-bold mb-2">
                  Privacy Settings Coming Soon
                </h3>
                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                  Data sharing, visibility controls, and privacy options will be
                  available here.
                </p>
              </div>
            )}
          </m.div>
        </div>
      </div>
    </div>
  );
}
