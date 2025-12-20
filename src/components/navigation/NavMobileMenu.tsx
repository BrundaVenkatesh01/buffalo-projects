"use client";

import { m } from "framer-motion";
import type { Route } from "next";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";

import { TwentySixLockBadge } from "@/components/common/TwentySixLockBadge";
import {
  Button,
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/unified";
import { Menu } from "@/icons";
import { easings } from "@/lib/motion";
import { cn } from "@/lib/utils";
import type { User } from "@/services/firebaseAuth";

interface NavItem {
  label: string;
  href: string;
  requiresAuth?: boolean;
  locked?: boolean;
  badge?: ReactNode;
}

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

interface NavMobileMenuProps {
  navItems: NavItem[];
  pathname: string;
  shouldReduceMotion: boolean;
  user: User | null;
}

/**
 * Mobile navigation menu (Sheet-based)
 */
export function NavMobileMenu({
  navItems,
  pathname,
  shouldReduceMotion,
  user,
}: NavMobileMenuProps) {
  const router = useRouter();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          className="md:hidden"
          aria-label="Open navigation menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="w-[280px] border-border bg-background/95"
      >
        <SheetHeader className="text-left">
          <SheetTitle className="font-display text-lg text-foreground">
            Navigate
          </SheetTitle>
          <SheetDescription className="sr-only">
            Site navigation menu with links to Explore, My Projects, Resources,
            and About. Close the menu with the escape key or by tapping outside.
          </SheetDescription>
        </SheetHeader>
        <div className="mt-6 flex flex-col gap-6">
          <m.ul
            className="flex flex-col gap-4"
            initial={shouldReduceMotion ? false : "hidden"}
            {...(!shouldReduceMotion ? { animate: "visible" as const } : {})}
            variants={listVariants}
          >
            {navItems.map((item) => {
              const isDashboard = item.href === "/dashboard";
              const isEditRoute = pathname.startsWith("/edit/");
              const isActive =
                pathname === item.href ||
                (item.href !== "/" && pathname.startsWith(`${item.href}/`)) ||
                (isDashboard && isEditRoute);
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
                  <SheetClose asChild>
                    <Link
                      href={item.href as Route}
                      className={cn(
                        "relative flex items-center gap-2 text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md px-3 py-1.5",
                        isActive
                          ? "text-foreground"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted",
                      )}
                    >
                      <span>{item.label}</span>
                      {item.badge}
                    </Link>
                  </SheetClose>
                </m.li>
              );
            })}
          </m.ul>
          <div className="flex flex-col gap-2">
            {user ? (
              <SheetClose asChild>
                <Button
                  onClick={() => {
                    router.push("/dashboard");
                  }}
                  block
                >
                  New Project
                </Button>
              </SheetClose>
            ) : (
              <SheetClose asChild>
                <Button
                  variant="ghost"
                  onClick={() => {
                    router.push("/signin");
                  }}
                  block
                >
                  Sign In
                </Button>
              </SheetClose>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default NavMobileMenu;
