"use client";

import { useState, useEffect } from "react";

import { ScrollArea, Badge } from "@/components/unified";
import { BORDER, TYPOGRAPHY } from "@/components/unified";
import { FileText, Image as ImageIcon, Link as LinkIcon } from "@/icons";
import { cn } from "@/lib/utils";

export type SourceType = "file" | "text" | "url";
export type FileType = "pdf" | "image" | "text" | "json";

export interface SourcePreviewPanelProps {
  sourceType: SourceType;
  fileType?: FileType;
  fileName?: string;
  fileSize?: number;
  content?: string; // For text/url content
  file?: File; // For file uploads
  className?: string;
}

export function SourcePreviewPanel({
  sourceType,
  fileType,
  fileName,
  fileSize,
  content,
  file,
  className,
}: SourcePreviewPanelProps) {
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);

  // Generate image preview URL
  useEffect(() => {
    if (file && fileType === "image") {
      const url = URL.createObjectURL(file);
      setImagePreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
    return undefined;
  }, [file, fileType]);

  const getSourceIcon = () => {
    if (fileType === "pdf") {
      return <FileText className="h-5 w-5" />;
    }
    if (fileType === "image") {
      return <ImageIcon className="h-5 w-5" />;
    }
    if (sourceType === "url") {
      return <LinkIcon className="h-5 w-5" />;
    }
    return <FileText className="h-5 w-5" />;
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) {
      return "";
    }
    if (bytes < 1024) {
      return `${bytes} B`;
    }
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const renderPreview = () => {
    // Image preview
    if (fileType === "image" && imagePreviewUrl) {
      return (
        <div className="flex h-full items-center justify-center bg-black/20 p-4">
          <img
            src={imagePreviewUrl}
            alt="Source preview"
            className="max-h-full max-w-full rounded-lg object-contain"
          />
        </div>
      );
    }

    // PDF preview (placeholder - would need PDF.js for full rendering)
    if (fileType === "pdf") {
      return (
        <div className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center">
          <FileText className="h-16 w-16 text-muted-foreground" />
          <div>
            <p className={cn(TYPOGRAPHY.heading.sm, "mb-1")}>PDF Document</p>
            <p className={cn(TYPOGRAPHY.muted.sm)}>
              {fileName}
              {fileSize && ` · ${formatFileSize(fileSize)}`}
            </p>
          </div>
          <p className={cn(TYPOGRAPHY.muted.sm)}>
            Preview available after processing
          </p>
        </div>
      );
    }

    // Text content preview
    if (content) {
      return (
        <ScrollArea className="h-full">
          <div className={cn("p-4", TYPOGRAPHY.body.sm, "font-mono")}>
            <pre className="whitespace-pre-wrap break-words">{content}</pre>
          </div>
        </ScrollArea>
      );
    }

    // Fallback
    return (
      <div className="flex h-full items-center justify-center p-8 text-center">
        <div>
          <p className={cn(TYPOGRAPHY.muted.md)}>
            Source preview will appear here
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className={cn("flex h-full flex-col", className)}>
      {/* Header */}
      <div
        className={cn(
          "flex items-center justify-between border-b px-4 py-3",
          BORDER.subtle,
        )}
      >
        <div className="flex items-center gap-2">
          {getSourceIcon()}
          <span className={cn(TYPOGRAPHY.heading.xs)}>Source</span>
          {fileType && (
            <Badge variant="secondary" className="ml-2 text-xs uppercase">
              {fileType}
            </Badge>
          )}
        </div>
        {fileSize && (
          <span className={cn(TYPOGRAPHY.muted.sm)}>
            {formatFileSize(fileSize)}
          </span>
        )}
      </div>

      {/* Preview Area */}
      <div className="flex-1 overflow-hidden">{renderPreview()}</div>
    </div>
  );
}
