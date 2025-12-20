import { m, AnimatePresence } from "framer-motion";
import NextImage from "next/image";
import { useState } from "react";
import { toast } from "sonner";

import { Badge, Button } from "@/components/unified";
import {
  X,
  Download,
  Trash2,
  FileText,
  Image as ImageIcon,
  Video,
  Calendar,
  HardDrive,
  Link as LinkIcon,
  CheckCircle2,
  FileCode,
  Book,
} from "@/icons";
import { useWorkspaceStore } from "@/stores/workspaceStore";
import type { CanvasBlockId, ProjectDocument } from "@/types";

interface DocumentDetailDrawerProps {
  document: ProjectDocument | null;
  isOpen: boolean;
  onClose: () => void;
  onDelete: (doc: ProjectDocument) => void;
  onLink: (doc: ProjectDocument) => void;
}

const BMC_BLOCK_LABELS: Record<CanvasBlockId, string> = {
  keyPartners: "Key Partners",
  keyActivities: "Key Activities",
  keyResources: "Key Resources",
  valuePropositions: "Value Propositions",
  customerRelationships: "Customer Relationships",
  channels: "Channels",
  customerSegments: "Customer Segments",
  costStructure: "Cost Structure",
  revenueStreams: "Revenue Streams",
};

const readableSize = (size: number) => {
  const units = ["B", "KB", "MB", "GB"];
  let index = 0;
  let value = size;
  while (value >= 1024 && index < units.length - 1) {
    value /= 1024;
    index++;
  }
  return `${value.toFixed(1)} ${units[index]}`;
};

export function DocumentDetailDrawer({
  document,
  isOpen,
  onClose,
  onDelete,
  onLink,
}: DocumentDetailDrawerProps) {
  const unlinkEvidence = useWorkspaceStore((state) => state.unlinkEvidence);
  const [isDeleting, setIsDeleting] = useState(false);

  if (!document) {
    return null;
  }

  const linkedBlocks = document.linkedFields || [];
  const hasLinks = linkedBlocks.length > 0;

  const handleDownload = () => {
    if (document.url) {
      window.open(document.url, "_blank");
      toast.success("Opening document in new tab");
    } else {
      toast.error("Download URL not available");
    }
  };

  const handleDelete = () => {
    setIsDeleting(true);
    try {
      onDelete(document);
      onClose();
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete document");
      setIsDeleting(false);
    }
  };

  const handleUnlink = (blockId: CanvasBlockId) => {
    unlinkEvidence(document.id, blockId);
    toast.success(`Unlinked from ${BMC_BLOCK_LABELS[blockId]}`);
  };

  const renderPreview = () => {
    if (document.type === "image" && document.previewUrl) {
      return (
        <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-white/10 bg-white/5">
          <NextImage
            src={document.previewUrl}
            alt={document.name}
            fill
            className="object-contain"
            sizes="(max-width: 768px) 100vw, 600px"
          />
        </div>
      );
    }

    // Text documents: Show content preview
    if (
      (document.type === "txt" || document.type === "md") &&
      document.content
    ) {
      return (
        <div className="w-full rounded-xl border border-white/10 bg-white/5">
          <div className="max-h-[400px] overflow-y-auto p-6">
            <pre className="whitespace-pre-wrap break-words font-mono text-sm text-foreground">
              {document.content}
            </pre>
          </div>
        </div>
      );
    }

    if (document.type === "pdf" && document.url) {
      return (
        <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl border border-white/10 bg-white/5">
          <iframe
            src={`${document.url}#toolbar=0`}
            className="h-full w-full"
            title={document.name}
          />
        </div>
      );
    }

    if (document.type === "video" && document.url) {
      return (
        <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-white/10 bg-white/5">
          <video
            src={document.url}
            controls
            className="h-full w-full"
            title={document.name}
          />
        </div>
      );
    }

    // Fallback icon
    const Icon =
      document.type === "video"
        ? Video
        : document.type === "pdf"
          ? FileText
          : document.type === "md"
            ? FileCode
            : document.type === "doc"
              ? Book
              : document.type === "txt"
                ? FileText
                : ImageIcon;

    const gradientClass =
      document.type === "txt" ||
      document.type === "md" ||
      document.type === "doc"
        ? "from-blue-500/10 to-blue-600/5"
        : "from-primary/10 to-primary/5";

    return (
      <div
        className={`flex aspect-video w-full items-center justify-center rounded-xl border border-white/10 bg-gradient-to-br ${gradientClass}`}
      >
        <Icon className="h-24 w-24 text-primary/40" />
      </div>
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          />

          {/* Drawer Panel */}
          <m.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed inset-y-0 right-0 z-50 w-full max-w-2xl border-l border-white/10 bg-gradient-to-br from-background via-background to-background/95 shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 p-6">
              <div className="flex items-center gap-3">
                <Badge
                  variant="secondary"
                  className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary"
                >
                  {document.type}
                </Badge>
                <h2 className="truncate font-display text-lg font-semibold text-foreground">
                  {document.name}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="h-[calc(100vh-80px)] overflow-y-auto p-6">
              <div className="space-y-6">
                {/* Preview Section */}
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-foreground">
                    Preview
                  </h3>
                  {renderPreview()}
                </div>

                {/* Metadata Section */}
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-foreground">
                    Details
                  </h3>
                  <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
                    <dl className="space-y-3">
                      <div className="flex items-center justify-between">
                        <dt className="flex items-center gap-2 text-xs text-muted-foreground">
                          <HardDrive className="h-3.5 w-3.5" />
                          File Size
                        </dt>
                        <dd className="text-sm font-medium text-foreground">
                          {readableSize(document.size)}
                        </dd>
                      </div>
                      <div className="flex items-center justify-between">
                        <dt className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Calendar className="h-3.5 w-3.5" />
                          Uploaded
                        </dt>
                        <dd className="text-sm font-medium text-foreground">
                          {new Date(document.uploadedAt).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            },
                          )}
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>

                {/* Linked Blocks Section */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-foreground">
                      Linked Canvas Blocks
                    </h3>
                    <button
                      onClick={() => onLink(document)}
                      className="flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium text-primary transition-colors hover:bg-primary/10"
                    >
                      <LinkIcon className="h-3 w-3" />
                      Edit Links
                    </button>
                  </div>

                  {hasLinks ? (
                    <div className="flex flex-wrap gap-2">
                      {linkedBlocks.map((blockId) => (
                        <m.div
                          key={blockId}
                          initial={{ scale: 0.9, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.9, opacity: 0 }}
                          className="group flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-sm text-emerald-500"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          <span className="font-medium">
                            {BMC_BLOCK_LABELS[blockId]}
                          </span>
                          <button
                            onClick={() => handleUnlink(blockId)}
                            className="ml-1 opacity-0 transition-opacity group-hover:opacity-100"
                            title="Remove link"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </m.div>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-xl border border-dashed border-amber-500/30 bg-amber-500/5 p-6 text-center">
                      <p className="text-sm text-amber-500/80">
                        This document isn&apos;t linked to any canvas blocks
                        yet. Click &quot;Edit Links&quot; to connect it.
                      </p>
                    </div>
                  )}
                </div>

                {/* Extracted Text Section (if available) */}
                {document.extractedText && (
                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-foreground">
                      Extracted Content
                    </h3>
                    <div className="max-h-48 overflow-y-auto rounded-xl border border-white/10 bg-white/[0.02] p-4">
                      <p className="text-xs leading-relaxed text-muted-foreground">
                        {document.extractedText.slice(0, 1000)}
                        {document.extractedText.length > 1000 && "..."}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Footer Actions */}
            <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between border-t border-white/10 bg-gradient-to-t from-background to-transparent p-6">
              <Button
                variant="outline"
                onClick={handleDownload}
                className="flex items-center gap-2 rounded-full"
              >
                <Download className="h-4 w-4 shrink-0" />
                <span className="whitespace-nowrap">Download</span>
              </Button>
              <Button
                variant="destructive"
                onClick={() => void handleDelete()}
                disabled={isDeleting}
                className="flex items-center gap-2 rounded-full"
              >
                <Trash2 className="h-4 w-4 shrink-0" />
                <span className="whitespace-nowrap">
                  {isDeleting ? "Deleting..." : "Delete"}
                </span>
              </Button>
            </div>
          </m.div>
        </>
      )}
    </AnimatePresence>
  );
}
