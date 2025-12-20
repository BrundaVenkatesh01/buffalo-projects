"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";

import { ImportUploadStep } from "./ImportUploadStep";
import { LiveExtractionPanel } from "./LiveExtractionPanel";
import { SourcePreviewPanel } from "./SourcePreviewPanel";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  Button,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/unified";
import { BORDER, TYPOGRAPHY } from "@/components/unified";
import { CheckCircle2, ChevronLeft, X } from "@/icons";
import { cn } from "@/lib/utils";
import type { ImportResult } from "@/services/importService";
import { importFromFile, importFromText } from "@/services/importService";
import type { CanvasBlockId } from "@/types";

interface ImportDialogV2Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImportComplete: (result: ImportResult) => void;
}

type DialogStep = "upload" | "review";

export function ImportDialogV2({
  open,
  onOpenChange,
  onImportComplete,
}: ImportDialogV2Props) {
  // State
  const [step, setStep] = useState<DialogStep>("upload");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [sourceText, setSourceText] = useState<string>("");
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractionProgress, setExtractionProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [importResult, setImportResult] =
    useState<Partial<ImportResult> | null>(null);

  // Mobile responsiveness
  const [showSourcePreview, setShowSourcePreview] = useState(false);

  // Reset dialog
  const resetDialog = useCallback(() => {
    setStep("upload");
    setSelectedFile(null);
    setSourceText("");
    setIsExtracting(false);
    setExtractionProgress(0);
    setStatusMessage("");
    setImportResult(null);
    setShowSourcePreview(false);
  }, []);

  const handleClose = useCallback(() => {
    if (isExtracting) {
      if (
        // eslint-disable-next-line no-alert
        !window.confirm(
          "Extraction is in progress. Are you sure you want to cancel?",
        )
      ) {
        return;
      }
    }
    onOpenChange(false);
    setTimeout(resetDialog, 300);
  }, [onOpenChange, resetDialog, isExtracting]);

  // Process import with progressive updates
  const processImport = useCallback(async (file: File) => {
    setIsExtracting(true);
    setExtractionProgress(0);
    setStatusMessage("Uploading file...");
    setStep("review");

    try {
      // Simulate upload progress
      setExtractionProgress(25);
      setStatusMessage("Analyzing content with AI...");

      // Call import service
      const result = await importFromFile(file);

      // Progressive field extraction simulation
      // In a real implementation, this would stream from the API
      setExtractionProgress(60);
      setStatusMessage(
        `Found ${result.extractedFields.length} fields. Extracting data...`,
      );

      // Update result progressively
      setImportResult(result);

      setExtractionProgress(90);
      setStatusMessage("Validating extracted information...");

      // Complete
      setExtractionProgress(100);
      setStatusMessage("Extraction complete!");
      setIsExtracting(false);
    } catch (error) {
      console.error("Import failed:", error);
      setIsExtracting(false);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to import project. Please try again.",
      );
      // Stay on review step to show partial results if any
    }
  }, []);

  const processTextImport = useCallback(async (text: string) => {
    setIsExtracting(true);
    setExtractionProgress(0);
    setStatusMessage("Parsing text content...");
    setStep("review");
    setSourceText(text);

    try {
      setExtractionProgress(25);
      setStatusMessage("Analyzing content with AI...");

      const result = await importFromText(text);

      setExtractionProgress(60);
      setStatusMessage(
        `Found ${result.extractedFields.length} fields. Extracting data...`,
      );

      setImportResult(result);

      setExtractionProgress(90);
      setStatusMessage("Validating extracted information...");

      setExtractionProgress(100);
      setStatusMessage("Extraction complete!");
      setIsExtracting(false);
    } catch (error) {
      console.error("Text import failed:", error);
      setIsExtracting(false);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to extract information from text. Please try again.",
      );
    }
  }, []);

  // Handlers
  const handleFileSelected = useCallback(
    (file: File) => {
      setSelectedFile(file);
      void processImport(file);
    },
    [processImport],
  );

  const handleTextPasted = useCallback(
    (text: string) => {
      void processTextImport(text);
    },
    [processTextImport],
  );

  const handleFieldChange = useCallback(
    (fieldId: CanvasBlockId, value: string) => {
      setImportResult((prev) => {
        if (!prev) {
          return prev;
        }
        return {
          ...prev,
          bmcData: {
            ...prev.bmcData,
            [fieldId]: value,
          },
        };
      });
    },
    [],
  );

  const handleMetadataChange = useCallback(
    (field: keyof ImportResult, value: string) => {
      setImportResult((prev) => {
        if (!prev) {
          return prev;
        }
        return {
          ...prev,
          [field]: value,
        };
      });
    },
    [],
  );

  const handleConfirmImport = useCallback(() => {
    if (!importResult || !importResult.projectName) {
      toast.error("Please enter a project name before continuing.");
      return;
    }

    // Convert partial result to full ImportResult
    const fullResult: ImportResult = {
      projectName: importResult.projectName,
      description: importResult.description,
      oneLiner: importResult.oneLiner,
      stage: importResult.stage,
      tags: importResult.tags || [],
      bmcData: importResult.bmcData || {},
      confidence: importResult.confidence || 0.7,
      extractedFields: importResult.extractedFields || [],
      warnings: importResult.warnings || [],
      suggestions: importResult.suggestions || [],
      originalFile: selectedFile || undefined,
      originalText: sourceText || undefined,
    };

    onImportComplete(fullResult);
    handleClose();
    toast.success("Project imported successfully!");
  }, [importResult, selectedFile, sourceText, onImportComplete, handleClose]);

  const handleBack = useCallback(() => {
    if (isExtracting) {
      if (
        // eslint-disable-next-line no-alert
        !window.confirm(
          "Extraction is in progress. Are you sure you want to go back?",
        )
      ) {
        return;
      }
    }
    setStep("upload");
    setImportResult(null);
    setIsExtracting(false);
  }, [isExtracting]);

  // Determine file type for source preview
  const getFileType = (): "pdf" | "image" | "text" | "json" => {
    if (!selectedFile) {
      return "text";
    }
    if (selectedFile.type.includes("pdf")) {
      return "pdf";
    }
    if (selectedFile.type.includes("image")) {
      return "image";
    }
    if (selectedFile.type.includes("json")) {
      return "json";
    }
    return "text";
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        className={cn(
          "flex max-h-[90vh] flex-col gap-0 p-0 overflow-hidden",
          step === "upload" ? "max-w-2xl" : "max-w-4xl",
        )}
      >
        {/* Header */}
        <DialogHeader
          className={cn("px-6 py-4 shrink-0", BORDER.subtle, "border-b")}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {step === "review" && (
                <button
                  onClick={handleBack}
                  className="rounded-lg p-1 hover:bg-white/10"
                  disabled={isExtracting}
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
              )}
              <div>
                <DialogTitle className={TYPOGRAPHY.heading.lg}>
                  {step === "upload" ? "Import Project" : "Review Import"}
                </DialogTitle>
                <DialogDescription className={TYPOGRAPHY.muted.sm}>
                  {step === "upload"
                    ? "Upload a Business Model Canvas, pitch deck, or paste your business idea"
                    : isExtracting
                      ? "AI is analyzing your content and extracting business model information"
                      : "Review extracted data and make any necessary edits"}
                </DialogDescription>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="rounded-lg p-1 hover:bg-white/10"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </DialogHeader>

        {/* Content */}
        <div className="min-h-0 flex-1 overflow-auto">
          {step === "upload" && (
            <div className="p-6">
              <ImportUploadStep
                onFileSelected={handleFileSelected}
                onTextPasted={handleTextPasted}
                onCancel={handleClose}
              />
            </div>
          )}

          {step === "review" && (
            <div className="grid h-full grid-cols-1 lg:grid-cols-5">
              {/* Source Preview Panel - Desktop: 2 columns, Mobile: collapsible */}
              <div
                className={cn(
                  "hidden overflow-y-auto lg:col-span-2 lg:block",
                  BORDER.subtle,
                  "lg:border-r",
                )}
              >
                <SourcePreviewPanel
                  sourceType={selectedFile ? "file" : "text"}
                  fileType={getFileType()}
                  fileName={selectedFile?.name}
                  fileSize={selectedFile?.size}
                  content={sourceText}
                  file={selectedFile || undefined}
                />
              </div>

              {/* Mobile source preview toggle */}
              <div className="lg:hidden">
                <button
                  onClick={() => setShowSourcePreview(!showSourcePreview)}
                  className={cn(
                    "w-full border-b px-4 py-2.5 text-left text-sm font-medium hover:bg-white/5",
                    BORDER.subtle,
                  )}
                >
                  {showSourcePreview ? "Hide" : "Show"} Source Preview
                </button>
                {showSourcePreview && (
                  <div className="max-h-64 overflow-y-auto border-b">
                    <SourcePreviewPanel
                      sourceType={selectedFile ? "file" : "text"}
                      fileType={getFileType()}
                      fileName={selectedFile?.name}
                      fileSize={selectedFile?.size}
                      content={sourceText}
                      file={selectedFile || undefined}
                    />
                  </div>
                )}
              </div>

              {/* Extraction Panel - Desktop: 3 columns */}
              <div className="flex flex-col overflow-hidden lg:col-span-3">
                {/* Project Metadata - Fixed at top */}
                <div
                  className={cn("border-b px-4 py-2.5 shrink-0", BORDER.subtle)}
                >
                  <details className="group" open>
                    <summary className="flex cursor-pointer items-center justify-between py-1">
                      <span
                        className={cn(TYPOGRAPHY.heading.xs, "font-semibold")}
                      >
                        Project Information
                      </span>
                      <ChevronLeft className="h-4 w-4 transition-transform group-open:rotate-[-90deg]" />
                    </summary>
                    <div className="mt-2.5 space-y-2.5">
                      <div>
                        <label
                          className={cn(
                            TYPOGRAPHY.label.default,
                            "mb-1 block text-xs font-medium",
                          )}
                        >
                          Project Name *
                        </label>
                        <Input
                          value={importResult?.projectName || ""}
                          onChange={(e) =>
                            handleMetadataChange("projectName", e.target.value)
                          }
                          placeholder="Enter project name"
                          disabled={isExtracting}
                          className="h-9"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2.5">
                        <div>
                          <label
                            className={cn(
                              TYPOGRAPHY.label.default,
                              "mb-1 block text-xs font-medium",
                            )}
                          >
                            Stage
                          </label>
                          <Select
                            value={importResult?.stage || "idea"}
                            onValueChange={(value) =>
                              handleMetadataChange("stage", value)
                            }
                            disabled={isExtracting}
                          >
                            <SelectTrigger className="h-9">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="idea">Idea</SelectItem>
                              <SelectItem value="building">Building</SelectItem>
                              <SelectItem value="testing">Testing</SelectItem>
                              <SelectItem value="launched">Launched</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label
                            className={cn(
                              TYPOGRAPHY.label.default,
                              "mb-1 block text-xs font-medium",
                            )}
                          >
                            One-liner
                          </label>
                          <Input
                            value={importResult?.oneLiner || ""}
                            onChange={(e) =>
                              handleMetadataChange("oneLiner", e.target.value)
                            }
                            placeholder="Elevator pitch"
                            disabled={isExtracting}
                            className="h-9"
                          />
                        </div>
                      </div>
                    </div>
                  </details>
                </div>

                {/* Live Extraction Panel - Scrollable */}
                <div className="flex-1 overflow-y-auto">
                  <LiveExtractionPanel
                    isExtracting={isExtracting}
                    progress={extractionProgress}
                    statusMessage={statusMessage}
                    result={importResult}
                    onFieldChange={handleFieldChange}
                    className="h-full"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        {step === "review" && (
          <DialogFooter
            className={cn(
              "flex-row items-center justify-between border-t px-6 py-4 shrink-0",
              BORDER.subtle,
            )}
          >
            <Button
              variant="ghost"
              onClick={handleBack}
              size="sm"
              disabled={isExtracting}
            >
              ← Back to Upload
            </Button>
            <Button
              onClick={handleConfirmImport}
              size="sm"
              className="gap-2"
              disabled={isExtracting || !importResult?.projectName}
            >
              <CheckCircle2 className="h-4 w-4" />
              Create Project
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
