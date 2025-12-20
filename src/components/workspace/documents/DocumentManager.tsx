import { m } from "framer-motion";
import { nanoid } from "nanoid";
import type { ChangeEvent, DragEvent } from "react";
import { useCallback, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

import { EvidenceLinkingModal } from "../canvas/EvidenceLinkingModal";

import { DocumentDetailDrawer } from "./DocumentDetailDrawer";
import { DocumentGrid } from "./DocumentGrid";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge, Button, Input } from "@/components/unified";
import { Upload, ArrowUpDown, Filter, Search, X } from "@/icons";
import { cn } from "@/lib/utils";
import { isFirebaseConfigured } from "@/services/firebase";
import { authService } from "@/services/firebaseAuth";
import { firebaseDatabase } from "@/services/firebaseDatabase";
import type {
  CanvasBlockId,
  ProjectDocument,
  ProjectDocumentKind,
} from "@/types";

interface DocumentManagerProps {
  documents: ProjectDocument[];
  onDocumentsChange: (documents: ProjectDocument[]) => void;
  workspaceCode: string;
}

const ACCEPTED_TYPES: Record<
  "image" | "video" | "pdf" | "txt" | "md" | "doc",
  { mime: string[]; maxBytes: number; label: string }
> = {
  image: {
    mime: ["image/jpeg", "image/png", "image/gif", "image/webp"],
    maxBytes: 10 * 1024 * 1024,
    label: "Images (JPG, PNG, GIF, WEBP) ≤ 10MB",
  },
  video: {
    mime: ["video/mp4", "video/webm"],
    maxBytes: 50 * 1024 * 1024,
    label: "Videos (MP4, WEBM) ≤ 50MB",
  },
  pdf: {
    mime: ["application/pdf"],
    maxBytes: 5 * 1024 * 1024,
    label: "PDF documents ≤ 5MB",
  },
  txt: {
    mime: ["text/plain"],
    maxBytes: 2 * 1024 * 1024,
    label: "Text files (TXT) ≤ 2MB",
  },
  md: {
    mime: ["text/markdown", "text/x-markdown"],
    maxBytes: 2 * 1024 * 1024,
    label: "Markdown (MD) ≤ 2MB",
  },
  doc: {
    mime: [
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ],
    maxBytes: 10 * 1024 * 1024,
    label: "Word docs (DOC, DOCX) ≤ 10MB",
  },
};

const ACCEPT_ATTR = Object.values(ACCEPTED_TYPES)
  .flatMap((item) => item.mime)
  .join(",");

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

type UploadQueueItem = {
  id: string;
  name: string;
  progress: number;
  status: "uploading" | "processing" | "completed" | "error";
  error?: string;
};

type SortMode = "date-desc" | "date-asc" | "name" | "linked" | "type";
type FilterMode = "all" | "linked" | "unlinked";

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// AUTO-LINKING LOGIC
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Keyword mapping for auto-linking documents to BMC blocks
 * Based on common document names and content themes serial entrepreneurs use
 */
const BMC_KEYWORD_MAP: Record<CanvasBlockId, string[]> = {
  valuePropositions: [
    "value",
    "proposition",
    "pitch",
    "solution",
    "problem",
    "benefit",
    "unique",
    "differentiation",
    "advantage",
    "value_prop",
    "vp",
  ],
  customerSegments: [
    "customer",
    "segment",
    "persona",
    "target",
    "audience",
    "user",
    "market",
    "demographic",
    "interview",
    "research",
    "survey",
    "icp",
  ],
  channels: [
    "channel",
    "distribution",
    "sales",
    "marketing",
    "acquisition",
    "reach",
    "funnel",
    "traffic",
    "conversion",
    "campaign",
    "gtm",
  ],
  customerRelationships: [
    "relationship",
    "retention",
    "engagement",
    "support",
    "service",
    "crm",
    "loyalty",
    "onboarding",
    "lifecycle",
    "churn",
    "nps",
  ],
  revenueStreams: [
    "revenue",
    "pricing",
    "monetization",
    "income",
    "subscription",
    "payment",
    "billing",
    "pricing_model",
    "sales",
    "forecast",
    "arr",
    "mrr",
  ],
  keyResources: [
    "resource",
    "asset",
    "infrastructure",
    "technology",
    "platform",
    "intellectual",
    "property",
    "ip",
    "team",
    "talent",
    "tech_stack",
  ],
  keyActivities: [
    "activity",
    "process",
    "operation",
    "workflow",
    "development",
    "production",
    "delivery",
    "execution",
    "roadmap",
    "sprint",
  ],
  keyPartners: [
    "partner",
    "supplier",
    "vendor",
    "alliance",
    "collaboration",
    "integration",
    "outsource",
    "contract",
    "agreement",
    "api",
  ],
  costStructure: [
    "cost",
    "expense",
    "budget",
    "burn",
    "spend",
    "overhead",
    "capex",
    "opex",
    "financial",
    "projection",
    "cac",
    "ltv",
  ],
};

/**
 * Suggests BMC blocks based on document filename
 * Uses keyword matching to intelligently link documents for serial entrepreneurs
 */
function suggestLinkedBlocks(filename: string): CanvasBlockId[] {
  const normalized = filename.toLowerCase().replace(/[_-]/g, " ");
  const suggestions: CanvasBlockId[] = [];

  for (const [blockId, keywords] of Object.entries(BMC_KEYWORD_MAP)) {
    const hasMatch = keywords.some((keyword) => normalized.includes(keyword));

    if (hasMatch) {
      suggestions.push(blockId as CanvasBlockId);
    }
  }

  return suggestions;
}

export function DocumentManager({
  documents,
  onDocumentsChange,
  workspaceCode,
}: DocumentManagerProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [queue, setQueue] = useState<Record<string, UploadQueueItem>>({});
  const [sortMode, setSortMode] = useState<SortMode>("date-desc");
  const [filterMode, setFilterMode] = useState<FilterMode>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDocument, setSelectedDocument] =
    useState<ProjectDocument | null>(null);
  const [linkingDocument, setLinkingDocument] =
    useState<ProjectDocument | null>(null);
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);
  const [isLinkingModalOpen, setIsLinkingModalOpen] = useState(false);

  const triggerFileDialog = () => {
    fileInputRef.current?.click();
  };

  const updateQueue = useCallback(
    (id: string, update: Partial<UploadQueueItem>) => {
      setQueue((prev) => ({
        ...prev,
        [id]: {
          ...(prev[id] ?? {
            id,
            name: "",
            progress: 0,
            status: "uploading" as const,
          }),
          ...update,
        },
      }));
    },
    [],
  );

  const removeFromQueue = useCallback((id: string) => {
    setQueue((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }, []);

  const determineKind = useCallback(
    (file: File): ProjectDocumentKind | "unsupported" => {
      const mime = file.type.toLowerCase();
      if (ACCEPTED_TYPES.image.mime.includes(mime)) {
        return "image";
      }
      if (ACCEPTED_TYPES.video.mime.includes(mime)) {
        return "video";
      }
      if (ACCEPTED_TYPES.pdf.mime.includes(mime)) {
        return "pdf";
      }
      if (ACCEPTED_TYPES.txt.mime.includes(mime)) {
        return "txt";
      }
      if (ACCEPTED_TYPES.md.mime.includes(mime)) {
        return "md";
      }
      if (ACCEPTED_TYPES.doc.mime.includes(mime)) {
        return "doc";
      }

      // Fallback to extension-based detection
      const extension = file.name.split(".").pop()?.toLowerCase();
      if (!extension) {
        return "unsupported";
      }
      if (["jpg", "jpeg", "png", "gif", "webp"].includes(extension)) {
        return "image";
      }
      if (["mp4", "webm"].includes(extension)) {
        return "video";
      }
      if (extension === "pdf") {
        return "pdf";
      }
      if (extension === "txt") {
        return "txt";
      }
      if (["md", "markdown"].includes(extension)) {
        return "md";
      }
      if (["doc", "docx"].includes(extension)) {
        return "doc";
      }
      return "unsupported";
    },
    [],
  );

  // Sort, filter, and search documents based on user preferences
  const sortedAndFilteredDocuments = useMemo(() => {
    let result = [...documents];

    // Apply search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter((doc) => doc.name.toLowerCase().includes(query));
    }

    // Apply filter
    if (filterMode === "linked") {
      result = result.filter(
        (doc) => doc.linkedFields && doc.linkedFields.length > 0,
      );
    } else if (filterMode === "unlinked") {
      result = result.filter(
        (doc) => !doc.linkedFields || doc.linkedFields.length === 0,
      );
    }

    // Apply sort
    result.sort((a, b) => {
      switch (sortMode) {
        case "date-desc":
          return (
            new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
          );
        case "date-asc":
          return (
            new Date(a.uploadedAt).getTime() - new Date(b.uploadedAt).getTime()
          );
        case "name":
          return a.name.localeCompare(b.name, "en", { sensitivity: "base" });
        case "linked": {
          const aLinked = a.linkedFields?.length ?? 0;
          const bLinked = b.linkedFields?.length ?? 0;
          return bLinked - aLinked;
        }
        case "type":
          return a.type.localeCompare(b.type);
        default:
          return 0;
      }
    });

    return result;
  }, [documents, sortMode, filterMode, searchQuery]);

  const validateFile = useCallback(
    (file: File) => {
      const kind = determineKind(file);
      if (kind === "unsupported") {
        return {
          valid: false,
          message:
            "Unsupported file type. Upload images, videos, PDFs, or text documents (TXT, MD, DOC).",
        };
      }

      const rules = ACCEPTED_TYPES[kind as keyof typeof ACCEPTED_TYPES];

      if (file.size > rules.maxBytes) {
        return {
          valid: false,
          message: `${file.name} exceeds the size limit (${readableSize(rules.maxBytes)}).`,
        };
      }

      return { valid: true, kind } as const;
    },
    [determineKind],
  );

  const readFileAsBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () =>
        reject(reader.error ?? new Error("File read error"));
      reader.readAsDataURL(file);
    });

  const readFileAsText = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () =>
        reject(reader.error ?? new Error("File read error"));
      reader.readAsText(file);
    });

  const processFileUpload = useCallback(
    async (file: File) => {
      const validation = validateFile(file);
      if (!validation.valid) {
        toast.error(validation.message);
        return;
      }

      const uploadId = nanoid();
      updateQueue(uploadId, {
        id: uploadId,
        name: file.name,
        progress: 0,
        status: "uploading",
      });

      try {
        let document: ProjectDocument;

        if (isFirebaseConfigured && authService.isAuthenticated()) {
          document = await firebaseDatabase.uploadDocument(
            workspaceCode,
            file,
            {
              onProgress: (progress) => {
                updateQueue(uploadId, { progress });
              },
            },
          );
          updateQueue(uploadId, { status: "processing", progress: 100 });
        } else {
          // For text files, read as text; for others, read as base64
          const isTextFile =
            validation.kind === "txt" || validation.kind === "md";

          let extractedText: string | undefined;
          let content: string | undefined;
          let previewUrl: string | undefined;

          if (isTextFile) {
            const textContent = await readFileAsText(file);
            extractedText = textContent;
            content = textContent;
          } else {
            const base64 = await readFileAsBase64(file);
            if (validation.kind === "pdf") {
              content = base64;
            } else if (validation.kind === "image") {
              previewUrl = base64;
            } else if (validation.kind === "doc") {
              content = base64;
              // Note: For Word docs, we'd need a proper parser in production
              extractedText =
                "Word document - content extraction requires backend processing";
            }
          }

          document = {
            id: nanoid(),
            name: file.name,
            type: validation.kind,
            size: file.size,
            uploadedAt: new Date().toISOString(),
            content,
            previewUrl,
            extractedText,
          } as ProjectDocument;
          updateQueue(uploadId, { status: "completed", progress: 100 });
        }

        // Auto-link document to relevant BMC blocks based on filename
        const suggestedBlocks = suggestLinkedBlocks(file.name);
        if (suggestedBlocks.length > 0) {
          document.linkedFields = suggestedBlocks;
        }

        onDocumentsChange([...documents, document]);

        // Show success toast with auto-link info
        if (suggestedBlocks.length > 0) {
          toast.success(
            `${file.name} added and auto-linked to ${suggestedBlocks.length} block${suggestedBlocks.length === 1 ? "" : "s"}.`,
          );
        } else {
          toast.success(`${file.name} added to workspace.`);
        }

        removeFromQueue(uploadId);
      } catch (error) {
        console.error("Upload failed", error);
        updateQueue(uploadId, {
          status: "error",
          error: "Upload failed",
          progress: 0,
        });
        toast.error(`Unable to upload ${file.name}.`);
        setTimeout(() => removeFromQueue(uploadId), 4000);
      }
    },
    [
      documents,
      onDocumentsChange,
      removeFromQueue,
      updateQueue,
      validateFile,
      workspaceCode,
    ],
  );

  const handleFiles = useCallback(
    async (files: FileList | File[]) => {
      const fileArray = Array.from(files);
      if (fileArray.length === 0) {
        return;
      }

      await fileArray.reduce<Promise<void>>(async (chain, file) => {
        await chain;
        await processFileUpload(file);
      }, Promise.resolve());
    },
    [processFileUpload],
  );

  const handleFileSelection = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;
      if (!files) {
        return;
      }
      void handleFiles(files);
      event.target.value = "";
    },
    [handleFiles],
  );

  const handleDrop = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setDragActive(false);
      if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
        void handleFiles(event.dataTransfer.files);
        event.dataTransfer.clearData();
      }
    },
    [handleFiles],
  );

  const handlePreview = useCallback((document: ProjectDocument) => {
    setSelectedDocument(document);
    setIsDetailDrawerOpen(true);
  }, []);

  const handleLink = useCallback((document: ProjectDocument) => {
    setLinkingDocument(document);
    setIsLinkingModalOpen(true);
  }, []);

  const handleDelete = useCallback(
    async (document: ProjectDocument) => {
      try {
        onDocumentsChange(documents.filter((doc) => doc.id !== document.id));
        if (isFirebaseConfigured && authService.isAuthenticated()) {
          await firebaseDatabase.deleteDocument(workspaceCode, document);
        }
        toast.success(`${document.name} removed.`);
      } catch (error) {
        console.error("Failed to delete document", error);
        toast.error("Could not delete document right now.");
      }
    },
    [documents, onDocumentsChange, workspaceCode],
  );

  const dropzoneHint = useMemo(() => {
    return Object.values(ACCEPTED_TYPES)
      .map((item) => item.label)
      .join(" • ");
  }, []);

  return (
    <>
      <div className="space-y-6">
        {/* Hero Section */}
        <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.03] to-transparent p-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="font-display text-lg font-bold text-foreground">
                Evidence Library
              </h2>
            </div>
            <Button
              onClick={triggerFileDialog}
              size="sm"
              leftIcon={<Upload className="h-4 w-4" />}
            >
              Upload Files
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              hidden
              multiple
              onChange={handleFileSelection}
              accept={ACCEPT_ATTR}
            />
          </div>

          {/* Controls Row */}
          {documents.length > 0 && (
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:flex-wrap">
              {/* Search */}
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search files..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-9 rounded-full border-white/10 bg-white/5 pl-9 pr-9 text-sm"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Sort */}
              <div className="flex items-center gap-2">
                <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                <Select
                  value={sortMode}
                  onValueChange={(value: SortMode) => setSortMode(value)}
                >
                  <SelectTrigger className="h-9 w-[160px] rounded-full border-white/10 bg-white/5 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date-desc">Newest first</SelectItem>
                    <SelectItem value="date-asc">Oldest first</SelectItem>
                    <SelectItem value="name">Name (A-Z)</SelectItem>
                    <SelectItem value="linked">Most linked</SelectItem>
                    <SelectItem value="type">File type</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Filter */}
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <Select
                  value={filterMode}
                  onValueChange={(value: FilterMode) => setFilterMode(value)}
                >
                  <SelectTrigger className="h-9 w-[140px] rounded-full border-white/10 bg-white/5 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All files</SelectItem>
                    <SelectItem value="linked">Linked</SelectItem>
                    <SelectItem value="unlinked">Unlinked</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Results count */}
              <Badge
                variant="outline"
                className="rounded-full border-white/20 text-xs text-muted-foreground"
              >
                {sortedAndFilteredDocuments.length} of {documents.length} file
                {documents.length === 1 ? "" : "s"}
              </Badge>
            </div>
          )}
        </div>

        {/* Drag & Drop Zone */}
        <div
          onDragEnter={(event) => {
            event.preventDefault();
            setDragActive(true);
          }}
          onDragOver={(event) => {
            event.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={(event) => {
            event.preventDefault();
            setDragActive(false);
          }}
          onDrop={handleDrop}
          className={cn(
            "rounded-2xl border-2 border-dashed p-8 text-center transition-all",
            dragActive
              ? "border-primary/60 bg-primary/10 scale-[1.02]"
              : "border-white/10 bg-white/[0.02]",
          )}
        >
          <p className="font-semibold text-foreground">
            Drag and drop files here
          </p>
          <p className="mt-2 text-xs text-muted-foreground">{dropzoneHint}</p>
        </div>

        {/* Upload Queue */}
        {Object.values(queue).length > 0 && (
          <div className="space-y-2">
            {Object.values(queue).map((item) => (
              <m.div
                key={item.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="rounded-xl border border-white/10 bg-white/5 p-4"
              >
                <div className="flex items-center justify-between text-sm text-foreground">
                  <span className="truncate font-medium">{item.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {item.status === "error" ? "Error" : `${item.progress}%`}
                  </span>
                </div>
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                  <m.div
                    className={cn(
                      "h-full transition-all",
                      item.status === "error" ? "bg-red-500" : "bg-primary",
                    )}
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.max(item.progress, 5)}%` }}
                  />
                </div>
                {item.error && (
                  <p className="mt-2 text-xs text-red-400">{item.error}</p>
                )}
              </m.div>
            ))}
          </div>
        )}

        {/* Document Grid */}
        <DocumentGrid
          documents={sortedAndFilteredDocuments}
          onPreview={handlePreview}
          onDelete={(doc: ProjectDocument) => void handleDelete(doc)}
          onLink={handleLink}
        />
      </div>

      {/* Detail Drawer */}
      <DocumentDetailDrawer
        document={selectedDocument}
        isOpen={isDetailDrawerOpen}
        onClose={() => {
          setIsDetailDrawerOpen(false);
          setSelectedDocument(null);
        }}
        onDelete={(doc: ProjectDocument) => void handleDelete(doc)}
        onLink={handleLink}
      />

      {/* Linking Modal */}
      <EvidenceLinkingModal
        document={linkingDocument}
        isOpen={isLinkingModalOpen}
        onClose={() => {
          setIsLinkingModalOpen(false);
          setLinkingDocument(null);
        }}
      />
    </>
  );
}

export default DocumentManager;
