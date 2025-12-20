"use client";

import { useRouter } from "next/navigation";

import { UserMenu } from "@/components/common/UserMenu";
import { NotificationDropdown } from "@/components/notifications/NotificationDropdown";
import { Button } from "@/components/unified";
import type { User } from "@/services/firebaseAuth";

interface NavUserSectionProps {
  user: User | null;
}

/**
 * Navigation user section (right side)
 * Shows auth actions, notifications, and user menu
 */
export function NavUserSection({ user }: NavUserSectionProps) {
  const router = useRouter();

  if (!user) {
    return (
      <Button
        size="sm"
        variant="ghost"
        onClick={() => {
          router.push("/signin");
        }}
      >
        Sign In
      </Button>
    );
  }

  return (
    <>
      <Button
        size="sm"
        className="hidden md:inline-flex"
        onClick={() => {
          router.push("/dashboard");
        }}
      >
        New Project
      </Button>
      <NotificationDropdown userId={user.uid} />
      <UserMenu />
    </>
  );
}

export default NavUserSection;
