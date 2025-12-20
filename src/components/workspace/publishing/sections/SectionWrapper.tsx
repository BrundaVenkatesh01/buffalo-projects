/**
 * Section Wrapper
 *
 * Collapsible section wrapper for publish form sections.
 * Provides consistent styling and expand/collapse behavior.
 */

"use client";

import { m, AnimatePresence } from "framer-motion";
import type { ReactNode } from "react";

import { usePublishForm, type PublishFormState } from "../PublishFormContext";

import { ChevronRight } from "@/icons";
import { cn } from "@/lib/utils";

interface SectionWrapperProps {
  title: string;
  sectionKey: keyof PublishFormState["expandedSections"];
  children: ReactNode;
  /** Section always stays expanded (no collapse) */
  defaultExpanded?: boolean;
  /** Additional classes for the wrapper */
  className?: string;
  /** Icon to show in header */
  icon?: ReactNode;
}

export function SectionWrapper({
  title,
  sectionKey,
  children,
  defaultExpanded = false,
  className,
  icon,
}: SectionWrapperProps) {
  const { state, dispatch } = usePublishForm();
  const isExpanded = state.expandedSections[sectionKey];

  // If defaultExpanded, always show content
  const showContent = defaultExpanded || isExpanded;

  const handleToggle = () => {
    if (!defaultExpanded) {
      dispatch({ type: "TOGGLE_SECTION", payload: sectionKey });
    }
  };

  return (
    <div
      className={cn(
        "rounded-lg border border-white/10 bg-white/[0.02] overflow-hidden",
        className,
      )}
    >
      {/* Header */}
      <button
        type="button"
        onClick={handleToggle}
        disabled={defaultExpanded}
        className={cn(
          "w-full flex items-center justify-between px-4 py-3 transition-colors",
          !defaultExpanded && "hover:bg-white/[0.03] cursor-pointer",
          defaultExpanded && "cursor-default",
        )}
      >
        <div className="flex items-center gap-2">
          {icon}
          <h3 className="font-medium text-foreground">{title}</h3>
        </div>
        {!defaultExpanded && (
          <m.div
            animate={{ rotate: isExpanded ? 90 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </m.div>
        )}
      </button>

      {/* Content */}
      <AnimatePresence initial={false}>
        {showContent && (
          <m.div
            initial={defaultExpanded ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            <div className="px-4 pb-4 pt-1">{children}</div>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}
