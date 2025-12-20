"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";

import { ImportProcessingStep } from "./ImportProcessingStep";
import { ImportReviewStep } from "./ImportReviewStep";
import { ImportUploadStep } from "./ImportUploadStep";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { ImportResult } from "@/services/importService";
import { importFromFile, importFromText } from "@/services/importService";

interface ProcessingStage {
  id: string;
  label: string;
  status: "pending" | "processing" | "complete" | "error";
  message?: string;
}

interface ImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImportComplete: (result: ImportResult) => void;
}

type DialogStep = "upload" | "processing" | "review";

export function ImportDialog({
  open,
  onOpenChange,
  onImportComplete,
}: ImportDialogProps) {
  const [step, setStep] = useState<DialogStep>("upload");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [processingStages, setProcessingStages] = useState<ProcessingStage[]>(
    [],
  );
  const [progress, setProgress] = useState(0);

  const resetDialog = useCallback(() => {
    setStep("upload");
    setSelectedFile(null);
    setImportResult(null);
    setProcessingStages([]);
    setProgress(0);
  }, []);

  const handleClose = useCallback(() => {
    onOpenChange(false);
    // Reset after animation completes
    setTimeout(resetDialog, 300);
  }, [onOpenChange, resetDialog]);

  const updateStage = useCallback(
    (stageId: string, status: ProcessingStage["status"], message?: string) => {
      setProcessingStages((prev) =>
        prev.map((stage) =>
          stage.id === stageId ? { ...stage, status, message } : stage,
        ),
      );
    },
    [],
  );

  const processImport = useCallback(
    async (file: File) => {
      setStep("processing");
      setProgress(0);

      // Initialize stages
      const stages: ProcessingStage[] = [
        {
          id: "upload",
          label: "Uploading file",
          status: "complete",
        },
        {
          id: "analyze",
          label: "Analyzing content with AI",
          status: "pending",
        },
        {
          id: "extract",
          label: "Extracting Business Model Canvas data",
          status: "pending",
        },
        {
          id: "validate",
          label: "Validating extracted information",
          status: "pending",
        },
      ];

      setProcessingStages(stages);
      setProgress(25);

      try {
        // Stage 1: Analyze
        updateStage("analyze", "processing");
        setProgress(40);

        const result = await importFromFile(file);

        updateStage(
          "analyze",
          "complete",
          `Found ${result.extractedFields.length} BMC fields`,
        );
        setProgress(60);

        // Stage 2: Extract
        updateStage("extract", "processing");
        setProgress(75);

        // Simulate extraction time for UX
        await new Promise((resolve) => setTimeout(resolve, 500));

        updateStage(
          "extract",
          "complete",
          `Extracted ${result.extractedFields.length}/9 fields with ${Math.round(result.confidence * 100)}% confidence`,
        );
        setProgress(90);

        // Stage 3: Validate
        updateStage("validate", "processing");
        setProgress(95);

        await new Promise((resolve) => setTimeout(resolve, 300));

        updateStage(
          "validate",
          "complete",
          result.warnings.length > 0
            ? `${result.warnings.length} warnings to review`
            : "All data validated successfully",
        );
        setProgress(100);

        // Store result and move to review
        setImportResult(result);
      } catch (error) {
        console.error("Import failed:", error);

        // Find current stage and mark as error
        const currentStage = stages.findIndex((s) => s.status === "processing");
        if (currentStage >= 0) {
          updateStage(
            stages[currentStage]!.id,
            "error",
            error instanceof Error ? error.message : "Import failed",
          );
        }

        toast.error(
          error instanceof Error
            ? error.message
            : "Failed to import project. Please try again.",
        );

        // Go back to upload after showing error
        setTimeout(() => {
          setStep("upload");
        }, 2000);
      }
    },
    [updateStage],
  );

  const processTextImport = useCallback(
    async (text: string) => {
      setStep("processing");
      setProgress(0);

      const stages: ProcessingStage[] = [
        {
          id: "parse",
          label: "Parsing text content",
          status: "complete",
        },
        {
          id: "analyze",
          label: "Analyzing content with AI",
          status: "pending",
        },
        {
          id: "extract",
          label: "Extracting Business Model Canvas data",
          status: "pending",
        },
        {
          id: "validate",
          label: "Validating extracted information",
          status: "pending",
        },
      ];

      setProcessingStages(stages);
      setProgress(25);

      try {
        updateStage("analyze", "processing");
        setProgress(40);

        const result = await importFromText(text);

        updateStage(
          "analyze",
          "complete",
          `Found ${result.extractedFields.length} BMC fields`,
        );
        setProgress(60);

        updateStage("extract", "processing");
        setProgress(75);

        await new Promise((resolve) => setTimeout(resolve, 500));

        updateStage(
          "extract",
          "complete",
          `Extracted ${result.extractedFields.length}/9 fields`,
        );
        setProgress(90);

        updateStage("validate", "processing");
        setProgress(95);

        await new Promise((resolve) => setTimeout(resolve, 300));

        updateStage("validate", "complete");
        setProgress(100);

        setImportResult(result);
      } catch (error) {
        console.error("Text import failed:", error);

        const currentStage = stages.findIndex((s) => s.status === "processing");
        if (currentStage >= 0) {
          updateStage(
            stages[currentStage]!.id,
            "error",
            error instanceof Error ? error.message : "Import failed",
          );
        }

        toast.error(
          error instanceof Error
            ? error.message
            : "Failed to extract information from text. Please try again.",
        );

        setTimeout(() => {
          setStep("upload");
        }, 2000);
      }
    },
    [updateStage],
  );

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

  const handleConfirmImport = useCallback(
    (result: ImportResult) => {
      onImportComplete(result);
      handleClose();
      toast.success("Project imported successfully!");
    },
    [onImportComplete, handleClose],
  );

  const handleBackToUpload = useCallback(() => {
    setStep("upload");
    setImportResult(null);
  }, []);

  // Auto-advance from processing to review
  const handleProcessingComplete = useCallback(() => {
    if (importResult) {
      setStep("review");
    }
  }, [importResult]);

  const getDialogTitle = () => {
    switch (step) {
      case "upload":
        return "Import Project";
      case "processing":
        return "Processing...";
      case "review":
        return "Review & Confirm";
    }
  };

  const getDialogDescription = () => {
    switch (step) {
      case "upload":
        return "Upload a Business Model Canvas, pitch deck, or paste your business idea";
      case "processing":
        return "Our AI is analyzing your content and extracting business model information";
      case "review":
        return "Review the extracted data and make any necessary edits";
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{getDialogTitle()}</DialogTitle>
          <DialogDescription>{getDialogDescription()}</DialogDescription>
        </DialogHeader>

        {step === "upload" && (
          <ImportUploadStep
            onFileSelected={handleFileSelected}
            onTextPasted={handleTextPasted}
            onCancel={handleClose}
          />
        )}

        {step === "processing" && (
          <ImportProcessingStep
            fileName={selectedFile?.name}
            stages={processingStages}
            progress={progress}
            onComplete={handleProcessingComplete}
          />
        )}

        {step === "review" && importResult && (
          <ImportReviewStep
            result={importResult}
            onConfirm={handleConfirmImport}
            onBack={handleBackToUpload}
            onCancel={handleClose}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
