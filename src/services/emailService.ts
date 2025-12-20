import { doc, getDoc } from "firebase/firestore";

import { db } from "@/services/firebase";
import type { NotificationType } from "@/types";
import { getEmailConfig, getSiteUrl, isEmailConfigured } from "@/utils/env";
import { logger } from "@/utils/logger";

interface CommentEmailPayload {
  recipientId: string;
  type: NotificationType;
  actorName: string;
  commentPreview: string;
  projectId: string;
  projectSlug?: string;
  projectName?: string;
}

const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

class EmailService {
  private warnedAboutConfig = false;

  private canSend(): boolean {
    if (!isEmailConfigured()) {
      if (!this.warnedAboutConfig) {
        logger.info(
          "Email provider not configured; skipping transactional emails.",
        );
        this.warnedAboutConfig = true;
      }
      return false;
    }
    return true;
  }

  async sendCommentNotification(
    payload: CommentEmailPayload,
  ): Promise<boolean> {
    if (!this.canSend()) {
      return false;
    }

    if (!db) {
      logger.warn(
        "Firestore is not initialized; cannot resolve recipient email",
      );
      return false;
    }

    try {
      const userDoc = await getDoc(doc(db, "users", payload.recipientId));
      if (!userDoc.exists()) {
        logger.debug("Recipient profile not found", payload.recipientId);
        return false;
      }

      const profile = userDoc.data() as {
        email?: string;
        contactEmail?: string;
        emailNotifications?: boolean;
        notificationsEnabled?: boolean;
        displayName?: string;
      };

      const wantsEmail =
        profile.emailNotifications ?? profile.notificationsEnabled ?? true;
      if (!wantsEmail) {
        return false;
      }

      const toEmail = profile.email ?? profile.contactEmail;
      if (!toEmail) {
        logger.debug("Recipient missing email address", payload.recipientId);
        return false;
      }

      return await this.dispatchEmail({
        toEmail,
        payload,
        ...(profile.displayName ? { recipientName: profile.displayName } : {}),
      });
    } catch (error) {
      logger.error("Failed to prepare email notification", error);
      return false;
    }
  }

  private async dispatchEmail({
    toEmail,
    payload,
    recipientName,
  }: {
    toEmail: string;
    payload: CommentEmailPayload;
    recipientName?: string;
  }): Promise<boolean> {
    const config = getEmailConfig();
    const siteUrl = getSiteUrl();
    const projectUrl = payload.projectSlug
      ? `${siteUrl}/p/${payload.projectSlug}`
      : `${siteUrl}/project/${payload.projectId}`;

    const projectName = payload.projectName ?? "your project";
    const subject =
      payload.type === "mention"
        ? `${payload.actorName} mentioned you on Buffalo Projects`
        : `${payload.actorName} left feedback on ${projectName}`;

    const preview = escapeHtml(payload.commentPreview.trim()).slice(0, 400);
    const salutation = recipientName
      ? `Hi ${escapeHtml(recipientName)},`
      : "Hi,";

    const html = `
      <div style="font-family: 'Geist Sans', system-ui, -apple-system, sans-serif; color: #0b0d0f; line-height: 1.6;">
        <p>${salutation}</p>
        <p><strong>${escapeHtml(payload.actorName)}</strong> ${
          payload.type === "mention"
            ? "mentioned you in a comment"
            : "shared new feedback"
        } on <strong>${escapeHtml(projectName)}</strong>.</p>
        <blockquote style="margin: 16px 0; padding: 12px 16px; border-left: 3px solid #7c3aed; background: #f4f3ff; color: #312e81;">
          ${preview || "(No additional comment text)"}
        </blockquote>
        <p>
          <a href="${projectUrl}" style="display: inline-block; padding: 10px 18px; background: #7c3aed; color: #fff; border-radius: 999px; text-decoration: none;">View project</a>
        </p>
        <p style="margin-top: 24px; font-size: 13px; color: #475569;">
          You are receiving this email because email alerts are enabled in your Buffalo Projects profile. You can update your preferences in the app.
        </p>
      </div>
    `;

    if (config.provider === "resend") {
      try {
        const response = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${config.apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: `${config.fromName} <${config.fromEmail}>`,
            to: [toEmail],
            subject,
            html,
          }),
        });

        if (!response.ok) {
          const detail = await response.text();
          logger.warn("Resend email API responded with error", detail);
          return false;
        }

        return true;
      } catch (error) {
        logger.error("Failed to send email via Resend", error);
        return false;
      }
    }

    logger.info(
      `Email provider “${config.provider}” is not implemented; notification logged instead of sent.`,
    );
    return false;
  }
}

export const emailService = new EmailService();
