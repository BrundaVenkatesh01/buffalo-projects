"use client";

import { m, AnimatePresence } from "framer-motion";
import { useState } from "react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge, Button, Label, Progress, Textarea } from "@/components/unified";
import {
  Loader2,
  Github,
  Globe,
  CheckCircle2,
  XCircle,
  Link2,
  AlertCircle,
} from "@/icons";
import { cn } from "@/lib/utils";
import { type GitHubConnection } from "@/services/githubOAuthService";
import {
  urlAnalyzerService,
  type UnifiedImportResult,
} from "@/services/urlAnalyzerService";

interface BatchURLImportProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (results: UnifiedImportResult[]) => void;
  githubConnection?: GitHubConnection | null;
}

type ImportStatus = "idle" | "processing" | "success";

interface URLStatus {
  url: string;
  status: "pending" | "processing" | "success" | "error";
  result?: UnifiedImportResult;
  error?: string;
}

export function BatchURLImport({
  isOpen,
  onClose,
  onImport,
  githubConnection = null,
}: BatchURLImportProps) {
  const [urlText, setUrlText] = useState("");
  const [status, setStatus] = useState<ImportStatus>("idle");
  const [urlStatuses, setUrlStatuses] = useState<URLStatus[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const urls = urlAnalyzerService.parseURLList(urlText);
  const validURLCount = urls.length;

  const handleImport = async () => {
    if (urls.length === 0) {
      return;
    }

    setStatus("processing");

    // Initialize statuses
    const initialStatuses: URLStatus[] = urls.map((url) => ({
      url,
      status: "pending",
    }));
    setUrlStatuses(initialStatuses);

    // Import each URL
    const successful: UnifiedImportResult[] = [];

    for (let i = 0; i < urls.length; i++) {
      setCurrentIndex(i);

      // Update status to processing
      setUrlStatuses((prev) =>
        prev.map((item, idx) =>
          idx === i ? { ...item, status: "processing" } : item,
        ),
      );

      try {
        // Pass GitHub access token if connected
        const accessToken = githubConnection?.accessToken;
        const result = await urlAnalyzerService.importFromURL(
          urls[i]!,
          accessToken,
        );

        // Update status to success
        setUrlStatuses((prev) =>
          prev.map((item, idx) =>
            idx === i ? { ...item, status: "success", result } : item,
          ),
        );

        successful.push(result);
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        // Update status to error
        setUrlStatuses((prev) =>
          prev.map((item, idx) =>
            idx === i
              ? { ...item, status: "error", error: errorMessage }
              : item,
          ),
        );
      }

      // Rate limiting delay (600ms between requests)
      if (i < urls.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 600));
      }
    }

    setStatus("success");

    // Auto-close and import successful results after brief delay
    setTimeout(() => {
      if (successful.length > 0) {
        onImport(successful);
      }
      handleClose();
    }, 2000);
  };

  const handleClose = () => {
    setUrlText("");
    setStatus("idle");
    setUrlStatuses([]);
    setCurrentIndex(0);
    onClose();
  };

  const successfulCount = urlStatuses.filter(
    (s) => s.status === "success",
  ).length;
  const failedCount = urlStatuses.filter((s) => s.status === "error").length;
  const progressPercent =
    urls.length > 0 ? ((currentIndex + 1) / urls.length) * 100 : 0;

  const getStatusIcon = (itemStatus: URLStatus["status"]) => {
    switch (itemStatus) {
      case "pending":
        return (
          <div className="h-4 w-4 rounded-full border-2 border-gray-300" />
        );
      case "processing":
        return <Loader2 className="h-4 w-4 animate-spin text-primary" />;
      case "success":
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case "error":
        return <XCircle className="h-4 w-4 text-red-600" />;
    }
  };

  const getURLIcon = (url: string) => {
    const type = urlAnalyzerService.detectURLType(url);
    switch (type) {
      case "github":
        return <Github className="h-3 w-3" />;
      case "website":
        return <Globe className="h-3 w-3" />;
      default:
        return <Link2 className="h-3 w-3" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Bulk Import from URLs</DialogTitle>
          <DialogDescription>
            Paste multiple project URLs (one per line) to import them all at
            once.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* URL Input */}
          {status === "idle" && (
            <div className="space-y-2">
              <Label htmlFor="urls">Project URLs (one per line)</Label>
              <Textarea
                id="urls"
                placeholder={`https://github.com/username/project-1
https://myapp.com
https://github.com/username/project-2
https://anothersite.io
https://github.com/username/project-3`}
                value={urlText}
                onChange={(e) => setUrlText(e.target.value)}
                rows={10}
                className="font-mono text-sm"
              />

              {validURLCount > 0 && (
                <m.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-2"
                >
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {validURLCount} valid URL{validURLCount !== 1 ? "s" : ""}{" "}
                      detected
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      Est. time: ~{Math.ceil(validURLCount * 3)} seconds
                    </span>
                  </div>

                  {/* GitHub Connection Tip */}
                  {!githubConnection &&
                    urls.some(
                      (url) =>
                        urlAnalyzerService.detectURLType(url) === "github",
                    ) && (
                      <div className="flex items-start gap-2 p-3 rounded-md bg-primary/5 border border-primary/20">
                        <p className="text-xs text-muted-foreground">
                          <strong className="text-foreground">Tip:</strong>{" "}
                          Connect GitHub for <strong>5,000 req/hr</strong> (vs
                          60) and private repo access.
                        </p>
                      </div>
                    )}
                </m.div>
              )}
            </div>
          )}

          {/* Progress */}
          {status === "processing" && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  Importing {currentIndex + 1} of {urls.length}...
                </span>
                <span className="font-medium">
                  {successfulCount} successful, {failedCount} failed
                </span>
              </div>
              <Progress value={progressPercent} className="h-2" />
            </div>
          )}

          {/* URL Status List */}
          {urlStatuses.length > 0 && (
            <ScrollArea className="h-[300px] rounded-md border border-border p-4 bg-muted/30">
              <div className="space-y-2">
                <AnimatePresence mode="popLayout">
                  {urlStatuses.map((item, index) => (
                    <m.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      transition={{ delay: index * 0.05 }}
                      className={cn(
                        "flex items-start gap-3 p-3 rounded-lg border transition-all duration-200",
                        item.status === "success" &&
                          "bg-green-50/50 dark:bg-green-950/20 border-green-200 dark:border-green-800",
                        item.status === "error" &&
                          "bg-red-50/50 dark:bg-red-950/20 border-red-200 dark:border-red-800",
                        item.status === "processing" &&
                          "bg-primary/5 border-primary/20",
                        item.status === "pending" &&
                          "bg-background border-border",
                      )}
                    >
                      <div className="mt-0.5">{getStatusIcon(item.status)}</div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <div
                            className={cn(
                              "flex items-center justify-center h-5 w-5 rounded-md",
                              item.status === "success" &&
                                "bg-green-100 dark:bg-green-900/30 text-green-600",
                              item.status === "error" &&
                                "bg-red-100 dark:bg-red-900/30 text-red-600",
                              item.status === "processing" &&
                                "bg-primary/10 text-primary",
                              item.status === "pending" &&
                                "bg-muted text-muted-foreground",
                            )}
                          >
                            {getURLIcon(item.url)}
                          </div>
                          <span className="text-sm font-mono truncate text-foreground">
                            {item.url}
                          </span>
                        </div>

                        {item.status === "success" && item.result && (
                          <m.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            className="mt-2 space-y-1"
                          >
                            <p className="text-sm font-medium text-foreground">
                              {item.result.projectName}
                            </p>
                            {item.result.oneLiner && (
                              <p className="text-xs text-muted-foreground line-clamp-1">
                                {item.result.oneLiner}
                              </p>
                            )}
                            <div className="flex items-center gap-2 mt-1">
                              <Badge
                                variant="outline"
                                className="text-xs capitalize"
                              >
                                {item.result.stage}
                              </Badge>
                              {item.result.githubStats && (
                                <span className="text-xs text-muted-foreground flex items-center gap-1">
                                  ⭐{" "}
                                  {item.result.githubStats.stars.toLocaleString()}
                                </span>
                              )}
                            </div>
                          </m.div>
                        )}

                        {item.status === "error" && (
                          <m.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="mt-2 flex items-start gap-1.5"
                          >
                            <AlertCircle className="h-3 w-3 text-destructive shrink-0 mt-0.5" />
                            <p className="text-xs text-destructive">
                              {item.error}
                            </p>
                          </m.div>
                        )}

                        {item.status === "processing" && (
                          <p className="text-xs text-primary mt-1 animate-pulse">
                            Analyzing and extracting project data...
                          </p>
                        )}
                      </div>
                    </m.div>
                  ))}
                </AnimatePresence>
              </div>
            </ScrollArea>
          )}

          {/* Success Summary */}
          {status === "success" && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription>
                <p className="font-medium text-green-900">
                  Import complete! {successfulCount} project
                  {successfulCount !== 1 ? "s" : ""} imported successfully.
                </p>
                {failedCount > 0 && (
                  <p className="text-sm text-green-700 mt-1">
                    {failedCount} URL{failedCount !== 1 ? "s" : ""} could not be
                    imported.
                  </p>
                )}
              </AlertDescription>
            </Alert>
          )}

          {/* Examples */}
          {status === "idle" && validURLCount === 0 && (
            <div className="text-sm text-muted-foreground">
              <p className="font-medium mb-2">Tips:</p>
              <ul className="space-y-1 list-disc list-inside">
                <li>Paste one URL per line</li>
                <li>Mix GitHub repos and websites</li>
                <li>Lines starting with # or // are ignored</li>
                <li>Empty lines are skipped</li>
              </ul>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={status === "processing"}
          >
            {status === "success" ? "Close" : "Cancel"}
          </Button>
          <Button
            onClick={() => {
              void handleImport();
            }}
            disabled={
              validURLCount === 0 ||
              status === "processing" ||
              status === "success"
            }
          >
            {status === "idle" ? (
              <>
                Import {validURLCount} Project{validURLCount !== 1 ? "s" : ""}
              </>
            ) : status === "processing" ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Importing...
              </>
            ) : (
              <>
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Done!
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
