import type { ReactNode } from "react";

import { TWENTY_SIX_UNLOCKED } from "@/config/featureFlags";

/**
 * Navigation item configuration
 */
export interface NavItem {
  label: string;
  href: string;
  requiresAuth?: boolean;
  locked?: boolean;
  badge?: ReactNode;
}

/**
 * Route matching configuration for determining active state
 */
export interface RouteMatch {
  /** Routes that should be considered "active" for this nav item */
  matchPrefixes?: string[];
  /** Exact route matches */
  exactMatches?: string[];
}

/**
 * Extended nav item with route matching
 */
export interface NavItemConfig extends NavItem {
  routeMatch?: RouteMatch;
}

/**
 * Public navigation items (logged out users)
 */
export const PUBLIC_NAV_ITEMS: NavItemConfig[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Resources", href: "/resources" },
];

/**
 * Authenticated navigation items
 */
export function getAuthenticatedNavItems(): NavItemConfig[] {
  return [
    {
      label: "Dashboard",
      href: "/dashboard",
      requiresAuth: true,
      routeMatch: {
        exactMatches: ["/dashboard"],
        matchPrefixes: ["/edit/"], // Edit routes are part of Dashboard context
      },
    },
    {
      label: "Discover",
      href: "/dashboard/discover",
      requiresAuth: true,
    },
    TWENTY_SIX_UNLOCKED
      ? { label: "Programs", href: "/programs" }
      : { label: "'26", href: "/26" },
  ];
}

/**
 * Check if a route is active based on nav item config
 */
export function isRouteActive(
  pathname: string,
  navItem: NavItemConfig,
): boolean {
  // Exact match
  if (pathname === navItem.href) {
    return true;
  }

  // Check custom route matches
  if (navItem.routeMatch) {
    const { matchPrefixes, exactMatches } = navItem.routeMatch;

    if (exactMatches?.includes(pathname)) {
      return true;
    }

    if (matchPrefixes?.some((prefix) => pathname.startsWith(prefix))) {
      return true;
    }
  }

  // Default prefix matching (for nested routes)
  if (navItem.href !== "/" && pathname.startsWith(`${navItem.href}/`)) {
    return true;
  }

  return false;
}

/**
 * Get navigation items based on auth state
 */
export function getNavItems(isAuthenticated: boolean): NavItemConfig[] {
  return isAuthenticated ? getAuthenticatedNavItems() : PUBLIC_NAV_ITEMS;
}

/**
 * Footer navigation items
 */
export const FOOTER_NAV_ITEMS: NavItem[] = [
  { label: "About", href: "/about" },
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
  { label: "Support", href: "/support" },
  { label: "Code of Conduct", href: "/coc" },
];

/**
 * Dashboard sidebar navigation items
 */
export const DASHBOARD_SIDEBAR_ITEMS: NavItem[] = [
  { label: "Overview", href: "/dashboard" },
  { label: "Discover", href: "/dashboard/discover" },
  { label: "Activity", href: "/dashboard/activity" },
  { label: "Settings", href: "/dashboard/settings" },
];

export default {
  PUBLIC_NAV_ITEMS,
  getAuthenticatedNavItems,
  getNavItems,
  isRouteActive,
  FOOTER_NAV_ITEMS,
  DASHBOARD_SIDEBAR_ITEMS,
};
