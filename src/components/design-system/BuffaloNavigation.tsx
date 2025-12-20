/**
 * BuffaloNavigation - Modern navigation component
 */
import { useState } from "react";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "../ui/button";

import { cn } from "@/lib/utils";

interface NavLink {
  label: string;
  href: string;
}

interface BuffaloNavigationProps {
  logo?: ReactNode;
  logoText?: string;
  links?: NavLink[];
  primaryCTA?: {
    text: string;
    onClick: () => void;
  };
  secondaryCTA?: {
    text: string;
    onClick: () => void;
  };
  className?: string;
}

export const BuffaloNavigation = ({
  logo,
  logoText = "Buffalo Projects",
  links = [
    { label: "Resources", href: "/resources" },
    { label: "Gallery", href: "/gallery" },
    { label: "About", href: "/about" },
  ],
  primaryCTA,
  secondaryCTA,
  className,
}: BuffaloNavigationProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const resolvedPrimaryCTA = primaryCTA ?? {
    text: "Start Free",
    onClick: () => {
      void navigate("/join");
    },
  };

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 bg-black/90 backdrop-blur-md border-b border-white/10 z-50",
        className,
      )}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <div
          onClick={() => {
            void navigate("/");
          }}
          className="flex items-center gap-3 cursor-pointer"
        >
          {logo || (
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-xl font-bold">
              B
            </div>
          )}
          <span className="text-lg font-semibold">{logoText}</span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <nav className="flex items-center gap-6">
            {links.map((link) => (
              <button
                key={link.href}
                onClick={() => {
                  void navigate(link.href);
                }}
                className="text-white/80 hover:text-white text-sm font-medium transition-colors"
              >
                {link.label}
              </button>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            {secondaryCTA && (
              <Button
                variant="ghost"
                size="default"
                onClick={() => {
                  void secondaryCTA.onClick();
                }}
              >
                {secondaryCTA.text}
              </Button>
            )}
            {resolvedPrimaryCTA && (
              <Button
                variant="default"
                size="default"
                onClick={() => {
                  void resolvedPrimaryCTA.onClick();
                }}
              >
                {resolvedPrimaryCTA.text}
              </Button>
            )}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-white"
          aria-label="Toggle menu"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            {mobileMenuOpen ? (
              <path d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path d="M3 12h18M3 6h18M3 18h18" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="bg-black/95 border-t border-white/10 p-6 md:hidden">
          <div className="space-y-4">
            {links.map((link) => (
              <button
                key={link.href}
                onClick={() => {
                  void navigate(link.href);
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left px-4 py-2 text-white/80 hover:text-white text-sm font-medium transition-colors"
              >
                {link.label}
              </button>
            ))}
            {secondaryCTA && (
              <Button
                variant="ghost"
                size="default"
                onClick={() => {
                  void secondaryCTA.onClick();
                  setMobileMenuOpen(false);
                }}
                className="w-full"
              >
                {secondaryCTA.text}
              </Button>
            )}
            {resolvedPrimaryCTA && (
              <Button
                variant="default"
                size="default"
                onClick={() => {
                  void resolvedPrimaryCTA.onClick();
                  setMobileMenuOpen(false);
                }}
                className="w-full"
              >
                {resolvedPrimaryCTA.text}
              </Button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
