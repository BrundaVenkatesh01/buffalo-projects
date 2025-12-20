import { m } from "framer-motion";
import NextImage from "next/image";
import { useState } from "react";
import { toast } from "sonner";

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/unified";
import {
  CheckCircle2,
  FileText,
  Image as ImageIcon,
  Video,
  FileCode,
  Book,
} from "@/icons";
import { cn } from "@/lib/utils";
import { useWorkspaceStore } from "@/stores/workspaceStore";
import type { CanvasBlockId, ProjectDocument } from "@/types";

interface EvidenceLinkingModalProps {
  document: ProjectDocument | null;
  isOpen: boolean;
  onClose: () => void;
}

const BMC_BLOCKS: Array<{
  id: CanvasBlockId;
  title: string;
  hint: string;
  gridArea: string;
}> = [
  {
    id: "keyPartners",
    title: "Key Partners",
    hint: "Who helps you deliver?",
    gridArea: "1 / 1 / 2 / 3",
  },
  {
    id: "keyActivities",
    title: "Key Activities",
    hint: "What must you excel at?",
    gridArea: "2 / 1 / 4 / 2",
  },
  {
    id: "keyResources",
    title: "Key Resources",
    hint: "What assets keep you moving?",
    gridArea: "2 / 2 / 4 / 3",
  },
  {
    id: "valuePropositions",
    title: "Value Propositions",
    hint: "Why do customers care?",
    gridArea: "1 / 3 / 4 / 5",
  },
  {
    id: "customerRelationships",
    title: "Customer Relationships",
    hint: "How do you build trust?",
    gridArea: "2 / 5 / 3 / 6",
  },
  {
    id: "channels",
    title: "Channels",
    hint: "How do you reach people?",
    gridArea: "3 / 5 / 4 / 6",
  },
  {
    id: "customerSegments",
    title: "Customer Segments",
    hint: "Who feels the pain most?",
    gridArea: "1 / 5 / 2 / 6",
  },
  {
    id: "costStructure",
    title: "Cost Structure",
    hint: "Where does money go?",
    gridArea: "4 / 1 / 5 / 4",
  },
  {
    id: "revenueStreams",
    title: "Revenue Streams",
    hint: "How do you earn?",
    gridArea: "4 / 4 / 5 / 6",
  },
];

export function EvidenceLinkingModal({
  document,
  isOpen,
  onClose,
}: EvidenceLinkingModalProps) {
  const linkEvidence = useWorkspaceStore((state) => state.linkEvidence);
  const unlinkEvidence = useWorkspaceStore((state) => state.unlinkEvidence);

  const [selectedBlocks, setSelectedBlocks] = useState<Set<CanvasBlockId>>(
    new Set(document?.linkedFields || []),
  );

  // Reset selection when document changes
  useState(() => {
    if (document) {
      setSelectedBlocks(new Set(document.linkedFields || []));
    }
  });

  if (!document) {
    return null;
  }

  const toggleBlock = (blockId: CanvasBlockId) => {
    setSelectedBlocks((prev) => {
      const next = new Set(prev);
      if (next.has(blockId)) {
        next.delete(blockId);
      } else {
        next.add(blockId);
      }
      return next;
    });
  };

  const handleSave = () => {
    const currentLinks = new Set(document.linkedFields || []);
    const newLinks = selectedBlocks;

    // Find blocks to link and unlink
    const toLink = Array.from(newLinks).filter((id) => !currentLinks.has(id));
    const toUnlink = Array.from(currentLinks).filter((id) => !newLinks.has(id));

    // Apply changes
    toLink.forEach((blockId) => linkEvidence(document.id, blockId));
    toUnlink.forEach((blockId) => unlinkEvidence(document.id, blockId));

    const linkCount = newLinks.size;
    toast.success(
      linkCount > 0
        ? `Linked to ${linkCount} canvas block${linkCount !== 1 ? "s" : ""}`
        : "All links removed",
    );

    onClose();
  };

  const renderDocumentPreview = () => {
    if (document.type === "image" && document.previewUrl) {
      return (
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-white/10 bg-white/5">
          <NextImage
            src={document.previewUrl}
            alt={document.name}
            fill
            className="object-contain"
            sizes="400px"
          />
        </div>
      );
    }

    // Text document preview
    if (
      (document.type === "txt" || document.type === "md") &&
      document.content
    ) {
      return (
        <div className="aspect-[4/3] w-full overflow-hidden rounded-xl border border-white/10 bg-white/5">
          <div className="h-full overflow-y-auto p-4">
            <pre className="whitespace-pre-wrap break-words font-mono text-xs text-foreground/80 line-clamp-[12]">
              {document.content.slice(0, 500)}
              {document.content.length > 500 && "..."}
            </pre>
          </div>
        </div>
      );
    }

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
        className={`flex aspect-[4/3] w-full items-center justify-center rounded-xl border border-white/10 bg-gradient-to-br ${gradientClass}`}
      >
        <Icon className="h-20 w-20 text-primary/40" />
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Link Evidence to Canvas
          </DialogTitle>
          <DialogDescription>
            Select which canvas blocks this evidence supports
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
            {/* Left: Document Preview */}
            <div className="lg:col-span-2">
              <div className="sticky top-0 space-y-3">
                {renderDocumentPreview()}
                <div>
                  <h4
                    className="truncate font-semibold text-foreground"
                    title={document.name}
                  >
                    {document.name}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    {document.type.toUpperCase()} •{" "}
                    {(document.size / 1024).toFixed(1)} KB
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Canvas Block Selector */}
            <div className="lg:col-span-3">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-foreground">
                    Select Blocks ({selectedBlocks.size} selected)
                  </h4>
                  {selectedBlocks.size > 0 && (
                    <button
                      onClick={() => setSelectedBlocks(new Set())}
                      className="text-xs text-muted-foreground hover:text-foreground"
                    >
                      Clear all
                    </button>
                  )}
                </div>

                {/* Block Grid */}
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {BMC_BLOCKS.map((block) => {
                    const isSelected = selectedBlocks.has(block.id);
                    const isCore = block.id === "valuePropositions";

                    return (
                      <m.button
                        key={block.id}
                        type="button"
                        onClick={() => toggleBlock(block.id)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={cn(
                          "relative flex flex-col items-start gap-1.5 rounded-xl border p-3 text-left transition-all",
                          isSelected
                            ? "border-primary/50 bg-primary/10 shadow-md shadow-primary/20"
                            : "border-white/10 bg-white/5 hover:border-white/20",
                          isCore && "sm:col-span-2",
                        )}
                      >
                        {isSelected && (
                          <div className="absolute right-2 top-2">
                            <CheckCircle2 className="h-4 w-4 text-primary" />
                          </div>
                        )}
                        <h5 className="text-sm font-semibold text-foreground">
                          {block.title}
                        </h5>
                        <p className="text-xs text-muted-foreground">
                          {block.hint}
                        </p>
                      </m.button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" size="md" onClick={onClose}>
            Cancel
          </Button>
          <Button size="md" onClick={handleSave}>
            Save Links
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
