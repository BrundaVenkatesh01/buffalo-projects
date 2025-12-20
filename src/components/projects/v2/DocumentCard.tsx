"use client";

import { m } from "framer-motion";

import {
  FileText,
  Video,
  Link as LinkIcon,
  File,
  Download,
  ExternalLink,
  Play,
} from "@/icons";
import { cn } from "@/lib/utils";
import type { ProjectDocument } from "@/types";

export interface DocumentCardProps {
  document: ProjectDocument;
  index?: number;
  className?: string;
}

/**
 * DocumentCard - Display evidence document with type-specific styling
 *
 * Design: Card with icon, name, metadata, action button
 * Types: PDF, Video, Link, Other
 * Actions: Download (PDFs/docs), Watch (videos), Visit (links)
 */
export function DocumentCard({
  document,
  index = 0,
  className,
}: DocumentCardProps) {
  const { icon, color, actionText, actionIcon } = getDocumentConfig(
    document.type,
  );

  const handleAction = () => {
    if (document.storagePath) {
      if (document.type === "video") {
        // Open video in new tab or player
        window.open(document.storagePath, "_blank");
      } else if (isExternalLink(document.storagePath)) {
        // Open external link
        window.open(document.storagePath, "_blank", "noopener,noreferrer");
      } else {
        // Download file
        const link = window.document.createElement("a");
        link.href = document.storagePath;
        link.download = document.name;
        link.click();
      }
    }
  };

  return (
    <m.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.3,
        delay: index * 0.05,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className={cn(
        "group relative overflow-hidden rounded-xl border border-white/[0.08]",
        "bg-gradient-to-br from-white/[0.03] to-white/[0.01] p-6",
        "backdrop-blur-sm transition-all",
        "hover:border-white/[0.12] hover:shadow-lg hover:shadow-primary/5",
        className,
      )}
    >
      {/* Icon */}
      <div className={cn("mb-4 inline-flex rounded-lg p-3", color)}>{icon}</div>

      {/* Document Name */}
      <h3 className="mb-2 line-clamp-2 text-lg font-semibold text-white">
        {document.name}
      </h3>

      {/* Metadata */}
      <div className="mb-4 flex items-center gap-2 text-xs text-neutral-400">
        {document.size > 0 && !isExternalLink(document.storagePath) && (
          <span>{formatFileSize(document.size)}</span>
        )}
        {document.uploadedAt && (
          <>
            {document.size > 0 && !isExternalLink(document.storagePath) && (
              <span className="text-neutral-500">•</span>
            )}
            <span>{formatDate(document.uploadedAt)}</span>
          </>
        )}
      </div>

      {/* Action Button */}
      {document.storagePath && (
        <button
          onClick={handleAction}
          className={cn(
            "inline-flex items-center gap-2 rounded-lg px-4 py-2",
            "border border-white/[0.08] bg-white/[0.02]",
            "text-sm font-medium text-white transition-all",
            "hover:border-white/[0.15] hover:bg-white/[0.05]",
          )}
        >
          {actionIcon}
          <span>{actionText}</span>
        </button>
      )}

      {/* Hover Effect */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
    </m.div>
  );
}

// Helper functions

function getDocumentConfig(type: ProjectDocument["type"]) {
  switch (type) {
    case "pdf":
    case "doc":
      return {
        icon: <FileText className="h-6 w-6 text-blue-500" />,
        color: "bg-blue-500/10",
        actionText: "Download",
        actionIcon: <Download className="h-4 w-4" />,
      };
    case "video":
      return {
        icon: <Video className="h-6 w-6 text-purple-500" />,
        color: "bg-purple-500/10",
        actionText: "Watch",
        actionIcon: <Play className="h-4 w-4" />,
      };
    case "iframe_embed":
      return {
        icon: <LinkIcon className="h-6 w-6 text-green-500" />,
        color: "bg-green-500/10",
        actionText: "Visit",
        actionIcon: <ExternalLink className="h-4 w-4" />,
      };
    default:
      return {
        icon: <File className="h-6 w-6 text-gray-500" />,
        color: "bg-gray-500/10",
        actionText: "Download",
        actionIcon: <Download className="h-4 w-4" />,
      };
  }
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) {
    return "0 Bytes";
  }
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateString;
  }
}

function isExternalLink(path?: string): boolean {
  if (!path) {
    return false;
  }
  return path.startsWith("http://") || path.startsWith("https://");
}
