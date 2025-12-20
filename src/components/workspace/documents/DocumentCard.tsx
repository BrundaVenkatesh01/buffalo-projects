import { m } from "framer-motion";
import NextImage from "next/image";
import { useState } from "react";

import { Badge } from "@/components/ui-next";
import {
  FileText,
  Image as ImageIcon,
  Video,
  ExternalLink,
  Trash2,
  Link as LinkIcon,
  CheckCircle2,
  AlertCircle,
  FileCode,
  Book,
} from "@/icons";
import { cn } from "@/lib/utils";
import type { ProjectDocument } from "@/types";

interface DocumentCardProps {
  document: ProjectDocument;
  onPreview: (doc: ProjectDocument) => void;
  onDelete: (doc: ProjectDocument) => void;
  onLink: (doc: ProjectDocument) => void;
  index?: number;
}

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

export function DocumentCard({
  document,
  onPreview,
  onDelete,
  onLink,
  index = 0,
}: DocumentCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const linkedCount = document.linkedFields?.length ?? 0;
  const hasLinks = linkedCount > 0;

  const renderThumbnail = () => {
    if (document.type === "image" && document.previewUrl) {
      return (
        <NextImage
          src={document.previewUrl}
          alt={document.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      );
    }

    // Icon fallback for non-images
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
        className={cn(
          "flex h-full w-full items-center justify-center bg-gradient-to-br",
          gradientClass,
        )}
      >
        <Icon className="h-16 w-16 text-primary/40" />
      </div>
    );
  };

  return (
    <m.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/5 transition-all duration-200 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/10"
    >
      {/* Thumbnail Section */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-white/5">
        {renderThumbnail()}

        {/* Type Badge */}
        <div className="absolute left-2 top-2">
          <Badge
            variant="secondary"
            className="rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-sm"
          >
            {document.type}
          </Badge>
        </div>

        {/* Link Status Badge */}
        <div className="absolute right-2 top-2">
          {hasLinks ? (
            <Badge
              variant="secondary"
              className="flex items-center gap-1 rounded-full border-0 bg-emerald-500/90 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur-sm"
            >
              <CheckCircle2 className="h-2.5 w-2.5" />
              {linkedCount} block{linkedCount !== 1 ? "s" : ""}
            </Badge>
          ) : (
            <Badge
              variant="secondary"
              className="flex items-center gap-1 rounded-full border-0 bg-amber-500/90 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur-sm"
            >
              <AlertCircle className="h-2.5 w-2.5" />
              Unlinked
            </Badge>
          )}
        </div>

        {/* Hover Overlay with Quick Actions */}
        {isHovered && (
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center gap-2 bg-black/60 backdrop-blur-sm"
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                onLink(document);
              }}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/90 text-white transition-transform hover:scale-110 hover:bg-primary"
              title="Link to canvas blocks"
            >
              <LinkIcon className="h-4 w-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onPreview(document);
              }}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-gray-900 transition-transform hover:scale-110 hover:bg-white"
              title="Preview document"
            >
              <ExternalLink className="h-4 w-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(document);
              }}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500/90 text-white transition-transform hover:scale-110 hover:bg-red-500"
              title="Delete document"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </m.div>
        )}
      </div>

      {/* Info Section */}
      <div className="flex flex-col gap-1.5 p-3">
        <h3
          className="truncate text-sm font-semibold text-foreground"
          title={document.name}
        >
          {document.name}
        </h3>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{readableSize(document.size)}</span>
          <span>
            {new Date(document.uploadedAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
          </span>
        </div>
      </div>

      {/* Bottom action indicator */}
      <div
        className={cn(
          "absolute bottom-0 left-0 right-0 h-0.5 transition-all duration-200",
          isHovered
            ? "bg-primary"
            : hasLinks
              ? "bg-emerald-500/30"
              : "bg-amber-500/30",
        )}
      />
    </m.div>
  );
}
