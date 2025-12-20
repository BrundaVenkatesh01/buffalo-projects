"use client";

import { m, AnimatePresence } from "framer-motion";
import React, { useState, useRef, useCallback } from "react";
import { toast } from "sonner";

import { ImportSuccessPreview } from "./ImportSuccessPreview";

import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge, Button, Progress } from "@/components/unified";
import {
  Upload,
  FileText,
  File,
  CheckCircle2,
  AlertCircle,
  Loader2,
  X,
} from "@/icons";
import { cn } from "@/lib/utils";
import { importService } from "@/services/importService";
import type { UnifiedImportResult } from "@/services/urlAnalyzerService";

interface FileImportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (result: UnifiedImportResult) => void;
}

type ImportStatus = "idle" | "uploading" | "processing" | "success" | "error";

const ACCEPTED_FILE_TYPES = {
  "application/pdf": [".pdf"],
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [
    ".docx",
  ],
  "text/plain": [".txt"],
  "text/markdown": [".md"],
};

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export function FileImportDialog({
  isOpen,
  onClose,
  onImport,
}: FileImportDialogProps) {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<ImportStatus>("idle");
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<UnifiedImportResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback((selectedFile: File | null) => {
    if (!selectedFile) {
      return;
    }

    // Validate file type
    const fileExtension = `.${selectedFile.name.split(".").pop()?.toLowerCase()}`;
    const acceptedExtensions = Object.values(ACCEPTED_FILE_TYPES).flat();

    if (!acceptedExtensions.includes(fileExtension)) {
      setError(
        `Unsupported file type. Please upload: ${acceptedExtensions.join(", ")}`,
      );
      return;
    }

    // Validate file size
    if (selectedFile.size > MAX_FILE_SIZE) {
      setError(
        `File too large. Maximum size is ${MAX_FILE_SIZE / (1024 * 1024)}MB`,
      );
      return;
    }

    setFile(selectedFile);
    setError(null);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile) {
        handleFileSelect(droppedFile);
      }
    },
    [handleFileSelect],
  );

  const handleImport = async () => {
    if (!file) {
      setError("Please select a file to import");
      return;
    }

    setError(null);
    setStatus("uploading");
    setProgress(10);

    try {
      // Step 1: Upload
      await new Promise((resolve) => setTimeout(resolve, 300));
      setProgress(25);

      // Step 2: Process
      setStatus("processing");
      setProgress(40);

      const importResult = await importService.importFromFile(file);

      // Convert ImportResult to UnifiedImportResult
      // Map stage values from ImportResult to UnifiedImportResult
      const stageMap: Record<string, UnifiedImportResult["stage"]> = {
        idea: "idea",
        building: "building",
        testing: "testing",
        launched: "launching",
      };

      const unifiedResult: UnifiedImportResult = {
        projectName: importResult.projectName,
        oneLiner: importResult.oneLiner,
        description: importResult.description || importResult.projectName,
        stage: importResult.stage
          ? stageMap[importResult.stage] || "idea"
          : "idea",
        tags: importResult.tags,
        bmcData: importResult.bmcData,
        confidence: importResult.confidence,
        warnings: importResult.warnings,
        sourceURL: `file://${file.name}`,
        sourceType: "file",
      };

      // Step 3: Extract BMC
      setProgress(80);
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Success!
      setProgress(100);
      setStatus("success");
      setResult(unifiedResult);

      // Auto-close and import after brief delay
      setTimeout(() => {
        onImport(unifiedResult);
        handleClose();
      }, 2000);
    } catch (err: unknown) {
      setStatus("error");
      const message =
        err instanceof Error ? err.message : "Failed to import file";
      setError(message);
      setProgress(0);
      toast.error(message);
    }
  };

  const handleClose = () => {
    setFile(null);
    setStatus("idle");
    setProgress(0);
    setResult(null);
    setError(null);
    onClose();
  };

  const handleRemoveFile = () => {
    setFile(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const getStatusMessage = (): string => {
    switch (status) {
      case "uploading":
        return "Uploading file...";
      case "processing":
        return "Extracting content with AI...";
      case "success":
        return "Project imported successfully!";
      case "error":
        return "Import failed";
      default:
        return "";
    }
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split(".").pop()?.toLowerCase();
    if (extension === "pdf") {
      return <FileText className="h-5 w-5 text-red-500" />;
    }
    if (extension === "docx") {
      return <File className="h-5 w-5 text-blue-500" />;
    }
    if (extension === "txt" || extension === "md") {
      return <FileText className="h-5 w-5 text-gray-500" />;
    }
    return <File className="h-5 w-5" />;
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Import Project from File</DialogTitle>
          <DialogDescription>
            Upload a PDF, Word document, or text file to automatically extract
            project details.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* File Upload Area */}
          {!file && status === "idle" && (
            <div
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              className={cn(
                "relative flex flex-col items-center justify-center h-48 rounded-lg border-2 border-dashed transition-all duration-200",
                "hover:border-primary/50 hover:bg-primary/5",
                "cursor-pointer group",
              )}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept={Object.keys(ACCEPTED_FILE_TYPES).join(",")}
                onChange={(e) => handleFileSelect(e.target.files?.[0] || null)}
                className="hidden"
              />

              <div className="flex flex-col items-center gap-3 text-center p-6">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <Upload className="h-8 w-8 text-primary" />
                </div>

                <div>
                  <p className="text-sm font-medium text-foreground">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    PDF, DOCX, TXT, or MD (max {MAX_FILE_SIZE / (1024 * 1024)}
                    MB)
                  </p>
                </div>

                <Badge variant="secondary" className="text-xs">
                  AI-powered extraction
                </Badge>
              </div>
            </div>
          )}

          {/* Selected File Preview */}
          {file && status === "idle" && (
            <m.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-start gap-3 p-4 rounded-lg border border-primary/20 bg-primary/5"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-background border">
                {getFileIcon(file.name)}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {file.name}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {(file.size / 1024).toFixed(1)} KB
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="outline" className="text-xs">
                    {file.type.split("/").pop()?.toUpperCase() ||
                      file.name.split(".").pop()?.toUpperCase()}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    Ready to import
                  </span>
                </div>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleRemoveFile}
                className="shrink-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </m.div>
          )}

          {/* Progress Indicator */}
          {status !== "idle" && status !== "error" && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                {status === "success" ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <span className="text-green-600 font-medium">
                      {getStatusMessage()}
                    </span>
                  </>
                ) : (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                    <span className="text-muted-foreground">
                      {getStatusMessage()}
                    </span>
                  </>
                )}
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}

          {/* Success Preview */}
          <AnimatePresence mode="wait">
            {status === "success" && result && (
              <m.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <ImportSuccessPreview result={result} />
              </m.div>
            )}
          </AnimatePresence>

          {/* Error Display */}
          {status === "error" && error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Info / Tips */}
          {status === "idle" && !file && (
            <div className="space-y-3">
              <div className="flex items-start gap-2 p-3 rounded-md bg-primary/5 border border-primary/20">
                <div className="text-xs text-muted-foreground">
                  <p className="font-medium text-foreground mb-1">
                    AI-Powered Extraction
                  </p>
                  <p>
                    Our AI will automatically analyze your document and extract
                    project details including Business Model Canvas fields,
                    stage, and tags.
                  </p>
                </div>
              </div>

              <div className="text-sm text-muted-foreground">
                <p className="font-medium mb-2">Supported Files:</p>
                <ul className="space-y-1 list-disc list-inside text-xs">
                  <li>PDFs - Business plans, pitch decks, reports</li>
                  <li>Word documents (.docx) - Project documentation</li>
                  <li>Text files (.txt, .md) - README, notes</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={status === "uploading" || status === "processing"}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              void handleImport();
            }}
            disabled={
              !file ||
              status === "uploading" ||
              status === "processing" ||
              status === "success"
            }
          >
            {status === "idle" || status === "error" ? (
              <>Import File</>
            ) : status === "success" ? (
              <>
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Imported!
              </>
            ) : (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Importing...
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
