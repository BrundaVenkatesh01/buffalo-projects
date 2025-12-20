"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

import { Button } from "@/components/unified";
import {
  BORDER,
  PADDING,
  RADIUS,
  SPACING,
  TYPOGRAPHY,
} from "@/components/unified";
import { Upload, FileText, Image, FileJson, X } from "@/icons";
import { cn } from "@/lib/utils";
import { getSupportedFileTypes } from "@/services/importService";

interface ImportUploadStepProps {
  onFileSelected: (file: File) => void;
  onTextPasted: (text: string) => void;
  onCancel: () => void;
}

export function ImportUploadStep({
  onFileSelected,
  onTextPasted,
  onCancel,
}: ImportUploadStepProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [pastedText, setPastedText] = useState("");
  const [mode, setMode] = useState<"file" | "text">("file");

  const supportedTypes = getSupportedFileTypes();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      if (file) {
        setSelectedFile(file);
      }
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      onDrop,
      accept: {
        "image/*": [".jpg", ".jpeg", ".png", ".webp"],
        "application/pdf": [".pdf"],
        "text/plain": [".txt"],
        "text/markdown": [".md"],
        "application/json": [".json"],
      },
      maxFiles: 1,
      maxSize: 10 * 1024 * 1024, // 10MB
    });

  const handleImport = () => {
    if (mode === "file" && selectedFile) {
      onFileSelected(selectedFile);
    } else if (mode === "text" && pastedText.trim()) {
      onTextPasted(pastedText);
    }
  };

  const canProceed =
    (mode === "file" && selectedFile) ||
    (mode === "text" && pastedText.trim().length > 0);

  const getFileIcon = (file: File) => {
    if (file.type.startsWith("image/")) {
      return Image;
    }
    if (file.type === "application/json") {
      return FileJson;
    }
    return FileText;
  };

  return (
    <div className={cn("flex flex-col", SPACING.lg)}>
      {/* Mode Toggle */}
      <div className="flex gap-2">
        <Button
          variant={mode === "file" ? "default" : "outline"}
          size="sm"
          onClick={() => setMode("file")}
          className="flex flex-1 items-center gap-2"
        >
          <Upload className="h-4 w-4 shrink-0" />
          <span className="whitespace-nowrap">Upload File</span>
        </Button>
        <Button
          variant={mode === "text" ? "default" : "outline"}
          size="sm"
          onClick={() => setMode("text")}
          className="flex flex-1 items-center gap-2"
        >
          <FileText className="h-4 w-4 shrink-0" />
          <span className="whitespace-nowrap">Paste Text</span>
        </Button>
      </div>

      {/* File Upload Mode */}
      {mode === "file" && (
        <div className={cn("flex flex-col", SPACING.md)}>
          {/* Drag & Drop Zone */}
          <div
            {...getRootProps()}
            className={cn(
              "relative flex flex-col items-center justify-center border-2 border-dashed transition-all cursor-pointer",
              PADDING.xl,
              RADIUS.lg,
              isDragActive && !isDragReject
                ? "border-primary bg-primary/10"
                : isDragReject
                  ? "border-destructive bg-destructive/10"
                  : selectedFile
                    ? "border-primary/40 bg-primary/5"
                    : "border-white/20 bg-white/5 hover:border-white/30 hover:bg-white/10",
            )}
          >
            <input {...getInputProps()} />

            {!selectedFile ? (
              <>
                <Upload
                  className={cn(
                    "mb-4 h-12 w-12",
                    isDragActive ? "text-primary" : "text-muted-foreground",
                  )}
                />
                <p className={cn(TYPOGRAPHY.heading.sm, "mb-2 text-center")}>
                  {isDragActive
                    ? "Drop your file here"
                    : "Drag & drop or click to upload"}
                </p>
                <p className={cn(TYPOGRAPHY.muted.sm, "text-center")}>
                  {supportedTypes.description}
                </p>
                <p className={cn(TYPOGRAPHY.muted.sm, "mt-2 text-center")}>
                  Maximum file size: 10MB
                </p>
              </>
            ) : (
              <div className="flex w-full items-center justify-between">
                <div className="flex items-center gap-3">
                  {(() => {
                    const Icon = getFileIcon(selectedFile);
                    return <Icon className="h-8 w-8 text-primary" />;
                  })()}
                  <div>
                    <p className={cn(TYPOGRAPHY.heading.xs, "text-foreground")}>
                      {selectedFile.name}
                    </p>
                    <p className={cn(TYPOGRAPHY.muted.sm)}>
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB •{" "}
                      {selectedFile.type || "Unknown type"}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedFile(null);
                  }}
                  className="h-8 w-8"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          {/* File Type Examples */}
          <div className={cn("rounded-lg border", BORDER.subtle, PADDING.md)}>
            <p className={cn(TYPOGRAPHY.label.default, "mb-2")}>
              What You Can Import
            </p>
            <ul className={cn("space-y-1", TYPOGRAPHY.muted.sm)}>
              <li>📸 Business Model Canvas images (JPG, PNG)</li>
              <li>📄 Pitch deck slides or business plans (PDF)</li>
              <li>📝 Text notes or descriptions (TXT, MD)</li>
              <li>💾 Exported project data (JSON)</li>
            </ul>
          </div>
        </div>
      )}

      {/* Text Paste Mode */}
      {mode === "text" && (
        <div className={cn("flex flex-col", SPACING.md)}>
          <textarea
            value={pastedText}
            onChange={(e) => setPastedText(e.target.value)}
            placeholder="Paste your business idea, pitch, or Business Model Canvas content here...

Example:
Project: PermitBridge
Problem: Small contractors in Buffalo waste 10+ hours per week navigating complex municipal permit applications.
Solution: Unified digital platform that streamlines permit workflows with pre-filled forms and real-time status tracking.
Target Customers: Small contractors, property owners, local developers
Revenue: Monthly subscription ($49/mo) + enterprise plans for larger firms"
            className={cn(
              "min-h-[300px] w-full resize-y rounded-lg border bg-white/5 px-4 py-3 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20",
              BORDER.default,
            )}
          />
          <p className={cn(TYPOGRAPHY.muted.sm)}>
            Our AI will extract Business Model Canvas information from your
            text.
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <Button variant="ghost" onClick={onCancel} size="sm">
          Cancel
        </Button>
        <Button
          onClick={handleImport}
          disabled={!canProceed}
          size="sm"
          className="gap-2"
        >
          {mode === "file" ? "Import File" : "Extract from Text"}
        </Button>
      </div>
    </div>
  );
}
