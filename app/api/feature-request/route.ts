import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { z } from "zod";

import { validateRequest, errorResponse, successResponse } from "../_lib/validation";

import { db } from "@/services/firebase";

// Zod schema for feature request validation
const featureRequestSchema = z.object({
  userId: z.string().optional(),
  userEmail: z.string().email("Invalid email format").optional(),
  workspaceId: z.string().optional(),
  workspaceName: z.string().optional(),
  category: z.enum(["feature", "bug", "improvement", "other"], {
    message: "Category is required",
  }),
  request: z
    .string()
    .min(10, "Request must be at least 10 characters")
    .max(2000, "Request is too long (max 2000 characters)")
    .transform((val) => val.trim()),
});

export async function POST(request: Request) {
  try {
    // Validate request body with Zod
    const validation = await validateRequest(request, featureRequestSchema);

    if (!validation.success) {
      return validation.error;
    }

    const { userId, userEmail, workspaceId, workspaceName, category, request: requestText } =
      validation.data;

    // Store in Firestore
    if (db) {
      const featureRequestsRef = collection(db, "feature-requests");
      await addDoc(featureRequestsRef, {
        userId: userId || "anonymous",
        userEmail: userEmail || null,
        workspaceId: workspaceId || null,
        workspaceName: workspaceName || null,
        category,
        request: requestText.trim(),
        status: "new", // new, reviewing, planned, implemented, declined
        createdAt: serverTimestamp(),
        votes: 0,
        comments: [],
      });
    }

    // Optional: Send notification to team (Slack webhook, email, etc.)
    // await notifyTeam({ category, request: requestText, userEmail });

    return successResponse({
      success: true,
      message: "Feature request submitted successfully",
    });
  } catch (error) {
    console.error("Feature request API error:", error);
    return errorResponse("Failed to submit feature request", 500);
  }
}
