"use client";

import { m } from "framer-motion";
import { useState } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge, Button, Input, Label, Textarea } from "@/components/unified";
import { AlertCircle, ExternalLink, X } from "@/icons";
import { cn } from "@/lib/utils";
import type { UnifiedImportResult } from "@/services/urlAnalyzerService";
import { BUFFALO_BRAND } from "@/tokens/brand";
import type { ProjectStage } from "@/types";

interface EditableImportPreviewProps {
  result: UnifiedImportResult;
  onUpdate: (updatedResult: UnifiedImportResult) => void;
  onConfirm: () => void;
  className?: string;
}

const STAGE_OPTIONS: { value: ProjectStage; label: string }[] = [
  { value: "idea", label: "Idea - Just getting started" },
  { value: "research", label: "Research - Validating assumptions" },
  { value: "planning", label: "Planning - Defining scope" },
  { value: "building", label: "Building - Active development" },
  { value: "testing", label: "Testing - Getting user feedback" },
  { value: "launching", label: "Launching - Going live" },
  { value: "scaling", label: "Scaling - Growing the business" },
];

export function EditableImportPreview({
  result,
  onUpdate,
  onConfirm,
  className,
}: EditableImportPreviewProps) {
  const [editedResult, setEditedResult] = useState(result);
  const [newTag, setNewTag] = useState("");

  // Update parent whenever we change
  const updateField = (updates: Partial<UnifiedImportResult>) => {
    const updated = { ...editedResult, ...updates };
    setEditedResult(updated);
    onUpdate(updated);
  };

  const handleAddTag = () => {
    if (newTag.trim() && !editedResult.tags?.includes(newTag.trim())) {
      updateField({ tags: [...(editedResult.tags || []), newTag.trim()] });
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    updateField({
      tags: editedResult.tags?.filter((tag) => tag !== tagToRemove),
    });
  };

  const openPreview = () => {
    if (result.sourceURL) {
      window.open(result.sourceURL, "_blank", "noopener,noreferrer");
    }
  };

  const hasWarnings = result.warnings && result.warnings.length > 0;
  const bmcFieldsCount = Object.values(result.bmcData || {}).filter(
    (v) => v && String(v).trim().length > 0,
  ).length;

  return (
    <m.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("space-y-4", className)}
    >
      {/* Clean header - matches workspace editor styling */}
      <div className="border-b pb-3">
        <h3 className="font-semibold text-foreground">Review Your Import</h3>
        <p className="text-sm text-muted-foreground mt-1">
          We extracted this from your URL. Edit anything before creating.
        </p>
      </div>

      {/* Always-editable form - workspace style */}
      <div className="space-y-4">
        {/* Project Name - Primary field */}
        <div className="space-y-2">
          <Label htmlFor="edit-project-name" className="text-sm font-medium">
            Project Name
          </Label>
          <Input
            id="edit-project-name"
            value={editedResult.projectName}
            onChange={(e) => updateField({ projectName: e.target.value })}
            className="text-base font-medium"
            placeholder="My Project"
          />
        </div>

        {/* One-liner */}
        <div className="space-y-2">
          <Label htmlFor="edit-one-liner" className="text-sm font-medium">
            Tagline
          </Label>
          <Input
            id="edit-one-liner"
            value={editedResult.oneLiner || ""}
            onChange={(e) => updateField({ oneLiner: e.target.value })}
            placeholder="A brief description of what you're building"
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="edit-description" className="text-sm font-medium">
            Description
          </Label>
          <Textarea
            id="edit-description"
            value={editedResult.description}
            onChange={(e) => updateField({ description: e.target.value })}
            rows={3}
            className="resize-none"
            placeholder="Tell people about your project..."
          />
        </div>

        {/* Stage */}
        <div className="space-y-2">
          <Label htmlFor="edit-stage" className="text-sm font-medium">
            Stage
          </Label>
          <Select
            value={editedResult.stage || "building"}
            onValueChange={(value) =>
              updateField({ stage: value as ProjectStage })
            }
          >
            <SelectTrigger id="edit-stage">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STAGE_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Tags */}
        {(editedResult.tags?.length || 0) > 0 && (
          <div className="space-y-2">
            <Label className="text-sm font-medium">Tags</Label>
            <div className="flex flex-wrap gap-2">
              {editedResult.tags?.map((tag, index) => (
                <Badge
                  key={`${tag}-${index}`}
                  variant="secondary"
                  className="pr-1"
                >
                  {tag}
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-1 hover:text-destructive"
                    aria-label={`Remove ${tag}`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Add tag inline */}
        <div className="flex gap-2">
          <Input
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddTag();
              }
            }}
            placeholder="Add a tag..."
            className="flex-1"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddTag}
            disabled={!newTag.trim()}
          >
            Add
          </Button>
        </div>
      </div>

      {/* Extraction summary - subtle, not flashy */}
      <div className="text-xs text-muted-foreground pt-2 border-t">
        <span>
          AI extracted {bmcFieldsCount}/9 canvas fields
          {editedResult.confidence && editedResult.confidence > 0.7 && (
            <span className="text-green-600"> • High confidence</span>
          )}
        </span>
      </div>

      {/* Warnings - only if present */}
      {hasWarnings && (
        <div
          className="p-3 rounded-lg text-sm"
          style={{
            backgroundColor: `${BUFFALO_BRAND.status.warning}10`,
          }}
        >
          <div className="flex items-start gap-2">
            <AlertCircle
              className="h-4 w-4 shrink-0 mt-0.5"
              style={{ color: BUFFALO_BRAND.status.warning }}
            />
            <div className="space-y-1">
              <p className="font-medium text-foreground">Review needed</p>
              <ul className="space-y-0.5 text-muted-foreground">
                {result.warnings?.map((warning, index) => (
                  <li key={index}>• {warning}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons - clean and clear */}
      <div className="flex gap-2 pt-2">
        <Button onClick={onConfirm} className="flex-1" size="lg">
          Create Project
        </Button>
        {result.sourceURL && (
          <Button
            variant="outline"
            size="lg"
            onClick={openPreview}
            title="View source"
          >
            <ExternalLink className="h-4 w-4" />
          </Button>
        )}
      </div>
    </m.div>
  );
}
