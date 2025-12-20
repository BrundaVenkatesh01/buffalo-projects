/**
 * GitHub OAuth Service
 *
 * Handles GitHub OAuth 2.0 authentication flow for Buffalo Projects.
 * Provides enhanced GitHub integration with:
 * - 5,000 requests/hour rate limit (vs 60 unauthenticated)
 * - Access to private repositories
 * - User repository listing
 * - Webhook support for auto-sync
 */

/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-explicit-any */

import { doc, getDoc, setDoc } from "firebase/firestore";

import { requireFirestore } from "./firebase";

const GITHUB_CLIENT_ID = process.env["GITHUB_CLIENT_ID"];
const GITHUB_CLIENT_SECRET = process.env["GITHUB_CLIENT_SECRET"];
const GITHUB_REDIRECT_URI = process.env["GITHUB_REDIRECT_URI"];

export interface GitHubUser {
  id: number;
  login: string;
  name: string | null;
  email: string | null;
  avatar_url: string;
  html_url: string;
  bio: string | null;
  public_repos: number;
  followers: number;
  following: number;
}

export interface GitHubOAuthTokens {
  accessToken: string;
  tokenType: string;
  scope: string;
}

export interface GitHubConnection {
  userId: string; // Buffalo user ID
  githubUserId: number;
  githubUsername: string;
  accessToken: string;
  scope: string;
  connectedAt: number;
  lastSyncedAt?: number;
}

/**
 * Generate the OAuth authorization URL
 * User will be redirected to this URL to grant permissions
 */
export function getGitHubAuthorizationUrl(state: string): string {
  if (!GITHUB_CLIENT_ID) {
    throw new Error("GITHUB_CLIENT_ID is not configured");
  }

  const params = new URLSearchParams({
    client_id: GITHUB_CLIENT_ID,
    redirect_uri:
      GITHUB_REDIRECT_URI ||
      `${process.env["NEXT_PUBLIC_SITE_URL"]}/api/auth/github/callback`,
    scope: "read:user user:email repo", // Permissions: user info, email, repo access
    state, // CSRF protection token
  });

  return `https://github.com/login/oauth/authorize?${params.toString()}`;
}

/**
 * Exchange authorization code for access token
 * Called in the OAuth callback after user grants permissions
 */
export async function exchangeCodeForToken(
  code: string,
): Promise<GitHubOAuthTokens> {
  if (!GITHUB_CLIENT_ID || !GITHUB_CLIENT_SECRET) {
    throw new Error(
      "GitHub OAuth is not configured. Set GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET.",
    );
  }

  const response = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      client_id: GITHUB_CLIENT_ID,
      client_secret: GITHUB_CLIENT_SECRET,
      code,
      redirect_uri:
        GITHUB_REDIRECT_URI ||
        `${process.env["NEXT_PUBLIC_SITE_URL"]}/api/auth/github/callback`,
    }),
  });

  if (!response.ok) {
    throw new Error(`GitHub token exchange failed: ${response.statusText}`);
  }

  const data = await response.json();

  if (data.error) {
    throw new Error(
      `GitHub OAuth error: ${data.error_description || data.error}`,
    );
  }

  return {
    accessToken: data.access_token,
    tokenType: data.token_type,
    scope: data.scope,
  };
}

/**
 * Fetch GitHub user information using access token
 */
export async function getGitHubUser(accessToken: string): Promise<GitHubUser> {
  const response = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/vnd.github.v3+json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch GitHub user: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Store GitHub connection in user's profile
 */
export async function storeGitHubConnection(
  userId: string,
  tokens: GitHubOAuthTokens,
  githubUser: GitHubUser,
): Promise<void> {
  const connection: GitHubConnection = {
    userId,
    githubUserId: githubUser.id,
    githubUsername: githubUser.login,
    accessToken: tokens.accessToken, // TODO: Encrypt this in production
    scope: tokens.scope,
    connectedAt: Date.now(),
  };

  // Store in user document under 'githubConnection' field
  const db = requireFirestore();
  const userRef = doc(db, "users", userId);
  await setDoc(
    userRef,
    {
      githubConnection: connection,
    },
    { merge: true },
  );
}

/**
 * Get user's GitHub connection from their profile
 */
export async function getGitHubConnection(
  userId: string,
): Promise<GitHubConnection | null> {
  try {
    const db = requireFirestore();
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      return null;
    }

    const userData = userSnap.data();
    return (userData?.["githubConnection"] as GitHubConnection) || null;
  } catch (error) {
    console.error("Error fetching GitHub connection:", error);
    return null;
  }
}

/**
 * Remove GitHub connection from user's profile
 */
export async function disconnectGitHub(userId: string): Promise<void> {
  const db = requireFirestore();
  const userRef = doc(db, "users", userId);
  await setDoc(
    userRef,
    {
      githubConnection: null,
    },
    { merge: true },
  );
}

/**
 * Check if user has a valid GitHub connection
 */
export async function isGitHubConnected(userId: string): Promise<boolean> {
  const connection = await getGitHubConnection(userId);
  return connection !== null && Boolean(connection.accessToken);
}

/**
 * Fetch user's GitHub repositories using their connected account
 * Returns up to 100 repos, sorted by last updated
 */
export async function getUserRepositories(
  accessToken: string,
  page: number = 1,
  perPage: number = 30,
): Promise<any[]> {
  const response = await fetch(
    `https://api.github.com/user/repos?page=${page}&per_page=${perPage}&sort=updated`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/vnd.github.v3+json",
      },
    },
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch repositories: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Validate that an access token is still valid
 * Returns true if valid, false if expired/revoked
 */
export async function validateAccessToken(
  accessToken: string,
): Promise<boolean> {
  try {
    const response = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/vnd.github.v3+json",
      },
    });
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Get rate limit status for authenticated user
 * Useful for showing users how many requests they have left
 */
export async function getRateLimitStatus(accessToken: string): Promise<{
  limit: number;
  remaining: number;
  reset: number;
}> {
  const response = await fetch("https://api.github.com/rate_limit", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/vnd.github.v3+json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch rate limit: ${response.statusText}`);
  }

  const data = await response.json();
  return {
    limit: data.rate.limit,
    remaining: data.rate.remaining,
    reset: data.rate.reset,
  };
}

export const githubOAuthService = {
  getAuthorizationUrl: getGitHubAuthorizationUrl,
  exchangeCodeForToken,
  getGitHubUser,
  storeConnection: storeGitHubConnection,
  getConnection: getGitHubConnection,
  disconnect: disconnectGitHub,
  isConnected: isGitHubConnected,
  getUserRepositories,
  validateAccessToken,
  getRateLimitStatus,
};
