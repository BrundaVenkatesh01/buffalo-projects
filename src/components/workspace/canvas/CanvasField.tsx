import { useMemo, useState, memo } from "react";
import { toast } from "sonner";

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Textarea,
  Badge,
} from "@/components/unified";
import { Loader2, Zap, RefreshCcw, Link as LinkIcon, X, Eye } from "@/icons";
import { geminiService } from "@/services/geminiService";
import { useWorkspaceStore } from "@/stores/workspaceStore";
import type { CanvasBlockId, ProjectDocument, Workspace } from "@/types";

const readableSize = (size: number): string => {
  const units = ["B", "KB", "MB", "GB"];
  let value = size;
  let index = 0;
  while (value >= 1024 && index < units.length - 1) {
    value /= 1024;
    index++;
  }
  return `${value.toFixed(1)} ${units[index]}`;
};

interface CanvasFieldProps {
  blockId: CanvasBlockId;
  title: string;
  placeholder: string;
  value: string;
  bmcData: Workspace["bmcData"];
  projectName?: string;
  projectDescription?: string;
  onChange: (value: string) => void;
}

// Memoized to prevent unnecessary re-renders when other fields change
export const CanvasField = memo(
  function CanvasField({
    blockId,
    title,
    placeholder,
    value,
    bmcData,
    projectName,
    projectDescription,
    onChange,
  }: CanvasFieldProps) {
    const [loading, setLoading] = useState(false);
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [insight, setInsight] = useState<string | null>(null);
    const [requested, setRequested] = useState(false);
    const [isEvidenceDialogOpen, setEvidenceDialogOpen] = useState(false);

    const documents = useWorkspaceStore(
      (state) => state.currentWorkspace?.documents ?? [],
    );
    const isPublic = useWorkspaceStore(
      (state) => state.currentWorkspace?.isPublic ?? false,
    );
    const linkEvidence = useWorkspaceStore((state) => state.linkEvidence);
    const unlinkEvidence = useWorkspaceStore((state) => state.unlinkEvidence);

    const linkedDocuments = useMemo<ProjectDocument[]>(() => {
      return documents.filter((document) =>
        document.linkedFields?.includes(blockId),
      );
    }, [blockId, documents]);

    const availableDocuments = useMemo<ProjectDocument[]>(() => {
      const linkedIds = new Set(linkedDocuments.map((doc) => doc.id));
      return documents.filter((document) => !linkedIds.has(document.id));
    }, [documents, linkedDocuments]);

    const otherSections = useMemo(() => {
      const entries = Object.entries(bmcData).filter(
        ([key]) => key !== blockId,
      );
      return Object.fromEntries(entries);
    }, [bmcData, blockId]);

    const askForHelp = async () => {
      setLoading(true);
      setRequested(true);
      try {
        // Use placeholder text if value is empty to avoid empty prompt error
        const contentForAI =
          value.trim() || `Help me fill in the ${title} section`;

        const response = await geminiService.getBMCSuggestions(
          title,
          contentForAI,
          otherSections,
          {
            ...(projectName ? { projectName } : {}),
            ...(projectDescription ? { description: projectDescription } : {}),
          },
        );

        const nextSuggestions = response.suggestions?.filter(
          (suggestion) => suggestion.trim().length > 0,
        );
        if (nextSuggestions && nextSuggestions.length > 0) {
          setSuggestions(nextSuggestions.slice(0, 3));
        } else if (response.text) {
          setSuggestions([response.text]);
        } else {
          setSuggestions([]);
        }

        setInsight(response.insights ?? null);

        if ((response.suggestions?.length ?? 0) === 0 && !response.text) {
          toast.info(
            "No extra suggestions this time. Try adding more context first.",
          );
        } else {
          toast.success(
            "Suggestions ready. Choose one to drop into your canvas.",
          );
        }
      } catch (error) {
        console.error(error);
        toast.error(
          "Unable to fetch AI support right now. Try again in a minute.",
        );
      } finally {
        setLoading(false);
      }
    };

    const resetSuggestions = () => {
      setSuggestions([]);
      setInsight(null);
      setRequested(false);
    };

    return (
      <div className="space-y-3">
        {isPublic && (
          <Badge
            variant="outline"
            className="text-xs bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
          >
            <Eye className="h-3 w-3 mr-1" />
            Visible to community
          </Badge>
        )}
        <Textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          rows={5}
          className="resize-none"
        />
        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={() => {
              void askForHelp();
            }}
            disabled={loading}
            className="rounded-full px-3 text-xs"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                Thinking…
              </>
            ) : (
              <>
                <Zap className="mr-2 h-3 w-3" />
                Ask AI
              </>
            )}
          </Button>
          {requested && (
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => {
                resetSuggestions();
              }}
              className="rounded-full px-3 text-xs text-muted-foreground hover:text-foreground"
            >
              <RefreshCcw className="mr-2 h-3 w-3" />
              Clear
            </Button>
          )}
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={() => {
              if (documents.length === 0) {
                toast.info("Upload documents in the Documents tab first", {
                  description:
                    "Switch to the Documents tab to upload files, then return here to attach them as evidence.",
                });
              } else {
                setEvidenceDialogOpen(true);
              }
            }}
            className="rounded-full px-3 text-xs"
          >
            <LinkIcon className="mr-2 h-3 w-3" />
            {documents.length === 0 ? "Add evidence" : "Attach evidence"}
          </Button>
        </div>

        {linkedDocuments.length > 0 ? (
          <div className="space-y-2 rounded-2xl border border-white/10 bg-white/5 p-3">
            <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
              Linked evidence
            </p>
            <div className="space-y-2">
              {linkedDocuments.map((document) => (
                <div
                  key={document.id}
                  className="flex items-center justify-between rounded-xl border border-white/10 bg-transparent px-3 py-2 text-sm text-muted-foreground"
                >
                  <div className="min-w-0 pr-3">
                    <p className="truncate text-foreground">{document.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {readableSize(document.size)}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => unlinkEvidence(document.id, blockId)}
                    className="inline-flex items-center gap-1 text-xs uppercase tracking-[0.24em] text-primary hover:text-primary/80"
                  >
                    <X className="h-3 w-3" />
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {suggestions.length > 0 && (
          <div className="space-y-3 rounded-2xl border border-primary/30 bg-primary/10 p-4 text-sm text-primary-foreground">
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-primary">
              <Zap className="h-3 w-3" />
              AI Suggestions
            </p>
            <div className="space-y-2.5">
              {suggestions.map((suggestion, index) => (
                <div
                  key={`${blockId}-suggestion-${index}`}
                  className="rounded-xl border border-white/10 bg-white/5 p-3"
                >
                  <p className="text-sm leading-relaxed text-white/90">
                    {suggestion}
                  </p>
                </div>
              ))}
            </div>
            {insight && (
              <div className="rounded-xl border border-white/20 bg-white/10 px-3 py-2.5 text-xs leading-relaxed">
                <strong className="font-semibold text-white">
                  Key insight:
                </strong>{" "}
                <span className="text-white/90">{insight}</span>
              </div>
            )}
          </div>
        )}

        <Dialog
          open={isEvidenceDialogOpen}
          onOpenChange={setEvidenceDialogOpen}
        >
          <DialogContent className="max-w-lg border-white/10 bg-[#0b0d0f]/95">
            <DialogHeader>
              <DialogTitle className="font-display text-xl text-foreground">
                Attach evidence
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                Choose existing uploads to support this section. Manage files in
                the Documents tab.
              </DialogDescription>
            </DialogHeader>
            <div className="max-h-[40vh] space-y-2 overflow-y-auto pr-1">
              {availableDocuments.length === 0 ? (
                <p className="rounded-xl border border-dashed border-white/10 p-4 text-sm text-muted-foreground">
                  No uploads available yet. Add evidence in the Documents tab,
                  then attach it here.
                </p>
              ) : (
                availableDocuments.map((document) => (
                  <div
                    key={document.id}
                    className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2"
                  >
                    <div className="min-w-0 pr-3">
                      <p className="truncate text-sm text-foreground">
                        {document.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {readableSize(document.size)}
                      </p>
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      className="rounded-full px-3 text-xs uppercase tracking-[0.24em]"
                      onClick={() => {
                        linkEvidence(document.id, blockId);
                      }}
                    >
                      Attach
                    </Button>
                  </div>
                ))
              )}
            </div>
            <DialogFooter>
              <Button
                variant="ghost"
                onClick={() => setEvidenceDialogOpen(false)}
                className="rounded-full px-4 text-xs uppercase tracking-[0.24em] text-muted-foreground hover:text-foreground"
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  },
  (prevProps, nextProps) => {
    // Custom comparison: only re-render if these props change
    return (
      prevProps.value === nextProps.value &&
      prevProps.blockId === nextProps.blockId &&
      prevProps.title === nextProps.title &&
      prevProps.placeholder === nextProps.placeholder &&
      prevProps.projectName === nextProps.projectName &&
      prevProps.projectDescription === nextProps.projectDescription
    );
  },
);

export default CanvasField;
