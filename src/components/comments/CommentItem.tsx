"use client";

import { formatDistanceToNow } from "date-fns";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui-next";
import { Textarea } from "@/components/ui-next";
import { Edit2, MoreHorizontal, Trash2 } from "@/icons";
import type { Comment } from "@/types";
import { markdownToHtml } from "@/utils/markdown";
import {
  findMentionedUserIds,
  indexMentionCandidates,
  linkifyMentions,
  type MentionSuggestion,
} from "@/utils/mentionParser";

export interface CommentItemProps {
  comment: Comment;
  canEdit: boolean;
  canDelete: boolean;
  onUpdate: (payload: {
    commentId: string;
    content: string;
    mentionIds: string[];
  }) => Promise<void>;
  onDelete: (commentId: string) => Promise<void>;
  mentionCandidates?: MentionSuggestion[];
}

export function CommentItem({
  comment,
  canEdit,
  canDelete,
  onUpdate,
  onDelete,
  mentionCandidates = [],
}: CommentItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(comment.content);
  const [isSaving, setIsSaving] = useState(false);

  const indexedCandidates = useMemo(
    () => indexMentionCandidates(mentionCandidates),
    [mentionCandidates],
  );

  const displayHtml = useMemo(() => {
    const linked = linkifyMentions(comment.content, indexedCandidates);
    return markdownToHtml(linked);
  }, [comment.content, indexedCandidates]);

  const createdLabel = useMemo(() => {
    const createdDate = new Date(comment.createdAt);
    if (Number.isNaN(createdDate.getTime())) {
      return "moments ago";
    }
    return formatDistanceToNow(createdDate, { addSuffix: true });
  }, [comment.createdAt]);

  const handleSave = async () => {
    const trimmed = editValue.trim();
    if (!trimmed) {
      return;
    }

    try {
      setIsSaving(true);
      const mentionIds = findMentionedUserIds(trimmed, indexedCandidates);
      await onUpdate({
        commentId: comment.id,
        content: trimmed,
        mentionIds,
      });
      setIsEditing(false);
    } catch {
      // Error surface handled upstream
    } finally {
      setIsSaving(false);
    }
  };

  const performDelete = async () => {
    try {
      await onDelete(comment.id);
    } catch {
      // Toast handled upstream
    }
  };

  const requestDeleteConfirmation = () => {
    toast.warning("Delete this comment permanently?", {
      action: {
        label: "Delete",
        onClick: () => {
          void performDelete();
        },
      },
    });
  };

  return (
    <article className="rounded-3xl border border-white/10 bg-white/5 p-4">
      <header className="flex items-start justify-between gap-3">
        <div>
          <p className="font-medium text-foreground">
            {comment.userDisplayName}
          </p>
          <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground/70">
            {createdLabel}
            {comment.isEdited ? " • Edited" : null}
          </p>
        </div>

        {(canEdit || canDelete) && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground"
                aria-label="Open comment actions"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="min-w-[160px] rounded-xl border-white/10 bg-black/90 text-sm"
            >
              {canEdit ? (
                <DropdownMenuItem
                  onSelect={() => setIsEditing(true)}
                  className="flex items-center gap-2"
                >
                  <Edit2 className="h-4 w-4" />
                  Edit
                </DropdownMenuItem>
              ) : null}
              {canDelete ? (
                <DropdownMenuItem
                  onSelect={() => {
                    requestDeleteConfirmation();
                  }}
                  className="flex items-center gap-2 text-red-400 focus:text-red-300"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              ) : null}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </header>

      <div className="mt-4 text-sm leading-6 text-muted-foreground">
        {isEditing ? (
          <div className="space-y-3">
            <Textarea
              value={editValue}
              onChange={(event) =>
                setEditValue(event.target.value.slice(0, 2000))
              }
              className="min-h-[140px] resize-none rounded-2xl border border-white/10 bg-black/20 text-sm focus-visible:ring-1 focus-visible:ring-primary"
            />
            <div className="flex items-center justify-end gap-2">
              <Button
                variant="ghost"
                className="rounded-full px-4 text-xs uppercase tracking-[0.24em]"
                onClick={() => {
                  setEditValue(comment.content);
                  setIsEditing(false);
                }}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button
                className="rounded-full px-4 text-xs uppercase tracking-[0.24em]"
                onClick={() => {
                  void handleSave();
                }}
                disabled={isSaving || editValue.trim().length === 0}
              >
                Save changes
              </Button>
            </div>
          </div>
        ) : (
          <div
            className="prose prose-invert max-w-none text-sm [&_a]:text-primary [&_a]:underline [&_code]:rounded [&_code]:bg-white/10 [&_code]:px-1 [&_code]:py-0.5 [&_code]:text-xs"
            dangerouslySetInnerHTML={{ __html: displayHtml }}
          />
        )}
      </div>
    </article>
  );
}
