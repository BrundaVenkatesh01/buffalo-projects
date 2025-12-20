"use client";

import { m, AnimatePresence } from "framer-motion";
import { useState } from "react";

import { EditableImportPreview } from "./EditableImportPreview";

import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge, Button, Input, Label, Progress } from "@/components/unified";
import {
  Loader2,
  Github,
  Globe,
  Link2,
  AlertCircle,
  CheckCircle2,
} from "@/icons";
import {
  urlAnalyzerService,
  type UnifiedImportResult,
} from "@/services/urlAnalyzerService";
import { BUFFALO_BRAND } from "@/tokens/brand";

interface URLImportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (result: UnifiedImportResult) => void;
}

type ImportStatus =
  | "idle"
  | "analyzing"
  | "fetching"
  | "extracting"
  | "success"
  | "error";

export function URLImportDialog({
  isOpen,
  onClose,
  onImport,
}: URLImportDialogProps) {
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState<ImportStatus>("idle");
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<UnifiedImportResult | null>(null);
  const [editedResult, setEditedResult] = useState<UnifiedImportResult | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);

  const urlType = url ? urlAnalyzerService.detectURLType(url) : null;
  const isValidURL = url && urlAnalyzerService.isValidURL(url);

  const handleImport = async () => {
    // Normalize URL by adding https:// if missing
    const normalizedURL = urlAnalyzerService.normalizeURL(url);

    if (!urlAnalyzerService.isValidURL(normalizedURL)) {
      setError(
        "Please enter a valid URL (e.g., github.com/user/repo or mysite.com)",
      );
      return;
    }

    setError(null);
    setStatus("analyzing");
    setProgress(10);

    try {
      // Step 1: Analyzing URL type
      await new Promise((resolve) => setTimeout(resolve, 300));
      setProgress(25);

      // Step 2: Fetching data
      setStatus("fetching");
      setProgress(40);

      const importResult =
        await urlAnalyzerService.importFromURL(normalizedURL);

      // Step 3: Extracting BMC
      setStatus("extracting");
      setProgress(70);
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Success! Don't auto-close, let user review and edit
      setProgress(100);
      setStatus("success");
      setResult(importResult);
    } catch (err: unknown) {
      setStatus("error");
      const message =
        err instanceof Error ? err.message : "Failed to import from URL";
      setError(message);
      setProgress(0);
    }
  };

  const handleClose = () => {
    setUrl("");
    setStatus("idle");
    setProgress(0);
    setResult(null);
    setError(null);
    onClose();
  };

  const getStatusMessage = (): string => {
    switch (status) {
      case "analyzing":
        return "Analyzing URL...";
      case "fetching":
        return urlType === "github"
          ? "Fetching repository data..."
          : "Fetching website content...";
      case "extracting":
        return "Extracting project details with AI...";
      case "success":
        return "Project imported successfully!";
      case "error":
        return "Import failed";
      default:
        return "";
    }
  };

  const getURLTypeIcon = () => {
    if (!urlType) {
      return <Link2 className="h-4 w-4" />;
    }

    switch (urlType) {
      case "github":
        return <Github className="h-4 w-4" />;
      case "website":
        return <Globe className="h-4 w-4" />;
      default:
        return <Link2 className="h-4 w-4" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="flex max-h-[calc(100vh-80px)] flex-col gap-0 p-0 overflow-hidden sm:max-w-[600px]">
        <DialogHeader className="px-6 py-4 shrink-0 border-b">
          <DialogTitle>Import Project from URL</DialogTitle>
          <DialogDescription>
            Paste a GitHub repository or website URL to import your project as a
            starting point. You&apos;ll review and complete the details after
            import.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 px-6 py-4 overflow-auto flex-1 min-h-0">
          {/* URL Input */}
          <div className="space-y-2">
            <Label htmlFor="url">Project URL</Label>
            <div className="relative">
              <Input
                id="url"
                placeholder="https://github.com/username/repo or https://myproject.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                disabled={status !== "idle" && status !== "error"}
                className="pr-10"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                {getURLTypeIcon()}
              </div>
            </div>

            {/* URL Type Badge */}
            {isValidURL && urlType && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">
                    {urlAnalyzerService.getURLTypeLabel(urlType)}
                  </Badge>
                  {urlType === "github" && (
                    <span className="text-xs text-muted-foreground">
                      Will fetch README, stars, and tech stack
                    </span>
                  )}
                  {urlType === "website" && (
                    <span className="text-xs text-muted-foreground">
                      Will scrape content and detect tech stack
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Progress Indicator */}
          {status !== "idle" && status !== "error" && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                {status === "success" ? (
                  <>
                    <CheckCircle2
                      className="h-4 w-4"
                      style={{ color: BUFFALO_BRAND.status.success }}
                    />
                    <span
                      className="font-medium"
                      style={{ color: BUFFALO_BRAND.status.success }}
                    >
                      {getStatusMessage()}
                    </span>
                  </>
                ) : (
                  <>
                    <Loader2
                      className="h-4 w-4 animate-spin"
                      style={{ color: BUFFALO_BRAND.blue.primary }}
                    />
                    <span className="text-muted-foreground">
                      {getStatusMessage()}
                    </span>
                  </>
                )}
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}

          {/* Editable Preview */}
          <AnimatePresence mode="wait">
            {status === "success" && result && (
              <m.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <EditableImportPreview
                  result={editedResult || result}
                  onUpdate={(updated) => setEditedResult(updated)}
                  onConfirm={() => {
                    onImport(editedResult || result);
                    handleClose();
                  }}
                />
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

          {/* Examples */}
          {status === "idle" && (
            <div className="text-sm text-muted-foreground">
              <p className="font-medium mb-2">Examples:</p>
              <ul className="space-y-1 list-disc list-inside">
                <li>GitHub repo: https://github.com/vercel/next.js</li>
                <li>Live website: https://myapp.com</li>
                <li>Product demo: https://demo.myproject.io</li>
              </ul>
            </div>
          )}
        </div>

        {/* Only show footer when not in success state (success has its own buttons) */}
        {status !== "success" && (
          <DialogFooter className="px-6 py-4 shrink-0 border-t">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={status === "fetching" || status === "extracting"}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                void handleImport();
              }}
              disabled={
                !isValidURL || status === "fetching" || status === "extracting"
              }
            >
              {status === "idle" || status === "error" ? (
                <>Import Project</>
              ) : (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Importing...
                </>
              )}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
