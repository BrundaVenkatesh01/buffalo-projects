/**
 * GitHub OAuth - Initiate Authorization
 *
 * GET /api/auth/github
 *
 * Redirects user to GitHub's authorization page to grant permissions.
 * State parameter is used for CSRF protection.
 */

import { randomUUID } from "node:crypto";

import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { githubOAuthService } from "@/services/githubOAuthService";

export async function GET(request: NextRequest) {
  try {
    // Get user ID from query params (passed from client)
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 },
      );
    }

    // Generate random state for CSRF protection
    const state = randomUUID();

    // Store state in cookie for verification in callback
    const cookieStore = await cookies();
    cookieStore.set("github_oauth_state", state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 600, // 10 minutes
      path: "/",
    });

    // Store user ID for callback
    cookieStore.set("github_oauth_user_id", userId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 600,
      path: "/",
    });

    // Redirect to GitHub authorization page
    const authUrl = githubOAuthService.getAuthorizationUrl(state);
    return NextResponse.redirect(authUrl);
  } catch (error) {
    console.error("GitHub OAuth initiation error:", error);
    return NextResponse.json(
      { error: "Failed to initiate GitHub OAuth" },
      { status: 500 },
    );
  }
}
