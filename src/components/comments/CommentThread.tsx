"use client";

import { m } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { CommentInput } from "@/components/comments/CommentInput";
import { CommentItem } from "@/components/comments/CommentItem";
import { MessageSquare } from "@/icons";
import { commentService } from "@/services/commentService";
import type { Comment } from "@/types";
import { type MentionSuggestion, toMentionHandle } from "@/utils/mentionParser";

export interface CommentThreadProps {
  projectId: string;
  projectSlug?: string;
  projectName?: string;
  currentUserId?: string | null;
  isOwner?: boolean;
  ownerProfile?: {
    id?: string;
    displayName?: string | null;
  };
  onRequireAuth?: () => void;
  onCountChange?: (count: number) => void;
}

const MAX_COMMENT_LENGTH = 2000;

const buildMentionCandidate = (
  id: string | undefined,
  displayName: string | undefined | null,
): MentionSuggestion | null => {
  if (!id || !displayName) {
    return null;
  }

  return {
    id,
    displayName,
    handle: toMentionHandle(displayName),
  };
};

export function CommentThread({
  projectId,
  projectSlug,
  projectName,
  currentUserId,
  isOwner = false,
  ownerProfile,
  onRequireAuth,
  onCountChange,
}: CommentThreadProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const ownerCandidate = useMemo(
    () => buildMentionCandidate(ownerProfile?.id, ownerProfile?.displayName),
    [ownerProfile],
  );

  const mentionCandidates = useMemo(() => {
    const candidates = new Map<string, MentionSuggestion>();
    if (ownerCandidate) {
      candidates.set(ownerCandidate.id, ownerCandidate);
    }

    comments.forEach((comment) => {
      if (!comment.userDisplayName) {
        return;
      }
      const candidate = buildMentionCandidate(
        comment.userId,
        comment.userDisplayName,
      );
      if (candidate) {
        candidates.set(candidate.id, candidate);
      }
    });

    return Array.from(candidates.values());
  }, [comments, ownerCandidate]);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    const setup = async () => {
      try {
        setLoading(true);
        const initial = await commentService.getCommentsByProject(projectId);
        setComments(initial);
        onCountChange?.(initial.length);

        unsubscribe = commentService.subscribeToProjectComments(
          projectId,
          (next) => {
            setComments(next);
            onCountChange?.(next.length);
            setError(null); // Clear any previous subscription errors
          },
          (errorMessage) => {
            // Handle subscription errors with sanitized message
            setError(errorMessage);
          },
        );
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Unable to load comments";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    void setup();

    return () => {
      unsubscribe?.();
    };
  }, [onCountChange, projectId]);

  const handleCreate = async ({
    content,
    mentionIds,
  }: {
    content: string;
    mentionIds: string[];
  }) => {
    if (!currentUserId) {
      onRequireAuth?.();
      toast.error("Sign in to leave feedback");
      throw new Error("auth-required");
    }

    try {
      setSubmitting(true);
      await commentService.createComment({
        projectId,
        content,
        mentionIds,
        ...(projectSlug ? { projectSlug } : {}),
        ...(projectName ? { projectName } : {}),
        ...(ownerProfile?.id ? { projectOwnerId: ownerProfile.id } : {}),
      });
      toast.success("Comment posted");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to post comment";
      toast.error(message);
      throw err;
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async (payload: {
    commentId: string;
    content: string;
    mentionIds: string[];
  }) => {
    try {
      await commentService.updateComment(payload);
      toast.success("Comment updated");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unable to update comment";
      toast.error(message);
      throw err;
    }
  };

  const handleDelete = async (commentId: string) => {
    try {
      await commentService.deleteComment(commentId, projectId);
      toast.success("Comment deleted");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unable to delete comment";
      toast.error(message);
      throw err;
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-40 animate-pulse rounded-2xl bg-white/[0.02] border border-white/[0.06]" />
        <div className="h-24 animate-pulse rounded-2xl bg-white/[0.02] border border-white/[0.06]" />
        <div className="h-24 animate-pulse rounded-2xl bg-white/[0.02] border border-white/[0.06]" />
      </div>
    );
  }

  if (error) {
    return (
      <m.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-amber-500/20 bg-amber-500/5 px-6 py-12 text-center backdrop-blur-sm"
      >
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-500/10 border border-amber-500/20">
          <MessageSquare className="h-6 w-6 text-amber-400" />
        </div>
        <div className="space-y-2">
          <p className="text-sm font-medium text-amber-200">{error}</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-3 rounded-xl border border-amber-500/30 bg-amber-500/5 hover:bg-amber-500/10 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-amber-300 hover:text-amber-200 hover:border-amber-500/40 transition-all"
          >
            Retry
          </button>
        </div>
      </m.div>
    );
  }

  const canPost = Boolean(currentUserId);

  return (
    <div className="space-y-8">
      {canPost ? (
        <CommentInput
          onSubmit={handleCreate}
          isSubmitting={submitting}
          mentionCandidates={mentionCandidates}
          maxLength={MAX_COMMENT_LENGTH}
        />
      ) : (
        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8 text-center">
          <p className="text-base font-semibold text-white">
            Sign in to leave feedback
          </p>
          <p className="max-w-md text-xs font-medium uppercase tracking-wider text-neutral-500">
            Authentic feedback builds trust. Join the Buffalo community to share
            notes and resources.
          </p>
          <button
            type="button"
            onClick={onRequireAuth}
            className="mt-2 rounded-xl border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.05] px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-neutral-400 hover:text-white hover:border-white/[0.12] transition-all"
          >
            Sign in
          </button>
        </div>
      )}

      {comments.length === 0 ? (
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] px-6 py-12 text-center">
          <m.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
            className="mx-auto mb-4 flex items-center justify-center w-14 h-14 rounded-full bg-blue-500/10"
          >
            <MessageSquare className="h-6 w-6 text-blue-400" />
          </m.div>
          <p className="text-base font-semibold text-white">
            Start the conversation
          </p>
          <p className="mt-2 text-sm text-neutral-400 max-w-md mx-auto">
            Be the first to share advice, questions, or encouragement
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => {
            const canEdit = currentUserId === comment.userId;
            const canDelete = canEdit || isOwner;
            return (
              <CommentItem
                key={comment.id}
                comment={comment}
                canEdit={canEdit}
                canDelete={canDelete}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
                mentionCandidates={mentionCandidates}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
