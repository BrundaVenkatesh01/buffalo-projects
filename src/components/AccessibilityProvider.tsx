"use client";

import { useEffect } from "react";
import type { ReactNode } from "react";

interface AccessibilityProviderProps {
  children: ReactNode;
}

const AccessibilityProvider = ({ children }: AccessibilityProviderProps) => {
  useEffect(() => {
    // Add keyboard navigation support
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Tab") {
        document.body.classList.add("keyboard-nav");
      }
    };

    const handleMouseDown = () => {
      document.body.classList.remove("keyboard-nav");
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("mousedown", handleMouseDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("mousedown", handleMouseDown);
    };
  }, []);

  return <>{children}</>;
};

export default AccessibilityProvider;
