/**
 * GitHub OAuth - Authorization Callback
 *
 * GET /api/auth/github/callback
 *
 * GitHub redirects here after user grants/denies permissions.
 * Exchange authorization code for access token and store connection.
 */

import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { githubOAuthService } from "@/services/githubOAuthService";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const error = searchParams.get("error");

    // Check if user denied access
    if (error) {
      console.warn("GitHub OAuth denied:", error);
      return NextResponse.redirect(
        new URL("/profile?github_error=access_denied", request.url),
      );
    }

    // Validate required parameters
    if (!code || !state) {
      console.error("Missing code or state in callback");
      return NextResponse.redirect(
        new URL("/profile?github_error=invalid_callback", request.url),
      );
    }

    // Verify state for CSRF protection
    const cookieStore = await cookies();
    const storedState = cookieStore.get("github_oauth_state")?.value;
    const userId = cookieStore.get("github_oauth_user_id")?.value;

    if (!storedState || storedState !== state) {
      console.error("State mismatch - possible CSRF attack");
      return NextResponse.redirect(
        new URL("/profile?github_error=invalid_state", request.url),
      );
    }

    if (!userId) {
      console.error("User ID not found in cookie");
      return NextResponse.redirect(
        new URL("/profile?github_error=missing_user", request.url),
      );
    }

    // Exchange code for access token
    const tokens = await githubOAuthService.exchangeCodeForToken(code);

    // Fetch GitHub user information
    const githubUser = await githubOAuthService.getGitHubUser(
      tokens.accessToken,
    );

    // Store connection in user's profile
    await githubOAuthService.storeConnection(userId, tokens, githubUser);

    // Clear OAuth cookies
    cookieStore.delete("github_oauth_state");
    cookieStore.delete("github_oauth_user_id");

    // Redirect back to dashboard with success message
    return NextResponse.redirect(
      new URL("/dashboard?github_connected=true", request.url),
    );
  } catch (error) {
    console.error("GitHub OAuth callback error:", error);

    // Clear OAuth cookies
    const cookieStore = await cookies();
    cookieStore.delete("github_oauth_state");
    cookieStore.delete("github_oauth_user_id");

    return NextResponse.redirect(
      new URL("/profile?github_error=connection_failed", request.url),
    );
  }
}
