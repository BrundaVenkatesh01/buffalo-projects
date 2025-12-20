"use client";

import { useRouter } from "next/navigation";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, LogOut } from "@/icons";
import { useAuthStore } from "@/stores/authStore";

export function UserMenu() {
  const router = useRouter();
  const { user, signOut } = useAuthStore();

  if (!user) {
    return null;
  }

  const getInitials = () => {
    if (user.firstName && user.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    if (user.displayName) {
      const parts = user.displayName.split(" ");
      return parts.length > 1
        ? `${parts[0]![0]}${parts[parts.length - 1]![0]}`.toUpperCase()
        : parts[0]!.substring(0, 2).toUpperCase();
    }
    if (user.email) {
      return user.email.substring(0, 2).toUpperCase();
    }
    return "U";
  };

  const displayName = () => {
    if (user.displayName) {
      return user.displayName;
    }
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    if (user.firstName) {
      return user.firstName;
    }
    if (user.email) {
      return user.email.split("@")[0];
    }
    return "User";
  };

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus:outline-none">
        <Avatar className="h-9 w-9 cursor-pointer transition hover:opacity-80">
          {user.photoURL ? (
            <img
              src={user.photoURL}
              alt={displayName()}
              className="h-full w-full rounded-xl object-cover"
            />
          ) : (
            <AvatarFallback className="rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 text-xs font-semibold uppercase tracking-[0.28em] text-white">
              {getInitials()}
            </AvatarFallback>
          )}
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-72 border-white/10 bg-[#0b0d0f]/90 backdrop-blur-xl"
      >
        <DropdownMenuLabel>
          <div className="flex min-w-0 flex-col gap-1">
            <p
              className="truncate text-sm font-semibold text-foreground"
              title={displayName()}
            >
              {displayName()}
            </p>
            <p
              className="truncate text-xs text-muted-foreground"
              title={user.email ?? undefined}
            >
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => router.push("/profile")}
          className="rounded-xl text-sm text-muted-foreground hover:text-foreground cursor-pointer"
        >
          <User className="mr-2 h-4 w-4 text-primary" />
          Profile & Projects
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            void handleSignOut();
          }}
          className="rounded-xl text-sm text-muted-foreground hover:text-foreground cursor-pointer"
        >
          <LogOut className="mr-2 h-4 w-4 text-destructive" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
