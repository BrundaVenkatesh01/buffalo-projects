"use client";

import { m } from "framer-motion";

import { DocumentCard } from "./DocumentCard";
import { EmptyState } from "./EmptyState";

import { Folder } from "@/icons";
import { cn } from "@/lib/utils";
import type { Workspace } from "@/types";

export interface EvidenceDocumentsProps {
  workspace: Workspace;
  isOwner?: boolean;
  className?: string;
}

/**
 * EvidenceDocuments - Display non-image documents and evidence
 *
 * Design: Grid of document cards (PDFs, videos, links)
 * Content: Filters out image documents (those are in Showcase)
 * Visual: Empty state if no documents exist
 */
export function EvidenceDocuments({
  workspace,
  isOwner = false,
  className,
}: EvidenceDocumentsProps) {
  // Filter out image documents (those are displayed in ProjectShowcase)
  const evidenceDocuments = (workspace.documents || []).filter(
    (doc) => doc.type !== "image",
  );

  const hasDocuments = evidenceDocuments.length > 0;

  return (
    <m.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      className={cn(
        "border-b border-white/[0.06] bg-transparent py-16 md:py-20",
        className,
      )}
    >
      <div className="mx-auto max-w-7xl px-6">
        {/* Section Header */}
        <div className="mb-12 flex items-center gap-4">
          <Folder className="h-7 w-7 text-blue-500" />
          <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl lg:text-5xl">
            Evidence & Resources
          </h2>
        </div>

        {/* Documents Grid or Empty State */}
        {hasDocuments ? (
          <>
            {/* Documents Grid */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {evidenceDocuments.map((document, index) => (
                <DocumentCard
                  key={document.id}
                  document={document}
                  index={index}
                />
              ))}
            </div>

            {/* Count */}
            <div className="mt-8 text-center text-sm text-neutral-400">
              {evidenceDocuments.length}{" "}
              {evidenceDocuments.length === 1 ? "document" : "documents"}{" "}
              uploaded
            </div>
          </>
        ) : (
          <EmptyState
            icon={Folder}
            title="No supporting documents yet"
            description="Upload PDFs, videos, or links to provide evidence and resources that support this project."
            ctaText={isOwner ? "Add in editor" : undefined}
            ctaHref={isOwner ? `/edit/${workspace.code}` : undefined}
            showCta={isOwner}
          />
        )}
      </div>
    </m.section>
  );
}
