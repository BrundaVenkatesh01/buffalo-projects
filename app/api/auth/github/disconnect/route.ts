/**
 * GitHub OAuth - Disconnect
 *
 * POST /api/auth/github/disconnect
 *
 * Removes GitHub connection from user's profile.
 */

/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-argument */

import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { githubOAuthService } from "@/services/githubOAuthService";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 },
      );
    }

    // Remove connection from user's profile
    await githubOAuthService.disconnect(userId);

    return NextResponse.json({
      success: true,
      message: "GitHub connection removed successfully",
    });
  } catch (error) {
    console.error("GitHub disconnect error:", error);
    return NextResponse.json(
      { error: "Failed to disconnect GitHub" },
      { status: 500 },
    );
  }
}
