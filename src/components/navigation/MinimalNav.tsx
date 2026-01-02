"use client";

import { m, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";

import { AnimatedLogo } from "@/components/common/AnimatedLogo";
import { TwentySixLockBadge } from "@/components/common/TwentySixLockBadge";
import {
  Button,
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/unified";
import { Menu } from "@/icons";

/**
 * Enhanced Minimal Navigation Component
 * Clean navigation with essential tabs (Projects, Resources, '26) and rainbow countdown badge
 */
export function MinimalNav() {
  const router = useRouter();
  const pathname = usePathname();
  const shouldReduceMotion = useReducedMotion();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    handleScroll(); // Initial check
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const navItems = [
    { label: "Projects", href: "/projects" },
    { label: "Resources", href: "/resources" },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <m.header
      className={`relative sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-white/10 bg-background/60 backdrop-blur-xl shadow-lg shadow-black/20"
          : "border-b border-transparent bg-background/40"
      }`}
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
      {scrolled && (
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-0">
          <div
            className="absolute -top-6 left-1/2 h-20 w-[500px]
                 -translate-x-1/2
                 bg-gradient-to-r from-blue-500/20 via-purple-500/25 to-pink-500/20
                 blur-2xl opacity-70"
          />
        </div>
      )}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded focus:bg-background focus:px-4 focus:py-2 focus:text-sm focus:text-foreground focus:shadow-lg"
      >
        Skip to main content
      </a>
      <div className="relative z-10 mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <button
          type="button"
          className="group flex items-center rounded-md border border-transparent bg-transparent px-1.5 py-1 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          onClick={() => {
            router.push("/");
          }}
          aria-label="Buffalo Projects home"
        >
          <AnimatedLogo size="md" />
        </button>

        {/* Desktop Navigation */}
        <nav
          className="hidden md:flex items-center gap-1"
          aria-label="Main navigation"
        >
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                isActive(item.href)
                  ? "text-foreground bg-secondary"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              }`}
            >
              {item.label}
            </Link>
          ))}
          {/* Rainbow '26 Badge */}
          <TwentySixLockBadge size="sm" />
        </nav>

        {/* Right Side Actions */}
        <div className="flex items-center gap-3">
          {/* Sign In Button (Desktop) */}
          <Button
            size="sm"
            variant="ghost"
            className="hidden md:inline-flex"
            onClick={() => {
              router.push("/signin");
            }}
          >
            Sign In
          </Button>

          {/* Mobile Menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button size="sm" variant="ghost" aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] sm:w-[320px]">
              <nav
                className="flex flex-col gap-4 mt-8"
                aria-label="Mobile navigation"
              >
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-4 py-3 text-base font-medium rounded-md transition-colors ${
                      isActive(item.href)
                        ? "text-foreground bg-secondary"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
                {/* Rainbow '26 Badge (Mobile) */}
                <div className="px-4 py-2">
                  <TwentySixLockBadge size="md" />
                </div>
                <div className="border-t border-border my-4" />
                <Button
                  size="default"
                  variant="default"
                  className="w-full"
                  onClick={() => {
                    router.push("/signin");
                    setMobileMenuOpen(false);
                  }}
                >
                  Sign In
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </m.header>
  );
}
