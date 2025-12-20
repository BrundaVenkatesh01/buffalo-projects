"use client";

import { useState, useCallback } from "react";
import type { ChangeEvent } from "react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  Button,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/unified";
import { Download, Globe, File, Loader2 } from "@/icons";
import type { ImportResult } from "@/services/importService";
import { importFromFile } from "@/services/importService";

interface UnifiedImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Callback when file import completes */
  onImportComplete: (result: ImportResult) => void;
  /** Custom handler for URL import - if provided, replaces internal URL handling */
  onUrlImport?: (url: string) => Promise<void>;
  /** Default tab to open */
  defaultTab?: "url" | "file";
  /** Pre-filled URL for URL tab */
  initialUrl?: string;
}

type ImportMode = "url" | "file";

export function UnifiedImportDialog({
  open,
  onOpenChange,
  onImportComplete,
  onUrlImport,
  defaultTab = "url",
  initialUrl = "",
}: UnifiedImportDialogProps) {
  // Tab state
  const [activeTab, setActiveTab] = useState<ImportMode>(defaultTab);

  // URL import state
  const [importUrl, setImportUrl] = useState(initialUrl);
  const [isImportingUrl, setIsImportingUrl] = useState(false);

  // File import state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessingFile, setIsProcessingFile] = useState(false);

  // Reset dialog
  const resetDialog = useCallback(() => {
    setActiveTab(defaultTab);
    setImportUrl(initialUrl);
    setIsImportingUrl(false);
    setSelectedFile(null);
    setIsProcessingFile(false);
  }, [defaultTab, initialUrl]);

  const handleClose = useCallback(() => {
    if (isProcessingFile || isImportingUrl) {
      if (
        // eslint-disable-next-line no-alert
        !window.confirm(
          "Import is in progress. Are you sure you want to cancel?",
        )
      ) {
        return;
      }
    }
    onOpenChange(false);
    setTimeout(resetDialog, 300);
  }, [onOpenChange, resetDialog, isProcessingFile, isImportingUrl]);

  // URL import handler
  const handleUrlImport = useCallback(async () => {
    if (!importUrl.trim()) {
      toast.error("Please enter a URL");
      return;
    }

    if (!onUrlImport) {
      toast.error("URL import not configured");
      return;
    }

    setIsImportingUrl(true);

    try {
      await onUrlImport(importUrl.trim());
      onOpenChange(false);
      setTimeout(resetDialog, 300);
    } catch (error) {
      console.error("URL import error:", error);
      // Error toast is handled by the parent
    } finally {
      setIsImportingUrl(false);
    }
  }, [importUrl, onUrlImport, onOpenChange, resetDialog]);

  // File import handler
  const handleFileSelect = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) {
        return;
      }

      setSelectedFile(file);
      setIsProcessingFile(true);

      try {
        const result = await importFromFile(file);
        onImportComplete(result);
        toast.success("File processed successfully!");
        onOpenChange(false);
        setTimeout(resetDialog, 300);
      } catch (error) {
        console.error("File import error:", error);
        toast.error("Failed to process file. Please try again.");
        setSelectedFile(null);
      } finally {
        setIsProcessingFile(false);
      }
    },
    [onImportComplete, onOpenChange, resetDialog],
  );

  const isProcessing = isProcessingFile || isImportingUrl;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg border-white/10 bg-[#0b0d0f]/95 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="font-display text-xl text-foreground flex items-center gap-2">
            <Download className="h-5 w-5" />
            Import Content
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Import data from a URL or file to populate your project fields.
          </DialogDescription>
        </DialogHeader>

        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as ImportMode)}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger
              value="url"
              className="flex items-center gap-2"
              disabled={isProcessing}
            >
              <Globe className="h-4 w-4" />
              URL
            </TabsTrigger>
            <TabsTrigger
              value="file"
              className="flex items-center gap-2"
              disabled={isProcessing}
            >
              <File className="h-4 w-4" />
              File
            </TabsTrigger>
          </TabsList>

          <TabsContent value="url" className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">URL</label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="url"
                  value={importUrl}
                  onChange={(e) => setImportUrl(e.target.value)}
                  placeholder="https://github.com/user/repo or any URL"
                  className="w-full rounded-lg border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  disabled={isImportingUrl}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !isImportingUrl) {
                      void handleUrlImport();
                    }
                  }}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Supports GitHub repos, websites, pitch decks, and more
              </p>
            </div>

            <DialogFooter className="gap-2 pt-2">
              <Button
                variant="ghost"
                onClick={handleClose}
                disabled={isImportingUrl}
                className="rounded-full px-4 text-xs uppercase tracking-[0.24em] text-muted-foreground hover:text-foreground"
              >
                Cancel
              </Button>
              <Button
                onClick={() => void handleUrlImport()}
                disabled={isImportingUrl || !importUrl.trim()}
                className="flex items-center gap-2 rounded-full px-4 text-xs uppercase tracking-[0.24em]"
              >
                {isImportingUrl ? (
                  <>
                    <Loader2 className="h-4 w-4 shrink-0 animate-spin" />
                    <span className="whitespace-nowrap">Importing…</span>
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4" />
                    Import
                  </>
                )}
              </Button>
            </DialogFooter>
          </TabsContent>

          <TabsContent value="file" className="space-y-4">
            <div className="space-y-4">
              <div className="rounded-xl border-2 border-dashed border-white/20 bg-white/5 p-8 text-center transition-colors hover:border-primary/50 hover:bg-white/10">
                <File className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-sm text-muted-foreground mb-2">
                  Drop a file here or click to browse
                </p>
                <p className="text-xs text-muted-foreground/70">
                  Supports PDF, DOCX, TXT, and images
                </p>
                <input
                  type="file"
                  accept=".pdf,.docx,.doc,.txt,.png,.jpg,.jpeg"
                  onChange={(event) => {
                    void handleFileSelect(event);
                  }}
                  disabled={isProcessingFile}
                  className="absolute inset-0 cursor-pointer opacity-0"
                  style={{ position: "relative" }}
                />
              </div>

              {selectedFile && (
                <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 p-3">
                  <File className="h-5 w-5 text-primary" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {selectedFile.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {(selectedFile.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                  {isProcessingFile && (
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  )}
                </div>
              )}
            </div>

            <DialogFooter className="gap-2 pt-2">
              <Button
                variant="ghost"
                onClick={handleClose}
                disabled={isProcessingFile}
                className="rounded-full px-4 text-xs uppercase tracking-[0.24em] text-muted-foreground hover:text-foreground"
              >
                Cancel
              </Button>
            </DialogFooter>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
