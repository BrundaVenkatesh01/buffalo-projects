"use client";

/**
 * Navigation - Unified navigation component
 *
 * Replaces both LandingNav and PlatformNavNext with a single
 * dark-theme navigation that adapts based on variant and auth state.
 *
 * Features:
 * - Auth-aware navigation items
 * - TwentySix badge
 * - Mobile hamburger menu
 * - Sticky + backdrop blur
 * - Skip-to-content link for accessibility
 * - Active route highlighting
 * - Dark theme styling (works with PageLayout)
 *
 * Variants:
 * - default: Full navigation with all items
 * - minimal: Logo + auth only (for auth pages, editor)
 */

import { m, useReducedMotion } from "framer-motion";
import type { Route } from "next";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { AnimatedLogo } from "@/components/common/AnimatedLogo";
import { TwentySixLockBadge } from "@/components/common/TwentySixLockBadge";
import { UserMenu } from "@/components/common/UserMenu";
import { NotificationDropdown } from "@/components/notifications/NotificationDropdown";
import {
  Button,
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/unified";
import { TWENTY_SIX_UNLOCKED } from "@/config/featureFlags";
import { Menu, X } from "@/icons";
import { easings } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/authStore";

interface NavItem {
  label: string;
  href: string;
  requiresAuth?: boolean;
}

export type NavigationVariant = "default" | "minimal";

interface NavigationProps {
  /** Navigation variant */
  variant?: NavigationVariant;
  /** Additional classes */
  className?: string;
}

// Animation variants for staggered list
const listVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: -6 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.28,
      ease: easings.easeOut,
    },
  },
};

/**
 * Desktop navigation items list
 */
function NavItems({
  items,
  shouldReduceMotion,
  pathname,
}: {
  items: NavItem[];
  shouldReduceMotion: boolean;
  pathname: string;
}) {
  return (
    <m.ul
      className="flex flex-row items-center gap-6 lg:gap-8"
      initial={shouldReduceMotion ? false : "hidden"}
      {...(!shouldReduceMotion ? { animate: "visible" as const } : {})}
      variants={listVariants}
    >
      {items.map((item) => {
        const isActive =
          pathname === item.href ||
          (item.href !== "/" && pathname.startsWith(`${item.href}/`));
        const isTwentySix = item.label === "'26";

        if (isTwentySix) {
          return (
            <m.li key={item.label} variants={itemVariants}>
              <TwentySixLockBadge />
            </m.li>
          );
        }

        return (
          <m.li key={item.label} variants={itemVariants}>
            <Link
              href={item.href as Route}
              className={cn(
                "relative flex items-center gap-2 text-sm font-medium transition-all duration-200",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md px-3 py-1.5",
                isActive
                  ? "text-white"
                  : "text-neutral-400 hover:text-white hover:bg-white/5",
              )}
            >
              <span>{item.label}</span>
            </Link>
          </m.li>
        );
      })}
    </m.ul>
  );
}

/**
 * User section - notifications, new project, user menu
 */
function UserSection({ userId }: { userId?: string }) {
  const router = useRouter();

  if (!userId) {
    return (
      <Button
        size="sm"
        variant="ghost"
        className="text-neutral-400 hover:text-white hover:bg-white/5"
        onClick={() => router.push("/signin")}
      >
        Sign In
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        size="sm"
        className="hidden md:inline-flex bg-white/10 hover:bg-white/15 text-white border-white/10"
        onClick={() => router.push("/workspace/new")}
      >
        New Project
      </Button>
      <NotificationDropdown userId={userId} />
      <UserMenu />
    </div>
  );
}

/**
 * Mobile menu using Sheet
 */
function MobileMenu({
  items,
  user,
  onNavigate,
}: {
  items: NavItem[];
  user: { uid: string } | null;
  onNavigate: (href: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleSignOut = async () => {
    const { signOut } = useAuthStore.getState();
    await signOut();
    setOpen(false);
    router.push("/");
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="md:hidden text-neutral-400 hover:text-white hover:bg-white/5"
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="w-[280px] border-white/10 bg-black/98 backdrop-blur-xl"
      >
        <nav className="flex flex-col gap-2 pt-8">
          {items.map((item) => {
            const isTwentySix = item.label === "'26";
            if (isTwentySix) {
              return (
                <div key={item.label} className="px-4 py-3">
                  <TwentySixLockBadge />
                </div>
              );
            }

            return (
              <button
                key={item.href}
                type="button"
                onClick={() => {
                  setOpen(false);
                  onNavigate(item.href);
                }}
                className="w-full rounded-lg px-4 py-3 text-left text-base font-medium text-neutral-400 hover:bg-white/5 hover:text-white transition-all"
              >
                {item.label}
              </button>
            );
          })}

          {/* Divider */}
          <div className="my-4 h-px bg-white/10" />

          {/* Auth actions */}
          {!user ? (
            <Button
              variant="default"
              size="lg"
              onClick={() => {
                setOpen(false);
                onNavigate("/signin");
              }}
              className="w-full mx-4"
            >
              Sign In
            </Button>
          ) : (
            <>
              <Button
                variant="default"
                size="lg"
                onClick={() => {
                  setOpen(false);
                  onNavigate("/workspace/new");
                }}
                className="mx-4 mb-2"
              >
                New Project
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => void handleSignOut()}
                className="mx-4 border-white/10 text-neutral-400 hover:text-white"
              >
                Sign Out
              </Button>
            </>
          )}
        </nav>
      </SheetContent>
    </Sheet>
  );
}

export function Navigation({
  variant = "default",
  className,
}: NavigationProps) {
  const { user } = useAuthStore();
  const pathname = usePathname();
  const router = useRouter();
  const shouldReduceMotion = useReducedMotion();

  // Build nav items based on auth state
  // Signed-in users get "My Projects" first for easy navigation back to dashboard
  const navItems = useMemo<NavItem[]>(() => {
    if (!user) {
      return [
        { label: "Home", href: "/" },
        { label: "Explore", href: "/dashboard/discover" },
        { label: "About", href: "/about" },
      ];
    }

    return [
      { label: "My Projects", href: "/dashboard", requiresAuth: true },
      { label: "Discover", href: "/dashboard/discover", requiresAuth: true },
      TWENTY_SIX_UNLOCKED
        ? { label: "Programs", href: "/programs" }
        : { label: "'26", href: "/26" },
    ];
  }, [user]);

  const handleNavigation = (href: string) => {
    router.push(href);
  };

  // Minimal variant - just logo and auth
  if (variant === "minimal") {
    return (
      <m.header
        className={cn(
          "sticky top-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur-md",
          className,
        )}
        initial={shouldReduceMotion ? false : { opacity: 0, y: -8 }}
        {...(!shouldReduceMotion
          ? {
              animate: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.2, ease: "easeOut" },
              },
            }
          : {})}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <button
            type="button"
            className="group flex items-center rounded-md px-1.5 py-1 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            onClick={() => router.push(user ? "/dashboard" : "/")}
            aria-label={user ? "Go to dashboard" : "Buffalo Projects home"}
          >
            <AnimatedLogo size="md" />
          </button>
          <UserSection userId={user?.uid} />
        </div>
      </m.header>
    );
  }

  // Default variant - full navigation
  return (
    <m.header
      className={cn(
        "sticky top-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur-md",
        className,
      )}
      initial={shouldReduceMotion ? false : { opacity: 0, y: -8 }}
      {...(!shouldReduceMotion
        ? {
            animate: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.2, ease: "easeOut" },
            },
          }
        : {})}
      layout
    >
      {/* Skip to main content link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded focus:bg-black focus:px-4 focus:py-2 focus:text-sm focus:text-white focus:shadow-lg focus:border focus:border-white/20"
      >
        Skip to main content
      </a>

      <div className="mx-auto grid h-16 max-w-6xl grid-cols-[auto_1fr_auto] items-center gap-4 px-4 sm:px-6 lg:px-8">
        {/* Logo/Brand */}
        <m.div
          initial={shouldReduceMotion ? false : { opacity: 0, x: -12 }}
          animate={shouldReduceMotion ? {} : { opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <button
            type="button"
            className="group flex items-center rounded-md px-1.5 py-1 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            onClick={() => router.push(user ? "/dashboard" : "/")}
            aria-label={user ? "Go to dashboard" : "Buffalo Projects home"}
          >
            <AnimatedLogo size="md" />
          </button>
        </m.div>

        {/* Desktop Navigation */}
        <nav className="hidden items-center justify-center md:flex">
          <NavItems
            items={navItems}
            shouldReduceMotion={Boolean(shouldReduceMotion)}
            pathname={pathname}
          />
        </nav>

        {/* User Section + Mobile Menu */}
        <div className="flex items-center justify-end gap-2">
          <div className="hidden md:flex">
            <UserSection userId={user?.uid} />
          </div>
          <div className="flex md:hidden items-center gap-2">
            <TwentySixLockBadge size="sm" />
            <MobileMenu
              items={navItems}
              user={user}
              onNavigate={handleNavigation}
            />
          </div>
        </div>
      </div>
    </m.header>
  );
}
